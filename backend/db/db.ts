import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const BANCO = process.env.BANCO || "";
const URLMongo = process.env.MONGOOSE_KEY || "";
const URL = `mongodb://localhost:27017/${BANCO}`;

const connectDB = async () => {
  try {
    await mongoose.connect(URLMongo);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
