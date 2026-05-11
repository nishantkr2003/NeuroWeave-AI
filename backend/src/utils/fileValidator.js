import fs from "fs/promises";
import path from "path";

import { fileTypeFromBuffer } from "file-type";

const allowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"],
  video: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"],
  audio: ["audio/mpeg", "audio/wav", "audio/flac", "audio/ogg", "audio/mp4"],
  document: [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const extensionMap = {
  ".pdf": {
    mime: "application/pdf",
    ext: "pdf",
    fileType: "document",
  },
  ".txt": {
    mime: "text/plain",
    ext: "txt",
    fileType: "document",
  },
  ".docx": {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "docx",
    fileType: "document",
  },
};

export const detectFileCategory = (mime) => {
  for (const category in allowedMimeTypes) {
    if (allowedMimeTypes[category].includes(mime)) {
      return category;
    }
  }

  return null;
};

export const validateFile = async (filePath, originalName = "") => {
  const fileBuffer = await fs.readFile(filePath);

  let detectedType = await fileTypeFromBuffer(fileBuffer);

  /* Fallback for text/docs */
  if (!detectedType) {
    const ext = path.extname(originalName || filePath).toLowerCase();

    if (extensionMap[ext]) {
      return {
        mimeType: extensionMap[ext].mime,
        extension: extensionMap[ext].ext,
        fileType: extensionMap[ext].fileType,
      };
    }

    throw new Error("Unable to detect file type");
  }

  const category = detectFileCategory(detectedType.mime);

  if (!category) {
    const ext = path.extname(originalName || filePath).toLowerCase();

    if (extensionMap[ext]) {
      return {
        mimeType: extensionMap[ext].mime,
        extension: extensionMap[ext].ext,
        fileType: extensionMap[ext].fileType,
      };
    }

    throw new Error("Unsupported or invalid file type");
  }

  return {
    mimeType: detectedType.mime,
    extension: detectedType.ext,
    fileType: category,
  };
};
