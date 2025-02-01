import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddressService } from "../services/addressService";
import ConfirmBox from "./ConfirmBox";
import AddressField from "./AddressField";

const buttonColors = {
  blue: "text-blue-500 hover:text-blue-600 hover:bg-blue-100",
  red: "text-red-500 hover:text-red-600 hover:bg-red-100",
};

const ActionButton = ({ label, onClick, color }) => (
  <button
    className={`text-sm px-3 py-1 rounded-md transition-colors focus:outline-none ${
      buttonColors[color] || ""
    }`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    {label}
  </button>
);

const AddressSection = ({
  allowSelection = false,
  allowEdit = false,
  allowDelete = false,
  onSelectAddress,
}) => {
  const dispatch = useDispatch();
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDeleteActionModal, setOpenDeleteActionModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddressForUpdate, setSelectedAddressForUpdate] =
    useState(null);
  const [loading, setLoading] = useState(false);

  const addressList = useSelector((state) => state.address?.userAddresses);

  const findAddressById = (id) =>
    addressList.find((address) => address?._id === id);

  const handleEditAddress = (addressId) => {
    setSelectedAddressForUpdate(findAddressById(addressId));
    setOpenAddressModal(true);
  };

  const handleDeleteAddress = (addressId) => {
    setAddressToDelete(addressId);
    setOpenDeleteActionModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddressModal(false);
    setSelectedAddressForUpdate(null);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setLoading(true);

    try {
      await deleteAddressService(dispatch, addressToDelete);
      setOpenDeleteActionModal(false);
      setAddressToDelete(null);
      toast.success("Address deleted successfully!");
      
      window.location.reload(); // for fetching updated user details
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (addressId) => {
    if (onSelectAddress) {
      onSelectAddress(addressId);
    }
  };

  const renderAddressList = () =>
    addressList?.map((address) => {
      const Container = allowSelection ? "label" : "div";

      return (
        <Container
          key={address._id}
          className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow flex flex-col gap-2 cursor-pointer"
        >
          <div className="flex gap-4">
            {allowSelection && (
              <input
                type="radio"
                name="address"
                value={address?._id}
                onChange={() => handleAddressSelection(address?._id)}
                className="accent-green-500 border h-4 w-4 cursor-pointer mt-2"
              />
            )}

            <div className="flex flex-col justify-center">
              <span className="text-gray-700 font-medium">
                {address.address_line}
              </span>
              <p className="text-sm text-gray-600">{address.city}</p>
              <p className="text-sm text-gray-600">{address.state}</p>
              <p className="text-sm text-gray-600">
                {address.country} - {address.pincode}
              </p>
              <p className="text-sm text-gray-600">Mobile: {address.mobile}</p>
            </div>
          </div>

          {(allowEdit || allowDelete) && (
            <div className="flex justify-end gap-4 mt-4">
              {allowEdit && (
                <ActionButton
                  label={loading ? "Updating..." : "Edit"}
                  onClick={() => handleEditAddress(address?._id)}
                  color="blue"
                />
              )}
              {allowDelete && (
                <ActionButton
                  label={loading ? "Deleting..." : "Delete"}
                  onClick={() => handleDeleteAddress(address?._id)}
                  color="red"
                  icon="delete"
                />
              )}
            </div>
          )}
        </Container>
      );
    });

  return (
    <div>
      <div className="bg-white grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {addressList?.length > 0 ? (
          renderAddressList()
        ) : (
          <p className="text-gray-500">No addresses found.</p>
        )}

        <div
          onClick={() => setOpenAddressModal(true)}
          className="h-36 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center text-gray-500 group hover:border-green-500 transition-colors cursor-pointer"
        >
          <span className="text-lg group-hover:text-green-500">
            + Add Address
          </span>
        </div>
      </div>

      {openAddressModal && (
        <AddressField
          open={openAddressModal}
          onClose={handleCloseModal}
          initialData={selectedAddressForUpdate}
          mode={selectedAddressForUpdate ? "edit" : "add"}
        />
      )}

      {openDeleteActionModal && (
        <ConfirmBox
          isOpen={openDeleteActionModal}
          onClose={() => setOpenDeleteActionModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Address"
          message="Are you sure you want to delete this address?"
        />
      )}
    </div>
  );
};

export default AddressSection;
