"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });

    return () => unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setAuthError("Missing Firebase env vars. Configure NEXT_PUBLIC_FIREBASE_*.");
      return;
    }

    try {
      setIsPending(true);
      setAuthError("");
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-in failed";
      setAuthError(message);
    } finally {
      setIsPending(false);
    }
  }

  async function handleSignOut() {
    if (!auth) {
      setAuthError("Firebase auth is not initialized.");
      return;
    }

    try {
      setIsPending(true);
      setAuthError("");
      await signOut(auth);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-out failed";
      setAuthError(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-xl font-semibold text-zinc-900">
            VideoX
          </Link>
          <Link href="/watch" className="text-sm text-zinc-600 hover:text-zinc-900">
            Watch
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-zinc-700 md:inline">
                {user.displayName ?? user.email ?? "Signed in"}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {isPending ? "Working..." : "Sign out"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isPending}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {isPending ? "Connecting..." : "Sign in with Google"}
            </button>
          )}
        </div>
      </div>

      {authError ? (
        <p className="mx-auto w-full max-w-6xl px-6 pb-3 text-sm text-red-600">{authError}</p>
      ) : null}
    </header>
  );
}
