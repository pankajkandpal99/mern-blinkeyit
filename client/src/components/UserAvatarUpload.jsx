import { useState } from "react";
import Axios from "../utils/Axios.js";
import { summaryApi } from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../store/userSlice";

const UserAvatarUpload = ({ user, close }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleUploadAvatar = async () => {
    if (selectedFile) {
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const { data: res } = await Axios({
          ...summaryApi.uploadAvatar,
          data: formData,
        });

        toast.success("Profile picture successfully updated");
        dispatch(updateAvatar(res.data));

        close();
      } catch (error) {
        console.error("Error occured while upload image : ", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select a file first.");
    }
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Change Avatar
        </h1>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-md bg-gray-200">
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Avatar"
                className="w-full h-full object-cover"
              />
            ) : user.avatar ? (
              <img
                src={user.avatar}
                alt="Current Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                No Avatar
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input file-input-bordered file-input-md w-full max-w-xs cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={close}
            className="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleUploadAvatar}
            // disabled={!selectedFile || isLoading}
            className={`px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedFile && !isLoading
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Loading..." : "Upload"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserAvatarUpload;
