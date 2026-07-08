import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');
const dataDir = join(root, 'data');
const statePath = join(dataDir, 'hitokoe-state.json');
const port = Number(process.env.PORT || 4173);

const defaultState = { records: [], timer: null, notifications: true };
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

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
  const notifications = typeof state.notifications === 'boolean' ? state.notifications : true;
  await writeFile(statePath, JSON.stringify({ records, timer: null, notifications }, null, 2));
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

createServer(async (req, res) => {
  try {
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
}).listen(port, () => {
  console.log(`Hitokoe server running at http://localhost:${port}`);
});
