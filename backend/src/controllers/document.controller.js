import { verifyToken } from "@clerk/backend";

import { analyzeDocumentByMediaId } from "../services/document.service.js";

export const analyzeDocument = async (req, res, next) => {
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

    const { media_id } = req.body;

    if (!media_id) {
      return res.status(400).json({
        success: false,
        message: "media_id is required",
      });
    }

    const result = await analyzeDocumentByMediaId(media_id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
