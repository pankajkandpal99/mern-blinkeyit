/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import CardLoading from "../components/CardLoading";
import Axios from "../utils/Axios";
import { summaryApi } from "../common/SummaryApi";
import { AxiosToastError } from "../utils/AxiosToastError";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import NoDataImage from "../assets/nothing here yet.webp";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("q");

  const [search, setSearch] = useState(searchValue || "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(null);

  const cache = useRef({}); // Cache to store results for previous queries
  const debounceTimeout = useRef(null); // Timeout reference for debouncing

  const fetchProducts = useCallback(async (query, page) => {
    const cacheKey = `${query}-${page}`; // Unique cache key for each query-page combination

    // Check if the data is already cached
    if (cache.current[cacheKey]) {
      const cachedData = cache.current[cacheKey];
      setData((prevData) =>
        page === 1 ? cachedData.products : [...prevData, ...cachedData.products]
      );
      setTotalPages(cachedData.pagination.totalPages);
      return;
    }

    setLoading(true);
    try {
      const { data: response } = await Axios({
        ...summaryApi.fetchProductBySearch,
        params: {
          search: query,
          page: page,
          limit,
          sort: "createdAt",
          order: "desc",
        },
      });

      if (response.success) {
        const { products, pagination } = response.data;

        // Update cache with both products and pagination
        cache.current[cacheKey] = { products, pagination };

        setData((prevData) =>
          page === 1 ? products : [...prevData, ...products]
        );
        setTotalPages(pagination.totalPages);
      } else {
        throw new Error(response.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(`Error occured while search products : ${error}`);
      if (error.status === 404) {
        toast.error("No Products found");
        // // Remove query if no products are found
        navigate({
          pathname: window.location.pathname,
          search: "", // Clear the query parameter
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchMore = () => {
    if (currentPage < totalPages && !loading) {
      setLoading(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Debounced Search Handler
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(searchValue, 1); // Fetch products based on searchValue (debounced)
    }, 500); // Debounce delay in ms

    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, [searchValue, fetchProducts]); // Trigger when searchValue changes

  useEffect(() => {
    fetchProducts(search, currentPage);
  }, [search, currentPage, fetchProducts]);

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4 sm:px-6 lg:px-8">
        <p className="font-semibold mb-2">Search Results : {data.length}</p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={currentPage < totalPages && !loading} // Check if there are more pages and not loading
          next={handleFetchMore}
          loader={
            loading && (
              <div className="flex justify-center py-4">
                <div className="loader">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-primary-200"></div>
                </div>
              </div>
            )
          }
          endMessage={
            !loading && (
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                No more products available
              </p>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {loading &&
              currentPage === 1 &&
              new Array(12)
                .fill(null)
                .map((_, idx) => (
                  <CardLoading key={"loadingSearchPAge" + idx} className="" />
                ))}

            {data.length > 0 &&
              data.map((prod, index) => (
                <CardProduct
                  key={prod._id + "searchProduct" + index}
                  data={prod}
                />
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default SearchPage;
