import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadImage from "../utils/uploadImage";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import ConfirmBox from "../components/ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../store/productSlice";
import { fetchCategories } from "../services/productService";

const Category = () => {
  const dispatch = useDispatch();
  const allCategory = useSelector((state) => state.product.allCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);

  const openModal = (category = null) => {
    setSelectedCategory(category); // pass category data if it's edit
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null); // Reset the selected category when modal closes
  };

  const handleUpdateCategory = (category) => {
    openModal(category); // Open modal for editing
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setConfirmBoxOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory._id) {
      toast.error("Please select a category to delete");
      return;
    }

    setLoading(true);
    try {
      const { data: res } = await Axios({
        ...summaryApi.deleteCategory,
        data: { categoryId: selectedCategory._id },
      });

      if (res.success) {
        fetchCategories(dispatch, setAllCategory); // fetch updated categories
        toast.success("Category deleted successfully.");
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setConfirmBoxOpen(false);
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    if (allCategory.length > 0) {
      setCategories(allCategory);
    }
  }, [allCategory]);

  return (
    <section className="p-4 h-full">
      <div className="bg-gray-100 p-3 rounded-lg shadow-md flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 my-4">Category</h2>

        <button
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-600 rounded-md hover:bg-yellow-50 cursor-pointer transition duration-300"
        >
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded shadow-md overflow-hidden group relative"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-52 object-scale-down"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-3 px-3 py-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/15 to-transparent">
                  <button
                    onClick={() => handleUpdateCategory(cat)}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
      )}

      <ConfirmBox
        isOpen={confirmBoxOpen}
        onClose={() => setConfirmBoxOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the Category "${selectedCategory?.name}"? This action cannot be undone.`}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        category={selectedCategory} // Pass the selected category for editing
      />
    </section>
  );
};

export default Category;

const CategoryModal = ({ isOpen, onClose, category }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    image: "",
  });

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setData((prevData) => ({
      ...prevData,
      image: file,
    }));

    handleImageUpload(file); // call the image upload function
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const response = await uploadImage(file);

      if (response && response?.data.secure_url) {
        setData((prevData) => ({
          ...prevData,
          image: response.data.secure_url,
        }));

        // toast.success("Image uploaded successfully");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      setData((prevData) => ({
        ...prevData,
        image: "",
      }));
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setData(() => ({
      name: "",
      image: "",
    }));

    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, image } = data;

    if (!name || !image) {
      toast.error("All fields are required");
      return;
    }

    if (image instanceof File) {
      await handleImageUpload(image); // Ensure the image is uploaded before submitting the form
    }

    try {
      setLoading(true);
      const requestData = { name, image };

      const { data: res } = category._id
        ? await Axios({
            ...summaryApi.updateCategory,
            data: { ...requestData, categoryId: category._id },
          })
        : await Axios({ ...summaryApi.addCategory, data: requestData });

      if (res.success) {
        setData(() => ({ name: "", image: "" })); // reset form
        fetchCategories(dispatch, setAllCategory);
        onClose();
        toast.success(
          category._id
            ? "Category updated successfully"
            : "Category added successfully"
        );
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error Submitting category:", error.message);
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setData(() => ({ name: "", image: "" }));
      // onClose();
    }
  };

  useEffect(() => {
    if (category) {
      setData({ name: category.name, image: category.image });
    } else {
      setData({ name: "", image: "" }); // Reset if it's an Add action
    }
  }, [category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] lg:w-[600px]">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {category._id ? "Edit Category" : "Add New Category"}
        </h3>

        <form
          className="mb-4 flex flex-col gap-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Category Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              name="name"
              value={data.name}
              onChange={handleCategoryChange}
              placeholder="Enter Category Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-100 focus:border-primary-100 transition duration-300"
            />
          </div>

          {/* Category Image Section */}
          <div className="flex flex-col">
            <label
              htmlFor="categoryImage"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Category Image
            </label>
            <div className="grid gap-4 mb-5">
              {data.image instanceof File ? (
                <img
                  src={URL.createObjectURL(data.image)}
                  alt="Selected Preview"
                  className="w-36 h-36 object-cover rounded"
                />
              ) : typeof data.image === "string" && data.image ? (
                <img
                  src={data.image}
                  alt="Uploaded Preview"
                  className="w-36 h-36 object-cover rounded"
                />
              ) : (
                <div className="border bg-blue-50 h-36 w-full sm:w-36 flex items-center justify-center rounded">
                  <p className="text-neutral-500">No Image</p>
                </div>
              )}

              <label
                htmlFor="uploadCategoryImage"
                className={`flex justify-center items-center cursor-pointer`}
              >
                <div
                  className={`w-full px-4 py-2 text-sm text-center font-medium border ${
                    loading
                      ? "text-yellow-500 cursor-not-allowed"
                      : "text-yellow-500 border-yellow-600 hover:bg-yellow-50 cursor-pointer"
                  } rounded-md transition duration-300`}
                >
                  {loading ? "Uploading..." : "Upload Image"}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  id="uploadCategoryImage"
                  onChange={handleImageSelect}
                  className={`hidden`}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              disabled={loading}
              onClick={handleCloseModal}
              className={`${
                loading
                  ? "cursor-not-allowed"
                  : "px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md"
              }`}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className={`${
                loading
                  ? "text-yellow-500 cursor-not-allowed"
                  : "px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-600 hover:bg-yellow-50 rounded-md cursor-pointer transition duration-300"
              }`}
            >
              {loading
                ? "Processing..."
                : category._id
                ? "Update Category"
                : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
