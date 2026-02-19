export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Next Phase: Web App
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900">
        Firebase auth is wired. Sign in with Google from the navbar.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-600">
        Next steps are upload flow, signed URL request, and a watch experience powered by processed
        video metadata.
      </p>
    </main>
  );
}
