import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { generateValidUrl } from "../utils/generateValidUrl";

const ProductShowByCategory = ({ categoryId, categoryName }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const subCategories = useSelector((state) => state.product.subCategory);

  const fetchPrductByCategory = async () => {
    setLoading(true);
    try {
      const { data: response } = await Axios({
        ...summaryApi.fetchProductByCategory,
        url: `${summaryApi.fetchProductByCategory.url}/${categoryId}`,
        // params: { limit: 15 }, // Add query parameters
      });

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error(`Error occured while fetch product by Category : ${error}`);
      // AxiosToastError(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (dir) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Amount to scroll per click

      if (dir === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth", // Enables smooth scrolling
        });
      } else if (dir === "right") {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleCategoryClick = (category) => {
    const subCategory = subCategories?.find((subCat) =>
      subCat?.category.some((cat) => cat._id === category._id)
    );

    if (!subCategory) {
      toast.error("Subcategory not found for the selected category");
      return;
    }

    // Generate Url -> /category_name-categoryId/subCategory_name-subCategoryId
    const url = generateValidUrl(category, subCategory);
    navigate(url);
  };

  useEffect(() => {
    if (categoryId) {
      fetchPrductByCategory();
    }
  }, [categoryId]);

  return (
    <div className="">
      <div className="container mx-auto px-4 lg:p-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{categoryName}</h3>
        <button
          onClick={() =>
            handleCategoryClick({ _id: categoryId, name: categoryName })
          }
          className="text-green-600 hover:text-green-400"
        >
          See All
        </button>
      </div>

      <div className="relative flex items-center container mx-auto p-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute hidden lg:block left-0 lg:ml-4 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 p-1 md:p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
        >
          <AiOutlineLeft size={24} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 md:gap-6 lg:gap-8 lg:overflow-hidden overflow-x-auto scrollbar-none w-full"
        >
          {loading
            ? new Array(6)
                .fill(null)
                .map((_, index) => (
                  <CardLoading key={"ShowProductByCategory" + index} />
                ))
            : data.length > 0 &&
              data.map((product, idx) => (
                <CardProduct
                  key={product._id + "ShowProductByCategory" + idx}
                  data={product}
                />
              ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute hidden lg:block right-0 lg:mr-5 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 p-2 md:p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
        >
          <AiOutlineRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductShowByCategory;
