import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addSubCategoryController,
  deleteSubCategorycontroller,
  fetchSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const route = Router();

route.post("/add-subCategory", authMiddleware, addSubCategoryController);
route.get("/fetch-subCategory", fetchSubCategoryController);
route.put("/update-subCategory", authMiddleware, updateSubCategoryController);
route.delete(
  "/delete-subCategory",
  authMiddleware,
  deleteSubCategorycontroller
);

export default route;
