import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ForgotPasswordPage from "../pages/Forgot-password";
import VerifyForgotPasswordOTPPage from "../pages/VerifyForgotPasswordOTP";
import ResetPasswordPage from "../pages/ResetPassword";
import UserMobileMenuPage from "../pages/UserMobileMenuPage";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layout/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartForMobile from "../components/CartForMobile";
import CheckoutPage from "../pages/CheckoutPage";
import SuccessPage from "../pages/SuccessPage";
import CancelPage from "../pages/Cancel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyForgotPasswordOTPPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/user",
        element: <UserMobileMenuPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "orders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <Category />
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                <SubCategory />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <ProductAdmin />
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:productName/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "cart",
        element: <CartForMobile />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <SuccessPage />,
      },
      {
        path: "cancel",
        element: <CancelPage />,
      },
    ],
  },
]);
