import { IoArrowBack, IoArrowForward } from "react-icons/io5";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`flex items-center justify-center gap-2 bg-white border-2 px-4 py-2 rounded-lg shadow-md text-primary-700 font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:border-primary-500 ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400 border-gray-300 opacity-50"
            : "border-primary-300 hover:text-primary-200"
        }`}
      >
        <IoArrowBack />
        Prev
      </button>

      <p className="hidden md:block text-gray-700 font-medium text-sm md:text-base px-4 py-2 rounded-md bg-white">
        Page <span className="text-primary-200">{currentPage}</span> of{" "}
        <span className="text-primary-200">{totalPages}</span>
      </p>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`flex items-center justify-center gap-2 bg-white border-2 px-4 py-2 rounded-lg shadow-md text-primary-700 font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:border-primary-500 ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400 border-gray-300 opacity-50"
            : "border-primary-300 hover:text-primary-200"
        }`}
      >
        Next
        <IoArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
