# KaTeX Support in Spaceboy Theme

## Overview

Math expressions (`$...$` inline, `$$...$$` block) are **pre-rendered at build time** by `scripts/render-katex-cache.mjs`. The rendered HTML is cached in `data/katex-cache.json` and injected at render time — no JavaScript KaTeX runtime is needed.

Only the KaTeX CSS (`katex.min.css`) is loaded for font sizing and class styling. No KaTeX JS, no auto-render.

## Usage

Write math using standard LaTeX delimiters in your markdown:

```markdown
Inline: $E = mc^2$

Display: $$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$
```

### Supported delimiters

| Delimiter | Type | Example |
|-----------|------|---------|
| `$...$` | Inline | `$\alpha + \beta$` |
| `$$...$$` | Block (display) | `$$\sum_{i=1}^n i$$` |
| `\(...\)` | Inline (alternative) | `\(\frac{1}{2}\)` |
| `\[...\]` | Block (alternative) | `\[\int_a^b f(x) dx\]` |

### Detection heuristic

The pre-render script scans markdown files for `$...$` and `$$...$$` expressions. To avoid false positives (jQuery selectors, currency amounts), inline `$...$` must contain at least one LaTeX command (`\frac`, `\sum`, etc.) or a `^`/`_` character.

Bare `$x$` or `$('selector')` patterns are ignored.

### Pre-render after changes

After adding or editing math expressions, run:

```bash
npm run build:diagrams
```

This rebuilds `data/katex-cache.json`. Commit the updated file.

## Configuration

### CSS CDN URL

```toml
[params]
  katexCSSCDN = "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
```

Default loads from jsDelivr. Set a local path via `katexCSSLocal` (place the file at `static/vendor/katex/katex.min.css`). No KaTeX JS is ever loaded.

### Disable CDN fallback

```toml
[params]
  enableCDNFallback = false
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Math shows as raw `$..$` code | Expression not in `data/katex-cache.json` | Run `npm run build:diagrams` and commit |
| Math renders but looks wrong | `katex.min.css` not loaded | Check `katexCSSCDN` param or network |
| KaTeX cache error | Expression has syntax error | Check expression syntax, fix and re-run |
