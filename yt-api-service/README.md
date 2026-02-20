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

## Auth Trigger Note

- `createUser` uses `firebase-functions/v1` auth trigger syntax intentionally.
- Firebase Auth post-create/post-delete triggers do not currently have a v2 equivalent.
- Console UI now routes function management through Cloud Run, but this auth trigger remains a v1 deployment model.
