import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const firestore = getFirestore();

export const createUser = functions
  .region("us-central1")
  .auth.user()
  .onCreate(async (user) => {
    const userInfo = {
      uid: user.uid,
      email: user.email ?? null,
      photoUrl: user.photoURL ?? null,
    };

    await firestore.collection("users").doc(user.uid).set(userInfo, { merge: true });
    logger.info("User created in Firestore.", userInfo);
  });
