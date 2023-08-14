import express from 'express';
import cors from 'cors';
import videoInfo from './db.js';
import { resolve, join } from 'path';
import { createReadStream, statSync } from 'fs';

const app = express();
const filePath = join(resolve(''), '/video');

app.use(cors());
app.use(express.json());

app.get('/video/:file', (req, res) => {
    const file = join(filePath, req.params.file);
    const range = req.headers.range;

    if (range) {
        let [ start, end ] = range.replace(/bytes=/, '').split('-');
        const fileSize = statSync(file).size;
        if(!end) end = fileSize - 1;
        const chunkSize = (end - start) + 1;


        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });

        createReadStream(file, { start: +start, end: +end }).pipe(res);
    } else {
        createReadStream(file).pipe(res);
    }
});

app.get('/video', (req, res) => {
    const { season, episode } = req.query;

    if(season && episode) {
        const current = videoInfo.findIndex(e => e.season == season && e.episode == episode);
        res.json({prev: videoInfo[current - 1], next: videoInfo[current + 1]});
    } else {
        res.json(videoInfo);
    }
});

app.listen(5000, () => console.log(`Server started`));