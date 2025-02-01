import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deleteProductController,
  fetchProductByCategory,
  fetchProductByCategoryAndSubCategory,
  fetchProductController,
  fetchProductDetailsController,
  postProductController,
  searchProductController,
  updateProductController,
} from "../controllers/product.controller.js";
import { Admin } from "../middleware/Admin.js";

const route = Router();

route.post(`/create`, authMiddleware, Admin, postProductController);
route.get(`/fetch`, fetchProductController);
route.get(`/fetch-product-by-category/:categoryId`, fetchProductByCategory);
route.get(`/fetchProductByCatAndSubCat`, fetchProductByCategoryAndSubCategory);
route.get(`/fetch-product-details/:productId`, fetchProductDetailsController);
route.put(`/update/:productId`, authMiddleware, Admin, updateProductController);
route.delete(`/delete/:productId`, authMiddleware, Admin, deleteProductController);
route.get(`/fetch/search`, searchProductController);

export default route;
