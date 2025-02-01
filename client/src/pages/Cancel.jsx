import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const CancelPage = () => {
  const navigate = useNavigate();

  const handleGoBackHome = () => {
    navigate("/", { replace: true });
    window.history.pushState(null, "", "/");
    window.history.go(0);
  };

  return (
    <div className="flex min-h-[74vh] lg:min-h-[76vh] items-center justify-center bg-gray-50 p-6">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Payment Canceled
        </h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment was not successful. Please try again if
          needed.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoBackHome}
            className="px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
