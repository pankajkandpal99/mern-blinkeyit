import axios from "axios";
import { summaryApi } from "../common/SummaryApi";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Request Interceptor (for Access Token)
// sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken"); // get the token

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // put the token into header
    }

    return config; // send the request
  },
  (error) => {
    return Promise.reject(error); // if error occured in get the token or send the request, then the API call will be rejected
  }
);

// extend the life span of access token with the help of refresh token
// Response Interceptor (for Token Refresh)
Axios.interceptors.response.use(
  (response) => {
    return response; // Return successful responses
  },
  async (error) => {
    const originRequest = error.config;

    if (
      error.response &&
      error.response.status === 500 &&
      !originRequest._retry &&
      error.response.data.message === "jwt expired"
    ) {
      originRequest._retry = true; // Mark request for retry

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // Update the header and retry the original request
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originRequest);
        }
      }

      // console.error("Refresh token expired or missing. Logging out...");
      handleSessionExpiry();
    }

    // If refresh fails, handle it gracefully
    if (error.response && error.response.status === 401) {
      // Handle logout or redirection if refresh token is invalid/expired
      console.error("Session expired. Logging out...");
      handleSessionExpiry();
    }

    return Promise.reject(error); // Reject if token refresh fails
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...summaryApi.refresh_token,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error(
      "Error occured while generating new access token via refresh token",
      error
    );
    return null; // Return null on failure
  }
};

// Handle session expiry (e.g., logout user, redirect to login page)
const handleSessionExpiry = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  const currentPath = window.location.pathname;

  // Redirect only if the user is not already on the /login page
  if (currentPath !== "/login") {
    window.location.href = "/login";
  }
};

export default Axios;
