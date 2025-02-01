import { loadStripe } from "@stripe/stripe-js";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { addOrder } from "../store/orderSlice";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const orderService = {
  createCODOrder: async (payload) => {
    try {
      const { data: response } = await Axios({
        ...summaryApi.createCODOrder,
        url: `${summaryApi.createCODOrder.url}/cod`,
        data: payload,
      });

      if (response.success || response.status === 201) {
        return response;
      } else {
        throw new Error("Order creation failed");
      }
    } catch (error) {
      AxiosToastError(error);
      throw error;
    }
  },

  createOnlineOrder: async (payload) => {
    try {
      const stripe = await stripePromise;

      const { data: response } = await Axios({
        ...summaryApi.createOnlineOrder,
        url: `${summaryApi.createOnlineOrder.url}/checkout-online`,
        data: payload,
      });

      if (response.success) {
        const { stripeSession } = response;
        const { error } = await stripe.redirectToCheckout({
          sessionId: stripeSession.id,
        });

        if (error) throw error;
        return response;
      } else {
        throw new Error("Online payment processing failed");
      }
    } catch (error) {
      AxiosToastError(error);
      throw error;
    }
  },
};

export const fetchOrdersByUser = async (dispatch) => {
  try {
    const { data: response } = await Axios({
      ...summaryApi.fetchOrderByUserId,
    });

    if (response.success || response.status === 200) {
      const { data } = response;
      dispatch(addOrder(data.length > 0 ? data : []));
    } else {
      throw new Error("Order fetching failed");
    }
  } catch (error) {
    throw error(error);
  }
};
