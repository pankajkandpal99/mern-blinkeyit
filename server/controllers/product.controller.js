import ProductModel from "../models/product.model.js";

export const postProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      more_details,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!image || image.length === 0) missingFields.push("image");
    if (!category || category.length === 0) missingFields.push("category");
    if (!subCategory || subCategory.length === 0)
      missingFields.push("subCategory");
    if (!unit) missingFields.push("unit");
    // if (!stock) missingFields.push("stock");
    if (!price) missingFields.push("price");
    if (!discount) missingFields.push("discount");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Validation Error: Missing fields - ${missingFields.join(
          ", "
        )}`,
        error: true,
        success: false,
      });
    }

    // validation more_detail to ensure no keys have values
    const invalidMoreDetails = Object.entries(more_details || {}).some(
      ([key, value]) => !value || value.trim() === ""
    );

    if (invalidMoreDetails) {
      return res.status(400).json({
        message:
          "Validation Error: All fields in more_details must have valid values.",
        error: true,
        success: false,
      });
    }

    const newProduct = new ProductModel({
      name,
      description,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      more_details,
    });

    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }

    return res.status(201).json({
      message: "Product uploaded successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error occured while uploading product : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchProductController = async (req, res) => {
  try {
    const {
      page,
      limit,
      search = "",
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const sortOrder = order === "asc" ? 1 : -1;

    // Create a filter Object
    const filter = {};
    let products = [];
    let totalProducts = 0;

    // Calculate skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Check if search query is provided
    if (search) {
      // Step 1: Exact match for name and description
      const exactMatchFilter = {
        ...filter,
        $or: [{ name: search }, { description: search }], // Exact name or description match
      };

      products = await ProductModel.find(exactMatchFilter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limitNumber);

      totalProducts = await ProductModel.countDocuments(exactMatchFilter);

      // Step 2: Fallback to similar results if no exact match found
      if (products.length === 0) {
        const searchRegex = new RegExp(
          search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
          "i"
        );

        const similarMatchFilter = {
          ...filter,
          $or: [{ name: searchRegex }, { description: searchRegex }], // Similar name or description match
        };

        products = await ProductModel.find(similarMatchFilter)
          .sort({ [sort]: sortOrder })
          .skip(skip)
          .limit(limitNumber);

        totalProducts = await ProductModel.countDocuments(similarMatchFilter);
      }
    } else {
      // If no search query, fetch all products with pagination and filters
      products = await ProductModel.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limitNumber);

      totalProducts = await ProductModel.countDocuments(filter);
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: "Product fetched successfully",
      error: false,
      success: true,
      data: {
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Error occured while fetching product : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // const limit = parseInt(req.query.limit) || 15;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      category: { $in: [categoryId] },
    });
    // .limit(limit)
    // .sort({ createdAt: -1 }) // Sort by newest first
    // .populate("category")
    // .populate("subCategory");

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for the given category",
        error: false,
        success: true,
        data: [],
      });
    }

    // console.log(products);
    // console.log(products.length);

    res.status(200).json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error occured while fetching product by category : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Category ID and Subcategory ID are required",
        error: true,
        success: false,
      });
    }

    // Pagination and Sorting
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
    };

    const products = await ProductModel.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await ProductModel.countDocuments(filter);

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for the given category and subcategory",
        error: false,
        success: true,
        data: [],
      });
    }

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      data: {
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error(
      "Error occured while fetching product by category and subCategory : ",
      error
    );
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const fetchProductDetailsController = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findOne({ _id: productId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .exec();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Products details fetched successfully",
      error: false,
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Error occured while fetching product details : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("ennter");

    if (!productId) {
      return res.status(400).json({
        message: "Validation Error: Missing productId in request parameters.",
        error: true,
        success: false,
      });
    }

    const {
      name,
      description,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      more_details,
    } = req.body;

    if (
      !name &&
      !description &&
      (!image || image.length === 0) &&
      (!category || category.length === 0) &&
      (!subCategory || subCategory.length === 0) &&
      !unit &&
      stock === undefined && // Allow stock to be 0
      price === undefined &&
      discount === undefined &&
      (more_details === undefined || Object.keys(more_details).length === 0)
    ) {
      return res.status(400).json({
        message:
          "Validation Error: At least one field must be provided to update the product.",
        error: true,
        success: false,
      });
    }

    // Validate more_details if provided
    if (more_details) {
      const invalidMoreDetails = Object.entries(more_details).some(
        ([_, value]) => !value || value.trim() === ""
      );

      if (invalidMoreDetails) {
        return res.status(400).json({
          message:
            "Validation Error: All fields in more_details must have valid values.",
          error: true,
          success: false,
        });
      }
    }

    // Prepare the update object with only the fields provided
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image && image.length > 0) updateData.image = image;
    if (category && category.length > 0) updateData.category = category;
    if (subCategory && subCategory.length > 0)
      updateData.subCategory = subCategory;
    if (unit) updateData.unit = unit;
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (more_details !== undefined) updateData.more_details = more_details;

    // Update the product in the database
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // Check if product exists
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found. Unable to update.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      error: false,
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error occured while update product : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        message: "Validation Error: Missing productId in request parameters.",
        error: true,
        success: false,
      });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found. Unable to delete.",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Successfully deleted your product.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error occured while update product : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sort = "createdAt", // we can sort as price also
      order = "desc",
    } = req.query;

    // if (search.trim() === "") {
    //   return res.status(400).json({
    //     message: "Search term is required",
    //     error: true,
    //     success: false,
    //   });
    // }

    // Pagination and Sorting
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } }, // Partial match for `name`
        { description: { $regex: search, $options: "i" } }, // Partial match for `description`
      ],
    };

    const products = await ProductModel.find(filter)
      .populate("category")
      .populate("subCategory")
      .skip(skip)
      .sort({ [sort]: sortOrder })
      .limit(limitNumber);

    const totalProducts = await ProductModel.countDocuments(filter);

    // If no products are found
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for the given search term",
        error: false,
        success: true,
        data: [],
      });
    }

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: "Products fetched successfully",
      error: false,
      success: true,
      data: {
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Error occured while fetching product by search : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
