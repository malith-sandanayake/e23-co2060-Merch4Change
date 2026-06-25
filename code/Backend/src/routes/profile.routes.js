import { Router } from "express";

import { me, getMyCoins, updateMe, getProfileByUsername, followUser, unfollowUser } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/me", protect, me);
router.get("/me/coins", protect, getMyCoins);
router.put("/me", protect, updateMe);
router.get("/:username", protect, getProfileByUsername);
router.post("/:username/follow", protect, followUser);
router.post("/:username/unfollow", protect, unfollowUser);



export default router;
