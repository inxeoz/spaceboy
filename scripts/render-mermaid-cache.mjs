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

// Bump RENDERER_VERSION when post-processing logic changes. Together with the
// sentinel config it forms a fingerprint: when it differs from the one stored
// in the manifest, every diagram is re-rendered (cache files are keyed only by
// diagram source, so config changes would otherwise never propagate).
const RENDERER_VERSION = 5;
const CONFIG_FINGERPRINT = createHash('sha256')
  .update(JSON.stringify(SENTINEL_CFG))
  .update(`v${RENDERER_VERSION}`)
  .digest('hex')
  .slice(0, 16);

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

function parseHex(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
}

function hexLuminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const lin = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const [r, g, b] = rgb.map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Dark-mode companion for a user-picked color: keep the hue, drop lightness
// to a muted panel level so light text and themed lines read on top of it.
function darkVariant(hex) {
  const [r, g, b] = parseHex(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s2 = Math.min(s * 0.6, 0.55);
  const l2 = 0.27;
  const c = (1 - Math.abs(2 * l2 - 1)) * s2;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l2 - c / 2;
  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return '#' + rgb.map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

// User `style`/`classDef` fills are baked into the SVG as literal colors that
// never flip with the site theme. For every cluster/node whose shape carries a
// literal hex fill:
//   - swap the fill for var(--sb-c-<hex>, <original>) and emit a muted dark
//     variant of the same hue under [data-theme="dark"], so panels go dark
//     with the rest of the page instead of glaring at full brightness;
//   - pin the label to a color that contrasts with whichever fill is active.
// Light mode uses the var fallbacks and stays pixel-identical.
function themeUserColors(svg) {
  const varDefs = new Map();
  const parts = svg.split(/(?=<g class="(?:cluster|node)[\s"])/);
  const out = parts.map(function (part, i) {
    if (i === 0) return part;
    const shape = part.match(/<(?:rect|circle|ellipse|polygon|path)[^>]*style="[^"]*fill:\s*(#[0-9a-fA-F]{3,6})\b[^"]*"/);
    if (!shape) return part;
    const hex = shape[1];
    const lum = hexLuminance(hex);
    if (lum === null) return part;
    const key = hex.slice(1).toLowerCase();
    const dark = darkVariant(hex);
    varDefs.set(key, { fill: dark, label: hexLuminance(dark) > 0.4 ? '#1f2937' : '#f0f0f0' });
    const themedShape = shape[0].replace(/fill:\s*#[0-9a-fA-F]{3,6}\b/, `fill:var(--sb-c-${key}, ${hex})`);
    part = part.replace(shape[0], themedShape);
    const label = `var(--sb-cl-${key}, ${lum > 0.4 ? '#1f2937' : '#f5f5f5'})`;
    if (/<span class="nodeLabel[^"]*" style="/.test(part)) {
      return part.replace(/(<span class="nodeLabel[^"]*" style=")/, `$1color:${label} !important;`);
    }
    return part.replace(/(<span class="nodeLabel[^"]*")/, `$1 style="color:${label} !important"`);
  }).join('');
  if (!varDefs.size) return out;
  let css = '[data-theme="dark"]{';
  for (const [key, v] of varDefs) {
    css += `--sb-c-${key}:${v.fill};--sb-cl-${key}:${v.label};`;
  }
  css += '}';
  return out.replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`);
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
  return themeUserColors(result);
}

function getMermaidVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(THEME_DIR, 'node_modules', '@mermaid-js', 'mermaid-cli', 'package.json'), 'utf-8'));
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

// Puppeteer config to use: starts as the static file; if puppeteer's managed
// Chrome is missing, falls back to a system browser (env override respected).
let activePuppeteerConfig = PUPPETEER_CONFIG;

function findSystemBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome']) {
    try {
      const p = execSync(`command -v ${bin}`, { stdio: 'pipe' }).toString().trim();
      if (p) return p;
    } catch {}
  }
  return null;
}

function makeSystemBrowserConfig(tmpDir) {
  const browser = findSystemBrowser();
  if (!browser) return null;
  const base = JSON.parse(readFileSync(PUPPETEER_CONFIG, 'utf-8'));
  base.executablePath = browser;
  const path = join(tmpDir, 'puppeteer-system.config.json');
  writeFileSync(path, JSON.stringify(base), 'utf-8');
  process.stdout.write(`[mermaid-cache] Puppeteer Chrome unavailable — using system browser: ${browser}\n`);
  return path;
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
  const run = puppeteerCfg => execSync(
    `"${mmdcPath}" -i "${inputPath}" -o "${outputPath}" -c "${configPath}" -p "${puppeteerCfg}" --backgroundColor transparent`,
    { stdio: 'pipe', timeout: 60000 }
  );

  try {
    try {
      run(activePuppeteerConfig);
    } catch (err) {
      const msg = String(err.stderr || err.message || '');
      if (activePuppeteerConfig === PUPPETEER_CONFIG && msg.includes('Could not find Chrome')) {
        const fallback = makeSystemBrowserConfig(tmpDir);
        if (!fallback) throw err;
        run(fallback);
        activePuppeteerConfig = fallback;
      } else {
        throw err;
      }
    }
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
    writeManifest({}, CONFIG_FINGERPRINT);
    return;
  }

  process.stdout.write(`[mermaid-cache] Found ${diagramSet.size} unique diagram(s).\n`);

  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  let rendered = 0;
  let cached = 0;
  let failed = 0;
  const mmdcPath = join(THEME_DIR, 'node_modules', '.bin', 'mmdc');

  if (!existsSync(mmdcPath)) {
    process.stderr.write('[mermaid-cache] ERROR: mmdc not found. Run "npm install" inside themes/spaceboy/ first.\n');
    process.exit(1);
  }

  // Cache files are keyed by diagram source only — when the sentinel config or
  // renderer changes, every cached SVG is stale and must be re-rendered.
  let prevFingerprint = null;
  if (existsSync(MANIFEST_PATH)) {
    try {
      prevFingerprint = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')).meta.config_fingerprint || null;
    } catch {}
  }
  const forceRender = prevFingerprint !== CONFIG_FINGERPRINT;
  if (forceRender) {
    process.stdout.write('[mermaid-cache] Config/renderer changed — re-rendering all diagrams.\n');
  }

  for (const [hash, source] of diagramSet) {
    const outputPath = join(CACHE_DIR, `${hash}.svg`);

    if (!forceRender && existsSync(outputPath)) {
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
      failed++;
      process.stderr.write(`[mermaid-cache] Failed to render ${hash}: ${err.message}\n`);
    }
  }

  const outputMeta = {};
  for (const [hash] of diagramSet) {
    if (existsSync(join(CACHE_DIR, `${hash}.svg`))) {
      outputMeta[hash] = `${hash}.svg`;
    }
  }

  // Prune cache files for diagrams that no longer exist in content/
  for (const file of readdirSync(CACHE_DIR)) {
    if (file.endsWith('.svg') && !outputMeta[file.slice(0, -4)]) {
      unlinkSync(join(CACHE_DIR, file));
      process.stdout.write(`[mermaid-cache] Pruned stale ${file}\n`);
    }
  }

  // On failures keep the previous fingerprint so the next run retries the
  // stale diagrams instead of treating them as up to date.
  writeManifest(outputMeta, failed === 0 ? CONFIG_FINGERPRINT : prevFingerprint);
  process.stdout.write(`[mermaid-cache] Done: ${rendered} rendered, ${cached} cached, ${failed} failed, ${Object.keys(outputMeta).length} total.\n`);
  if (failed > 0) process.exitCode = 1;
}

function writeManifest(diagrams, fingerprint) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const manifest = {
    meta: {
      mermaid_version: getMermaidVersion(),
      config_fingerprint: fingerprint || null,
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
