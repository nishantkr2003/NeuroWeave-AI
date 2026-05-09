import express from "express";

import { analyzeImage } from "../controllers/image.controller.js";

const router = express.Router();

/* Analyze uploaded image by media ID */
router.post("/", analyzeImage);

export default router;
