import express from "express";

import {
  createNewConversation,
  fetchUserConversations,
  fetchConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

/* Create new conversation */
router.post("/", createNewConversation);

/* Get all user conversations */
router.get("/", fetchUserConversations);

/* Get single conversation */
router.get("/:id", fetchConversation);

export default router;
