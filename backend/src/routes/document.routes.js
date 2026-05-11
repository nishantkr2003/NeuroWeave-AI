import express from "express";

import { analyzeDocument } from "../controllers/document.controller.js";

const router = express.Router();

/* Analyze uploaded document */
router.post("/", analyzeDocument);

export default router;
