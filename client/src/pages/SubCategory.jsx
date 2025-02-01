import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import ConfirmBox from "../components/ConfirmBox";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import uploadImage from "../utils/uploadImage";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "../services/productService";
import { setAllSubCategory } from "../store/productSlice";
import DataTable from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";

const SubCategory = () => {
  const dispatch = useDispatch();
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.subCategory);
  const columnHelper = createColumnHelper();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const openModal = (subCategory = null) => {
    setSelectedSubCategory(subCategory); // pass subCategory data if it's edit
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubCategory(null); // Reset the selected subCategory when modal closes
  };

  const handleUpdateSubCategory = (subCategory) => {
    openModal(subCategory); // Open modal for editing
  };

  const handleDeleteSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setConfirmBoxOpen(true);
  };

  const confirmDeleteSubCategory = async () => {
    if (!selectedSubCategory._id) {
      toast.error("Please select a category to delete");
      return;
    }

    setLoading(true);
    try {
      const { data: res } = await Axios({
        ...summaryApi.deleteSubCategory,
        data: { subCategoryId: selectedSubCategory._id },
      });

      if (res.success) {
        toast.success("Category deleted successfully.");

        fetchSubCategories(dispatch, setAllSubCategory);
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
      setConfirmBoxOpen(false);
      setSelectedSubCategory(null);
    }
  };

  const closeImageModal = () => {
    setImgUrl(""); // Close the ViewImage modal
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),

    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={row?.original.image}
              alt={row.original.name}
              className="w-10 h-10 cursor-pointer"
              onClick={() => setImgUrl(row.original.image)}
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((cat) => (
              <p key={cat._id + "table"} className="px-1 inline-block">
                {cat.name}
              </p>
            ))}
          </>
        );
      },
    }),

    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-between lg:justify-center gap-3">
            <button
              onClick={() => handleUpdateSubCategory(row.original)}
              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition duration-300"
              title="Edit"
            >
              <HiPencil size={18} />
            </button>

            <button
              onClick={() => handleDeleteSubCategory(row.original)}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition duration-300"
              title="Delete"
            >
              <MdDelete size={18} />
            </button>
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    setSubCategories(allSubCategory);
  }, [allSubCategory]);

  return (
    <section className="h-full">
      <div className="bg-gray-100 p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold text-gray-800 my-4">
          Sub Category
        </h2>

        <button
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-600 rounded-md hover:bg-yellow-50 cursor-pointer transition duration-300"
        >
          Add SubCategory
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subCategories.length > 0 ? (
        <div className="">
          <DataTable data={subCategories} column={column} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <NoData message="No subcategories available. Please add a subcategory to get started." />
        </div>
      )}

      {/* View Image Modal */}
      {imgUrl && <ViewImage imageUrl={imgUrl} onClose={closeImageModal} />}

      <ConfirmBox
        isOpen={confirmBoxOpen}
        onClose={() => setConfirmBoxOpen(false)}
        onConfirm={confirmDeleteSubCategory}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the subCategory "${selectedSubCategory?.name}"? This action cannot be undone.`}
      />

      <SubCategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        subCategory={selectedSubCategory} // Pass the selected subCategory for editing
        allCategory={allCategory} // Pass all categories for selection
      />
    </section>
  );
};

export default SubCategory;

const SubCategoryModal = ({ isOpen, onClose, allCategory, subCategory }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const handleSubCategoryChange = (event) => {
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

      if (response && response?.data?.secure_url) {
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
        category: [],
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
      category: [],
    }));

    onClose();
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;

    // check if the category is already selected...
    const alreadySelected = data.category.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (alreadySelected) {
      toast.error("Category already selected");
      return;
    }

    // Find the selected category details from allCategory
    const selectedCategory = allCategory.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (selectedCategory) {
      setData((prevData) => ({
        ...prevData,
        category: [...prevData.category, selectedCategory], // Add the new category
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, image, category } = data;

    if (!name || !image || category.length === 0) {
      toast.error("All fields are required");
      return;
    }

    if (image instanceof File) {
      await handleImageUpload(image); // Ensure the image is uploaded before submitting the form
    }

    try {
      setLoading(true);
      const requestData = { name, image, category };

      const { data: res } = subCategory._id
        ? await Axios({
            ...summaryApi.updateSubCategory,
            data: { ...requestData, subCategoryId: subCategory._id },
          })
        : await Axios({ ...summaryApi.addSubCategory, data: requestData });

      if (res.success) {
        setData(() => ({ name: "", image: "", category: [] })); // reset form
        fetchSubCategories(dispatch, setAllSubCategory); // go to the top and imported there.
        onClose();
        toast.success(
          subCategory._id
            ? "SubCategory updated successfully"
            : "SubCategory added successfully"
        );
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error Submitting category:", error.message);

      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setData(() => ({ name: "", image: "", category: [] })); // Reset form
      // onClose();
    }
  };

  useEffect(() => {
    if (subCategory && subCategory?.category?.length > 0) {
      const matchedCategories = subCategory?.category?.map((subCat) =>
        allCategory.find((cat) => cat.name === subCat.name)
      );
      setData({
        name: subCategory.name,
        image: subCategory.image,
        category: matchedCategories,
      });
    } else {
      setData({
        name: "",
        image: "",
        category: [],
      });
    }
  }, [subCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-lg w-[90%] lg:w-[600px]">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {subCategory._id ? "Edit SubCategory" : "Add New SubCategory"}
        </h3>

        <form
          className="mb-4 flex flex-col gap-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* SubCategory Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="subCategoryName"
              className="text-sm font-medium text-gray-700"
            >
              SubCategory Name
            </label>
            <input
              id="subCategoryName"
              type="text"
              name="name"
              value={data.name}
              onChange={handleSubCategoryChange}
              placeholder="Enter SubCategory Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-100 focus:border-primary-100 transition duration-300"
            />
          </div>

          {/* SubCategory Image Section */}
          <div className="flex flex-col">
            <label
              htmlFor="subCategoryImage"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              SubCategory Image
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
                htmlFor="uploadSubCategoryImage"
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
                  id="uploadSubCategoryImage"
                  onChange={handleImageSelect}
                  className={`hidden`}
                />
              </label>
            </div>
          </div>

          {/* Category list will appear here */}
          <div className="grid gap-1">
            {/* <label>Select Category</label> */}

            {data.category.length > 0 && (
              <div className="max-h-28 border focus-within:border-primary-200 rounded-lg mb-2 overflow-y-auto">
                {/* display value */}
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-primary-100 focus-within:border-primary-200 rounded-lg shadow-sm overflow-visible">
                  {data?.category.map((cat) => (
                    <span
                      key={cat._id + "selectValue"}
                      className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-700 bg-blue-100 rounded-full shadow-sm"
                    >
                      {cat.name}
                      <button
                        type="button"
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setData((prevData) => ({
                            ...prevData,
                            category: prevData.category.filter(
                              (c) => c._id !== cat._id
                            ),
                          }));
                        }}
                      >
                        &#10005; {/* Cross icon */}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <select
              onChange={handleCategoryChange}
              placeholder="Select Category"
              defaultValue={""}
              className="border border-primary-200 w-full p-2 bg-transparent outline-none cursor-pointer rounded-md"
            >
              <option value={""} disabled>
                Select Category
              </option>
              {allCategory.length > 0 &&
                allCategory?.map((category) => (
                  <option
                    key={category._id + "subCategory"}
                    value={category?._id}
                    className=""
                  >
                    {category?.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-between gap-3 mt-2">
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
                : subCategory._id
                ? "Update SubCategory"
                : "Add SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
