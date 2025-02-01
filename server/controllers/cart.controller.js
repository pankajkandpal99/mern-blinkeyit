import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    if (!productId) {
      return res.status(402).json({
        message: "ProductId is missing",
        error: true,
        success: false,
      });
    }

    const existingCartItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      return res.status(400).json({
        message: "Item already in cart",
        error: true,
        success: false,
      });
    }

    // Create a new cart item and update the user model concurrently
    const newCartItem = new CartProductModel({
      quantity: 1,
      userId,
      productId,
    });

    const operations = [
      newCartItem.save(),
      UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { shopping_cart: productId } }, // $addToSet prevents duplicates
        { new: true }
      ),
    ];

    const [savedCartItem, updatedUser] = await Promise.all(operations);

    return res.status(200).json({
      message: "Item add successfully",
      error: false,
      success: true,
      data: {
        cartItem: savedCartItem,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error occured while add item in cart : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchCartItemsController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "You are not authorized, Please Login first.",
        error: true,
        success: false,
      });
    }

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId"
    );

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        message: "Your cart is empty.",
        error: false,
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      message: "Cart items fetched successfully.",
      error: false,
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error("Error occurred while fetching items from cart: ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

// update the cart -> update quantity
export const updateCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId || !quantity) {
      return res.status(400).json({
        message: "Item ID and quantity are required",
        error: true,
        success: false,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        error: true,
        success: false,
      });
    }

    const cartItem = await CartProductModel.findOne({
      productId: itemId,
      userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        error: true,
        success: false,
      });
    }

    cartItem.quantity = quantity;
    const updatedCartItem = await cartItem.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      error: false,
      success: true,
      data: updatedCartItem,
    });
  } catch (error) {
    console.error("Error occurred while updating items in cart: ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "You are not authorized, Please Login first.",
        error: true,
        success: false,
      });
    }

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        message: "Cart item ID is required",
        error: true,
        success: false,
      });
    }

    const cartItem = await CartProductModel.findOneAndDelete({
      productId: itemId,
      userId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        error: true,
        success: false,
      });
    }

    // Remove cart item ID from user's shopping_cart array
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { shopping_cart: cartItem.productId } },
      { new: true }
    );

    res.status(200).json({
      message: "Cart item deleted successfully",
      error: false,
      success: true,
      data: cartItem,
    });
  } catch (error) {
    console.error("Error occurred while deleting cart item : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
