import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPage = () => {
  const navigate = useNavigate();

  const clearHistoryAndNavigate = () => {
    navigate("/", { replace: true });

    // Clear entire history
    window.history.pushState(null, "", "/");
    window.history.go(0);
  };

  return (
    <div className="flex min-h-[74vh] lg:min-h-[76vh] items-center justify-center bg-gray-50 p-6">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We’ll send you a confirmation email shortly.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={clearHistoryAndNavigate}
            className="px-6 py-3 text-white bg-primary-100 hover:bg-primary-200 rounded-lg shadow-lg font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
