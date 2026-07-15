import { createServer } from 'node:http';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');
const dataDir = join(root, 'data');
const statePath = join(dataDir, 'hitokoe-state.json');
const serverTagPath = join(dataDir, 'hitokoe-server.json');
const preferredPort = Number(process.env.PORT || 4173);

const backgroundPatterns = ['plain', 'dots', 'leaf', 'wave'];
const backgroundColors = ['white', 'mint', 'cream', 'sky'];
const defaultState = { records: [], timer: null, darkMode: false, backgroundPattern: 'plain', backgroundColor: 'white', proposedExerciseIds: [] };
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function exitSoon(code) {
  process.exitCode = code;
  setTimeout(() => {
    process.exitCode = code;
  }, 50);
}

async function readState() {
  try {
    return JSON.parse(await readFile(statePath, 'utf8'));
  } catch {
    return defaultState;
  }
}

async function writeState(state) {
  await mkdir(dataDir, { recursive: true });
  const records = Array.isArray(state.records) ? state.records : [];
  const darkMode = typeof state.darkMode === 'boolean' ? state.darkMode : false;
  const backgroundPattern = backgroundPatterns.includes(state.backgroundPattern) ? state.backgroundPattern : 'plain';
  const backgroundColor = backgroundColors.includes(state.backgroundColor) ? state.backgroundColor : 'white';
  const proposedExerciseIds = Array.isArray(state.proposedExerciseIds) ? state.proposedExerciseIds : [];
  await writeFile(statePath, JSON.stringify({ records, timer: null, darkMode, backgroundPattern, backgroundColor, proposedExerciseIds }, null, 2));
}

async function writeServerTag(port) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(serverTagPath, JSON.stringify({
    app: 'hitokoe',
    pid: process.pid,
    port,
    url: `http://localhost:${port}`,
    startedAt: new Date().toISOString()
  }, null, 2));
}

async function removeServerTag() {
  try {
    await unlink(serverTagPath);
  } catch {
    // タグがない場合は何もしません。
  }
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function serveStatic(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const requested = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(distDir, requested === '/' ? 'index.html' : requested);
  if (!filePath.startsWith(distDir)) filePath = join(distDir, 'index.html');

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    filePath = join(distDir, 'index.html');
  }

  const type = mime[extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': type });
  createReadStream(filePath).pipe(res);
}

async function isHitokoeServerRunning(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/server`);
    if (!response.ok) return false;
    const info = await response.json();
    return info.app === 'hitokoe';
  } catch {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/state`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/server')) {
      return sendJson(res, 200, { app: 'hitokoe', pid: process.pid, port: server.address()?.port });
    }
    if (req.url?.startsWith('/api/state')) {
      if (req.method === 'GET') return sendJson(res, 200, await readState());
      if (req.method === 'PUT') {
        await writeState(JSON.parse(await readBody(req)));
        return sendJson(res, 200, { ok: true });
      }
      return sendJson(res, 405, { error: 'method_not_allowed' });
    }
    return serveStatic(req, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'server_error' });
  }
});

function startServer(port, tried = 0) {
  server.once('error', async error => {
    if (error.code !== 'EADDRINUSE') {
      console.error(error);
      exitSoon(1);
      return;
    }

    if (await isHitokoeServerRunning(port)) {
      console.log(`Hitokoe server is already running at http://localhost:${port}`);
      console.log('Open that URL in your browser. No second server was started.');
      exitSoon(0);
      return;
    }

    if (process.env.PORT || tried >= 10) {
      console.error(`Port ${port} is already in use by another app.`);
      console.error('Set another port, for example: PORT=4174 npm run start');
      exitSoon(1);
      return;
    }

    const nextPort = port + 1;
    console.log(`Port ${port} is already in use. Trying http://localhost:${nextPort}`);
    startServer(nextPort, tried + 1);
  });

  server.listen(port, async () => {
    const actualPort = server.address().port;
    await writeServerTag(actualPort);
    console.log(`Hitokoe server running at http://localhost:${actualPort}`);
  });
}

process.on('SIGINT', async () => {
  await removeServerTag();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await removeServerTag();
  process.exit(0);
});

startServer(preferredPort);
