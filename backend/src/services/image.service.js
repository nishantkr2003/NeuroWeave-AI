// import { analyzeImageWithGemini } from "./gemini.service.js";
// import { getMediaById } from "../models/media.model.js";

// export const analyzeImageByMediaId = async (mediaId, customPrompt = null) => {
//   const media = await getMediaById(mediaId);

//   if (!media) {
//     throw new Error("Media not found");
//   }

//   if (media.file_type !== "image") {
//     throw new Error("Selected media is not an image");
//   }

//   const analysis = await analyzeImageWithGemini(
//     media.storage_path,
//     media.mime_type,
//     customPrompt ||
//       "Analyze this image in detail. Include OCR text, scene understanding, chart/table detection, and useful structured insights.",
//   );

//   return {
//     media,
//     analysis,
//   };
// };

import { analyzeImageWithGroq } from "./groq.service.js";
import { getMediaById } from "../models/media.model.js";

export const analyzeImageByMediaId = async (mediaId, customPrompt = null) => {
  const media = await getMediaById(mediaId);

  if (!media) {
    throw new Error("Media not found");
  }

  if (media.file_type !== "image") {
    throw new Error("Selected media is not an image");
  }

  const analysis = await analyzeImageWithGroq(
    media.storage_path,
    media.mime_type,
    customPrompt ||
      "Analyze this image in detail. Include OCR text, scene understanding, chart/table detection, and useful structured insights.",
  );

  return {
    media,
    analysis,
  };
};