const ConfirmBox = ({ onClose, isOpen, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="bg-white px-5 py-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-2">
          {title || "Confirm Action"}
        </h2>
        <p className="text-gray-600 mb-4">{message || "Are you sure?"}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-400 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
