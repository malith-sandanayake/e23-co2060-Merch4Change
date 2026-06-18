import Post from "../models/Post.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(file.buffer, "merch4change/posts"),
        ),
      );
      images = uploads.map((upload) => upload.secure_url);
    }

    const post = await Post.create({ userId, content, images });
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
