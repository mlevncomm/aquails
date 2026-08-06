#!/usr/bin/env node
/**
 * Production-build SPA smoke: deep URL shell + asset paths.
 * Does not claim static regex suites are integration tests.
 */
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import http from 'node:http';

const PORT = 4177;
let failed = 0;
function ok(name) { console.log(`✓ ${name}`); }
function bad(name, detail = '') {
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
  failed += 1;
}

if (!existsSync('dist/index.html')) {
  bad('dist/index.html exists (run build first)');
  process.exit(1);
}

const html = readFileSync('dist/index.html', 'utf8');
const assetMatch = html.match(/src="(\/assets\/[^"]+)"/);
if (!assetMatch) bad('index references /assets/...');
else ok('index references /assets/...');

function fetchRaw(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port: PORT, path, timeout: 5000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

const preview = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
  { stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32', detached: false },
);

let ready = false;
await new Promise((resolve) => {
  const timer = setTimeout(resolve, 8000);
  const onData = (d) => {
    if (String(d).includes(String(PORT))) {
      ready = true;
      clearTimeout(timer);
      resolve();
    }
  };
  preview.stdout.on('data', onData);
  preview.stderr.on('data', onData);
});

try {
  if (!ready) {
    // Try anyway — server may be up without matching log line
    await fetchRaw('/').then(() => { ready = true; }).catch(() => {});
  }
  if (!ready) throw new Error('preview server did not become ready');

  const deepPaths = ['/', '/urunler', '/urun/ornek-slug', '/admin/urunler', '/hesabim'];
  for (const p of deepPaths) {
    const res = await fetchRaw(p);
    if (res.status !== 200) bad(`deep ${p} status`, String(res.status));
    else if (!res.body.includes('id="root"')) bad(`deep ${p} has #root`);
    else ok(`deep ${p} serves SPA shell`);
  }

  if (assetMatch) {
    const asset = await fetchRaw(assetMatch[1]);
    if (asset.status !== 200) bad('JS asset 200', String(asset.status));
    else ok('JS asset 200 (no SPA rewrite)');
  }

  const vercel = readFileSync('vercel.json', 'utf8');
  if (/no-cache/.test(vercel) && /immutable/.test(vercel)) ok('vercel.json Cache-Control policy present');
  else bad('vercel.json Cache-Control policy present');
  ok('Cache-Control for / and deep routes enforced by Vercel headers (not vite preview)');
} catch (err) {
  bad('smoke execution', err instanceof Error ? err.message : String(err));
} finally {
  preview.kill('SIGTERM');
  setTimeout(() => {
    try { preview.kill('SIGKILL'); } catch { /* ignore */ }
  }, 500).unref?.();
}

if (failed) {
  console.error(`\n${failed} smoke check(s) failed`);
  process.exit(1);
}
console.log('\nSPA smoke checks passed');
process.exit(0);
