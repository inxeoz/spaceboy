#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, '..');
const SITE_ROOT = join(THEME_DIR, '..', '..');
const CONTENT_DIR = join(SITE_ROOT, 'content');
const DATA_DIR = join(SITE_ROOT, 'data');
const CACHE_PATH = join(DATA_DIR, 'katex-cache.json');

// Bump when the cache schema or render settings change — a mismatch forces a
// full re-render instead of trusting stale cached HTML (e.g. entries that were
// rendered with throwOnError:false and silently contain error markup).
const CACHE_VERSION = 2;

function* walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.md')) yield fullPath;
  }
}

// \command (2+ letters like \frac, \sum) or explicit superscript/subscript ^ _
// Excludes JS regex escapes like \s, \n, \d which are single letters
const LATEX_INDICATOR = /\\[a-zA-Z]{2,}|[\^_]/;

function extractMathExpressions(content) {
  const stripped = content
    .replace(/^---[\s\S]*?^---\s*\n/m, '')         // strip frontmatter
    .replace(/^```[^\n]*\n[\s\S]*?^```\s*\n?/gm, '') // strip fenced code blocks
    .replace(/^(    |\t)[^\n]+$/gm, '')              // strip indented code blocks
    .replace(/`[^`\n]+`/g, '');                      // strip inline code

  const exprs = [];

  // Block: $$...$$ (may span multiple lines)
  const blockRe = /\$\$([\s\S]*?)\$\$/g;
  let m;
  while ((m = blockRe.exec(stripped)) !== null) {
    const src = m[1].trim();
    if (src) exprs.push({ source: src, type: 'block' });
  }

  // Inline: $...$ — require at least one LaTeX character to avoid matching
  // JS $('selector') calls, currency amounts, etc.
  const inlineRe = /(?<!\$)\$(?!\$)([^\n$]+?)(?<!\$)\$(?!\$)/g;
  while ((m = inlineRe.exec(stripped)) !== null) {
    const src = m[1].trim();
    if (src && LATEX_INDICATOR.test(src)) exprs.push({ source: src, type: 'inline' });
  }

  return exprs;
}

function cacheKey(type, source) {
  return createHash('sha256').update(`${type}:${source}`).digest('hex');
}

function render(source, type) {
  return katex.renderToString(source, {
    displayMode: type === 'block',
    throwOnError: true,
    output: 'html',
  });
}

function main() {
  process.stdout.write('[katex-cache] Scanning content/ for math expressions...\n');

  const found = new Map();

  for (const filePath of walkDir(CONTENT_DIR)) {
    const content = readFileSync(filePath, 'utf-8');
    for (const expr of extractMathExpressions(content)) {
      const key = cacheKey(expr.type, expr.source);
      if (!found.has(key)) found.set(key, expr);
    }
  }

  if (found.size === 0) {
    process.stdout.write('[katex-cache] No math expressions found.\n');
    writeCache({});
    return;
  }

  process.stdout.write(`[katex-cache] Found ${found.size} unique expression(s).\n`);

  let existing = {};
  if (existsSync(CACHE_PATH)) {
    try { existing = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')); } catch {}
    if (existing._version !== CACHE_VERSION) {
      process.stdout.write('[katex-cache] Cache version changed — re-rendering all expressions.\n');
      existing = {};
    }
  }

  let rendered = 0;
  let cached = 0;
  let failed = 0;
  const result = { _version: CACHE_VERSION };

  for (const [key, { source, type }] of found) {
    if (existing[key]) {
      result[key] = existing[key];
      cached++;
      continue;
    }
    try {
      result[key] = render(source, type);
      rendered++;
    } catch (err) {
      failed++;
      process.stderr.write(`[katex-cache] FAILED to render "${source}": ${err.message}\n`);
    }
  }

  writeCache(result);
  process.stdout.write(`[katex-cache] Done: ${rendered} rendered, ${cached} cached, ${failed} failed.\n`);
  if (failed > 0) process.exitCode = 1;
}

function writeCache(data) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  process.stdout.write(`[katex-cache] Cache written: ${CACHE_PATH}\n`);
}

main();
