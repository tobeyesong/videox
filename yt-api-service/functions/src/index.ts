import { Storage } from "@google-cloud/storage";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const firestore = getFirestore();
const storage = new Storage();

const rawVideoBucketName = process.env.RAW_VIDEO_BUCKET || "tpl-raw-videos";
const fileExtensionPattern = /^[a-z0-9]+$/i;

/**
 * Firebase Auth user lifecycle events are still supported through v1 auth triggers.
 * Keep this as v1 until Firebase provides a v2 onCreate/onDelete equivalent.
 */
export const createUser = functions
  .region("us-west1")
  .auth.user()
  .onCreate(async (user) => {
    const userInfo = {
      uid: user.uid,
      email: user.email ?? null,
      photoUrl: user.photoURL ?? null,
      displayName: user.displayName ?? null,
    };

    try {
      await firestore.collection("users").doc(user.uid).set(userInfo, { merge: true });
      logger.info("createUser write succeeded", { uid: user.uid });
    } catch (error) {
      logger.error("createUser write failed", {
        uid: user.uid,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });

export const generateUploadUrl = onCall(
  {
    maxInstances: 1,
    region: "us-west1",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "failed-precondition",
        "The function must be called while authenticated.",
      );
    }

    const requestData =
      typeof request.data === "object" && request.data !== null
        ? (request.data as { fileExtension?: unknown })
        : {};
    const { fileExtension } = requestData;
    if (typeof fileExtension !== "string" || !fileExtensionPattern.test(fileExtension)) {
      throw new HttpsError(
        "invalid-argument",
        "A valid fileExtension is required.",
      );
    }

    const normalizedFileExtension = fileExtension.toLowerCase();
    const fileName = `${request.auth.uid}-${Date.now()}.${normalizedFileExtension}`;
    const bucket = storage.bucket(rawVideoBucketName);
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
    });

    logger.info("generateUploadUrl succeeded", {
      uid: request.auth.uid,
      bucket: rawVideoBucketName,
      fileName,
    });

    return { url, fileName };
  },
);
