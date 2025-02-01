import jwt from "jsonwebtoken";

// Check user is authenticate or not...
export const authMiddleware = (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token =
      req.cookies["accessToken"] ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]); // ["Bearer","token"], here I want to token only

    if (!token) {
      return res.status(401).json({
        message: "Access token is missing. Please log in first.",
        error: true,
        success: false,
      });
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return res.status(401).json({
        message: "Unauthorised access",
        error: true,
        success: false,
      });
    }

    // Attach user info to the request object
    req.userId = decode.id;
    next();
  } catch (error) {
    console.error("Error occured while auth middleware check", error);
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
