import { FaCartShopping } from "react-icons/fa6";
import CartSummary from "./CartSummary";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartMobile = () => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <>
      {cartItems.length > 0 && (
        <div className="lg:hidden p-2 sticky bottom-4 z-50">
          <div className="px-2 py-1 bg-green-600 rounded text-neutral-100 text-sm flex justify-between items-center">
            {/* left */}
            <div className="flex items-center gap-x-1">
              <div className="p-2 bg-green-500 rounded w-fit">
                <FaCartShopping className="text-lg" />
              </div>
              <div className="text-xs">
                <CartSummary isMobile={true} />
              </div>
            </div>

            {/* right */}
            <Link
              to="/cart"
              className="text-base flex items-center gap-x-1 font-semibold px-3 py-1 rounded bg-green-500 text-white hover:text-green-500 hover:bg-white transition-all duration-200 ease-in-out shadow-sm"
            >
              <span>View Cart</span>
              <FaCaretRight className="text-lg" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobile;
