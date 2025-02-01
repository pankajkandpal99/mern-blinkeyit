import { summaryApi } from "../common/SummaryApi";
import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../store/addressSlice";
import Axios from "../utils/Axios";

export const addAddressService = async (addressData) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.createAddress,
      data: addressData,
    });

    if (response.success || response.status === 200) {
      return response;
    } else {
      throw new Error(response.message || "Failed to create user address.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchAddress = async (dispatch) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.fetchAddress,
    });

    if (response.success || response.status === 200) {
      const { data } = response;
      dispatch(addAddress(data));
    } else {
      throw new Error(response.message || "Failed to fetch user address.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateAddressService = async (
  dispatch,
  addressId,
  addressData
) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.updateAddress,
      url: `${summaryApi.updateAddress.url}/${addressId}`,
      data: addressData,
    });
    if (response.success || response.status === 200) {
      dispatch(updateAddress(response.data));
    } else {
      throw new Error(response.message || "Failed to update user address.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteAddressService = async (dispatch, addressId) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.deleteAddress,
      url: `${summaryApi.deleteAddress.url}/${addressId}`,
    });

    if (response.success || response.status === 200) {
      dispatch(deleteAddress(addressId));
    } else {
      throw new Error(response.message || "Failed to delete user address.");
    }
  } catch (error) {
    throw new Error(error);
  }
};
