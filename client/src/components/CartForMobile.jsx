import CartDetail from "./CartDetail";

const CartForMobile = () => {
  return (
    <div className="block lg:hidden">
      <CartDetail />
    </div>
  );
};

export default CartForMobile;
