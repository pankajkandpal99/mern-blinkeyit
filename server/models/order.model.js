import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: [true, "please provide orderId"],
      unique: true,
    },

    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },

    product_details: {
      name: { type: String, required: true },
      image: { type: [String], default: [] },
    },

    paymentId: {
      type: String,
      default: "",
    },

    payment_status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    payment_type: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true,
    },

    subTotalAmt: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmt: {
      type: Number,
      required: true,
      min: 0,
    },

    // receipt generate only for online payment users...
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;

// const orderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     productId: {
//       type: mongoose.Schema.ObjectId,
//       ref: "product",
//     },
//     product_details: {
//       name: String,
//       image: Array,
//     },
//     paymentId: {
//       type: String,
//       default: "",
//     },
//     paymentType: {
//       type: String,
//       enum: ["COD", "Online"],
//       required: true,
//     },
//     payment_status: {
//       type: String,
//       enum: ["Pending", "Completed", "Failed"],
//       default: "Pending",
//     },
//     delivery_address: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Address",
//     },
//     subTotalAmt: {
//       type: Number,
//       default: 0,
//     },
//     totalAmt: {
//       type: Number,
//       default: 0,
//     },
//     shippingCharge: {
//       type: Number,
//       default: 0,
//     },
//     discountAmount: {
//       type: Number,
//       default: 0,
//     },
//     orderStatus: {
//       type: String,
//       enum: [
//         "Pending",
//         "Placed",
//         "Processing",
//         "Dispatched",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },
//     invoice_receipt: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );
// const OrderModel = mongoose.model("Order", orderSchema);
