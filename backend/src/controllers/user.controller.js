import { verifyToken } from "@clerk/backend";
import { createUser } from "../models/user.model.js";

export const syncUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
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

    const userData = {
      clerk_id: payload.sub,
      email: payload.email || "",
      full_name:
        `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
      profile_image: payload.image_url || null,
    };

    const user = await createUser(userData);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("SYNC ERROR:", error);
    next(error);
  }
};
