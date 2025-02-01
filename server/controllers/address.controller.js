import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const createAddressController = async (req, res) => {
  try {
    const { userId } = req; // access from auth middleware
    const { address_line, city, state, pincode, country, mobile } = req.body;

    if (!userId) {
      return res.status(404).json({
        message: "You are not authenticated, please login first.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Check if all required fields are provided
    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Validate pincode (6 digits) and mobile (10 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        message: "Pincode must be 6 digits",
        error: true,
        success: false,
      });
    }
    // Validate mobile (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be a 10-digit number",
        error: true,
        success: false,
      });
    }

    const mobileNumber = Number(mobile);

    // Create new address
    const newAddress = await AddressModel.create({
      userId,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile: mobileNumber, // Store as number
    });

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { address_details: newAddress._id } },
      { new: true }
    );

    return res.status(200).json({
      message: "Address created successfully",
      error: false,
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error(`Error occured while adding address : ${error}`);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchAddressController = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(404).json({
        message: "You are not authenticated, please login first.",
        error: true,
        success: false,
      });
    }

    const addresses = await AddressModel.find({ userId, status: true }).sort({
      createdAt: -1,
    });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        message: "No addresses found for this user",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Addresses fetched successfully",
      error: false,
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error(`Error occured while fetching address : ${error}`);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateAddressController = async (req, res) => {
  try {
    const { userId } = req; // access from middleware
    const { addressId } = req.params;
    const { address_line, city, state, pincode, country, mobile } = req.body;

    if (!userId) {
      return res.status(404).json({
        message:
          "You are not authorized to update the address, please login first.",
        error: true,
        success: false,
      });
    }
    if (!addressId) {
      return res.status(400).json({
        message: "Please provide address ID to update the address.",
        error: true,
        success: false,
      });
    }

    // Check if the address exists and belongs to the user
    const existingAddress = await AddressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found or not associated with the user.",
        error: true,
        success: false,
      });
    }

    // Validate pincode (6 digits) and mobile (10 digits) if provided
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        message: "Pincode must be 6 digits.",
        error: true,
        success: false,
      });
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be a 10-digit number.",
        error: true,
        success: false,
      });
    }

    const updateData = {};
    if (address_line) updateData.address_line = address_line;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (pincode) updateData.pincode = pincode;
    if (country) updateData.country = country;
    if (mobile) updateData.mobile = Number(mobile);

    // update the address
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      message: "Address updated successfully.",
      error: false,
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error(`Error occured while updating address : ${error}`);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteAddressController = async (req, res) => {
  try {
    const { userId } = req; // access from middleware
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access. Please login first.",
        error: true,
        success: false,
      });
    }

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required to delete an address.",
        error: true,
        success: false,
      });
    }

    // Check if the address exists and belongs to the user
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        message: "Address not found or does not belong to the user.",
        error: true,
        success: false,
      });
    }

    // await AddressModel.findByIdAndDelete(addressId);
    // await UserModel.findByIdAndUpdate(userId, {
    //   $pull: { address_details: addressId },
    // });

    await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: { status: false } }, // Set status to false
      { new: true }
    );

    return res.status(200).json({
      message: "Address deleted successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(`Error occured while deleting address : ${error}`);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
