import fs from "fs/promises";
import path from "path";

import { PDFParse } from "pdf-parse";

import { analyzeTextWithGroq } from "./groq.service.js";
import { extractTextFromImage } from "./ocr.service.js";

import { getMediaById } from "../models/media.model.js";

export const analyzeDocumentByMediaId = async (mediaId) => {
  try {
    const media = await getMediaById(mediaId);

    if (!media) {
      throw new Error("Media not found");
    }

    if (media.file_type !== "document" && media.file_type !== "image") {
      throw new Error("Selected media is not document-compatible");
    }

    let extractedText = "";

    const ext = path.extname(media.storage_path).toLowerCase();

    /* PDF */
    if (ext === ".pdf") {
      const pdfBuffer = await fs.readFile(media.storage_path);

      const parser = new PDFParse({
        data: pdfBuffer,
      });

      const pdfData = await parser.getText();

      extractedText = pdfData.text;
    } else if (ext === ".txt") {
      /* TXT */
      extractedText = await fs.readFile(media.storage_path, "utf-8");
    } else {
      /* Scanned image / handwriting / image docs */
      extractedText = await extractTextFromImage(media.storage_path);
    }

    if (!extractedText || extractedText.trim().length < 3) {
      extractedText = "No readable text extracted.";
    }

    /* Groq Document Analysis */
    const analysis = await analyzeTextWithGroq(`
You are analyzing a document.

Extracted content:
${extractedText}

Provide:
1. Executive summary
2. Main sections/topics
3. Important points
4. Key entities/details
5. Actionable insights
6. If resume: candidate summary
7. If report: business summary
`);

    return {
      media,
      extractedText,
      analysis,
    };
  } catch (error) {
    console.error("DOCUMENT ANALYSIS ERROR:", error);

    throw new Error(
      error.message || "Document analysis failed due to unexpected error.",
    );
  }
};
