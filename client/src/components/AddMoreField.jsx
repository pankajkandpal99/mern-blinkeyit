import { IoClose } from "react-icons/io5";

const AddMoreField = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed inset-0 bg-neutral-900 bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="font-semibold text-xl text-gray-800">Add New Field</h1>
          <button
            onClick={close}
            className="text-gray-500 hover:text-primary-200"
          >
            <IoClose size={25} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="bg-yellow-50 p-3 border border-yellow-200 focus:border-yellow-200 outline-none rounded w-full text-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-yellow-300"
            placeholder="Enter your field name"
          />
        </div>

        <button
          onClick={submit}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg w-full transition duration-200 ease-in-out"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddMoreField;
