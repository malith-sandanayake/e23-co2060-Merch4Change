import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);

export default router;
