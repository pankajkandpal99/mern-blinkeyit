import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

export const addCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        message: `Category "${name}" already exists.`,
        error: true,
        success: false,
      });
    }

    // Create and save new category
    const addCategory = new CategoryModel({ name, image });
    const savedCategory = await addCategory.save();

    if (!savedCategory) {
      return res.status(500).json({
        message: "Failed to save category. Please try again.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "successfully added Category",
      error: false,
      success: true,
      data: savedCategory,
    });
  } catch (error) {
    console.error(`Error occured while creating category : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchCategoryController = async (req, res) => {
  try {
    // using pagination to fetching category..
    const categories = await CategoryModel.find();
    if (categories.length === 0) {
      return res.status(404).json({
        message: "No categories found.",
        data: [],
        error: false,
        success: true,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched your categories",
      data: categories,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(`Error occured while fetching category : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId, name, image } = req.body;

    if (!categoryId || !name || !image) {
      return res.status(400).json({
        message: "All fields are required.",
        error: true,
        success: false,
      });
    }

    const existingCategory = await CategoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found.",
        error: true,
        success: false,
      });
    }

    const updatedData = await CategoryModel.findByIdAndUpdate(
      { _id: categoryId },
      {
        name: name,
        image: image,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Category updated successfully",
      error: false,
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error(`Error occured while updating category : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    // check the category is available or not in sub category, then delete...
    const checkSubCategory = await SubCategoryModel.find({
      category: { $in: [categoryId] },
    }).countDocuments(); // return the count ki subCategory me ye category ki id kitni jagah use ho rahi hai....

    // check the category is available or not in product, then delete...
    const checkProduct = await ProductModel.find({
      category: { $in: [categoryId] },
    }).countDocuments(); // return the count ki product me ye category ki id kitni jagah use ho rahi hai....

    if (checkSubCategory > 0 && checkProduct > 0) {
      return res.status(404).json({
        message: "category is already used, can't delete this category.",
        error: true,
        success: false,
      });
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(
      {
        _id: categoryId,
      },
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // console.log(deletedCategory);

    return res.status(200).json({
      message: "Category delete successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(`Error occured while deleting category : ${error}`);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
