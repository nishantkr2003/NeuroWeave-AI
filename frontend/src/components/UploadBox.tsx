"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";

import useChatStore from "@/store/chatStore";

import {
  UploadCloud,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
} from "lucide-react";

export default function UploadBox() {
  const { getToken, isSignedIn } = useAuth();

  const [uploading, setUploading] = useState(false);

  const { addMessage, activeConversationId } = useChatStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        /* Auth check */
        if (!isSignedIn) {
          alert("Please sign in first");
          return;
        }

        /* Active chat required */
        if (!activeConversationId) {
          alert("No active conversation found.");
          return;
        }

        const file = acceptedFiles[0];

        if (!file) return;

        setUploading(true);

        /* Clerk token */
        const token = await getToken({
          template: "neon",
        });

        if (!token) {
          throw new Error("Authentication failed");
        }

        /* Upload with conversation_id */
        const formData = new FormData();

        formData.append("file", file);

        formData.append("conversation_id", activeConversationId);

        /* Upload file */
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Upload failed");
        }

        const media = data.media;

        /* User upload message */
        addMessage({
          role: "user",
          content: `Uploaded: ${media.original_name}`,
        });

        /* Processing state */
        addMessage({
          role: "assistant",
          content: `Processing ${media.file_type}...`,
        });

        /* Auto route analysis */
        let analysisEndpoint = "";

        if (media.file_type === "image") {
          analysisEndpoint = "/api/analyze/image";
        } else if (media.file_type === "video") {
          analysisEndpoint = "/api/analyze/video";
        } else if (media.file_type === "audio") {
          analysisEndpoint = "/api/analyze/audio";
        } else if (media.file_type === "document") {
          analysisEndpoint = "/api/analyze/document";
        }

        /* Run analysis if supported */
        if (analysisEndpoint) {
          const analysisResponse = await fetch(
            `http://localhost:5000${analysisEndpoint}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                media_id: media.id,
              }),
            },
          );

          const analysisData = await analysisResponse.json();

          if (analysisResponse.ok) {
            const finalAnalysis =
              analysisData.analysis ||
              analysisData.summary ||
              analysisData.overallSummary ||
              "Analysis completed successfully.";

            addMessage({
              role: "assistant",
              content: finalAnalysis,
            });
          } else {
            addMessage({
              role: "assistant",
              content:
                analysisData.message ||
                `${media.file_type} uploaded, but analysis failed.`,
            });
          }
        } else {
          addMessage({
            role: "assistant",
            content: `Uploaded ${media.file_type} successfully.`,
          });
        }
      } catch (error: any) {
        console.error(error);

        alert(error.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [getToken, isSignedIn, addMessage, activeConversationId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-card border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? "border-indigo-400 bg-indigo-500/10"
          : "border-white/10 hover:border-indigo-400"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-2xl bg-indigo-500/10">
          <UploadCloud size={42} className="text-indigo-400" />
        </div>

        <div>
          <p className="text-lg font-semibold">
            {uploading
              ? "Uploading & analyzing..."
              : isDragActive
                ? "Drop your file here..."
                : "Drag & Drop or Click to Upload"}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Upload once, then ask anything
          </p>
        </div>

        <div className="flex gap-4 text-gray-400 mt-2 flex-wrap justify-center">
          <FileImage size={18} />
          <FileVideo size={18} />
          <FileAudio size={18} />
          <FileText size={18} />
        </div>
      </div>
    </div>
  );
}
