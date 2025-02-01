export const priceWithDiscount = (price, discount = 0) => {
  const discountedAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  const actualPrice = Number(price) - discountedAmount;

  return actualPrice;
};
