# VideoX

VideoX is a YouTube-style learning project built around direct-to-cloud uploads, asynchronous video processing, and serverless infrastructure on Firebase and Google Cloud.

## Repo Overview

- `yt-web-client/`: Next.js 16 web app with Firebase Auth and signed uploads
- `yt-api-service/`: Firebase Functions for auth user sync and upload URL generation
- `video-processing-service/`: Cloud Run worker that transcodes uploads and writes Firestore metadata
- `utils/gcs-cors.json`: CORS policy for direct browser uploads to the raw video bucket

There is no root `package.json`. Each app/service is installed and run from its own directory.

## Current Architecture

- **Frontend:** Next.js App Router + React 19
- **Authentication:** Firebase Auth with Google sign-in
- **Upload API:** Firebase Functions in `us-west1`
- **Raw Storage:** Google Cloud Storage bucket for direct browser uploads
- **Processing:** Pub/Sub-driven Cloud Run worker with FFmpeg
- **Metadata:** Firestore documents for users and video processing state
- **Processed Storage:** Separate Cloud Storage bucket for transcoded outputs

## Implemented Flow

1. A user signs in with Google from the web client.
2. The client calls the `generateUploadUrl` callable function in `us-west1`.
3. Firebase Functions returns a short-lived signed `PUT` URL and generated file name.
4. The browser uploads the raw video directly to Cloud Storage.
5. The video-processing service consumes the upload event, claims the video in Firestore, transcodes it to a 360p output, uploads the processed file, and marks the video as `processed`.
6. The web client fetches up to 10 videos from Firestore and links each one to the watch page.

## Project Status

| Component | Status |
|-----------|--------|
| Google sign-in / sign-out | ✅ Implemented |
| Firebase `createUser` sync | ✅ Implemented |
| Signed upload URL function | ✅ Implemented |
| Video list callable (`getVideos`) | ✅ Implemented |
| Navbar upload action | ✅ Implemented |
| Firestore processing metadata | ✅ Implemented |
| Cloud Run video processor | ✅ Implemented |
| Home video feed | ✅ Implemented |
| Watch page | ✅ Implemented |
| Multi-resolution output / adaptive streaming | ⏳ Pending |

## Local Development

### Web Client

```bash
cd yt-web-client
cp .env.example .env.local
npm install
npm run dev
```

The web client expects Firebase web config in `.env.local`. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional.

### Firebase Functions

```bash
cd yt-api-service/functions
npm install
npm run serve
```

To deploy functions:

```bash
cd yt-api-service
firebase deploy --only functions
```

### Video Processing Service

```bash
cd video-processing-service
npm install
npm run build
npm run serve
```

For local TypeScript execution, use:

```bash
cd video-processing-service
npm start
```

To deploy the processor to Cloud Run:

```bash
gcloud run deploy video-processor --source ./video-processing-service
```

## Infrastructure Notes

- The upload callable defaults to the raw bucket `tpl-raw-videos` unless `RAW_VIDEO_BUCKET` is set in Functions.
- The processor currently reads from `tpl-raw-videos` and writes processed outputs to `tpl-processed-videos`.
- Direct browser uploads require CORS on the raw bucket. The repo includes a policy at `utils/gcs-cors.json`.
- Local runs of the processor require Google Application Default Credentials with access to Cloud Storage and Firestore.
- The processor uses Firestore transactions to ignore duplicate processing messages and store video status transitions.

## What Is Still Missing

- Multi-bitrate or adaptive streaming outputs
- Upload quotas, moderation, and social features

## License

MIT
