import UserModel from "../models/user.model.js";

export const Admin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(500).json({
        message: "Permission Denied",
        error: true,
        success: false,
      });
    }

    next();  
  } catch (error) {
    console.error(`ADMIN Error occured - PERMISSION DENIED : ${error}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
