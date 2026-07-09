import express from "express";
import protect from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { uploadStory, getStories } from "../controllers/story.controller.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadStory);
router.get("/", protect, getStories);

export default router;
