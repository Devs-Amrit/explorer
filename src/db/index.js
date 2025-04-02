import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "./env" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Mongodb connected!! Host in:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("DB Connection errror ", error);
    process.exit(1);
  }
};

export default connectDB;
