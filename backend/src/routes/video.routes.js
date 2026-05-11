import express from "express";

import { analyzeVideo } from "../controllers/video.controller.js";

const router = express.Router();

/* Analyze uploaded video */
router.post("/", analyzeVideo);

export default router;
