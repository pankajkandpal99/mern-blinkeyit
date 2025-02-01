import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    if (!name || !image || category.length === 0) {
      return res.status(400).json({
        message: "All fields are required.",
        error: true,
        success: false,
      });
    }

    const existingSubCategory = await SubCategoryModel.findOne({
      name,
      category,
    });

    if (existingSubCategory) {
      return res.status(400).json({
        message: `SubCategory "${name}" already exists.`,
        error: true,
        success: false,
      });
    }

    const newSubCategory = new SubCategoryModel({ name, image, category });
    const savedSubCategory = await newSubCategory.save();

    if (!savedSubCategory) {
      return res.status(500).json({
        message: "Failed to save subCategory. Please try again.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully added SubCategory.",
      error: false,
      success: true,
      data: savedSubCategory,
    });
  } catch (error) {
    console.error(`Error occured while creating subCategory : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchSubCategoryController = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");

    if (!subCategories) {
      return res.status(404).json({
        message: "No subCategories found.",
        data: [],
        error: false,
        success: true,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched your subCategories",
      data: subCategories,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(`Error occured while fetching subCategory : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateSubCategoryController = async (req, res) => {
  try {
    const { name, image, subCategoryId, category } = req.body;

    if (!subCategoryId) {
      return res.status(400).json({
        message: "Subcategory ID is required to update the subcategory.",
        error: true,
        success: false,
      });
    }

    if (!name || !image || category.length === 0) {
      return res.status(400).json({
        message: "All fields are erquired.",
        error: true,
        success: false,
      });
    }

    // Find the subcategory by name
    const subCategory = await SubCategoryModel.findById({ _id: subCategoryId });

    if (!subCategory) {
      return res.status(404).json({
        message: "SubCategory not found with the provided name.",
        error: true,
        success: false,
      });
    }

    // update the subCategory
    const newSubCategory = await SubCategoryModel.findByIdAndUpdate(
      { _id: subCategoryId },
      {
        name,
        image,
        category,
      },
      { new: true }
    );

    if (!newSubCategory) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }

    // console.log("new Sub category : ", newSubCategory);

    return res.status(200).json({
      message: "Subcategory updated successfully.",
      error: false,
      success: true,
      data: newSubCategory,
    });
  } catch (error) {
    console.error(`Error occured while update subCategory : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteSubCategorycontroller = async (req, res) => {
  try {
    const { subCategoryId } = req.body;

    if (!subCategoryId) {
      return res.status(400).json({
        message: "Subcategory ID is required to delete the subcategory.",
        error: true,
        success: false,
      });
    }

    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete({
      _id: subCategoryId,
    });

    if (!deletedSubCategory) {
      return res.status(404).json({
        message: "Subcategory not found. Please check the provided ID.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subcategory deleted successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(`Error occured while delete subCategory : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
