import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "merch4change-backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
