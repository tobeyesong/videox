import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let authInstance: Auth | null = null;
let providerInstance: GoogleAuthProvider | null = null;

function getFirebaseApp() {
  if (!isFirebaseConfigured) {
    return null;
  }

  return getApps().length
    ? getApp()
    : initializeApp(firebaseConfig as Record<string, string>);
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  authInstance = getAuth(app);
  return authInstance;
}

export function getGoogleProvider() {
  if (providerInstance) {
    return providerInstance;
  }

  providerInstance = new GoogleAuthProvider();
  providerInstance.setCustomParameters({
    prompt: "select_account",
  });

  return providerInstance;
}
