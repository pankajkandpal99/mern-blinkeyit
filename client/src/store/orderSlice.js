import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders = [...action.payload];
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
