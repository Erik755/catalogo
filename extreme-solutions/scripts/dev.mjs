import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import projectHandler from '../api/project.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg' };
const port = Number(process.env.PORT || 4174);
http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  const url = new URL(req.url, 'http://localhost');
  const match = url.pathname.match(/^\/proyecto\/([^/]+)\/?$/);
  if (match) {
    req.query = { slug: decodeURIComponent(match[1]), lang: url.searchParams.get('lang') };
    return projectHandler(req, res);
  }
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Stripe requiere Vercel y sus variables de entorno.' }));
  }
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    if (!/^\/(?:[\w-]+\.(?:html|css|js)|assets\/[\w.-]+)$/.test(relative)) throw new Error('Not public');
    const filename = path.join(root, relative);
    const content = await readFile(filename);
    res.writeHead(200, { 'Content-Type': `${types[path.extname(filename)] || 'application/octet-stream'}; charset=utf-8` });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));
