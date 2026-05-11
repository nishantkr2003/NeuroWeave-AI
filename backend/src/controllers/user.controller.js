import { verifyToken, createClerkClient } from "@clerk/backend";
import { createUser } from "../models/user.model.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

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

    if (!token || token.split(".").length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT format",
      });
    }

    // Verify JWT
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Fetch Clerk user
    const clerkUser = await clerkClient.users.getUser(payload.sub);

    const userData = {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      full_name:
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      profile_image: clerkUser.imageUrl || null,
    };

    const user = await createUser(userData);

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      user,
    });
  } catch (error) {
    console.error("SYNC ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
