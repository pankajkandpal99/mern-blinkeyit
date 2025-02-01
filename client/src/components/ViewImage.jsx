import { IoClose } from "react-icons/io5";

const ViewImage = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-md max-h-[80vh] p-4 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-300 rounded-full hover:bg-gray-100 hover:text-gray-900 hover:shadow-md transition duration-200"
          title="Close"
        >
          <IoClose size={20} />
        </button>
        <img
          src={imageUrl}
          alt="full screen"
          className="w-full h-full object-scale-down"
        />
      </div>
    </div>
  );
};

export default ViewImage;
