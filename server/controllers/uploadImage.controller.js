import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js";

export const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    const uploadImage = await uploadImageCloudinary(file);

    return res.status(200).json({
      message: "Image upload successfully",
      error: false,
      success: true,
      data: uploadImage,
    });
  } catch (error) {
    console.error(`Error occured while uploading image : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
