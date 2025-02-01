import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { connectToDB } from "./config/connectDB.js";
import userRoute from "./route/user.route.js";
import categoryRoute from "./route/category.route.js";
import uploadImageRoute from "./route/uploadImage.route.js";
import subCategoryRoute from "./route/subCategory.route.js";
import productRoute from "./route/product.route.js";
import cartRoute from "./route/cart.route.js";
import addressRoute from "./route/address.route.js";
import orderRoute from "./route/order.route.js";
import { stripeWebhookHandler } from "./controllers/order.controller.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, "https://*.ngrok-free.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  })
);

app.post(
  "/api/order/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

// routes...
app.use(`/api/user`, userRoute);
app.use(`/api/category`, categoryRoute);
app.use(`/api/file`, uploadImageRoute);
app.use(`/api/subCategory`, subCategoryRoute);
app.use(`/api/product`, productRoute);
app.use(`/api/cart`, cartRoute);
app.use(`/api/address`, addressRoute);
app.use(`/api/order`, orderRoute);

// db connect, then server will run.
const PORT = process.env.PORT || 8080;
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Error occured while mongoDB connection : ", error);
  });
