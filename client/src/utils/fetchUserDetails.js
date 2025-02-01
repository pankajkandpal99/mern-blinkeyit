import { summaryApi } from "../common/SummaryApi";
import Axios from "./Axios";

export const fetchUserDetails = async () => {
  try {
    const res = await Axios({
      ...summaryApi.fetchUserDetails,
    });

    if (res.status !== 200) {
      throw new Error("Failed to fetch user details.");
    }

    return res.data;
  } catch (error) {
    console.error("Error occured while fetching User details", error);
    return { error: true, message: error.message || "Something went wrong" };
  }
};
