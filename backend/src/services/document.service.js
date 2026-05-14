import fs from "fs/promises";
import path from "path";

import { PDFParse } from "pdf-parse";

import { analyzeTextWithGroq } from "./groq.service.js";
import { extractTextFromImage } from "./ocr.service.js";

import { getMediaById, updateExtractedText } from "../models/media.model.js";

export const analyzeDocumentByMediaId = async (mediaId) => {
  try {
    /* Fetch media */
    const media = await getMediaById(mediaId);

    if (!media) {
      throw new Error("Media not found");
    }

    /* Validate type */
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
    } else if ([".png", ".jpg", ".jpeg", ".webp", ".bmp"].includes(ext)) {

    /* Image docs / OCR */
      extractedText = await extractTextFromImage(media.storage_path);
    } else {

    /* Unsupported */
      throw new Error(`Unsupported document format for analysis: ${ext}`);
    }

    /* Fallback */
    if (!extractedText || extractedText.trim().length < 3) {
      extractedText = "No readable text extracted.";
    }

    /* PostgreSQL-safe sanitization */
    const cleanedExtractedText = extractedText
      .replace(/\u0000/g, "")
      .replace(/\x00/g, "")
      .trim();

    /* Persist extracted text */
    await updateExtractedText(media.id, cleanedExtractedText);

    /* Groq document intelligence */
    const analysis = await analyzeTextWithGroq(`
You are analyzing a document.

Extracted content:
${cleanedExtractedText}

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
      extractedText: cleanedExtractedText,
      analysis,
    };
  } catch (error) {
    console.error("DOCUMENT ANALYSIS ERROR:", error);

    throw new Error(
      error.message || "Document analysis failed due to unexpected error.",
    );
  }
};
