import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { summaryApi } from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { AxiosToastError } from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isConfirmVisiblePass, setIsConfirmVisiblePass] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleConfirmVisiblePass = () => {
    setIsConfirmVisiblePass((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = data;
    
    if (!isFormValid) {
      toast.error("Please fill all the fields.");
      return;
    }

    // validate the data
    if (password !== confirmPassword) {
      toast.error("Password and confirm password are not the same.");
      return;
    }

    try {
      const response = await Axios({
        ...summaryApi.register, // Use method and URL from the summary API
        data: { name, email, password },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful!");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      AxiosToastError(error); // render the toast error
    }
  };

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="">Welcome to Binkeyit</p>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              id="name"
              type="text"
              autoFocus
              name="name"
              value={data.name}
              placeholder="Enter your name"
              onChange={handleChange}
              className="bg-blue-50 p-2 pr-8 outline-none rounded-md w-full border focus-within:border-primary-200"
            />
          </div>

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
            <label htmlFor="password">Password :</label>
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

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="relative flex items-center w-full">
              <input
                id="confirmPassword"
                type={!isConfirmVisiblePass ? "password" : "text"}
                name="confirmPassword"
                value={data.confirmPassword}
                placeholder="Enter your confirm password"
                onChange={handleChange}
                className="bg-blue-50 p-2 pr-8 outline-none rounded-md w-full border focus-within:border-primary-200"
              />

              {data.confirmPassword &&
                (isConfirmVisiblePass ? (
                  <FaRegEyeSlash
                    onClick={handleConfirmVisiblePass}
                    className="absolute right-3 cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={handleConfirmVisiblePass}
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
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account ?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
