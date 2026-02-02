# VideoX

A YouTube clone with serverless video transcoding. Built to learn scalable video processing and event-driven architecture.

## Live Demo
*Coming soon — frontend in progress*

## Architecture Overview

- **Frontend:** Next.js 14 (App Router) + Firebase Auth
- **Video Processing:** FFmpeg running on Cloud Run (auto-scaling workers)
- **Storage:** Google Cloud Storage (raw uploads + transcoded outputs)
- **Queue:** Cloud Pub/Sub (decouples upload from processing)
- **Metadata:** Firestore (video info, processing status, user data)
- **Auth:** Firebase Auth (Google Sign-In)

## What I Built

### Backend Infrastructure
- **Secure Uploads:** Signed URL generation prevents unauthorized GCS access
- **Async Processing Pipeline:** Videos are transcoded to 360p and 720p using FFmpeg
- **Auto-Scaling Workers:** Cloud Run scales from 0 → N based on queue depth
- **Event-Driven Architecture:** Pub/Sub handles buffering when uploads spike
- **Metadata Tracking:** Firestore stores video status, URLs, and user associations

### Key Design Decisions
- Used Pub/Sub instead of direct invocation to handle traffic spikes gracefully
- Containerized FFmpeg workers for consistent transcoding environments
- Separated raw and processed storage buckets for access control
- Serverless-first approach to minimize ops overhead

## Tech Stack

```
Next.js 14        |  Frontend framework
Firebase Auth     |  Authentication
Cloud Run         |  Video processing workers
Cloud Storage     |  Video file storage
Pub/Sub           |  Message queue / event bus
Firestore         |  NoSQL metadata storage
FFmpeg            |  Video transcoding
TypeScript        |  Type safety across stack
```

## Project Status

| Component | Status |
|-----------|--------|
| Video Processing Service | ✅ Complete |
| Cloud Infrastructure (GCS, Pub/Sub, Cloud Run) | ✅ Complete |
| Firebase Auth Integration | 🚧 In Progress |
| Next.js Web Client | 🚧 In Progress |
| Upload UI | ⏳ Pending |
| Video Player / Watch Page | ⏳ Pending |

## Local Development

```bash
# Install dependencies
npm install

# Set up Firebase
firebase login
firebase init

# Run Next.js dev server
npm run dev

# Deploy video processing service
gcloud run deploy video-processor --source ./video-service
```

## What I Learned

- **Scalable architecture:** How to decouple services with message queues
- **Cloud-native patterns:** Event-driven processing, auto-scaling, signed URLs
- **Video processing:** FFmpeg command chains, format transcoding
- **Trade-offs:** 60min Cloud Run timeout vs. long video processing, Pub/Sub redelivery semantics

## Future Work

- [ ] Add video player with adaptive bitrate streaming
- [ ] Implement upload quotas per user
- [ ] Content moderation (thumbnail extraction + ML classification)
- [ ] CDN integration for faster global delivery
- [ ] Add comments and likes (social features)

## License

MIT
