import { useMemo } from "react";
import { priceWithDiscount } from "../utils/PriceWithDiscount";

const useCartPriceCalculator = (cartItems) => {
  const totalPriceWithDiscount = useMemo(() => {
    return cartItems.reduce((prevValue, currItem) => {
      const price = currItem?.productId?.price || 0;
      const discount = currItem?.productId?.discount || 0;
      const quantity = currItem?.quantity || 0;

      if (isNaN(price) || isNaN(discount) || isNaN(quantity)) {
        console.warn("Invalid numeric values:", { price, discount, quantity });
        return prevValue;
      }

      const discountedAmount = priceWithDiscount(price, discount);

      return prevValue + quantity * discountedAmount;
    }, 0);
  }, [cartItems]);

  const calculateTotalSaving = useMemo(() => {
    return cartItems.reduce((totalSaving, currItem) => {
      const price = currItem?.productId?.price || 0;
      const discount = currItem?.productId?.discount || 0;
      const quantity = currItem?.quantity || 0;

      if (isNaN(price) || isNaN(discount) || isNaN(quantity)) {
        console.warn("Invalid numeric values:", { price, discount, quantity });
        return totalSaving;
      }

      const originalTotal = price * quantity;
      const discountedTotal = priceWithDiscount(price, discount) * quantity;

      const itemSaving = originalTotal - discountedTotal;

      return totalSaving + itemSaving;
    }, 0);
  }, [cartItems]);

  const priceWithoutDiscount = useMemo(() => {
    return cartItems.reduce((prevValue, currItem) => {
      const price = currItem?.productId?.price || 0;
      const quantity = currItem?.quantity || 0;

      if (isNaN(price) || isNaN(quantity)) {
        console.warn("Invalid numeric values:", { price, quantity });
        return prevValue;
      }

      return prevValue + price * quantity;
    }, 0);
  }, [cartItems]);

  return { totalPriceWithDiscount, calculateTotalSaving, priceWithoutDiscount };
};

export default useCartPriceCalculator;
