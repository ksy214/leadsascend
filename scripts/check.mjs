import { readFile, access, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
const root = resolve('dist');
const html = await readFile(join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML IDs');
for (const [, ref] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (ref === '#') continue;
  if (ref.startsWith('#')) {
    if (!ids.includes(ref.slice(1))) throw new Error(`Missing anchor ${ref}`);
  } else if (!/^(https?:|data:|mailto:)/.test(ref)) {
    const path = resolve(root, ref.split('?')[0]);
    if (!path.startsWith(root + '/')) throw new Error(`Asset outside site: ${ref}`);
    await access(path);
  }
}
execFileSync(process.execPath, ['--check', 'dist/app.js'], {stdio: 'inherit'});
const css = await readFile(join(root, 'style.css'), 'utf8');
if (/fonts\.googleapis\.com|@import/.test(css)) throw new Error('External stylesheet blocks rendering');
if (!css.includes('prefers-reduced-motion:reduce')) throw new Error('Reduced-motion styles missing');
const files = ['index.html', 'style.css', 'app.js', 'assets/mark.svg'];
let total = 0, gzipTotal = 0;
for (const path of files) {
  const bytes = await readFile(join(root, path));
  const compressed = gzipSync(bytes).length;
  total += bytes.length; gzipTotal += compressed;
  console.log(`${path}: ${bytes.length} bytes (${compressed} bytes gzip)`);
}
if (total > 60000) throw new Error('Static payload exceeds the 60 KB budget');
console.log(`PASS: anchors, local assets, unique IDs, JavaScript syntax, motion fallback.\nTotal ${total} bytes; gzip estimate ${gzipTotal} bytes (actual delivery depends on host).`);
