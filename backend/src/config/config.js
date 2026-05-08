import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL,

  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,

  geminiApiKey: process.env.GEMINI_API_KEY,
  whisperApiKey: process.env.WHISPER_API_KEY,

  maxImageSize: 20 * 1024 * 1024,
  maxVideoSize: 100 * 1024 * 1024,
  maxAudioSize: 50 * 1024 * 1024,
};
