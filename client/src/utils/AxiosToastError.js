import toast from "react-hot-toast";

export const AxiosToastError = (error) => {
  const statusCode = error?.response?.status;

  // Check for specific status codes (optional customization)
  if (statusCode === 400) {
    toast.error("Invalid request, please try again.");
  } else if (statusCode === 401) {
    toast.error("Unauthorized, please log in.");
  } else {
    // Generic error message for other cases
    toast.error("Internal Server Error");
  }
};
