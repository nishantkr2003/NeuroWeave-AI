// import { verifyToken } from "@clerk/backend";
// import { analyzeImageByMediaId } from "../services/image.service.js";

// export const analyzeImage = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     console.log("TOKEN RECEIVED:", token);

//     const payload = await verifyToken(token, {
//       secretKey: process.env.CLERK_SECRET_KEY,
//     });

//     console.log("PAYLOAD:", payload);

//     const { media_id, prompt } = req.body;

//     console.log("BODY:", req.body);

//     if (!media_id) {
//       return res.status(400).json({
//         success: false,
//         message: "media_id is required",
//       });
//     }

//     const result = await analyzeImageByMediaId(media_id, prompt);

//     return res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     console.error("IMAGE ANALYSIS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import { verifyToken } from "@clerk/backend";
import { analyzeImageByMediaId } from "../services/image.service.js";

export const analyzeImage = async (req, res) => {
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

    const { media_id, prompt } = req.body;

    if (!media_id) {
      return res.status(400).json({
        success: false,
        message: "media_id is required",
      });
    }

    const result = await analyzeImageByMediaId(media_id, prompt);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("IMAGE ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image analysis failed",
    });
  }
};