import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { config } from "./config/config.js";
import { connectDB } from "./utils/db.js";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { testDatabaseTables } from "./utils/dbTest.js";
import userRoutes from "./routes/user.routes.js";
import { clerkMiddleware } from "@clerk/express";
import uploadRoutes from "./routes/upload.routes.js";
import imageRoutes from "./routes/image.routes.js";
import videoRoutes from "./routes/video.routes.js";
import audioRoutes from "./routes/audio.routes.js";
import documentRoutes from "./routes/document.routes.js";

const app = express();

/* Fix __dirname in ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Ensure required directories exist */
const requiredDirs = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../thumbnails"),
  path.join(__dirname, "../frames"),
];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* Core Middleware */
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze/image", imageRoutes);
app.use("/api/analyze/video", videoRoutes);
app.use("/api/analyze/audio", audioRoutes);
app.use("/api/analyze/document", documentRoutes);

app.use(clerkMiddleware());

/* Static Media Access */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/thumbnails", express.static(path.join(__dirname, "../thumbnails")));
app.use("/frames", express.static(path.join(__dirname, "../frames")));




/* Routes */
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

/* Root */
app.get("/", (req, res) => {
  res.send("Multi-Modal AI Assistant API is Live");
});

/* Error Middleware */
app.use(errorHandler);

/* Start Server */
const startServer = async () => {
  await connectDB();
  await testDatabaseTables();
  
  app.listen(config.port, () => {
    console.log(
      `Server running in ${config.nodeEnv} mode on port ${config.port}`,
    );
  });
};

startServer();
