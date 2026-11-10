#!/usr/bin/env node
// 静态站自检：所有相对 href/src 是否真实存在、外链是否写了协议、演示视频是否可播放的体积。
// 用法: node scripts/check-links.mjs
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'scripts']);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const html = files.filter((f) => extname(f) === '.html');

let links = 0;
const broken = [];
const missingProto = [];
const bigAssets = [];

for (const file of html) {
  const src = readFileSync(file, 'utf8');
  const attrs = src.matchAll(/\s(?:href|src)\s*=\s*"([^"]+)"/g);
  for (const [, url] of attrs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) {
      if (/^www\./.test(url)) missingProto.push(`${rel(file)} → ${url}`);
      continue;
    }
    links++;
    const clean = url.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = resolve(dirname(file), decodeURIComponent(clean));
    try {
      const st = statSync(target);
      if (st.size === 0) broken.push(`${rel(file)} → ${url} (0 字节)`);
    } catch {
      broken.push(`${rel(file)} → ${url}`);
    }
  }
}

for (const f of files) {
  if (['.mp4', '.pdf'].includes(extname(f))) {
    const mb = statSync(f).size / 1048576;
    if (mb > 15) bigAssets.push(`${rel(f)} ${mb.toFixed(1)}MB`);
  }
}

function rel(p) {
  return p.slice(ROOT.length + 1);
}

console.log(`扫描 ${html.length} 个 HTML，检查 ${links} 条相对链接`);
if (bigAssets.length) console.log(`大素材(>15MB): ${bigAssets.join(', ')}`);
if (missingProto.length) {
  console.log(`缺协议的外链 ${missingProto.length} 条:`);
  for (const m of missingProto) console.log(`  ${m}`);
}
if (broken.length) {
  console.log(`断链 ${broken.length} 条:`);
  for (const b of broken) console.log(`  ✗ ${b}`);
  process.exit(1);
}
console.log('断链 0 条');
