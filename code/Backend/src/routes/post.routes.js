import express from "express";
import protect from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { createPost, deletePost, getFeedPosts, getMyPosts, getUserPosts, likePost, commentOnPost } from "../controllers/post.controller.js";

const router = express.Router();

// create a post with up to 5 images (field name: "images")
router.post("/", protect, upload.array("images", 5), createPost);

// get feed posts
router.get("/", protect, getFeedPosts);

// get the authenticated user's posts for the profile page
router.get("/me", protect, getMyPosts);

// get a specific user's posts
router.get("/user/:username", protect, getUserPosts);

// delete a post owned by the authenticated user
router.delete("/:postId", protect, deletePost);

// like/unlike a post
router.post("/:postId/like", protect, likePost);

// comment on a post
router.post("/:postId/comment", protect, commentOnPost);

export default router;
