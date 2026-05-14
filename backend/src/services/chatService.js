import { getConversationMessages } from "../models/message.model.js";
import { getMediaByConversation } from "../models/media.model.js";

import { analyzeTextWithGroq } from "./groq.service.js";

export const generateConversationResponse = async (
  conversationId,
  userPrompt,
) => {
  /* Full message history */
  const messages = await getConversationMessages(conversationId);

  /* All uploaded media */
  const allMedia = await getMediaByConversation(conversationId);

  /* Deduplicate by original filename
       Prioritize:
       1. extracted_text exists
       2. longest extracted_text
       3. newest useful upload
    */
  const mediaMap = new Map();

  for (const file of allMedia) {
    const existing = mediaMap.get(file.original_name);

    const currentScore = file.extracted_text
      ? file.extracted_text.trim().length
      : 0;

    const existingScore = existing?.extracted_text
      ? existing.extracted_text.trim().length
      : 0;

    if (!existing || currentScore > existingScore) {
      mediaMap.set(file.original_name, file);
    }
  }

  const media = Array.from(mediaMap.values());

  /* Message context */
  const messageContext =
    messages.length > 0
      ? messages
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join("\n")
      : "No prior conversation history.";

  /* Smart media context */
  const mediaContext =
    media.length > 0
      ? media
          .map((file, index) => {
            const extracted =
              file.extracted_text && file.extracted_text.trim().length > 0
                ? file.extracted_text.slice(0, 8000)
                : "No extracted intelligence available.";

            return `
MEDIA ${index + 1}
File Name: ${file.original_name}
Type: ${file.file_type}
Uploaded At: ${file.created_at}

Intelligence:
${extracted}
                `.trim();
          })
          .join("\n\n====================\n\n")
      : "No uploaded media found.";

  /* Unified master prompt */
  const fullPrompt = `
You are a persistent multimodal AI assistant with ChatGPT-style memory.

Conversation History:
${messageContext}

Uploaded Media Intelligence:
${mediaContext}

Current User Request:
${userPrompt}

Core Behavior:
1. Answer using uploaded file intelligence first when relevant
2. Use prior conversation memory
3. Deduplicate repeated uploads
4. If multiple files exist, compare them intelligently
5. If extracted intelligence exists, NEVER say file lacks context
6. If no extracted text exists, clearly mention limitation
7. Be accurate, contextual, and concise
8. Avoid hallucinations
9. Behave like ChatGPT with persistent multimodal memory
`;

  /* Generate final AI response */
  const aiResponse = await analyzeTextWithGroq(fullPrompt);

  return aiResponse;
};
