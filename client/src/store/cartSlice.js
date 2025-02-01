import { createSlice } from "@reduxjs/toolkit";
import { priceWithDiscount } from "../utils/PriceWithDiscount";

const initialState = {
  items: [],
  totalAmount: 0,
  totalQty: 0,
};

const calculateTotals = (items) => {
  const totalAmount = items.reduce((total, item) => {
    const price = item?.productId?.price || 0;
    const discount = item?.productId?.discount || 0;
    const quantity = item?.quantity || 0;

    const discountedPrice = priceWithDiscount(price, discount);
    return total + discountedPrice * quantity;
  }, 0);

  const totalQty = items.reduce((total, item) => {
    return total + (item?.quantity || 0);
  }, 0);

  return { totalAmount, totalQty };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    handleItemsInCart: (state, action) => {
      state.items = [...action.payload];
      
      const { totalAmount, totalQty } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalQty = totalQty;
    },

    updateItemInCartHandler: (state, action) => {
      const updatedItem = action.payload;

      const itemIndex = state.items.findIndex(
        (item) => item?.productId?._id === updatedItem?.productId
      );

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = updatedItem?.quantity;
      } else {
        state.items.push(updatedItem);
      }

      const { totalAmount, totalQty } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalQty = totalQty;
    },

    deleteItemInCartHandler: (state, action) => {
      const itemId = action.payload;
      state.items = state.items?.filter(
        (item) => item?.productId?._id !== itemId
      );

      const { totalAmount, totalQty } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalQty = totalQty;
    },

    // Clear the entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQty = 0;
    },
  },
});

export const {
  handleItemsInCart,
  updateItemInCartHandler,
  deleteItemInCartHandler,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
