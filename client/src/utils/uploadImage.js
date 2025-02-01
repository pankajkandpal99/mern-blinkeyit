import { summaryApi } from "../common/SummaryApi";
import Axios from "./Axios";

const uploadImage = async (image) => {
  if (!(image instanceof File)) {
    throw new Error("Invalid image file");
  }

  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await Axios({
      ...summaryApi.uploadImage,
      data: formData,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Failed to upload image, status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`Error occured while uploading image : ${error}`);
    throw error;
  }
};

export default uploadImage;
