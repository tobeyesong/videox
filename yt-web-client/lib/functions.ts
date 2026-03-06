import { getFunctions, httpsCallable } from "firebase/functions";
import { app, isFirebaseConfigured } from "@/lib/firebase";

type GenerateUploadUrlRequest = {
  fileExtension: string;
};

type GenerateUploadUrlResponse = {
  fileName: string;
  url: string;
};

const functions = app ? getFunctions(app, "us-west1") : null;
const generateUploadUrlFunction = functions
  ? httpsCallable<GenerateUploadUrlRequest, GenerateUploadUrlResponse>(
      functions,
      "generateUploadUrl",
    )
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
