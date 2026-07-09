import Post from "../models/Post.js";
import User from "../models/User.js";
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

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id })
      .populate("userId", "firstName lastName userName profileImage profileImageUrl")
      .sort({ createdAt: -1 });

    const normalizedPosts = posts.map((post) => ({
      id: post._id,
      title: post.content?.slice(0, 48) || "Untitled post",
      description: post.content,
      imageUrl: post.images?.[0] || "",
      images: post.images || [],
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      comments: post.comments || [],
      createdAt: post.createdAt,
      author: post.userId
        ? {
            id: post.userId._id,
            firstName: post.userId.firstName,
            lastName: post.userId.lastName,
            userName: post.userId.userName,
            profileImageUrl: post.userId.profileImageUrl,
          }
        : null,
    }));

    res.status(200).json({ success: true, posts: normalizedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Post.findOneAndDelete({ _id: req.params.postId, userId: req.user._id });

    return res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const posts = await Post.find({ userId: user._id })
      .populate("userId", "firstName lastName userName profileImage profileImageUrl")
      .sort({ createdAt: -1 });

    const normalizedPosts = posts.map((post) => ({
      id: post._id,
      title: post.content?.slice(0, 48) || "Untitled post",
      description: post.content,
      imageUrl: post.images?.[0] || "",
      images: post.images || [],
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      comments: post.comments || [],
      createdAt: post.createdAt,
      author: post.userId
        ? {
            id: post.userId._id,
            firstName: post.userId.firstName,
            lastName: post.userId.lastName,
            userName: post.userId.userName,
            profileImageUrl: post.userId.profileImageUrl,
          }
        : null,
    }));

    res.status(200).json({ success: true, posts: normalizedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

