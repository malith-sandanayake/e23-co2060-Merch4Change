import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (buffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // ← this is the URL you save in MongoDB
      }
    );
    stream.end(buffer);
  });
};
