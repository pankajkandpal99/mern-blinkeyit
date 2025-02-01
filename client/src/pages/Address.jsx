import AddressSection from "../components/AddressSection";

const Address = () => {
  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Address Management
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Manage your saved addresses for a seamless shopping experience.
        </p>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
        <AddressSection
          allowSelection={false}
          allowEdit={true}
          allowDelete={true}
        />
      </div>
    </div>
  );
};

export default Address;
