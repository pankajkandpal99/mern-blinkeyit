import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URL) {
  throw new Error("Database URL is not found!");
}

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error : ", error);
    process.exit(1);
  }
}
