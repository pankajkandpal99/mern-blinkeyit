import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const generateRefreshToken = async (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    const updateRefreshToken = await UserModel.findOneAndUpdate(
      { _id: userId },
      { refresh_token: token },
      { new: true }
    );

    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate access token.");
  }
};
