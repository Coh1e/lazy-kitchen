#!/usr/bin/env tsx
/**
 * Development server: rebuild lazy-kitchen.html on file changes,
 * serve at localhost:3000. Uses Node http + child_process.
 */

import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML_PATH = join(ROOT, 'lazy-kitchen.html');

function rebuild(): Promise<void> {
  return new Promise((resolve) => {
    const proc = spawn('npx', ['tsx', join(ROOT, 'scripts', 'build-html.ts')], {
      stdio: 'inherit', shell: true,
    });
    proc.on('close', () => resolve());
  });
}

console.log('🍳 Lazy Kitchen dev server starting...');
await rebuild();

let cooldown = false;
function debounce() {
  if (cooldown) return;
  cooldown = true;
  setTimeout(async () => {
    await rebuild();
    cooldown = false;
    console.log('   rebuilt');
  }, 300);
}

watch(join(ROOT, 'docs'), { recursive: true }, debounce);
watch(join(ROOT, 'data'), { recursive: true }, debounce);

const PORT = 3000;
const server = createServer(async (req, res) => {
  if (req.url === '/' || req.url === '/lazy-kitchen.html') {
    try {
      const html = await readFile(HTML_PATH, 'utf-8');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e) {
      res.writeHead(500); res.end('Build error');
    }
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🍳 Open http://localhost:${PORT}/`);
  console.log('   Watching docs/ + data/ — edit any file to rebuild');
});
