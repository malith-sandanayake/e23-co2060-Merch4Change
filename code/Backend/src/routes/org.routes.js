import { Router } from "express";
import { getOrgProfileByUsername, addProject } from "../controllers/org.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/profile/:username", getOrgProfileByUsername);
router.post("/projects", protect, addProject);

export default router;
