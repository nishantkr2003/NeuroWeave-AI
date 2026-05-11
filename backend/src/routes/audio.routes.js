import express from "express";

import { analyzeAudio } from "../controllers/audio.controller.js";

const router = express.Router();

/* Analyze uploaded audio */
router.post("/", analyzeAudio);

export default router;
