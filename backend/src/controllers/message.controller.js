import { verifyToken } from "@clerk/backend";

import { generateConversationResponse } from "../services/chat.service.js";

import {
  createMessage,
  getConversationMessages,
} from "../models/message.model.js";

import { getConversationById } from "../models/conversation.model.js";

import { getUserByClerkId } from "../models/user.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const dbUser = await getUserByClerkId(payload.sub);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { conversation_id, content, media_id = null } = req.body;

    if (!conversation_id || !content) {
      return res.status(400).json({
        success: false,
        message: "conversation_id and content are required",
      });
    }

    const conversation = await getConversationById(conversation_id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (conversation.user_id !== dbUser.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    /* Save user message */
    const userMessage = await createMessage({
      conversation_id,
      media_id,
      role: "user",
      content,
    });

    /* Generate contextual AI response */
    const aiReply = await generateConversationResponse(
      conversation_id,
      content,
    );

    /* Save assistant reply */
    const assistantMessage = await createMessage({
      conversation_id,
      media_id: null,
      role: "assistant",
      content: aiReply,
    });

    res.status(201).json({
      success: true,
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchMessages = async (req, res, next) => {
  try {
    const messages = await getConversationMessages(req.params.conversationId);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};
