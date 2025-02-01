import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { FiLogOut } from "react-icons/fi";
import {
  MdOutlineShoppingBag,
  MdOutlineLocationOn,
  MdUpload,
  MdCategory,
  MdLayers,
} from "react-icons/md";
import { HiOutlineExternalLink } from "react-icons/hi";
import { logout } from "../store/userSlice";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useMobile } from "../hooks/useMobile";
import { FaProductHunt } from "react-icons/fa";
import { isAdmin } from "../utils/isAdmin";
import { clearCart } from "../store/cartSlice";

const UserMenu = ({ close }) => {
  const [isMobile] = useMobile();

  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await Axios({
        ...summaryApi.logout,
      });

      if (res.data.success) {
        if (!isMobile && close) close(); // usermenu will be close only for desktop devices.

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        dispatch(logout());
        dispatch(clearCart());

        toast.success("You have successfully logged out");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error occured while logging out : ", error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div>
      {/* User Details */}
      <div className="font-semibold text-lg text-gray-800 mb-2">My Account</div>
      <div className="text-sm text-gray-600 mb-4">
        {user?.role === "ADMIN" && (
          <span className="block w-[75px] text-start mb-2 px-4 py-1 text-xs font-semibold text-white bg-red-500 rounded-md">
            Admin
          </span>
        )}
        <Link
          to={`${user._id ? "/dashboard/profile" : ""}`}
          onClick={handleClose}
          className={`flex items-center gap-3 ${
            user._id ? " hover:text-blue-600 cursor-pointer" : "cursor-default"
          }`}
        >
          <span className="max-w-52 text-ellipsis line-clamp-1">
            {user?.name || "Guest"}{" "}
          </span>
          {user.name && <HiOutlineExternalLink size={20} />}
        </Link>
      </div>

      <Divider />

      {/* Menu Links */}
      <div className="text-sm grid gap-4 mt-4">
        {isAdmin(user?.role) && (
          <Link
            to="/dashboard/category"
            onClick={handleClose}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
          >
            <MdCategory size={20} className="text-blue-500" />
            Category
          </Link>
        )}

        {isAdmin(user?.role) && (
          <Link
            to="/dashboard/sub-category"
            onClick={handleClose}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
          >
            <MdLayers size={20} className="text-blue-500" />
            SubCategory
          </Link>
        )}

        {isAdmin(user?.role) && (
          <Link
            to="/dashboard/upload-product"
            onClick={handleClose}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
          >
            <MdUpload size={20} className="text-blue-500" />
            Upload Product
          </Link>
        )}

        {isAdmin(user?.role) && (
          <Link
            to="/dashboard/product"
            onClick={handleClose}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
          >
            <FaProductHunt size={20} className="text-blue-500" />
            Product
          </Link>
        )}

        <Link
          to="/dashboard/orders"
          onClick={handleClose}
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
        >
          <MdOutlineShoppingBag size={20} className="text-blue-500" />
          My Orders
        </Link>

        <Link
          to="/dashboard/address"
          onClick={handleClose}
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
        >
          <MdOutlineLocationOn size={20} className="text-blue-500" />
          Saved Addresses
        </Link>

        <button
          onClick={() => {
            if (user?._id) {
              logoutHandler(); // Call logout if the user is logged in
            } else {
              navigate("/login"); // Redirect to login if the user is not logged in
            }
          }}
          className={`${
            user?._id ? "hover:text-red-500" : "hover:text-blue-600"
          } flex items-center gap-3 text-left text-gray-700 transition`}
        >
          <FiLogOut
            size={20}
            className={`${user?._id ? "text-red-500" : "text-blue-500"}`}
          />
          {user?._id ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
