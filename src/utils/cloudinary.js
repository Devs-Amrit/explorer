import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload on cloudinary.
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // upload success ful on cloudinary.
    console.log("file uploaded successfully", response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temprory file as the upload opretion failed.
    return null;
  }
};

export { uploadOnCloudinary };
