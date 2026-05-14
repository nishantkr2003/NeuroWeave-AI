import { verifyToken } from "@clerk/backend";

import { processUploadedFile } from "../services/upload.service.js";
import { getUserByClerkId } from "../models/user.model.js";
import { getConversationById } from "../models/conversation.model.js";

export const uploadFile = async (req, res) => {
  try {
    /* Extract auth header */
    const authHeader = req.headers.authorization;

    /* Ensure Bearer token exists */
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* Parse token */
    const token = authHeader.split(" ")[1];

    /* Basic JWT format validation */
    if (!token || token.split(".").length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT format",
      });
    }

    /* Verify Clerk token */
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    /* Ensure valid Clerk user */
    if (!payload?.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    /* Map Clerk user → Neon DB user */
    const dbUser = await getUserByClerkId(payload.sub);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    /* Optional conversation linking */
    const { conversation_id = null } = req.body;

    /* If conversation provided, verify ownership */
    if (conversation_id) {
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
          message: "You do not own this conversation",
        });
      }
    }

    /* Ensure file exists */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    /* Process upload + persist media */
    const media = await processUploadedFile({
      file: req.file,
      userId: dbUser.id,
      conversationId: conversation_id,
    });

    /* Success response */
    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      media,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
