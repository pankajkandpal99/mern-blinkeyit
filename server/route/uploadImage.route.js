import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadImageController } from "../controllers/uploadImage.controller.js";
import { upload } from "../middleware/multer.js";

const uploadImageRoute = Router();

uploadImageRoute.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  uploadImageController
);

export default uploadImageRoute;
