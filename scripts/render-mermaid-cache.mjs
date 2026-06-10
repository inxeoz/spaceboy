#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, '..');
const SITE_ROOT = join(THEME_DIR, '..', '..');
const CONTENT_DIR = join(SITE_ROOT, 'content');
const CACHE_DIR = join(SITE_ROOT, 'static', 'mermaid-cache');
const DATA_DIR = join(SITE_ROOT, 'data');
const MANIFEST_PATH = join(DATA_DIR, 'mermaid-manifest.json');
const PUPPETEER_CONFIG = join(THEME_DIR, 'mermaid', 'puppeteer-config.json');
const SENTINEL_CFG = JSON.parse(readFileSync(join(THEME_DIR, 'mermaid', 'sentinel-colors.json'), 'utf-8'));

const CSS_VAR_MAP = {};
for (const [, entry] of Object.entries(SENTINEL_CFG.sentinelColors)) {
  CSS_VAR_MAP[entry.sentinel] = entry.mapsTo;
}

function buildMermaidConfig() {
  const themeVariables = {};
  for (const [key, entry] of Object.entries(SENTINEL_CFG.sentinelColors)) {
    themeVariables[key] = entry.sentinel;
  }
  return { theme: 'default', themeVariables };
}

function extractMermaidBlocks(content) {
  const blocks = [];
  const fencedRegex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  while ((match = fencedRegex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  const shortcodeRegex = /\{\{<\s*mermaid\s*>\}\}([\s\S]*?)\{\{<\s*\/mermaid\s*>\}\}/g;
  while ((match = shortcodeRegex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

function* walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield fullPath;
    }
  }
}

function postProcessSvg(svg) {
  let result = svg;
  for (const [sentinel, cssVar] of Object.entries(CSS_VAR_MAP)) {
    result = result.replaceAll(`"${sentinel}"`, `"${cssVar}"`);
    result = result.replaceAll(`:${sentinel}`, `:${cssVar}`);
    result = result.replaceAll(`: ${sentinel}`, `: ${cssVar}`);
  }
  const rules = SENTINEL_CFG.hardcodedDefaults;
  for (const rule of rules) {
    const escaped = rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replaceAll(escaped, rule.to);
  }
  return result;
}

function getMermaidVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(THEME_DIR, 'node_modules', '@mermaid-js', 'mermaid-cli', 'package.json'), 'utf-8'));
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

function renderWithMmdc(source) {
  const tmpDir = join(THEME_DIR, 'node_modules', '.tmp-mermaid');
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  const tmpId = createHash('md5').update(source).digest('hex');
  const inputPath = join(tmpDir, `${tmpId}.mmd`);
  const outputPath = join(tmpDir, `${tmpId}.svg`);
  const configPath = join(tmpDir, `${tmpId}.config.json`);

  writeFileSync(inputPath, source, 'utf-8');
  writeFileSync(configPath, JSON.stringify(buildMermaidConfig()), 'utf-8');

  const mmdcPath = join(THEME_DIR, 'node_modules', '.bin', 'mmdc');
  const cmd = `"${mmdcPath}" -i "${inputPath}" -o "${outputPath}" -c "${configPath}" -p "${PUPPETEER_CONFIG}" --backgroundColor transparent`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    const svg = readFileSync(outputPath, 'utf-8');
    return svg;
  } finally {
    try { unlinkSync(inputPath); } catch {}
    try { unlinkSync(outputPath); } catch {}
    try { unlinkSync(configPath); } catch {}
  }
}

async function main() {
  process.stdout.write('[mermaid-cache] Scanning content/ for diagrams...\n');

  const diagramSet = new Map();

  for (const filePath of walkDir(CONTENT_DIR)) {
    const content = readFileSync(filePath, 'utf-8');
    const blocks = extractMermaidBlocks(content);
    for (const source of blocks) {
      if (!source) continue;
      const hash = createHash('sha256').update(source).digest('hex');
      if (!diagramSet.has(hash)) {
        diagramSet.set(hash, source);
      }
    }
  }

  if (diagramSet.size === 0) {
    process.stdout.write('[mermaid-cache] No diagrams found.\n');
    writeManifest({});
    return;
  }

  process.stdout.write(`[mermaid-cache] Found ${diagramSet.size} unique diagram(s).\n`);

  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  let rendered = 0;
  let cached = 0;
  const mmdcPath = join(THEME_DIR, 'node_modules', '.bin', 'mmdc');

  if (!existsSync(mmdcPath)) {
    process.stderr.write('[mermaid-cache] ERROR: mmdc not found. Run "npm install" inside themes/spaceboy/ first.\n');
    process.exit(1);
  }

  for (const [hash, source] of diagramSet) {
    const outputPath = join(CACHE_DIR, `${hash}.svg`);

    if (existsSync(outputPath)) {
      cached++;
      continue;
    }

    process.stdout.write(`[mermaid-cache] Rendering ${hash}...\n`);

    try {
      const svg = renderWithMmdc(source);
      const processed = postProcessSvg(svg);
      writeFileSync(outputPath, processed, 'utf-8');
      rendered++;
    } catch (err) {
      process.stderr.write(`[mermaid-cache] Failed to render ${hash}: ${err.message}\n`);
    }
  }

  const outputMeta = {};
  for (const [hash] of diagramSet) {
    if (existsSync(join(CACHE_DIR, `${hash}.svg`))) {
      outputMeta[hash] = `${hash}.svg`;
    }
  }

  writeManifest(outputMeta);
  process.stdout.write(`[mermaid-cache] Done: ${rendered} rendered, ${cached} cached, ${Object.keys(outputMeta).length} total.\n`);
}

function writeManifest(diagrams) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const manifest = {
    meta: {
      mermaid_version: getMermaidVersion(),
      generated_at: new Date().toISOString(),
      total: Object.keys(diagrams).length,
    },
    diagrams,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  process.stdout.write(`[mermaid-cache] Manifest written: ${MANIFEST_PATH}\n`);
}

main().catch(err => {
  process.stderr.write(`[mermaid-cache] Error: ${err.stack}\n`);
  process.exit(1);
});
