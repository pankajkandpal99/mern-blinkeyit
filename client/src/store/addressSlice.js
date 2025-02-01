import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userAddresses: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.userAddresses = [...action.payload];
    },

    updateAddress: (state, action) => {
      const updateAddress = action.payload;
      const addressIndex = state.userAddresses.findIndex(
        (address) => address?._id === updateAddress?._id
      );
      if (addressIndex !== -1) {
        state.userAddresses[addressIndex] = updateAddress;
      } else {
        console.warn(`Address with ID ${updateAddress?._id} not found`);
      }
    },
    deleteAddress: (state, action) => {
      const deleteAddressId = action.payload;
      if (!deleteAddressId) {
        console.warn("Invalid address ID provided for deletion.");
        return;
      }

      state.userAddresses = state.userAddresses.filter(
        (address) => address?._id !== deleteAddressId
      );
    },
  },
});

export const { addAddress, updateAddress, deleteAddress } =
  addressSlice.actions;
export default addressSlice.reducer;
