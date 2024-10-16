import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Choose a port that doesn't conflict with OpenWebUI

// Serve static files from the 'videos' directory
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Video embed endpoint
app.get('/video-embed', (req, res) => {
  const videoId = req.query.id as string;
  const startTime = req.query.start as string || '0';
  const endTime = req.query.end as string;

  // Ensure the videoId is just a filename and doesn't contain path traversal
  const safeVideoId = path.basename(videoId);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Player</title>
      <link href="https://vjs.zencdn.net/7.20.3/video-js.min.css" rel="stylesheet">
      <script src="https://vjs.zencdn.net/7.20.3/video.min.js"></script>
      <style>
        /* Center the play button */
        .video-js .vjs-big-play-button {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <video id="my-video" class="video-js" controls preload="auto" width="600" height="300">
        <source src="/videos/${safeVideoId}" type="video/mp4">
      </video>
      <script>
        var player = videojs('my-video');
        player.ready(function() {
          this.currentTime(${startTime});
          ${endTime ? `
          this.on('timeupdate', function() {
            if (this.currentTime() >= ${endTime}) {
              this.pause();
            }
          });
          ` : ''}
        });
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Video server running at http://localhost:${port}`);
});