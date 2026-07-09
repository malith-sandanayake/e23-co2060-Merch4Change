import { Router } from "express";
import { getUserCollections, createCollection, saveStoryToCollection } from "../controllers/storyCollection.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/:username", protect, getUserCollections);
router.post("/", protect, createCollection);
router.put("/:id/save", protect, saveStoryToCollection);

export default router;
