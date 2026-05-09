import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";

const allowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"],
  video: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"],
  audio: ["audio/mpeg", "audio/wav", "audio/flac", "audio/ogg", "audio/mp4"],
  document: ["application/pdf", "text/plain"],
};

export const detectFileCategory = (mime) => {
  for (const category in allowedMimeTypes) {
    if (allowedMimeTypes[category].includes(mime)) {
      return category;
    }
  }

  return null;
};

export const validateFile = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  const detectedType = await fileTypeFromBuffer(fileBuffer);

  if (!detectedType) {
    throw new Error("Unable to detect file type");
  }

  const category = detectFileCategory(detectedType.mime);

  if (!category) {
    throw new Error("Unsupported or invalid file type");
  }

  return {
    mimeType: detectedType.mime,
    extension: detectedType.ext,
    fileType: category,
  };
};
