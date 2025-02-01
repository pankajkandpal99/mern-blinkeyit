import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import { useMobile } from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile] = useMobile();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("q");

  const searchHandler = () => {
    navigate("/search");
  };

  const handleChange = (event) => {
    const value = event.target.value;

    const url = `/search?q=${value}`;
    navigate(url);
  };

  useEffect(() => {
    const isSearchRoute = location.pathname === "/search";
    setIsSearchPage(isSearchRoute);
  }, [location]);

  return (
    <div className="border w-full min-w-[300px] lg:min-w-[420px] h-10 lg:h-12 rounded-md overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 ">
      <div className="">
        {isMobile && isSearchPage ? (
          <Link
            to="/"
            className="flex justify-center items-center h-full m-1 p-2 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button
            onClick={searchHandler}
            className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200"
          >
            <IoSearch size={22} />
          </button>
        )}
      </div>

      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={searchHandler}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait is before replacing "Mice" with "Hamsters"
                'Search "breed"',
                1000,
                'Search "sugar"',
                1000,
                'Search "paneer"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              autoFocus
              defaultValue={searchValue || ""}
              onChange={handleChange}
              placeholder="Search for atta daal and more..."
              className="w-full h-full border-0 outline-none px-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
