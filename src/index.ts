import expres from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app  = expres();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});