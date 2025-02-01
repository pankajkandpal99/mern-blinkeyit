import { sendEmail } from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import verificationEmailTemplate from "../utils/verifyEmailTemplate.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js";
import { generateOTP } from "../utils/generateOtp.js";
import { forgotPasswordTemplate } from "../utils/forgot-password-template.js";
import AddressModel from "../models/address.model.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "please provide mendatory fields.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "email is already registered",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPass,
    };

    const newUser = new UserModel(payload);
    const savedData = await newUser.save();

    // email sending part for verifying email...
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedData?._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email, // you can send email only that user which have logged-in in resend website.
      subject: "Verify email from Binkeyit",
      html: verificationEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: savedData,
    });
  } catch (error) {
    console.error("Error occured while registering user");
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        message: "Verification code is missing.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res.status(404).json({
        message: "Invalid verification code.",
        error: true,
        success: false,
      });
    }

    // Check if the user is already verified
    if (user.verify_email) {
      return res.status(400).json({
        message: "User is already verified.",
        error: false,
        success: true,
      });
    }

    // update user
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: code },
      { $set: { verify_email: true } }, // The $set operator in MongoDB is used to update specific fields of a document.
      { new: true }
    );

    if (!updateUser) {
      return res.status(500).json({
        message: "Failed to update user verification.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User is verified successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error occured while verifying email : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }

    // Find user in the database
    const user = await UserModel.findOne({ email });

    if (!user || user.status !== "Active") {
      return res.status(400).json({
        message: !user
          ? "Invalid email or password"
          : "Your account is currently inactive. Please contact the administrator to activate your account.",
        error: true,
        success: false,
      });
    }

    // check password is valid or not
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
        error: true,
        success: false,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Set cookies with appropriate options
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    // user.last_login_date = new Date();
    // await user.save();

    return res.status(200).json({
      message: "You are successfully logged in",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error occured while user loggin in : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.userId; // added in middlewar

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    if (!removeRefreshToken) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "You are successfully logout",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error occured while user logout : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const uploadAvatarController = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const image = req.file; // multer middleware

    // Validate if image is present
    if (!image) {
      return res.status(400).json({
        message: "No file uploaded. Please provide an avatar image.",
        error: true,
        success: false,
      });
    }

    // Upload image to Cloudinary
    const upload = await uploadImageCloudinary(image);

    // Validate Cloudinary upload response
    if (!upload || !upload.secure_url) {
      return res.status(500).json({
        message: "Image upload failed. Please try again.",
        error: true,
        success: false,
      });
    }

    // Update user's avatar in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: upload.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found. Avatar not updated.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "uploaded avatar",
      data: {
        _id: userId,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error occured while user upload his avatar : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateUserDetailsController = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    // Check if the request body is empty
    if (!name && !email && !mobile && !password) {
      return res.status(400).json({
        message:
          "No fields to update. Please provide at least one field to update.",
        error: true,
        success: false,
      });
    }

    let hashedPass = "";

    // If password is provided, hash it before updating...
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPass = await bcryptjs.hash(password, salt);
    }

    // Update user details only if the respective fields are provided
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashedPass }),
      },
      { new: true }
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found. Please check the user ID.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error occured while user update user details : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

// forgot Password --> Send OTP --> Verify OTP --> reset Password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide an email to reset your password.",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Generate OTP and expiry time
    const generatedOtp = generateOTP();
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // after 1hr otp will be expired...

    // Update user with OTP and expiry
    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: generatedOtp,
      forgot_password_expiry: expiryTime,
    });

    // Send OTP to user provide email
    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Binkeyit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: generatedOtp,
      }),
    });

    return res.status(200).json({
      message: "OTP sent successfully. Please check your email.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error occured while user forgot his password : ", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const verifyForgotPasswordOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "please provide mendatory fields like email and OTP.",
        error: true,
        success: false,
      });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Check if OTP has expired
    const currTime = new Date();
    if (user.forgot_password_expiry < currTime) {
      res.statut(400).json({
        message: "OTP has expired, please retry.",
        error: true,
        success: false,
      });
    }

    // Check if OTP is correct
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "OTP is Invalid.",
        error: true,
        success: false,
      });
    }

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });

    // OTP verified successfully
    return res.status(200).json({
      message: "OTP verified successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(
      "Error occured while verifying forgot-password otp : ",
      error
    );
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;
    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "Please provide all required fields.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
        error: true,
        success: false,
      });
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(confirmNewPassword, salt);

    // Update password and reset OTP fields
    await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPass,
        forgot_password_otp: null,
        forgot_password_expiry: null,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error occurred while resetting the password:", error);
    return res.status(500).json({
      message: error.message || error || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

// refresh token controller ... The refreshTokenController is responsible for generating a new access token when a valid refresh token is provided. This process is typically used in authentication flows where access tokens expire quickly (e.g., in JWT-based authentication). The refresh token remains valid longer, allowing the client to request a new access token without requiring the user to log in again...
// export const refreshTokenController = async (req, res) => {
//   try {
//     const refreshToken =
//       req.cookies.refreshToken ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     if (!refreshToken) {
//       return res.status(401).json({
//         message: "Invalid token",
//         error: true,
//         success: false,
//       });
//     }

//     const verifyToken = jwt.verify(
//       refreshToken,
//       process.env.JWT_SECRET_KEY_REFRESH_TOKEN
//     );

//     if (!verifyToken) {
//       return res.status(401).json({
//         message: "Token has expired",
//         error: true,
//         success: false,
//       });
//     }

//     const userId = verifyToken.id;
//     const newAccessToken = generateAccessToken(userId);

//     const cookiesOption = {
//       httpOnly: true,
//       secure: true,
//       sameSite: true,
//     };

//     res.cookie("accessToken", newAccessToken, cookiesOption);

//     return res.json({
//       message: "New Access Token generated",
//       error: false,
//       success: true,
//       data: {
//         accessToken: newAccessToken,
//       },
//     });
//   } catch (error) {
//     console.error("Error occurred while refresh token update:", error);
//     return res.status(500).json({
//       message: error.message || error || "Internal Server Error",
//       error: true,
//       success: false,
//     });
//   }
// };

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const decodedToken = jwt.decode(refreshToken);

    try {
      const verifyToken = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_KEY_REFRESH_TOKEN
      );

      if (!verifyToken) {
        return res.status(401).json({
          message: "Token has expired",
          error: true,
          success: false,
        });
      }

      const userId = verifyToken.id;
      const newAccessToken = generateAccessToken(userId);

      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: true,
      };

      res.cookie("accessToken", newAccessToken, cookiesOption);

      return res.status(200).json({
        message: "New Access Token generated",
        error: false,
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({
        message: err.message || "Token verification failed",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error occurred while refresh token update:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const getUserDetailsController = async (req, res) => {
  try {
    const { userId } = req; // access from middleware

    if (!userId) {
      return res.status(401).json({
        message: "User ID not provided",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const activeAddresses = await AddressModel.find({
      _id: { $in: user.address_details },
      status: true,
    }).select("_id"); // Only fetch the _id field

    // Replace address_details array with only active address IDs
    user.address_details = activeAddresses?.map((address) => address?._id);

    return res.status(200).json({
      message: "User details fetched successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error occurred while get user details :", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
