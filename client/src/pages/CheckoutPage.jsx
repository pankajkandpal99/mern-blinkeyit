import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";
import useCartPriceCalculator from "../hooks/useCartPriceCalculator";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { useState } from "react";
import AddressSection from "../components/AddressSection";
import toast from "react-hot-toast";
import { clearCart } from "../store/cartSlice";
import { orderService } from "../services/orderService";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.items);
  const totalAmount = useSelector((state) => state.cart?.totalAmount);
  const addressList = useSelector((state) => state.address?.userAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { totalPriceWithDiscount, priceWithoutDiscount } =
    useCartPriceCalculator(cartItems);

  const findAddressById = (id) =>
    addressList?.find((address) => address?._id === id);

  const handleSelectedAddress = (addressId) => {
    const address = findAddressById(addressId);
    setSelectedAddress(address);
  };

  const handleCODOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      const payload = {
        items:
          cartItems?.length > 0 &&
          cartItems?.map((item) => ({
            productId: {
              _id: item.productId?._id,
              name: item.productId?.name,
              image: item.productId?.image,
            },
            quantity: item.quantity,
          })),
        subTotalAmt: totalAmount,
        totalAmt: priceWithoutDiscount,
        addressId: selectedAddress?._id,
      };

      await orderService.createCODOrder(payload);
      dispatch(clearCart());
      toast.success("successfully created your order");
      navigate("/success", { replace: true });

      window.history.pushState(null, "", "/success"); // Remove checkout page from history stack -> User can't go back in checkout page...
    } catch (error) {
      console.error("Error placing COD order:", error);
    }
  };

  const onlinePaymentHandler = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        items: cartItems,
        totalAmt: totalAmount,
        subTotalAmt: totalAmount,
        addressId: selectedAddress?._id,
      };

      await orderService.createOnlineOrder(payload);
    } catch (error) {
      console.error("Error in online payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-[76vh] py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Address Section */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Choose Your Address</h3>

            <AddressSection
              allowSelection={true}
              allowEdit={false}
              allowDelete={false}
              onSelectAddress={handleSelectedAddress}
            />
          </div>

          {/* Billing Details Section */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Items:</span>
              <span className="text-gray-800 font-medium">
                {cartItems.length} item(s), Total Quantity:{" "}
                {cartItems.reduce(
                  (prevValue, currItem) =>
                    prevValue + (currItem?.quantity || 0),
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Delivery Charge:</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-gray-500 line-through">
                {PriceFormatterInRupee(priceWithoutDiscount)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-semibold">
                Payable Amount:
              </span>
              <span className="text-green-600 font-semibold text-xl">
                {PriceFormatterInRupee(totalPriceWithDiscount)}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={onlinePaymentHandler}
                disabled={isLoading || !selectedAddress}
                className="font-semibold w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-0 focus:ring-green-500 focus:ring-offset-0 disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <FaCreditCard /> Pay Online
                  </>
                )}
              </button>

              <button
                onClick={handleCODOrder}
                disabled={isLoading}
                className="font-semibold w-full text-indigo-500 py-3 rounded-lg hover:bg-indigo-500 transition-colors border-indigo-500 border-2 hover:text-white flex items-center justify-center gap-2 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-0 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <FaMoneyBillWave /> Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
