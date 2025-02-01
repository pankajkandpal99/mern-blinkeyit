import { Router } from "express";
import {
  forgotPasswordController,
  getUserDetailsController,
  loginController,
  logoutController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  updateUserDetailsController,
  uploadAvatarController,
  verifyEmailController,
  verifyForgotPasswordOTPController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const userRoute = Router();

userRoute.post("/register", registerUserController);
userRoute.put(`/verify-email`, verifyEmailController); // Todo: task not completed,

userRoute.post(`/login`, loginController);
userRoute.get(`/logout`, authMiddleware, logoutController);

userRoute.put(
  `/upload-avatar`,
  authMiddleware,
  upload.single("avatar"),
  uploadAvatarController
);
userRoute.put(`/update-user`, authMiddleware, updateUserDetailsController);

userRoute.put(`/forgot-password`, forgotPasswordController);
userRoute.put(`/verify-forgot-password-otp`, verifyForgotPasswordOTPController);
userRoute.put(`/reset-password`, resetPasswordController);

userRoute.post(`/refresh-token`, refreshTokenController);

userRoute.get("/user-details", authMiddleware, getUserDetailsController);

export default userRoute;
