import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, folder = "posts", options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto", ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};