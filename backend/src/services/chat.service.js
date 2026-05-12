import { getConversationMessages } from "../models/message.model.js";
import { getMediaByConversation } from "../models/media.model.js";

import { analyzeTextWithGroq } from "./groq.service.js";

export const generateConversationResponse = async (
  conversationId,
  userPrompt,
) => {
  /* Past chat history */
  const messages = await getConversationMessages(conversationId);

  /* Uploaded media */
const media = await getMediaByConversation(conversationId);


  /* Build message history context */
  const messageContext =
    messages.length > 0
      ? messages
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join("\n")
      : "No prior conversation history.";

  /* Deep media intelligence injection */
  const mediaContext =
    media.length > 0
      ? media
          .map((file, index) => {
            const extractedText =
              file.extracted_text && file.extracted_text.trim().length > 0
                ? file.extracted_text.slice(0, 4000)
                : "No extracted text available yet.";

            return `
MEDIA ${index + 1}:
File Name: ${file.original_name}
Type: ${file.file_type}
MIME: ${file.mime_type}
Uploaded At: ${file.created_at}

Extracted Intelligence:
${extractedText}
              `.trim();
          })
          .join("\n\n-------------------\n\n")
      : "No uploaded media found.";

  /* Master multimodal prompt */
  const fullPrompt = `
You are a persistent multimodal AI assistant with long-term conversation memory.

Conversation History:
${messageContext}

Uploaded Media Intelligence:
${mediaContext}

Current User Request:
${userPrompt}

Instructions:
1. Use prior conversation history
2. Use uploaded media deeply, including extracted text
3. If documents exist, summarize actual content
4. If images/videos/audio exist, reference prior extracted insights when available
5. If media lacks extracted text, clearly state limitation
6. Answer contextually like ChatGPT memory
7. Avoid hallucination
8. Be concise, accurate, and insightful
`;

  /* Generate contextual AI response */
  const aiResponse = await analyzeTextWithGroq(fullPrompt);

  return aiResponse;
};
