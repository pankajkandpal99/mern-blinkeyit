import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import { priceWithDiscount } from "../../client/src/utils/PriceWithDiscount.js";
import Stripe from "../config/stripe.js";
import AddressModel from "../models/address.model.js";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const generateOrderId = () => `ORD-${new mongoose.Types.ObjectId()}`;

const validateRequest = (userId, items, totalAmt, addressId, subTotalAmt) => {
  if (!userId) {
    throw new Error("User not authenticated. Please errorin first.");
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Invalid or empty items in the cart.");
  }
  if (!totalAmt || !subTotalAmt || !addressId) {
    throw new Error(
      "Missing required fields: totalAmt, subTotalAmt, or addressId."
    );
  }
};

const prepareOrderCODPayload = (
  userId,
  items,
  totalAmt,
  addressId,
  subTotalAmt
) => {
  return items.map((item) => ({
    userId,
    orderId: generateOrderId(),
    productId: item.productId._id,
    product_details: {
      name: item.productId.name,
      image: item.productId.image,
    },
    paymentId: "",
    payment_status: "PENDING",
    payment_type: "COD",
    delivery_address: addressId,
    subTotalAmt: subTotalAmt,
    totalAmt: totalAmt,
  }));
};

export const createOrderCODController = async (req, res) => {
  const session = await mongoose.startSession(); // Added transaction handling for database operations to ensure atomicity.
  session.startTransaction();

  try {
    const { userId } = req;
    const { items, totalAmt, addressId, subTotalAmt } = req.body;

    validateRequest(userId, items, totalAmt, addressId, subTotalAmt);
    const payload = prepareOrderCODPayload(
      userId,
      items,
      totalAmt,
      addressId,
      subTotalAmt
    );

    // console.log("payload: ", payload);

    // Create the order in the database
    const generatedOrder = await OrderModel.insertMany(payload);
    const orderIds = generatedOrder.map((order) => order._id);

    // update user order history and clear the cart also..
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { order_history: { $each: orderIds } },
        $set: { shopping_cart: [] },
      },
      { session }
    );

    await CartProductModel.deleteMany({ userId }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error(`Error occured while creating order with COD : ${error}`);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const createOnlinePaymentSessionController = async (req, res) => {
  try {
    const { userId } = req;
    const { items, totalAmt, addressId, subTotalAmt } = req.body;

    validateRequest(userId, items, totalAmt, addressId, subTotalAmt);

    const user = await UserModel.findById(userId);
    const address = await AddressModel.findOne({
      _id: addressId,
      userId: userId,
    });

    if (!address) {
      return res
        .status(404)
        .json({ error: true, message: "Address not found" });
    }

    // Prepare line items for Stripe
    const lineItems = items.map((item) => {
      const discountedAmount = priceWithDiscount(
        item.productId.price,
        item.productId.discount
      );
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id.toString(),
            },
          },
          unit_amount: Math.round(discountedAmount * 100), // Stripe expects amount in paise
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const sessionData = {
      mode: "payment",
      tax_id_collection: { enabled: true }, // for GST/VAT
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: userId.toString(),
        addressId: addressId.toString(),
      },
      payment_intent_data: {
        shipping: {
          name: user.name,
          address: {
            line1: address.address_line,
            city: address.city,
            postal_code: address.pincode,
            country: address.country || "IN",
          },
        },
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    // Create Stripe Checkout Session
    const session = await Stripe.checkout.sessions.create(sessionData);

    // Return Stripe session to frontend
    return res.status(200).json({
      success: true,
      stripeSession: session,
    });
  } catch (error) {
    console.error("Online payment error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Payment nahi hua, phir try karo! 😂",
    });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("No Stripe signature found");
    return res.status(400).send("No signature");
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event?.data?.object;

        // Verify payment status
        if (session?.payment_status !== "paid") {
          console.error(
            `Payment not completed. Status: ${session.payment_status}`
          );
          return res.status(200).json({ received: true });
        }

        // Check if metadata exist or not
        if (!session.metadata) {
          return res.status(400).json({ error: "Metadata is missing" });
        }

        // Extract metadata and payment details
        const userId = session?.metadata?.userId;
        const addressId = session?.metadata?.addressId;
        const paymentIntentId = session?.payment_intent;

        if (!userId || !addressId) {
          throw new Error("Missing required metadata");
        }

        // Fetch line items from Stripe
        const lineItemsResponse = await Stripe.checkout.sessions.listLineItems(
          session?.id,
          { expand: ["data.price.product"] }
        );

        if (!lineItemsResponse || !lineItemsResponse.data.length) {
          throw new Error("No line items found or improperly structured");
        }

        const lineItems = lineItemsResponse?.data;

        // Prepare order payload
        const orderPayload = lineItems.map((item) => {
          const product = item.price.product;

          if (!product || !product.metadata) {
            throw new Error("Invalid product structure");
          }

          return {
            userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: product.metadata.productId,
            product_details: {
              name: item.description || product.name,
              image: product.images?.[0],
            },
            paymentId: paymentIntentId,
            payment_status: session.payment_status.toUpperCase(),
            payment_type: "ONLINE",
            delivery_address: addressId,
            quantity: item.quantity,
            subTotalAmt: session.amount_subtotal / 100,
            totalAmt: session.amount_total / 100,
            created_at: new Date(),
            updated_at: new Date(),
          };
        });

        // Start a MongoDB session for transactions
        const sessionMongo = await mongoose.startSession();
        sessionMongo.startTransaction();

        try {
          const insertedOrder = await OrderModel.insertMany(orderPayload, {
            session: sessionMongo,
          });

          // Extract order IDs for user's order history
          const orderIds = await insertedOrder.map((order) => order._id);

          // Update user record in a single operation
          await UserModel.findByIdAndUpdate(
            userId,
            {
              $push: { order_history: { $each: orderIds } },
              $set: { shopping_cart: [] },
            },
            { session: sessionMongo }
          );

          await CartProductModel.deleteMany(
            { userId: userId },
            { session: sessionMongo }
          );

          await sessionMongo.commitTransaction(); // Commit the transaction
          sessionMongo.endSession();

          console.log("Order created and cart cleared successfully");
        } catch (dbError) {
          await sessionMongo.abortTransaction(); // Rollback the transaction in case of any error
          sessionMongo.endSession();

          console.error("Database operation failed:", dbError);
          throw new Error("Database operation failed");
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        console.error("Session expired:", session.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error("Payment failed:", paymentIntent.id);
        break;
      }

      default: {
        console.error(`Unhandled event type: ${event.type}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return 200 to acknowledge receipt
    return res.status(200).json({
      received: true,
      error:
        "Payment processed, but order creation failed. Please contact support.",
    });
  }
};

export const fetchOrderByUserIdController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .session(session);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this user",
        error: true,
        success: false,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Orders fetched successfully",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(`Error occurred while fetching orders: ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
