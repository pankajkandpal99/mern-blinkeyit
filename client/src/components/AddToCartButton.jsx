/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItemInCart,
  fetchItemsFromCart,
  updateItemInCart,
} from "../services/cartService";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { handleItemsInCart } from "../store/cartSlice";
import toast, { LoaderIcon } from "react-hot-toast";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useLocation } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const items = useSelector((state) => state?.cart?.items);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Check if the current route matches the product details page
  const isProductDetailsPage = location.pathname.startsWith("/product/");

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    setLoading(true);
    try {
      const { data: response } = await Axios({
        ...summaryApi.addToCart,
        url: `${summaryApi.addToCart.url}/${data?._id}`,
      });

      if (response.success) {
        const { cartItem, user } = data;

        fetchItemsFromCart(dispatch, handleItemsInCart);
        toast.success("item added successfully.");
      }
    } catch (error) {
      console.error(`Error occured while adding item to cart : ${error}`);
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.message || "Item already in cart.";
        toast.error(errorMessage);
      } else {
        AxiosToastError(error); // Handle other errors
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQty = async () => {
    try {
      const newQuantity = quantity + 1;
      await updateItemInCart(dispatch, data._id, newQuantity);

      setIsAvailableCart(true);
      setQuantity(newQuantity);
      toast.success("Quantity increased.");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("Failed to increase quantity. Please try again.");
    }
  };

  const handleDecreaseQty = async () => {
    if (quantity <= 1) {
      try {
        await deleteItemInCart(dispatch, data._id); // data._id is productId, not cart item id....
        setIsAvailableCart(false);
        setQuantity(0);
        toast.success("Item removed from cart.");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("Failed to remove item. Please try again.");
      }

      return; // Exit early since item is deleted
    }

    try {
      const newQuantity = quantity - 1;
      await updateItemInCart(dispatch, data._id, newQuantity);
      setIsAvailableCart(true);
      setQuantity(newQuantity);
      toast.success("Quantity decreased.");
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error("Failed to decrease quantity. Please try again.");
    }
  };

  // checking the product is already available in cart - if available then show increase and decrease button except Add To Cart or Add button.
  useEffect(() => {
    const itemInCart = items.find((item) => item.productId?._id === data?._id);
    if (itemInCart) {
      setIsAvailableCart(true);
      setQuantity(itemInCart.quantity);
    } else {
      setIsAvailableCart(false);
      setQuantity(0);
    }
  }, [items, data?._id]);

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div
          className={`flex items-center ${
            isProductDetailsPage
              ? "bg-gray-100 shadow-md rounded-lg border border-gray-300 px-4 py-2 gap-x-4"
              : "bg-gray-200 rounded"
          } cursor-default`}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handleDecreaseQty();
            }}
            className={`${
              isProductDetailsPage
                ? "flex items-center justify-center w-10 h-10 rounded-l-md text-lg font-medium hover:shadow-md transition-transform transform hover:scale-105"
                : "flex items-center justify-center w-6 h-6 rounded-l text-sm font-medium"
            } bg-green-600 hover:bg-green-700 text-white`}
          >
            <FaMinus />
          </button>

          <p
            className={`${
              isProductDetailsPage
                ? "text-lg font-semibold"
                : "text-sm font-medium"
            } text-gray-800 text-center w-8`}
          >
            {quantity}
          </p>

          <button
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handleIncreaseQty();
            }}
            className={`${
              isProductDetailsPage
                ? "flex items-center justify-center w-10 h-10 rounded-r-md text-lg font-medium hover:shadow-md transition-transform transform hover:scale-105"
                : "flex items-center justify-center w-6 h-6 rounded-r text-sm font-medium"
            } bg-green-600 hover:bg-green-700 text-white`}
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className={`${
            isProductDetailsPage
              ? "w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 sm:px-6 sm:py-3 rounded text-white text-sm sm:text-base font-medium shadow-md transition-transform transform hover:scale-105"
              : "bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white text-xs md:text-sm font-medium shadow-md transition-transform transform"
          }`}
        >
          {loading ? (
            <LoaderIcon />
          ) : isProductDetailsPage ? (
            "Add To Cart"
          ) : (
            "Add"
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
