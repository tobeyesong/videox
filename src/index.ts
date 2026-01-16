import express from 'express';
import { 
  convertVideo, 
  downloadRawVideo, 
  setupDirectories, 
  uploadProcessedVideo,
  deleteRawVideo,
  deleteProcessedVideo
} from './storage';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';

setupDirectories();

const app  = express();

app.use(express.json());

app.post('/process-video', async (req, res) => {
  let data;
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

  try {
    // Download the raw video from Cloud Storage
    console.log(`Downloading ${inputFileName}...`);
    await downloadRawVideo(inputFileName);
    
    // Convert the video to 360p resolution
    console.log(`Converting ${inputFileName}...`);
    await convertVideo(inputFileName, outputFileName);
    
    // Upload the processed video to Cloud Storage
    console.log(`Uploading ${outputFileName}...`);
    await uploadProcessedVideo(outputFileName);
    
    // Cleanup
    console.log('Cleaning up local files...');
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);

    console.log('Video processing complete!');
    return res.status(200).send('Video processed successfully.');
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Cleanup on error
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]).catch(err => console.error('Cleanup error:', err));
    
    return res.status(500).send('Error processing video.');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
});