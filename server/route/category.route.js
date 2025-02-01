import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addCategoryController,
  deleteCategoryController,
  fetchCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";

const categoryRoute = Router();

categoryRoute.post("/add-category", authMiddleware, addCategoryController);
categoryRoute.get("/fetch-category", fetchCategoryController);
categoryRoute.put("/update-category", authMiddleware, updateCategoryController);
categoryRoute.delete(
  "/delete-category",
  authMiddleware,
  deleteCategoryController
);

export default categoryRoute;
