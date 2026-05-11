import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

export const analyzeImageWithGemini = async (
  imagePath,
  mimeType,
  prompt = "Analyze this image in detail. Extract visible text, describe objects, detect charts/tables if present, and summarize key insights.",
) => {
  try {
    const imageBuffer = await fs.readFile(imagePath);

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    let quotaExceeded = false;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent([prompt, imagePart]);

        return result.response.text();
      } catch (error) {
        if (error.status === 429) {
          console.warn(`Quota exceeded for ${modelName}`);
          quotaExceeded = true;
          continue;
        }

        throw error;
      }
    }

    if (quotaExceeded) {
      throw new Error(
        "AI daily quota reached. Please try again later or upgrade Gemini API.",
      );
    }

    throw new Error("Image analysis failed.");
  } catch (error) {
    throw new Error(
      error.message || "Image analysis failed due to unexpected error.",
    );
  }
};
