import { Link } from "react-router-dom";
import { PriceFormatterInRupee } from "../utils/PriceFormatterInRupee";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  return (
    <Link
      to={`/product/${data.name}/${data._id}`}
      className="border p-4 flex flex-col gap-4 w-full sm:w-64 md:w-56 lg:w-56 rounded-lg bg-white shadow hover:shadow-lg transition-shadow"
    >
      <div className="h-40 bg-blue-50 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={data.image[0]}
          alt="Product Image"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="text-green-600 w-fit px-3 py-1 rounded-md bg-green-100 text-xs md:text-sm">
        10 min delivery
      </div>

      {data.discount !== undefined && (
        <div className="text-green-600 bg-green-100 px-3 py-1 w-fit rounded-md text-xs md:text-sm">
          {data.discount}% off
        </div>
      )}

      <div className="font-medium text-gray-700 text-sm md:text-base line-clamp-2 h-10 md:h-12">
        {data.name}
      </div>

      <div className="text-xs md:text-sm text-gray-500 h-5 md:h-6">
        {isNaN(data.unit) ? data.unit : `${data.unit} Piece`}
      </div>

      <div className={`flex sm:flex-row items-center justify-between gap-3`}>
        <div
          className={`text-sm md:text-base font-medium text-green-600 ${
            data.stock === 0 && "w-full"
          }`}
        >
          {PriceFormatterInRupee(priceWithDiscount(data.price, data.discount))}
        </div>

        {data.stock > 0 ? (
          <AddToCartButton data={data} />
        ) : (
          <div className="w-full sm:w-auto bg-red-100 text-red-600 px-4 py-2 text-center rounded text-xs md:text-sm font-medium shadow-md whitespace-nowrap">
            Out of Stock
          </div>
        )}
      </div>
    </Link>
  );
};

export default CardProduct;
