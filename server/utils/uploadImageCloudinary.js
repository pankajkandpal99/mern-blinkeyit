import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const uploadImageCloudinary = async (image) => {
  const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

  try {
    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "Binkeyit" }, (error, uploadResult) => {
          if (error) {
            reject(
              new Error(
                `Error uploading image to Cloudinary : ${error.message}`
              )
            );
          } else {
            resolve(uploadResult);
          }
        })
        .end(buffer);
    });

    return uploadImage;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
