/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";
import Divider from "../components/Divider";
import minuteDeliveryImage from "../assets/minute_delivery.png";
import bestPriceOffer from "../assets/Best_Prices_Offers.png";
import wideAssortment from "../assets/Wide_Assortment.png";
import { fetchProductById } from "../services/productService";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDetailsPage = () => {
  const params = useParams();
  const [product, setProduct] = useState({ name: "", image: [] });
  const [loading, setLoading] = useState(false);
  const [imgStateIndex, setImgStateIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const thumbnailRef = useRef(null);

  const { productId } = params;

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

  const handleScroll = (dir) => {
    if (thumbnailRef.current) {
      const scrollAmount = 150; // Amount to scroll per click

      if (dir === "left") {
        thumbnailRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth", // Enables smooth scrolling
        });
      } else if (dir === "right") {
        thumbnailRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const checkScrollable = () => {
    if (thumbnailRef.current) {
      setIsScrollable(
        thumbnailRef.current.scrollWidth > thumbnailRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    loadProductByDetails();
  }, [productId]);

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, [product.image]);

  return (
    <section className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded overflow-hidden flex justify-center items-center h-64 sm:h-80 lg:min-h-[65vh] lg:max-h-[650h] mb-6">
            <img
              src={product.image[imgStateIndex]}
              alt="product"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image Indicator Dots */}
          <div className="flex justify-center items-center gap-3 my-4">
            {product.image.length > 0 &&
              product.image.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full cursor-pointer transition ${
                    imgStateIndex === index ? "bg-primary-200" : "bg-gray-300"
                  }`}
                  onClick={() => setImgStateIndex(index)}
                ></div>
              ))}
          </div>

          {/* Thumbnail Images */}
          <div className="grid relative">
            {isScrollable && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 hidden lg:block lg:ml-4 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 p-1 md:p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
              >
                <AiOutlineLeft size={24} />
              </button>
            )}

            <div
              ref={thumbnailRef}
              className="flex gap-4 z-8 relative w-full overflow-x-auto scrollbar-none py-2 px-2 rounded-md"
            >
              {product.image.map((img, index) => {
                return (
                  <div
                    className={`w-16 h-16 rounded-md shadow-md border-2 flex-shrink-0 cursor-pointer transition-transform transform hover:scale-105 ${
                      imgStateIndex === index
                        ? "border-primary-200 bg-gray-200"
                        : "border-gray-300"
                    }`}
                    key={img + index}
                    onClick={() => setImgStateIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-scale-down rounded-md"
                    />
                  </div>
                );
              })}
            </div>

            {isScrollable && (
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-0 hidden lg:block lg:mr-5 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 p-1 md:p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
              >
                <AiOutlineRight size={24} />
              </button>
            )}
          </div>

          <div className="flex flex-col mt-3 gap-1.5">
            <div className="">
              <h1 className="font-medium text-lg">Description</h1>
              <p className="text-base text-gray-600 lg:text-lg mb-4 leading-tight">
                {product.description}
              </p>
            </div>

            <div className="">
              {product?.more_details &&
                Object.keys(product?.more_details).map((ele, index) => (
                  <div key={index} className="">
                    <h1 className="font-medium text-lg">{ele}</h1>
                    <p className="text-base text-gray-600 lg:text-lg mb-4 leading-tight">
                      {product?.more_details[ele]}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 py-0 lg:text-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-600 px-3 py-1 rounded-full bg-green-100 text-xs md:text-sm font-medium">
              10 min delivery
            </span>
            <span className="text-gray-400 text-xs md:text-sm italic">
              (Fast and reliable)
            </span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-gray-800 leading-tight mb-2">
            {product.name}
          </h2>

          <p className="text-sm md:text-lg text-gray-500 mb-4">
            {isNaN(product.unit) ? product.unit : `${product.unit} Piece`}
          </p>

          <Divider />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            {/* Price Section with Discount */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-col items-start sm:items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-3 text-lg sm:text-xl md:text-2xl rounded font-semibold text-green-700 border border-green-500 bg-green-50 shadow-md w-full sm:w-auto">
                <div className="text-xl sm:text-2xl md:text-3xl">
                  {PriceFormatterInRupee(
                    priceWithDiscount(product.price, product.discount)
                  )}
                </div>
              </div>
              {product.discount !== undefined && (
                <p className="text-sm sm:text-base line-through text-gray-500">
                  {PriceFormatterInRupee(product.price)}
                </p>
              )}
              {product.discount !== undefined && (
                <p className="text-xs sm:text-sm md:text-base text-green-600 font-medium bg-green-200 px-2 py-1 rounded-md shadow-sm">
                  {product.discount}% OFF
                </p>
              )}
            </div>

            {/* Add to Cart or Out of Stock Section */}
            {product.stock > 0 ? (
              <AddToCartButton data={product} />
            ) : (
              <div className="w-full sm:w-auto bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm sm:text-base font-medium shadow-md text-center">
                Out of Stock
              </div>
            )}
          </div>

          {/* <div className="bg-gray-50 p-4 rounded-md shadow-md border-t border-gray-200">
            <h3 className="text-md md:text-lg font-medium text-gray-700 mb-2">
              Product Highlights
            </h3>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-600 space-y-1">
              <li>High-quality material</li>
              <li>Lightweight and durable</li>
              <li>Available in multiple sizes</li>
              <li>Easy to use and clean</li>
            </ul>
          </div> */}

          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Why shop from Binkeyit ?</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <img
                  src={minuteDeliveryImage}
                  alt="SuperFast Delivery"
                  className="w-20 h-20"
                />

                <div className="text-sm">
                  <div className="font-semibold">Superfast Delivery</div>
                  <p className="">
                    Get your order delivered to your doorstep at the earliest
                    from dark stores near you.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={bestPriceOffer}
                  alt="Best prices offer"
                  className="w-20 h-20"
                />

                <div className="text-sm">
                  <div className="font-semibold">Best Prices & Offers</div>
                  <p className="">
                    Best price destination with offers directly from the
                    manufacturing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={wideAssortment}
                  alt="Wide Assortment"
                  className="w-20 h-20"
                />

                <div className="text-sm">
                  <div className="font-semibold">Wide Assortment</div>
                  <p className="">
                    Choose from 5000+ prioducts across food personal care,
                    household & other categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
