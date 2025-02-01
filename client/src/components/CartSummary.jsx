import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";
import useCartPriceCalculator from "../hooks/useCartPriceCalculator";

const CartSummary = ({ isMobile = false }) => {
  const cartItem = useSelector((state) => state?.cart?.items);
  const { totalPriceWithDiscount } = useCartPriceCalculator(cartItem);

  const totalQty = cartItem.reduce(
    (prevValue, currValue) => prevValue + currValue?.quantity,
    0
  );

  return (
    <div
      className={`flex items-center ${
        isMobile
          ? "justify-between px-2 py-1 bg-green-600 rounded text-white"
          : "gap-4 items-center text-sm"
      }`}
    >
      <div
        className={`flex items-center ${
          isMobile ? "" : "bg-green-600 text-white p-2 rounded-full"
        }`}
      >
        <BsCart4
          size="26"
          className={`${isMobile && "hidden"} animate-bounce`}
        />
      </div>

      <div className={`flex flex-col justify-center`}>
        <span
          className={`font-semibold ${
            isMobile ? "text-sm" : "text-base text-gray-200"
          }`}
        >
          {cartItem.length > 0 ? `${totalQty} Items` : "My Cart"}
        </span>
        {cartItem.length > 0 && (
          <p
            className={`font-semibold ${
              isMobile ? "text-sm" : "text-gray-200"
            }`}
          >
            {PriceFormatterInRupee(totalPriceWithDiscount)}
          </p>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
