import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { fetchUserDetails } from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const isFormValid = Object.values(data).every((field) => field.trim() !== "");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleVisiblePass = () => {
    setIsVisiblePass((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = data;

    if (!isFormValid) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const response = await Axios({
        ...summaryApi.login, // Use method and URL from the summary API
        data: { email, password },
      });

      const { data } = response.data;
      // console.log("Access token", data.accessToken);
      // console.log("Refresh token", data.refreshToken);

      if (response.status === 201 || response.status === 200) {
        toast.success("You are logged In successful!");
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        const user = await fetchUserDetails();
        dispatch(setUserDetails(user.data));

        setData({
          email: "",
          password: "",
        });

        navigate("/");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      AxiosToastError(error); // render the toast error
    }
  };

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="">Welcome to Binkeyit</p>

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

          <div className="grid gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password">Password :</label>
              <Link
                to="/forgot-password"
                className="text-blue-700 hover:text-blue-800 hover:underline"
              >
                Forgot password
              </Link>
            </div>
            <div className="relative flex items-center w-full">
              <input
                id="password"
                type={!isVisiblePass ? "password" : "text"}
                name="password"
                value={data.password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="bg-blue-50 p-2 pr-8 outline-none rounded-md w-full border focus-within:border-primary-200"
              />
              {data.password &&
                (isVisiblePass ? (
                  <FaRegEyeSlash
                    onClick={handleVisiblePass}
                    className="absolute right-3 cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={handleVisiblePass}
                    className="absolute right-3 cursor-pointer"
                  />
                ))}
            </div>
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
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don&#39;t have an account ?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
