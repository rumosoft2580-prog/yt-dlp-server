import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';

async function getStreamInfo(query) {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-playlist',
      `ytsearch1:${query}`
    ];
    
    const proc = spawn(YTDLP_PATH, args);
    let data = '';
    let error = '';

    proc.stdout.on('data', (chunk) => {
      data += chunk;
    });

    proc.stderr.on('data', (chunk) => {
      error += chunk;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Failed to get stream info'));
        return;
      }

      try {
        const info = JSON.parse(data.trim());
        resolve({
          id: info.id,
          title: info.title,
          thumbnail: info.thumbnail,
          duration: info.duration,
          stream_url: info.url,
          container: info.ext || 'unknown',
          codec: info.acodec || 'unknown'
        });
      } catch (e) {
        reject(new Error('Failed to parse yt-dlp output'));
      }
    });
  });
}

async function search(query, limit = 10) {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-playlist',
      `--playlist-items=1:${limit}`,
      `ytsearch${limit}:${query}`
    ];
    
    const proc = spawn(YTDLP_PATH, args);
    let data = '';
    let error = '';

    proc.stdout.on('data', (chunk) => {
      data += chunk;
    });

    proc.stderr.on('data', (chunk) => {
      error += chunk;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Search failed'));
        return;
      }

      try {
        const lines = data.trim().split('\n').filter(l => l.trim());
        const results = lines.map(line => {
          const info = JSON.parse(line);
          return {
            id: info.id,
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
          };
        });
        resolve(results);
      } catch (e) {
        reject(new Error('Failed to parse search results'));
      }
    });
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const results = await search(query, 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/stream', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  try {
    const info = await getStreamInfo(url);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});