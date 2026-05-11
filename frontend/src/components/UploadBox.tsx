"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";
import { useChatStore } from "@/store/chatStore";

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
  const { addMessage } = useChatStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (!isSignedIn) {
          alert("Please sign in first");
          return;
        }

        const file = acceptedFiles[0];

        if (!file) return;

        setUploading(true);

        const token = await getToken({
          template: "neon",
        });

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        console.log("UPLOAD RESPONSE:", data);

        if (!response.ok) {
          throw new Error(data.message || "Upload failed");
        }

        const media = data.media;

        addMessage({
          role: "user",
          content: `Uploaded: ${media.original_name}`,
        });

        /* IMAGE ANALYSIS */
        if (media.file_type === "image") {
          const analysisResponse = await fetch(
            "http://localhost:5000/api/analyze/image",
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
            addMessage({
              role: "assistant",
              content: analysisData.analysis,
            });
          } else {
            addMessage({
              role: "assistant",
              content:
                analysisData.message ||
                "Image uploaded successfully, but AI analysis is temporarily unavailable.",
            });
          }
        } else if (media.file_type === "video") {
          /* VIDEO ANALYSIS */
          addMessage({
            role: "assistant",
            content:
              "Processing video... extracting frames and analyzing scenes.",
          });

          const videoResponse = await fetch(
            "http://localhost:5000/api/analyze/video",
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

          const videoData = await videoResponse.json();

          if (videoResponse.ok) {
            addMessage({
              role: "assistant",
              content:
                videoData.overallSummary ||
                "Video processed successfully, but summary unavailable.",
            });
          } else {
            addMessage({
              role: "assistant",
              content:
                videoData.message || "Video uploaded, but analysis failed.",
            });
          }
        } else if (media.file_type === "audio") {
          addMessage({
            role: "assistant",
            content: "Processing audio... transcribing and analyzing.",
          });

          const audioResponse = await fetch(
            "http://localhost:5000/api/analyze/audio",
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

          const audioData = await audioResponse.json();

          if (audioResponse.ok) {
            addMessage({
              role: "assistant",
              content: audioData.summary,
            });
          } else {
            addMessage({
              role: "assistant",
              content: "Audio uploaded, but analysis failed.",
            });
          }
        } else if (media.file_type === "document") {
          addMessage({
            role: "assistant",
            content: "Processing document... extracting text and analyzing.",
          });

          const documentResponse = await fetch(
            "http://localhost:5000/api/analyze/document",
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

          const documentData = await documentResponse.json();

          if (documentResponse.ok) {
            addMessage({
              role: "assistant",
              content: documentData.analysis,
            });
          } else {
            addMessage({
              role: "assistant",
              content: "Document uploaded, but analysis failed.",
            });
          }
        } else {
          /* OTHER FILE TYPES */
          addMessage({
            role: "assistant",
            content: `Uploaded ${media.file_type} successfully. Analysis pipeline coming next.`,
          });
        }
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      } finally {
        setUploading(false);
      }
    },
    [getToken, isSignedIn, addMessage],
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
              ? "Uploading..."
              : isDragActive
                ? "Drop your file here..."
                : "Drag & Drop or Click to Upload"}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Supports Images, Videos, Audio, PDFs
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
