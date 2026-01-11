import expres from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app  = expres();

app.use(expres.json());

app.post('/process-video', (req, res) => {


  // Get path of the inptut video file from request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
  const missing = [];
  if (!inputFilePath) missing.push('input');
  if (!outputFilePath) missing.push('output');

  return res
    .status(400)
    .send(`Missing ${missing.join(' and ')} file path(s).`);
}

  ffmpeg(inputFilePath)
  .outputOptions('-vf', 'scale=-1:360')
  .on('end', () => {
    res
      .status(200)
      .send(`Video processed successfully. Saved to ${outputFilePath}`);
  })
  .on('error', (err) => {
    console.error(`Error processing video: ${err.message}`);
    res
      .status(500)
      .send(`Error processing video: ${err.message}`);
  })
  .save(outputFilePath);


});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Video processing service is running at http://localhost:${port}`);
});