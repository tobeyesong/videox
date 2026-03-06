export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Upload Flow Live
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900">
        Signed-in users can upload videos directly from the navbar.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-600">
        The client now requests a signed URL from Firebase Functions in{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm text-zinc-800">us-west1</code>{" "}
        and uploads the selected video straight to Cloud Storage.
      </p>
    </main>
  );
}
