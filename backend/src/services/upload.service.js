import path from "path";

import { validateFile } from "../utils/fileValidator.js";
import { createMedia } from "../models/media.model.js";

export const processUploadedFile = async ({
  file,
  userId,
  conversationId = null,
}) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  /* Validate real file type using magic bytes */
  const validation = await validateFile(file.path);

  /* File size category limits */
  const sizeLimits = {
    image: 20 * 1024 * 1024,
    video: 100 * 1024 * 1024,
    audio: 50 * 1024 * 1024,
    document: 25 * 1024 * 1024,
  };

  if (file.size > sizeLimits[validation.fileType]) {
    throw new Error(`${validation.fileType} exceeds allowed size limit`);
  }

  /* Save media to DB */
  const media = await createMedia({
    user_id: userId,
    conversation_id: conversationId,
    file_name: path.basename(file.path),
    original_name: file.originalname,
    file_type: validation.fileType,
    mime_type: validation.mimeType,
    file_size: file.size,
    storage_path: file.path,
    metadata: {
      extension: validation.extension,
    },
  });

  return media;
};
