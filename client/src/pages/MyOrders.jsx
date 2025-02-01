import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByUser } from "../services/orderService";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useEffect, useState } from "react";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";

const MyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      await fetchOrdersByUser(dispatch);
    } catch (error) {
      console.error(`Error occurred while fetching your orders: ${error}`);
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No orders found</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-50 shadow-sm rounded-xl p-5 border border-gray-300 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-4 gap-2">
              <span className="text-start w-full lg:w-auto text-sm text-gray-600 font-medium">
                Order ID: {order.orderId}
              </span>
              <div className="flex gap-x-2 justify-start w-full lg:w-auto">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.payment_status === "PAID"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {order.payment_status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.payment_type === "ONLINE"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {order.payment_type}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-4">
              <img
                src={order.product_details.image[0]}
                alt={order.product_details.name}
                className="w-24 h-24 object-cover rounded-md shadow-sm"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-700">
                  {order.product_details.name}
                </h3>
              </div>
            </div>

            <div className="mb-3 flex gap-2">
              <h4 className="text-sm font-medium text-gray-600">
                Shipping Address:
              </h4>
              <p className="text-sm text-gray-500">
                {order.delivery_address.city},{" "}
                {order.delivery_address.address_line},{" "}
                {order.delivery_address.state} -{" "}
                {order.delivery_address.pincode}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="font-bold text-green-700 text-lg">
                {PriceFormatterInRupee(order.subTotalAmt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
