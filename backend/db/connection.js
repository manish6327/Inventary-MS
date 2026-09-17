import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");
  } catch (err) {
    console.error("connection failed", err.message);
  }
};

export default connectToDB;
