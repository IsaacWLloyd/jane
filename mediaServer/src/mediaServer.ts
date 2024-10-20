import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use('/media', express.static(path.join(__dirname, 'media')));

// Media embed endpoint
app.get('/media-embed', (req, res) => {
	const mediaId = req.query.id as string;
	const timestamp = req.query.t as string; // For video/audio timestamps
	const page = req.query.page as string; // For document pages

	if (!mediaId) {
		return res.status(400).send('Media ID is required');
	}

	const safeMediaId = path.basename(mediaId);
	const mediaPath = path.join(__dirname, 'media', safeMediaId);

	if (!fs.existsSync(mediaPath)) {
		console.error(`File not found: ${mediaPath}`);
		return res.status(404).send('File not found');
	}

	const fileExtension = path.extname(safeMediaId).toLowerCase();
	const mimeType = getMimeType(fileExtension);

	let embedHtml = '';

	switch (mimeType.split('/')[0]) {
		case 'video':
			embedHtml = `<video controls width="100%" height="auto">
                <source src="/media/${safeMediaId}${timestamp ? '#t=' + timestamp : ''}" type="${mimeType}">
            </video>`;
			break;
		case 'audio':
			embedHtml = `<audio controls>
                <source src="/media/${safeMediaId}${timestamp ? '#t=' + timestamp : ''}" type="${mimeType}">
            </audio>`;
			break;
		case 'image':
			embedHtml = `<img src="/media/${safeMediaId}" alt="Embedded image" style="max-width: 100%; height: auto;">`;
			break;
		case 'application':
			if (mimeType === 'application/pdf') {
				embedHtml = `<iframe src="/media/${safeMediaId}${page ? '#page=' + page : ''}" width="100%" height="600px"></iframe>`;
			} else {
				embedHtml = `<a href="/media/${safeMediaId}" target="_blank">Download ${safeMediaId}</a>`;
			}
			break;
		case 'text':
			if (mimeType === 'text/html') {
				embedHtml = `<iframe src="/media/${safeMediaId}" width="100%" height="600px"></iframe>`;
			} else {
				embedHtml = `<iframe src="/media/${safeMediaId}" width="100%" height="600px"></iframe>`;
			}
			break;
		default:
			embedHtml = `<p>Unsupported file type: ${fileExtension}</p>`;
	}

	const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Media Embed</title>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
            #media-container {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div id="media-container">
            ${embedHtml}
        </div>
    </body>
    </html>
    `;

	res.send(html);
});

app.listen(port, () => {
	console.log(`Media server running at http://localhost:${port}`);
});

function getMimeType(ext: string): string {
	const mimeTypes: { [key: string]: string } = {
		// Video
		'.mp4': 'video/mp4',
		'.webm': 'video/webm',
		'.ogg': 'video/ogg',
		'.avi': 'video/x-msvideo',
		'.mov': 'video/quicktime',
		'.wmv': 'video/x-ms-wmv',
		// Audio
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.m4a': 'audio/m4a',
		'.aac': 'audio/aac',
		'.flac': 'audio/flac',
		// Image
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.png': 'image/png',
		'.gif': 'image/gif',
		'.webp': 'image/webp',
		'.svg': 'image/svg+xml',
		// Document
		'.pdf': 'application/pdf',
		'.doc': 'application/msword',
		'.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'.xls': 'application/vnd.ms-excel',
		'.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'.ppt': 'application/vnd.ms-powerpoint',
		'.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		// Text
		'.txt': 'text/plain',
		'.csv': 'text/csv',
		'.html': 'text/html',
		'.css': 'text/css',
		'.js': 'text/javascript'
	};
	return mimeTypes[ext] || 'application/octet-stream';
}
