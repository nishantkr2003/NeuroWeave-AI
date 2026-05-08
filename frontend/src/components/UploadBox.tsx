"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
} from "lucide-react";

export default function UploadBox() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Uploaded Files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
            {isDragActive
              ? "Drop your files here..."
              : "Drag & Drop or Click to Upload"}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Supports Images, Videos, Audio, PDFs, Notes, Charts
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
