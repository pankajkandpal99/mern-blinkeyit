/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/uploadImage";
import Loader from "../components/Loader";
import { MdDelete } from "react-icons/md";
import ViewImage from "../components/ViewImage";
import { useSelector } from "react-redux";
import AddMoreField from "../components/AddMoreField";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import { useSearchParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
// import { successAlert } from "../utils/Successalert";

const UploadProduct = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("edit"); // GET from url "/dashboard/upload-product?edit=${product._id}"
  const [product, setProduct] = useState({});

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: product.name || "",
    description: product.description || "",
    image: product.image || [],
    category: product.category || [],
    subCategory: product.subCategory || [],
    unit: product.unit || "",
    stock: product.stock || "",
    price: product.price || "",
    discount: product.discount || "",
    more_details: product.more_details || {},
    // publish: true,  // this is not required
  });

  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.subCategory);

  const [selectedImgUrl, setSelectedImgUrl] = useState("");
  const [isViewImageModalOpen, setIsViewImageModalOpen] = useState(false);
  const [subCategoryWithSelectedCategory, setSubCategoryWithSelectedCategory] =
    useState([]);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 5MB

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size exceeds 10MB limit.`);
      return;
    }

    handleImageUpload(file); // call the image upload function
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const response = await uploadImage(file);

      if (response && response?.data?.secure_url) {
        setData((prevData) => ({
          ...prevData,
          image: [...prevData.image, response.data.secure_url],
        }));

        // toast.success("Image uploaded successfully");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewImageURL = (imgUrl) => {
    setSelectedImgUrl(imgUrl);
    setIsViewImageModalOpen(true);
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

      // Filter subcategories based on selected category
      const filteredSubCategories = allSubCategory.filter((subCat) =>
        subCat.category.find((cat) => cat._id === selectedCategoryId)
      );

      // console.log("filtered subcategories : ", filteredSubCategories);

      setSubCategoryWithSelectedCategory(filteredSubCategories);
    }
  };

  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryId = event.target.value;

    // check if the sub-category is already selected...
    const alreadySelected = data.subCategory.find(
      (subCat) => subCat._id === selectedSubCategoryId
    );

    if (alreadySelected) {
      toast.error("SubCategory already selected");
      return;
    }

    // Find the selected sub-category details from allSubCategory
    const selectedSubCategory = allSubCategory.find(
      (subCat) => subCat._id === selectedSubCategoryId
    );

    if (selectedSubCategory) {
      setData((prevData) => ({
        ...prevData,
        subCategory: [...prevData.subCategory, selectedSubCategory],
      }));
    }
  };

  const addMoreFieldSubmitHandler = () => {
    setData((prevData) => ({
      ...prevData,
      more_details: {
        ...prevData.more_details,
        [fieldName]: "",
      },
    }));

    setFieldName("");
    setOpenAddField(false);
  };

  // Delete Added more field
  const handleDeleteAddedField = (fieldKey) => {
    setData((prevData) => ({
      ...prevData,
      more_details: Object.fromEntries(
        Object.entries(prevData.more_details).filter(
          ([key]) => key !== fieldKey
        )
      ),
    }));
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    // Check if any required field (excluding more_details) is empty
    const requiredFields = [
      "name",
      "description",
      "image",
      "category",
      "unit",
      "stock",
      "price",
      "discount",
    ];

    const isEmpty = (value) => {
      value === undefined || value === null || value === "";
    };

    const emptyFields = requiredFields.filter((field) => {
      if (Array.isArray(data[field])) {
        return data[field].length === 0;
      }

      return isEmpty(data[field]); // check other fields
    });

    if (emptyFields.length > 0) {
      toast.error("All fields are required.");
      return;
    }

    // Check if more_details has any keys with empty or unavailable values
    const invalidMoreDetails = Object.entries(data.more_details).some(
      ([, value]) => !value || value.trim() === ""
    );

    if (invalidMoreDetails) {
      toast.error("All additional fields must have valid values.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (productId) {
        // If productId exists, update the product
        response = await Axios({
          ...summaryApi.updateProduct,
          url: `${summaryApi.updateProduct.url}/${productId}`, // Append productId to the URL
          data: data,
        });
      } else {
        // If productId doesn't exist, create a new product
        response = await Axios({
          ...summaryApi.createProduct,
          data: data,
        });
      }

      const { data: res } = response;

      if (res.success) {
        const message = productId
          ? "Product updated successfully"
          : "Product created successfully";

        toast.success(message);
        // successAlert("Upload successfully");
        setData({
          name: "",
          description: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          more_details: {},
        });
      }
    } catch (error) {
      console.error(
        `Error occured while Submitting UploadProduct form : ${error.message}`
      );
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductByDetails = async () => {
    setLoading(true);
    try {
      const fetchedProdcut = await fetchProductById(productId);
      setProduct(fetchedProdcut);
    } catch (error) {
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadProductByDetails();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setData({
        ...product,
        image: product.image || [],
        category: product.category || [],
        subCategory: product.subCategory || [],
        more_details: product.more_details || {},
      });
    }
  }, [product]);

  return (
    <section className="h-full w-full p-4">
      {/* Header */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Upload Product
        </h2>
      </div>

      {/* Form */}
      <div className="bg-white p-2 rounded-lg">
        <form className="grid gap-6" onSubmit={handleSubmitForm}>
          {/* Name Field */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your product name"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-gray-700 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={data.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300 resize-none"
            />
          </div>

          {/* Image Field */}
          <div className="grid gap-2">
            <p className="text-gray-700 font-medium">Product Image</p>

            <div className="">
              <label
                htmlFor="productImage"
                className={`bg-blue-100 h-24 border rounded flex justify-center items-center ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="text-center flex flex-col justify-center items-center">
                  {!loading && (
                    <FaCloudUploadAlt size={35} className="text-center" />
                  )}
                  <p className="text-center">
                    {loading ? <Loader /> : "Upload Image"}
                  </p>
                </div>

                <input
                  id="productImage"
                  disabled={loading}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              {/* display uploaded images */}
              <div className="flex flex-wrap gap-4 mt-4">
                {data?.image?.length > 0 &&
                  data?.image?.map((img, idx) => (
                    <div
                      key={img + idx}
                      className="h-24 mt-1 w-24 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt={`productImage+${idx + 1}`}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => handleViewImageURL(img)}
                      />
                      <div
                        onClick={() => {
                          setData((prevData) => ({
                            ...prevData,
                            image: prevData.image.filter(
                              (_, index) => index !== idx
                            ),
                          }));

                          toast.success("Image Removed");
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-white rounded text-white hover:text-red-600 hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Category Field */}
          <div className="grid gap-1">
            <label htmlFor="category" className="text-gray-700 font-medium">
              Category
            </label>

            {data.category.length > 0 && (
              <div className="max-h-28 rounded-lg mb-2 overflow-y-auto">
                {/* display value */}
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 focus-within:border-primary-200 rounded-lg shadow-sm overflow-visible">
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

            <div className="">
              <select
                id="category"
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
          </div>

          {/* SubCategory Field */}
          <div className="grid gap-1">
            <label htmlFor="sub-category" className="text-gray-700 font-medium">
              SubCategory
            </label>

            {data.subCategory.length > 0 && (
              <div className="max-h-28 rounded-lg mb-2 overflow-y-auto">
                {/* display value */}
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 focus-within:border-primary-200 rounded-lg shadow-sm overflow-visible">
                  {data?.subCategory.map((cat) => (
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
                            subCategory: prevData.subCategory.filter(
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

            <div className="">
              <select
                id="sub-category"
                onChange={handleSubCategoryChange}
                placeholder="Select SubCategory"
                defaultValue={""}
                className="border border-primary-200 w-full p-2 bg-transparent outline-none cursor-pointer rounded-md"
              >
                <option value={""} disabled>
                  Select SubCategory
                </option>
                {subCategoryWithSelectedCategory.length > 0 &&
                  subCategoryWithSelectedCategory?.map((category) => (
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
          </div>

          {/* Unit */}
          <div className="grid gap-2">
            <label htmlFor="unit" className="text-gray-700 font-medium">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              name="unit"
              required
              value={data.unit}
              onChange={handleChange}
              placeholder="Enter your product unit"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
            />
          </div>

          {/* Stock and Price */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Stock */}
            <div className="grid gap-2">
              <label htmlFor="stock" className="text-gray-700 font-medium">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={data.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
              />
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <label htmlFor="price" className="text-gray-700 font-medium">
                Price
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                placeholder="Enter product price"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="grid gap-2">
            <label htmlFor="discount" className="text-gray-700 font-medium">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
            />
          </div>

          {/* Add more field */}
          {Object.keys(data.more_details).map((key, index) => (
            <div key={index} className="grid gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor={key} className="text-gray-700 font-medium mb-0">
                  {key}
                </label>

                <button
                  onClick={() => handleDeleteAddedField(key)}
                  className="text-primary-100 hover:text-primary-200 font-medium"
                >
                  Delete
                </button>
              </div>

              <input
                id={key}
                type="text"
                name={key}
                value={data?.more_details[key]}
                onChange={(event) => {
                  const { value } = event.target;
                  setData((prevData) => ({
                    ...prevData,
                    more_details: {
                      ...prevData.more_details,
                      [key]: value,
                    },
                  }));
                }}
                placeholder={`Enter ${key}`}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-yellow-300 focus:ring-yellow-300"
              />
            </div>
          ))}

          {!openAddField && (
            <div
              onClick={() => setOpenAddField(true)}
              className="inline-block hover:bg-primary-200 hover:text-white text-gray-700 bg-white py-1 px-3 w-32 text-center font-medium border border-primary-200 cursor-pointer rounded"
            >
              Add Field
            </div>
          )}

          {/* Add Field modal */}
          {openAddField && (
            <AddMoreField
              close={() => setOpenAddField(false)}
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={addMoreFieldSubmitHandler}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            {productId ? "Update " : "Create "}Product
          </button>
        </form>
      </div>

      {isViewImageModalOpen && (
        <ViewImage
          imageUrl={selectedImgUrl}
          onClose={() => {
            setSelectedImgUrl("");
            setIsViewImageModalOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default UploadProduct;
