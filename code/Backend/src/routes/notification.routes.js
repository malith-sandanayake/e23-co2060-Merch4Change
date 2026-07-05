import { Router } from "express";
import protect from "../middlewares/auth.js";
import {
  listNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", protect, listNotifications);
router.patch("/:id/read", protect, markNotificationRead);

export default router;
