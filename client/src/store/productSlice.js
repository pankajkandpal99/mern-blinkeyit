import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  subCategory: [],
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setAllCategory(state, action) {
      state.allCategory = [...action.payload];
    },
    setAllSubCategory(state, action) {
      state.subCategory = [...action.payload];
    },
    // setProduct(state, action) {
    //   state.product = action.payload;
    // },
  },
});

export const { setAllCategory, setAllSubCategory } = productSlice.actions;

export default productSlice.reducer;
