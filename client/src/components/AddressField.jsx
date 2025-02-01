import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  addAddressService,
  fetchAddress,
  updateAddressService,
} from "../services/addressService";

const AddressField = ({ open, onClose, initialData, mode = "add" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async (data) => {
    const { address_line, state, city, pincode, mobile, country } = data;
    const addressData = {
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
    };

    setLoading(true);
    try {
      if (mode === "add") {
        try {
          const response = await addAddressService(addressData);
          if (response.success) {
            fetchAddress(dispatch);
            toast.success("Successfully created your address.");
            onClose();
          } else {
            throw new Error(`Error occured in creating address`);
          }
        } catch (error) {
          throw new Error(
            `Error in adding address success response : ${error}`
          );
        }
      }

      if (mode === "edit") {
        try {
          await updateAddressService(dispatch, initialData?._id, addressData);
          toast.success("Successfully updated your address.");
          onClose();
        } catch (error) {
          throw new Error(`Error in update success response : ${error}`);
        }
      }
    } catch (error) {
      console.error(
        `Error occurred while ${
          mode === "add" ? "adding" : "updating"
        } address : ${error}`
      );
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    // Disable scrolling on body when the modal is open
    document.body.style.overflow = "hidden";

    // Cleanup to enable scrolling again when the modal is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!open) return null;

  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-lg mx-4 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto scrollbarCustom relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {mode === "add" ? "Add Address" : "Edit Address"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="address_line"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line :
            </label>
            <input
              type="text"
              id="address_line"
              name="address_line"
              placeholder="Enter your address"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.addressline ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("address_line", {
                required: "Address line is required",
              })}
            />
            {errors.address_line && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address_line.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City :
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter your city"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("city", {
                required: "City is required",
              })}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State :
            </label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="Enter your state"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("state", {
                required: "State is required",
              })}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700"
            >
              Pincode :
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              placeholder="Enter your pincode"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("pincode", {
                required: "Pincode is required",
              })}
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.pincode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country :
            </label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter your country"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.country ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("country", {
                required: "Country is required",
              })}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile No. :
            </label>
            <input
              type="number"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 focus:border-primary-200`}
              {...register("mobile", {
                required: "Mobile is required",
              })}
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">
                {errors.mobile.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`bg-primary-200 text-white w-full py-2 font-semibold hover:bg-primary-100 rounded focus:outline-none focus:ring-0 focus:ring-primary-200 focus:ring-offset-0 ${
              loading && "cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddressField;
