import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const firestore = getFirestore();
const videoCollectionId = 'videos';

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: 'processing' | 'processed';
  title?: string;
  description?: string;
}

function getVideoDocument(videoId: string) {
  return firestore.collection(videoCollectionId).doc(videoId);
}

export function setVideo(videoId: string, video: Video) {
  return getVideoDocument(videoId).set(video, { merge: true });
}

export async function claimVideoForProcessing(videoId: string, uid: string) {
  const videoDocument = getVideoDocument(videoId);

  return firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(videoDocument);
    const status = snapshot.get('status') as Video['status'] | undefined;

    if (status !== undefined) {
      return false;
    }

    transaction.set(
      videoDocument,
      {
        id: videoId,
        uid,
        status: 'processing',
      },
      { merge: true },
    );

    return true;
  });
}

export function clearProcessingState(videoId: string) {
  return getVideoDocument(videoId).set(
    {
      status: FieldValue.delete(),
      filename: FieldValue.delete(),
    },
    { merge: true },
  );
}
