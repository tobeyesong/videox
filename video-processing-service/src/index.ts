import express from 'express';
import { 
  convertVideo, 
  downloadRawVideo, 
  setupDirectories, 
  uploadProcessedVideo,
  deleteRawVideo,
  deleteProcessedVideo
} from './storage';
import { claimVideoForProcessing, clearProcessingState, setVideo } from './firestore';

setupDirectories();

const app  = express();

app.use(express.json());

async function cleanupLocalFiles(inputFileName: string, outputFileName: string) {
  const cleanupResults = await Promise.allSettled([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  cleanupResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      const fileName = index === 0 ? inputFileName : outputFileName;
      console.error(`Cleanup error for ${fileName}:`, result.reason);
    }
  });
}

function getVideoId(fileName: string) {
  const extensionIndex = fileName.lastIndexOf('.');
  return extensionIndex === -1 ? fileName : fileName.slice(0, extensionIndex);
}

function getUidFromVideoId(videoId: string) {
  const separatorIndex = videoId.indexOf('-');
  return separatorIndex === -1 ? videoId : videoId.slice(0, separatorIndex);
}

app.post('/process-video', async (req, res) => {
  let data;
  let shouldCleanupLocalFiles = false;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error('Error parsing Pub/Sub message:', error);
    return res.status(400).send('Invalid Pub/Sub message payload.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = getVideoId(inputFileName);
  const uid = getUidFromVideoId(videoId);

  try {
    const isClaimed = await claimVideoForProcessing(videoId, uid);

    if (!isClaimed) {
      console.log(`Skipping duplicate processing request for ${videoId}.`);
      return res.status(200).send('Duplicate message ignored.');
    }

    shouldCleanupLocalFiles = true;

    // Download the raw video from Cloud Storage
    console.log(`Downloading ${inputFileName}...`);
    await downloadRawVideo(inputFileName);
    
    // Convert the video to 360p resolution
    console.log(`Converting ${inputFileName}...`);
    await convertVideo(inputFileName, outputFileName);
    
    // Upload the processed video to Cloud Storage
    console.log(`Uploading ${outputFileName}...`);
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
      filename: outputFileName,
      status: 'processed',
    });
    
    console.log('Video processing complete!');
    return res.status(200).send('Video processed successfully.');
    
  } catch (error) {
    console.error('Error processing video:', error);

    await clearProcessingState(videoId).catch((firestoreError) => {
      console.error(`Error clearing processing state for ${videoId}:`, firestoreError);
    });
    
    return res.status(500).send('Error processing video.');
  } finally {
    if (shouldCleanupLocalFiles) {
      console.log('Cleaning up local files...');
      await cleanupLocalFiles(inputFileName, outputFileName);
    }
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
});
