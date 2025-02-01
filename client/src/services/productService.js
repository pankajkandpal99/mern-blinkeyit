import { summaryApi } from "../common/SummaryApi";
import Axios from "../utils/Axios";

export const fetchCategories = async (dispatch, setAllCategory) => {
  try {
    const { data: res } = await Axios({ ...summaryApi.fetchCategory });
    if (res.success) {
      dispatch(setAllCategory(res.data));
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    throw error;
  }
};

export const fetchSubCategories = async (dispatch, setAllSubCategory) => {
  try {
    const { data: res } = await Axios({ ...summaryApi.fetchSubCategory });
    if (res.success) {
      dispatch(setAllSubCategory(res.data));
    } else {
      throw new Error("Failed to fetch subCategories");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Invalid product ID.");
    }

    const { data: response } = await Axios({
      ...summaryApi.fetchProductDetails,
      url: `${summaryApi.fetchProductDetails.url}/${productId}`,
    });

    if (response.success) {
      const { product } = response.data;
      return product;
    } else {
      throw new Error("Failed to fetch product details.");
    }
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while fetching the product."
    );
  }
};
