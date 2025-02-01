import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserDetails } from "./store/userSlice";
import { fetchUserDetails } from "./utils/fetchUserDetails";
import { setAllCategory, setAllSubCategory } from "./store/productSlice";
import { isAdmin } from "./utils/isAdmin";
import { fetchCategories, fetchSubCategories } from "./services/productService";
import { fetchItemsFromCart } from "./services/cartService";
import { handleItemsInCart } from "./store/cartSlice";
import CartMobile from "./components/CartMobile";
import { fetchAddress } from "./services/addressService";

// Outlet means - render child routes, which is defined in route folder index file
function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const excludedRoutes = ["/cart", "/checkout", "/success"];
  const shouldDisplayCartMobile = !excludedRoutes.includes(
    useLocation().pathname
  );

  const fetchUser = async () => {
    try {
      const response = await fetchUserDetails();

      if (response.success) {
        dispatch(setUserDetails(response.data));
      } else {
        throw new Error("Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    if (!user?._id) {
      fetchUser();
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchItemsFromCart(dispatch, handleItemsInCart);
      fetchAddress(dispatch);
    }
  }, [user?._id]);

  useEffect(() => {
    if (isAdmin(user?.role)) {
      fetchCategories(dispatch, setAllCategory);
      fetchSubCategories(dispatch, setAllSubCategory);
    }
  }, [user?.role]);

  return (
    <>
      <Header />
      <main className="min-h-[74vh] lg:min-h-[76vh]" role="main">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {shouldDisplayCartMobile && <CartMobile />}
    </>
  );
}

export default App;
