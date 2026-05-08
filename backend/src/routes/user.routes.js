import express from "express";
import { syncUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Sync Clerk user to Neon DB */
router.post("/sync", syncUser);

export default router;
