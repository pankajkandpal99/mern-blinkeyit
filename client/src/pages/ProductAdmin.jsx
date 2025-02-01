/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { IoSearch } from "react-icons/io5";
import NoData from "../components/NoData";
import { debounce } from "lodash";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered products for search
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [limit, setLimit] = useState(20); // Items per page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryCache, setQueryCache] = useState({}); // Cache for Search queries

  const fetchProductData = useCallback(
    async (search = "") => {
      // Cache key includes search query and page
      const cacheKey = `${search}_${currentPage}`;
      const cachedData = queryCache[cacheKey];
      const currTime = Date.now();

      // Check if cache exists and hasn't expired
      if (cachedData && currTime - cachedData.timestamp < CACHE_EXPIRY_TIME) {
        setFilteredData(cachedData.data.products);
        setTotalPages(cachedData.data.pagination.totalPages); // Use cached totalPages
        return;
      }

      setLoading(true);
      try {
        const { data: response } = await Axios({
          ...summaryApi.fetchProduct,
          params: {
            page: currentPage,
            limit: limit,
            search: search,
          },
        });

        // Validate response structure
        if (
          !response ||
          !response.data ||
          !response.data.products ||
          !response.data.pagination
        ) {
          throw new Error("Invalid response structure or missing data.");
        }

        const { products, pagination } = response.data;

        if (search) {
          // Update cache with data and timestamp
          setQueryCache((prev) => ({
            ...prev,
            [cacheKey]: { data: { products, pagination }, timestamp: currTime },
          }));

          setFilteredData(products);
          setTotalPages(pagination.totalPages); // Pagination based on search query results
        } else {
          setProductData(products);
          setTotalPages(pagination.totalPages); // Pagination based on all products
        }
      } catch (error) {
        console.error(`Error occured while fetching products data : ${error}`);
        AxiosToastError(error);
        setProductData([]);
        setFilteredData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, queryCache]
  );

  // Debounced version of the fetch function
  const debouncedFetchProductData = useCallback(
    debounce((query) => fetchProductData(query), 500),
    [fetchProductData]
  );

  const deleteProduct = async (productId) => {
    if (!productId) {
      toast.error("Please select a product to delete");
      return;
    }

    setLoading(true);
    try {
      const { data: res } = await Axios({
        ...summaryApi.deleteProduct,
        url: `${summaryApi.deleteProduct.url}/${productId}`,
      });

      if (res.success) {
        fetchProductData(searchQuery);
        toast.success("Category deleted successfully.");
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchProductData(searchQuery); // Fetch data based on search query
    } else {
      fetchProductData(); // Fetch all products if search query is empty
    }

    // cleanup on unmount
    return () => debouncedFetchProductData.cancel();
  }, [searchQuery, currentPage, debouncedFetchProductData]);

  useEffect(() => {
    if (!searchQuery && productData.length > 0) {
      setFilteredData(productData.slice(0, limit)); // Show first 'limit' products by default
    }
  }, [searchQuery, productData, limit]);

  return (
    <section className="h-full w-full p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Products
          </h2>

          <div className="relative w-[70%] md:w-full max-w-xs">
            <IoSearch className="absolute text-gray-500 top-3 left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search a product ..."
              className="block w-full pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-primary-300 focus:outline-none focus:border-primary-200 transition duration-300 hover:shadow-lg"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : productData.length > 0 && filteredData.length > 0 ? (
        <div className="p-4 bg-blue-50 w-full rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.length > 0 &&
              filteredData.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={deleteProduct}
                />
              ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

          {/* TODO : ADD INFINITE SCROLLING (OPTIONAL) */}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full py-10">
          {/* <p className="text-gray-500 text-lg">No products found.</p> */}
          <NoData />
        </div>
      )}
    </section>
  );
};

export default ProductAdmin;
