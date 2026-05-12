import Groq from "groq-sdk";
import { transcribeAudio } from "./whisper.service.js";
import { getMediaById } from "../models/media.model.js";
import { updateExtractedText } from "../models/media.model.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeAudioByMediaId = async (mediaId) => {
  try {
    const media = await getMediaById(mediaId);

    if (!media) {
      throw new Error("Media not found");
    }

    if (media.file_type !== "audio") {
      throw new Error("Selected media is not audio");
    }

    /* Step 1: Transcribe audio */
    const transcription = await transcribeAudio(media.storage_path);

    const transcriptText = transcription.text || "No transcription available";

    /* Step 2: Use Groq for transcript analysis */
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: `
You are analyzing an audio transcript:

${transcriptText}

Provide:
1. Summary
2. Main topics
3. Sentiment
4. Action items
5. Important points
`,
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    const summary =
      completion.choices?.[0]?.message?.content || "No analysis generated.";

    return {
      media,
      transcription,
      summary,
    };
  } catch (error) {
    console.error("GROQ AUDIO ANALYSIS ERROR:", error);

    if (error.status === 429) {
      throw new Error(
        "Groq API rate limit exceeded. Please wait and try again.",
      );
    }

    throw new Error(
      error.message || "Audio analysis failed due to unexpected error.",
    );
  }
};
