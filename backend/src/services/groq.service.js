import fs from "fs/promises";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* IMAGE ANALYSIS */
export const analyzeImageWithGroq = async (
  imagePath,
  mimeType,
  prompt = "Analyze this image in detail. Extract visible text, describe objects, detect charts/tables if present, and summarize key insights.",
) => {
  try {
    const imageBuffer = await fs.readFile(imagePath);

    const base64Image = imageBuffer.toString("base64");

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    return (
      completion.choices?.[0]?.message?.content || "No analysis generated."
    );
  } catch (error) {
    console.error("GROQ IMAGE ANALYSIS ERROR:", error);

    if (error.status === 429) {
      throw new Error(
        "Groq API rate limit exceeded. Please wait and try again.",
      );
    }

    throw new Error(
      error.message || "Image analysis failed due to unexpected error.",
    );
  }
};

/* TEXT ANALYSIS */
export const analyzeTextWithGroq = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    return (
      completion.choices?.[0]?.message?.content || "No analysis generated."
    );
  } catch (error) {
    console.error("GROQ TEXT ANALYSIS ERROR:", error);

    if (error.status === 429) {
      throw new Error(
        "Groq API rate limit exceeded. Please wait and try again.",
      );
    }

    throw new Error(
      error.message || "Text analysis failed due to unexpected error.",
    );
  }
};
