import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connectDB(): Promise<void> {
  try {
    const conn = process.env.DATABASE_URI as string;
    await mongoose.connect(conn);
    console.log("Database connected successfully...");
  } catch (error) {
    console.error("Error to connecting DATABASE", error);
    process.exit(1);
  }
}
