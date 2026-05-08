import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Multi-Modal AI Assistant Backend Running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
