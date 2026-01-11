import expres from 'express';
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

const app  = expres();

app.use(expres.json());

app.post('/process-video', async (req, res) => {
  //Get the bucket and filename from Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name){
      throw new Error('Invalid message payload recieved.');
    }
  } catch (error) {
    console.error('Error parsing Pub/Sub message:', error);
    res.status(400).send('Invalid Pub/Sub message payload.');
    return;  
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Donwload the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  // Convert the video to 360p resolution
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (error) {
    Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    return res.status(500).send('Error processing video.');
  }

  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])

    return res.status(200).send('Video processed successfully.');


});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
});