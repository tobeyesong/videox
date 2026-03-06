# yt-api-service

Firebase Functions backend for VideoX.

## Structure

- `functions/`: TypeScript Firebase Functions project
- `firebase.json`: Firebase project + emulator config
- `firestore.rules`: Firestore security rules
- `firestore.indexes.json`: Firestore indexes

## Prerequisites

- `firebase-tools` installed globally
- Logged in with `firebase login`
- Node.js `22.x` recommended for local parity with deploy runtime

## Local Development

```bash
cd yt-api-service/functions
npm install
npm run serve
```

Emulator UI: `http://127.0.0.1:4000`

## Deploy

```bash
cd yt-api-service
firebase deploy --only functions
```

To deploy only the auth user writer:

```bash
cd yt-api-service/functions
npm run deploy:create-user -- --project videox-2a530
```

To deploy only the signed upload URL callable:

```bash
cd yt-api-service/functions
npm run deploy:generate-upload-url -- --project videox-2a530
```

## Auth Trigger Note

- `createUser` uses `firebase-functions/v1` auth trigger syntax intentionally.
- Firebase Auth post-create/post-delete triggers do not currently have a v2 equivalent.
- Console UI now routes function management through Cloud Run, but this auth trigger remains a v1 deployment model.

## Current Status

- `createUser` auth trigger is deployed and active in `us-west1`.
- Firestore user document write (`users/{uid}`) is implemented and tested.
- `generateUploadUrl` callable is implemented for authenticated raw video uploads.

## To Do

- Add metadata read/list endpoints for the web client watch/home pages.
- Add basic integration tests for Auth trigger + Firestore write.

## Signed Upload Function

- `generateUploadUrl` is a v2 callable in `us-west1`.
- It requires Firebase Authentication and returns a 15-minute v4 signed URL plus the generated file name.
- The raw upload bucket defaults to `tpl-raw-videos`. Override it with the `RAW_VIDEO_BUCKET` environment variable if your bucket name differs.

## Required GCP Permissions

After deploy, grant the Cloud Functions service account access to the raw upload bucket:

1. Open the `generateUploadUrl` function details and copy its service account email.
2. In Cloud Storage, grant that principal `Storage Object Admin` on the raw videos bucket.
3. In IAM, grant the same principal the `Service Account Token Creator` role.

Without both permissions, signed URL generation will fail even though the function deploys successfully.

## References

- Signed URLs: https://cloud.google.com/storage/docs/access-control/signed-urls
- Create Signed URL: https://cloud.google.com/storage/docs/samples/storage-generate-upload-signed-url-v4#storage_generate_upload_signed_url_v4-nodejs
- Firebase Functions v1 vs v2: https://firebase.google.com/docs/functions/version-comparison
- Cloud Functions v1 vs v2: https://cloud.google.com/functions/docs/concepts/version-comparison
