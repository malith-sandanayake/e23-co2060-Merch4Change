import express from "express";
import protect from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { createPost, getFeedPosts, getMyPosts } from "../controllers/post.controller.js";

const router = express.Router();

// create a post with up to 5 images (field name: "images")
router.post("/", protect, upload.array("images", 5), createPost);

// get feed posts
router.get("/", protect, getFeedPosts);

// get the authenticated user's posts for the profile page
router.get("/me", protect, getMyPosts);

export default router;

