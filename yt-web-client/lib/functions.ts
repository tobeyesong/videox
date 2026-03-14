import { httpsCallable } from "firebase/functions";
import { functions, isFirebaseConfigured } from "@/lib/firebase";

type GenerateUploadUrlRequest = {
  fileExtension: string;
};

type GenerateUploadUrlResponse = {
  fileName: string;
  url: string;
};

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

const generateUploadUrlFunction = functions
  ? httpsCallable<GenerateUploadUrlRequest, GenerateUploadUrlResponse>(
      functions,
      "generateUploadUrl",
    )
  : null;
const getVideosFunction = functions
  ? httpsCallable<Record<string, never>, Video[]>(functions, "getVideos")
  : null;

export async function uploadVideo(file: File) {
  if (!isFirebaseConfigured || !generateUploadUrlFunction) {
    throw new Error("Firebase functions is not initialized.");
  }

  const fileExtension = file.name.split(".").pop();
  if (!fileExtension) {
    throw new Error("Selected file must include a file extension.");
  }

  const response = await generateUploadUrlFunction({ fileExtension });
  const uploadResult = await fetch(response.data.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (!uploadResult.ok) {
    throw new Error(`Upload failed with status ${uploadResult.status}.`);
  }

  return {
    fileName: response.data.fileName,
    status: uploadResult.status,
  };
}

export async function getVideos() {
  if (!isFirebaseConfigured || !getVideosFunction) {
    throw new Error("Firebase functions is not initialized.");
  }

  const response = await getVideosFunction({});
  return response.data;
}
