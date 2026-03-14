import Image from "next/image";
import Link from "next/link";
import { getVideos } from "@/lib/functions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getVideos();
  const playableVideos = videos.filter(
    (video): video is typeof video & { filename: string } => typeof video.filename === "string",
  );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl flex-col px-6 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Video Feed
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900">
        Browse the latest processed uploads.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-600">
        This page follows the transcript flow: it fetches videos in a server component and
        renders simple links to the watch page.
      </p>

      {playableVideos.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
          <h2 className="text-lg font-medium text-zinc-900">No processed videos yet</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Upload a video from the navbar, wait for processing to finish, then refresh.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {playableVideos.map((video) => (
            <Link
              key={video.id ?? video.filename}
              href={{ pathname: "/watch", query: { v: video.filename } }}
              className="group"
            >
              <article className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Image
                  src="/thumbnail.svg"
                  alt="Video thumbnail"
                  width={320}
                  height={180}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-100"
                />
                <div className="px-1 pb-1 pt-3">
                  <p className="text-sm font-medium text-zinc-900">
                    {video.title ?? video.filename}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {video.description ?? video.filename}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
