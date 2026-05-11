// import path from "path";
// import fs from "fs";

// import ffmpeg from "./ffmpeg.service.js";

// import { getMediaById } from "../models/media.model.js";
// import { analyzeImageWithGroq } from "./groq.service.js";
// export const analyzeVideoByMediaId = async (mediaId) => {
//   const media = await getMediaById(mediaId);

//   if (!media) {
//     throw new Error("Media not found");
//   }

//   if (media.file_type !== "video") {
//     throw new Error("Selected media is not a video");
//   }

//   const outputDir = path.join("frames", media.id);

//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   /* Metadata */
//   const metadata = await new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(media.storage_path, (err, data) => {
//       if (err) reject(err);
//       else resolve(data);
//     });
//   });

//   /* Extract frames every 5 seconds */
//   await new Promise((resolve, reject) => {
//     ffmpeg(media.storage_path)
//       .output(path.join(outputDir, "frame-%03d.jpg"))
//       .outputOptions(["-vf fps=1/5"])
//       .on("end", resolve)
//       .on("error", reject)
//       .run();
//   });

//   const extractedFrames = fs
//     .readdirSync(outputDir)
//     .map((file) => path.join(outputDir, file));

//   return {
//     media,
//     metadata,
//     frames: extractedFrames,
//   };
// };

import path from "path";
import fs from "fs";

import ffmpeg from "./ffmpeg.service.js";

import { getMediaById } from "../models/media.model.js";
import { analyzeImageWithGroq } from "./groq.service.js";

export const analyzeVideoByMediaId = async (mediaId) => {
  const media = await getMediaById(mediaId);

  if (!media) {
    throw new Error("Media not found");
  }

  if (media.file_type !== "video") {
    throw new Error("Selected media is not a video");
  }

  const outputDir = path.join("frames", media.id);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  /* Metadata */
  const metadata = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(media.storage_path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  /* Extract frames every 5 seconds */
  await new Promise((resolve, reject) => {
    ffmpeg(media.storage_path)
      .output(path.join(outputDir, "frame-%03d.jpg"))
      .outputOptions(["-vf fps=1/5"])
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  /* Get extracted frames */
  const extractedFrames = fs
    .readdirSync(outputDir)
    .map((file) => path.join(outputDir, file));

  /* Analyze first 10 frames using Groq */
  const frameAnalyses = [];

  for (const framePath of extractedFrames.slice(0, 10)) {
    try {
      const analysis = await analyzeImageWithGroq(
        framePath,
        "image/jpeg",
        "Describe this video frame in detail. Identify scene context, actions, objects, people, environment, and important events.",
      );

      frameAnalyses.push({
        frame: framePath,
        analysis,
      });
    } catch (error) {
      console.error(`Frame analysis failed for ${framePath}:`, error);

      frameAnalyses.push({
        frame: framePath,
        analysis: "Frame analysis failed",
      });
    }
  }

  /* Combine all frame analyses into video-level context */
  const combinedFrameContext = frameAnalyses
    .map((frame, index) => `Frame ${index + 1}: ${frame.analysis}`)
    .join("\n\n");

  /* Generate overall video summary */
  let overallSummary = "Video summary generation failed";

  try {
    overallSummary = await analyzeImageWithGroq(
      extractedFrames[0],
      "image/jpeg",
      `
You are analyzing a sequence of frames from a video.

Frame-by-frame observations:
${combinedFrameContext}

Based on all frames:
1. Summarize the overall video
2. Identify major scenes
3. Describe likely story progression
4. Highlight key moments
5. Provide a concise scene-by-scene breakdown
`,
    );
  } catch (error) {
    console.error("Overall video summary failed:", error);
  }

  return {
    media,
    metadata,
    frames: extractedFrames,
    frameAnalyses,
    overallSummary,
  };
};