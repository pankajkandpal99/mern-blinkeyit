import { summaryApi } from "../common/SummaryApi";
import {
  deleteItemInCartHandler,
  updateItemInCartHandler,
} from "../store/cartSlice";
import Axios from "../utils/Axios";

export const fetchItemsFromCart = async (dispatch, handleItemsInCart) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.fetchItemsFromCart,
    });

    if (response.success) {
      const { data } = response;
      dispatch(handleItemsInCart(data.length > 0 ? data : []));
    } else {
      throw new Error(response.message || "Failed to fetch cart items.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateItemInCart = async (dispatch, itemId, quantity) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.updateItemInCart,
      url: `${summaryApi.updateItemInCart.url}/${itemId}`,
      data: { quantity },
    });

    if (response.success) {
      const updatedItem = response.data; // Server se updated item ka object

      // Redux state me directly update
      dispatch(updateItemInCartHandler(updatedItem));
    } else {
      throw new Error(
        response.message || "Failed to update cart item quantity."
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteItemInCart = async (dispatch, itemId) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.deleteItemInCart,
      url: `${summaryApi.deleteItemInCart.url}/${itemId}`,
    });

    if (response?.success || response?.status === 200) {
      dispatch(deleteItemInCartHandler(itemId)); // Update Redux store
    } else {
      throw new Error(response.message || "Failed to delete cart item.");
    }
  } catch (error) {
    // console.error("Error deleting item from cart:", error);
    throw new Error(error);
  }
};
