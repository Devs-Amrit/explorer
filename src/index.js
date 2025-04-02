import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("error hai re..", error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`server running on port-${port}`);
    });
  })
  .catch((err) => {
    console.log("Data base connection failed..");
  });

/*
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("db error - ", error);
  }
})();

      */
