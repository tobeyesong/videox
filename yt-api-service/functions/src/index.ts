import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const firestore = getFirestore();

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
