import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    let lastError = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent([prompt, imagePart]);

        const response = await result.response;

        return response.text();
      } catch (error) {
        lastError = error;

        if (error.status === 429) {
          console.warn(`Quota exceeded for ${modelName}, trying next model...`);
          continue;
        }

        throw error;
      }
    }

    // Retry once after delay if all quota exhausted
    if (lastError?.status === 429) {
      console.warn("All Gemini models exhausted. Retrying after 50 seconds...");
      await sleep(50000);

      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
      });

      const retryResult = await fallbackModel.generateContent([
        prompt,
        imagePart,
      ]);

      return retryResult.response.text();
    }

    throw lastError;
  } catch (error) {
    if (error.status === 429) {
      throw new Error(
        "Gemini API quota exceeded. Please wait before retrying or upgrade your API plan.",
      );
    }

    throw new Error(
      error.message || "Image analysis failed due to an unexpected error.",
    );
  }
};
