"use client";

import { ChangeEvent, useId, useState } from "react";
import { uploadVideo } from "@/lib/functions";

export default function Upload() {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    event.target.value = "";

    if (file) {
      void handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadVideo(file);
      window.alert(
        `File uploaded successfully.\n\nFile name: ${response.fileName}\nStatus: ${response.status}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      window.alert(`Failed to upload file: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        id={inputId}
        className="hidden"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label
        htmlFor={inputId}
        aria-disabled={isUploading}
        title={isUploading ? "Uploading video..." : "Upload video"}
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 transition",
          isUploading
            ? "cursor-wait bg-zinc-100 text-zinc-400"
            : "cursor-pointer text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        ].join(" ")}
      >
        <span className="sr-only">{isUploading ? "Uploading video" : "Upload video"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
          />
        </svg>
      </label>
    </>
  );
}
