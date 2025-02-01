import { useDispatch, useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import UserAvatarUpload from "../components/UserAvatarUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [openProfileChange, setProfileChange] = useState(false);
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const handleUserDataChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct updateData only when submitting
    const updateData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          typeof value === "string" &&
          value.trim() &&
          value.trim() !== user[key]
      )
    );

    // If no changes detected, show error
    if (Object.keys(updateData).length === 0) {
      toast.error("No changes detected");
      return;
    }

    // Validate mobile number
    if (updateData.mobile && !/^\d{10}$/.test(updateData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      // console.log("Submitting updated data:", updateData);
      const { data: res } = await Axios({
        ...summaryApi.updateUser,
        data: data,
      });

      if (res && res.data) {
        dispatch(setUserDetails(res.data));
        toast.success("Successfully updated your profile");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error occured while user update his profile ", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-gray-200 to-gray-400">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaRegCircleUser size={80} className="text-gray-600" />
        )}
      </div>
      <button
        onClick={() => setProfileChange(true)}
        className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Change Profile
      </button>

      {openProfileChange && (
        <UserAvatarUpload user={user} close={() => setProfileChange(false)} />
      )}

      {/* user can update update his details */}
      <form
        className="w-full space-y-6 mt-8"
        onSubmit={handleSubmit}
        noValidate
      >
        {[
          {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter your name",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Enter your email",
          },
          {
            label: "Mobile",
            name: "mobile",
            type: "number",
            placeholder: "Enter your mobile number",
          },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className="grid gap-2">
            <label htmlFor={name} className="text-gray-700 font-medium">
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={data[name]}
              onChange={handleUserDataChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-600"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          // className="w-full text-blue-500 font-semibold py-3 rounded-md border border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          className={`w-full py-3 rounded-md font-semibold text-blue-600 ${
            loading
              ? "bg-gray-400"
              : "text-yellow-500 border border-yellow-600 hover:bg-yellow-50 focus:ring-1 focus:ring-yellow-600"
          } transition duration-200 disabled:cursor-not-allowed`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
