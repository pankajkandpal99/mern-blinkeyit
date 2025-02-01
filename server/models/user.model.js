import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
    },

    email: {
      type: String,
      required: [true, "please provide email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "please provide password"],
    },

    avatar: {
      type: String,
      default: "",
    },

    mobile: {
      type: Number,
      default: null,
    },

    refresh_token: {
      type: String,
      default: "",
    },

    verify_email: {
      type: Boolean,
      default: false,
    },

    last_login_date: {
      type: Date,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"], // only admin can update the status of user.
      default: "Active",
    },

    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],

    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CartProduct",
      },
    ],

    order_history: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],

    forgot_password_otp: {
      type: String,
      default: null,
    },

    forgot_password_expiry: {
      type: Date,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
