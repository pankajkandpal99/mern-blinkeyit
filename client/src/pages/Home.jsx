/* eslint-disable no-unused-vars */
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductShowByCategory from "../components/ProductShowByCategory";
import { generateValidUrl } from "../utils/generateValidUrl";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const categories = useSelector((state) => state.product.allCategory);
  const subCategories = useSelector((state) => state.product.subCategory);

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

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative w-full min-h-44 bg-blue-100 rounded-md overflow-hidden ${
            !banner && "animate-pulse my-2"
          }`}
        >
          <img
            src={banner}
            className="w-full h-full object-cover rounded-md hidden lg:block"
            alt="Banner"
          />

          <img
            src={bannerMobile}
            className="w-full h-full object-cover rounded-md lg:hidden"
            alt="Banner"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
        {loading
          ? new Array(12).fill(null).map((_, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow-md animate-pulse"
                >
                  <div className="bg-blue-100 min-h-24 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categories.length > 0 &&
            categories.map((cat) => {
              return (
                <div
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat)}
                  className="cursor-pointer"
                >
                  <div className="">
                    <img
                      src={cat.image}
                      alt=""
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Display Category product */}
      {categories.length > 0 &&
        categories.map((cat) => (
          <ProductShowByCategory
            key={cat._id + "ShowProductByCategory"}
            categoryId={cat._id}
            categoryName={cat.name}
          />
        ))}
    </section>
  );
};

export default Home;
