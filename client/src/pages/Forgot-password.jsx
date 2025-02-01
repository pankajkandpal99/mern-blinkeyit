import { useState } from "react";
import toast from "react-hot-toast";
import { summaryApi } from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
  });

  const isFormValid = Object.values(data).every((field) => field.trim() !== "");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email } = data;

    if (!isFormValid) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const response = await Axios({
        ...summaryApi.forgot_password, // Use method and URL from the summary API
        data: { email },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("OTP sent. Check your email.");
        navigate("/verify-otp", {
          state: { email: data.email },  // email access in verify-otp file, please use useLocation hook...
        });

        setData({
          email: "",
        });
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Forgot-password Error:", error);
      AxiosToastError(error); // render the toast error
    }
  };

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Forgot Password</p>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="bg-blue-50 p-2 pr-8 outline-none rounded-md w-full border focus-within:border-primary-200"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`${
              isFormValid
                ? "bg-green-700 hover:bg-green-800 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            } text-white rounded font-semibold py-2 mt-3 mb-2 tracking-wide`}
          >
            Send OTP
          </button>
        </form>

        {/* <p className="text-center mt-4">
          Already have an account ?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p> */}
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
