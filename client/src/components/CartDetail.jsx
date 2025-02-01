import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteItemInCart, updateItemInCart } from "../services/cartService";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";
import imageEmptyCart from "../assets/empty_cart.webp";
import useCartPriceCalculator from "../hooks/useCartPriceCalculator";

const CartDetail = ({ close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state?.cart?.items);
  const { totalPriceWithDiscount, calculateTotalSaving, priceWithoutDiscount } =
    useCartPriceCalculator(cartItem);

  const handleIncreaseQty = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity + 1;
      await updateItemInCart(dispatch, productId, newQuantity);
      toast.success("Quantity increased.");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("Failed to increase quantity. Please try again.");
    }
  };

  const handleDecreaseQty = async (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      try {
        await deleteItemInCart(dispatch, productId);
        toast.success("Item removed from cart.");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("Failed to remove item. Please try again.");
      }

      return;
    }

    try {
      const newQuantity = currentQuantity - 1;
      await updateItemInCart(dispatch, productId, newQuantity);
      toast.success("Quantity decreased.");
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error("Failed to decrease quantity. Please try again.");
    }
  };

  const checkoutPageNavigator = () => {
    if (!user?._id) {
      toast.error("Please login to continue.");
      return;
    }

    navigate("/checkout");
    close?.();
  };

  useEffect(() => {
    // Disable scrolling on body when the cart is open
    document.body.style.overflow = "hidden";

    // Cleanup to enable scrolling again when the cart is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>

          <Link to={"/"} className="lg:hidden">
            <IoClose size={26} />
          </Link>

          <button
            onClick={close}
            className="hidden lg:block text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close Cart"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto scrollbarCustom p-4">
          {/* Total Savings */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full mb-4">
            <p>Your total savings</p>
            <p>{PriceFormatterInRupee(calculateTotalSaving)}</p>
          </div>

          {cartItem.length > 0 ? (
            cartItem.map((item) => (
              <div
                key={item?._id + "cartItemDetail"}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.productId?.image[0]}
                    alt={item.productId?.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex flex-col gap-0">
                    <h4
                      className="text-gray-800 font-medium"
                      title={item?.productId?.name}
                    >
                      {item.productId?.name?.length > 25
                        ? item.productId?.name.substring(0, 25) + "..."
                        : item.productId?.name}
                    </h4>

                    <div className="flex flex-col gap-0">
                      <div className="text-sm text-gray-500 h-5">
                        {isNaN(item.productId.unit)
                          ? item?.productId?.unit
                          : `${item?.productId?.unit} Piece`}
                      </div>

                      <p className="text-sm text-gray-500">
                        {PriceFormatterInRupee(
                          priceWithDiscount(
                            item.productId?.price,
                            item.productId?.discount || 0
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() =>
                      handleDecreaseQty(item?.productId?._id, item?.quantity)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-0 rounded"
                  >
                    -
                  </button>
                  <p className="text-gray-800 font-medium">{item?.quantity}</p>
                  <button
                    onClick={() =>
                      handleIncreaseQty(item?.productId?._id, item?.quantity)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-0 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <img
                src={imageEmptyCart}
                alt="Empty Cart"
                className="w-80 h-60 object-cover -mt-20"
              />
              <p className="text-center text-xl text-gray-500">
                Your cart is empty.
              </p>
              <Link
                to="/"
                onClick={close}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItem.length > 0 && (
          <div className="p-4 border-t border-gray-300 text-sm">
            {/* Total items and quantity */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Items:</span>
              <span className="text-gray-800">
                {cartItem.length} item(s), Total Quantity:{" "}
                {cartItem.reduce(
                  (prevValue, currItem) =>
                    prevValue + (currItem?.quantity || 0),
                  0
                )}
              </span>
            </div>

            {/* Delivery charge */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Delivery Charge:</span>
              <span className="text-green-600">Free</span>
            </div>

            {/* Total Price Without Discount */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Amount:</span>
              <span className="text-gray-500 line-through">
                {PriceFormatterInRupee(priceWithoutDiscount)}
              </span>
            </div>

            {/* Discounted Total Amount */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-800">
                Payable Amount:
              </span>
              <span className="font-semibold text-green-600">
                {PriceFormatterInRupee(totalPriceWithDiscount)}
              </span>
            </div>

            <button
              disabled={cartItem.length === 0}
              onClick={checkoutPageNavigator}
              className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors ${
                cartItem.length === 0 && "cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartDetail;
