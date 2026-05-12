import express from "express";

import {
  sendMessage,
  fetchMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

/* Save new user message */
router.post("/", sendMessage);

/* Get conversation messages */
router.get("/:conversationId", fetchMessages);

export default router;
