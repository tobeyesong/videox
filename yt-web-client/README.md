# yt-web-client

Next.js 16 frontend for VideoX.

## What It Does

- Initializes Firebase Web SDK from `NEXT_PUBLIC_FIREBASE_*` environment variables
- Supports Google sign-in and sign-out with Firebase Auth
- Shows an upload action in the navbar for authenticated users
- Calls the `generateUploadUrl` Firebase callable in `us-west1`
- Calls the `getVideos` Firebase callable in `us-west1`
- Uploads the selected video directly from the browser to Cloud Storage with the signed URL
- Renders a basic home feed of processed videos
- Renders a watch page player from the `?v=` query param

## Current Routes

- `/`: Server-rendered video feed using the first 10 Firestore videos
- `/watch`: Client-side video player page using the processed file name from `?v=`

## Prerequisites

- Node.js 20+ recommended
- A Firebase project with Auth enabled for Google sign-in
- The `generateUploadUrl` function deployed in `us-west1`
- CORS enabled on the raw upload bucket using `../utils/gcs-cors.json`

## Environment Setup

Copy `.env.example` to `.env.local` and fill in the Firebase web config:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional:

- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

If the required values are missing, sign-in and upload attempts will fail fast and surface an error message in the UI.

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Upload Flow

1. Sign in with Google from the navbar.
2. Choose a video file from the upload button.
3. The client requests a signed upload URL from Firebase Functions.
4. The browser performs a direct `PUT` upload to the raw Cloud Storage bucket.
5. The API returns the generated file name, and the UI shows a completion alert.

## Current Gaps

- No pagination, ordering, or personalized recommendations in the feed yet
- No progress bar or resumable upload support yet
- No titles, descriptions, or real thumbnails shown in the UI yet

## Scripts

- `npm run dev`: Start the Next.js dev server
- `npm run build`: Build for production
- `npm run start`: Run the production server
- `npm run lint`: Run ESLint
