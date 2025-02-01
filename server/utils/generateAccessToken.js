import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "5h" }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate access token.");
  }
};
