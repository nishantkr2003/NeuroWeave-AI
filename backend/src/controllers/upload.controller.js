import { verifyToken } from "@clerk/backend";

import { processUploadedFile } from "../services/upload.service.js";
import { getUserByClerkId } from "../models/user.model.js";

export const uploadFile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token.split(".").length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT format",
      });
    }

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
        message: "User not found in database",
      });
    }

    const media = await processUploadedFile({
      file: req.file,
      userId: dbUser.id,
      conversationId: req.body.conversation_id || null,
    });

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
