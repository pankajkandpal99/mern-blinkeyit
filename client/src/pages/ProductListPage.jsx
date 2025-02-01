/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import Loader from "../components/Loader";
import CardProduct from "../components/CardProduct";
import NoData from "../components/NoData";
import { useSelector } from "react-redux";
import { generateValidUrl } from "../utils/generateValidUrl";

const ProductListPage = () => {
  const params = useParams();
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [limit, setLimit] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [loading, setLoading] = useState(false);

  const subCategories = useSelector((state) => state.product.subCategory);
  const { category, subCategory } = params;
  // const [currentSubCategory, setCurrentSubCategory] = useState(null); // Track the selected subcategory for smaller devices

  const extractIdFromUrl = (param) => {
    if (!param) return null;
    const parts = param.split("-");
    return parts[parts.length - 1];
  };

  const extractNameFromUrl = (param) => {
    if (!param) return null;
    const parts = param.split("-");
    const namePart = parts[0];
    return namePart.replace(/_/g, " ").trim();
  };

  const filteredSubCategories = subCategories.filter((subCat) =>
    subCat.category.find((cat) => cat._id === extractIdFromUrl(category))
  );

  const fetchProductData = async () => {
    const categoryId = extractIdFromUrl(category);
    const subCategoryId = extractIdFromUrl(subCategory);

    if (!categoryId || !subCategoryId) {
      toast.error("Invalid category or subcategory in the URL");
      return;
    }

    setLoading(true);
    try {
      const { data: response } = await Axios({
        ...summaryApi.fetchProductByCatAndSubCat,
        params: {
          categoryId,
          subCategoryId,
          page: currentPage,
          limit,
          sort: "createdAt",
          order: "desc",
        },
      });

      if (!response?.data?.products || !response?.data?.pagination) {
        throw new Error("Invalid response structure");
      }

      const { products, pagination } = response.data;
      setProductData(products || []);
      setTotalPages(pagination.totalPages || 0);
    } catch (error) {
      console.error(
        "Error occurred while fetching product by category and subCategory:",
        error
      );
      if (error.status === 404) {
        setProductData([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [currentPage, limit, params]);

  return (
    <section className="sticky top-24 lg:top-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Subcategory Sidebar */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll scrollbarCustom shadow-md bg-white py-2">
          {filteredSubCategories.length > 0 &&
            filteredSubCategories.map((subCat) => {
              const url = generateValidUrl(subCat?.category[0], subCat);
              return (
                <Link
                  to={`${url}`}
                  key={subCat._id}
                  className={`w-full p-2 flex flex-col items-center lg:flex-row lg:items-center lg:h-16 gap-2 border-b 
                  hover:bg-green-100 cursor-pointer ${
                    subCat._id === extractIdFromUrl(subCategory)
                      ? "bg-green-100"
                      : ""
                  }`}
                >
                  {/* Subcategory Image */}
                  <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-white">
                    <img
                      src={subCat.image}
                      alt="subcategory"
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                  {/* Subcategory Name */}
                  <p className="text-center lg:text-left text-xs lg:text-base mt-1 lg:mt-0">
                    {subCat.name}
                  </p>
                </Link>
              );
            })}
        </div>

        {/* Product Section */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
              <Loader />
            </div>
          )}
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{extractNameFromUrl(subCategory)}</h3>
          </div>
          <div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto scrollbarCustom relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-4 xl:grid-cols-5 gap-4">
                {productData.length > 0 &&
                  productData.map((p, index) => (
                    <CardProduct
                      data={p}
                      key={p._id + "productSubCategory" + index}
                      className="w-full"
                    />
                  ))}
              </div>

              {productData.length === 0 && <NoData />}
            </div>

            {loading && <Loader />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
