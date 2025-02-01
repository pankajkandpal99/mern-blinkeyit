import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { summaryApi } from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyForgotPasswordOTPPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef([]);
  
  const location = useLocation();
  const email = location?.state?.email; // access email from forgotPassword page.

  const [otpNumber, setOtpNumber] = useState(["", "", "", "", "", ""]);
  const isOtpValid = otpNumber.every((el) => el.trim() !== "");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isOtpValid) {
      toast.error("Please fill in all OTP fields.");
      return;
    }

    try {
      const response = await Axios({
        ...summaryApi.verify_otp, // Use method and URL from the summary API
        data: {
          otp: otpNumber.join(""),
          email: email,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("OTP verified successfully.");
        setOtpNumber(["", "", "", "", "", ""]);

        navigate("/reset-password", {
          state: {
            data: response.data,
            email: email,
          },
        });
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      AxiosToastError(error); // render the toast error
    }
  };

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Verify OTP</p>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1">
            <label htmlFor="verifyOtp">Please enter your OTP :</label>

            <div className="flex items-center gap-2 justify-between mt-3">
              {otpNumber.map((otp, idx) => (
                <input
                  key={"otp" + idx}
                  type="text"
                  id="otp"
                  ref={(ref) => {
                    inputRef.current[idx] = ref;
                    return ref;
                  }}
                  value={otpNumber[idx]}
                  maxLength={1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^[0-9]?$/.test(value)) return;

                    const newData = [...otpNumber];
                    newData[idx] = value;
                    setOtpNumber(newData);

                    if (value && idx < otpNumber.length - 1) {
                      inputRef.current[idx + 1]?.focus();
                    }
                  }}
                  className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isOtpValid}
            className={`${
              isOtpValid
                ? "bg-green-700 hover:bg-green-800 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            } text-white rounded font-semibold py-2 mt-3 mb-2 tracking-wide`}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyForgotPasswordOTPPage;
