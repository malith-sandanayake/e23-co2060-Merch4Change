import { Router } from "express";
import { getOrgProfileByUsername } from "../controllers/org.controller.js";

const router = Router();

router.get("/profile/:username", getOrgProfileByUsername);

export default router;
