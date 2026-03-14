"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const videoPrefix = "https://storage.googleapis.com/tpl-processed-videos/";

function WatchContent() {
  const videoSrc = useSearchParams().get("v");

  return (
    <>
      {videoSrc ? (
        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 shadow-sm">
          <video
            controls
            src={videoPrefix + videoSrc}
            className="aspect-video w-full bg-black"
          />
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12">
          <p className="text-sm text-zinc-600">
            Missing video id. Go back to the homepage and select a video.
          </p>
        </div>
      )}
    </>
  );
}

export default function Watch() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl flex-col px-6 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Watch</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">Watch Page</h1>
      <Suspense
        fallback={
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12">
            <p className="text-sm text-zinc-600">Loading video...</p>
          </div>
        }
      >
        <WatchContent />
      </Suspense>
    </main>
  );
}
