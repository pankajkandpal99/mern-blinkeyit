import { useNavigate } from "react-router-dom";
import ConfirmBox from "./ConfirmBox";
import { useState } from "react";
import toast from "react-hot-toast";

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const [confirmBoxOpen, setConfirmBoxOpen] = useState(false); // only for delete product

  const handleUpdateProduct = () => {
    if (!product._id) {
      toast.error("Please select a product to update");
      return;
    }

    navigate(`/dashboard/upload-product?edit=${product._id}`);
  };

  return (
    <div className="border w-full p-4 bg-white rounded-md shadow-sm mx-auto hover:shadow-md transition-shadow duration-300">
      <div className="w-full h-36 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
        <img
          src={product?.image?.[0]}
          alt={"Product Image"}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="h-12 flex items-center">
        <p className="text-sm text-gray-700 font-medium text-ellipsis line-clamp-2">
          {product.name || "Unnamed Product"}
        </p>
      </div>

      <p className="text-xs md:text-sm text-gray-500 mt-1">
        {isNaN(product.unit) ? product.unit : `${product.unit} Piece`}
      </p>

      <div className="flex items-center justify-between gap-3 py-2 mt-3">
        <button
          onClick={handleUpdateProduct}
          className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setConfirmBoxOpen(true)}
          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded"
        >
          Delete
        </button>
      </div>

      <ConfirmBox
        isOpen={confirmBoxOpen}
        onClose={() => setConfirmBoxOpen(false)}
        onConfirm={() => onDelete(product._id)}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the product "${product?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProductCard;
