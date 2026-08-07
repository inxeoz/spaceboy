# Spaceboy Hugo Theme

Minimal Hugo blog theme with dark/light mode, 33 color palettes, syntax highlighting, pre-rendered Mermaid diagrams, and pre-rendered KaTeX math.

## Quick Start

```toml
theme = "spaceboy"

[params]
  mainSections = ["posts"]

  [[params.nav]]
    name = "Home"
    link = "/"
  [[params.nav]]
    name = "About"
    link = "/about"
```

## Configuration

```toml
[params]
  mainSections = ["posts"]
  enableCopyCode = true
  lazyImage = true
  favicon = "/favicon.ico"
  enableSearch = true
  enableCDNFallback = true
  staticPrefix = ""
  headTitle = "Site Name"
  ogImage = "/images/og-default.png"
  description = "Site description for meta tags"
  showReadingTime = true

  # Author
  [params.author]
    name = "Your Name"

  # Navigation
  [[params.nav]]
    name = "Home"
    link = "/"
  [[params.nav]]
    name = "About"
    link = "/about"

  # Social links (displayed in header)
  [[params.socials]]
    name = "github"
    link = "https://github.com/you"
  [[params.socials]]
    name = "twitter"
    link = "https://twitter.com/you"

  # Post template injection (raw HTML — use with caution)
  # postHeaderContent = "<div>Ad banner</div>"
  # postFooterContent = "<div>Newsletter signup</div>"
  # postAds = "<div>Ad unit</div>"
  # extraHead = "<meta name='theme-color' content='#000'>"
  # extraBody = "<script>/* analytics */</script>"

  # Custom assets (site-level)
  # customHead = "<link rel='webmention' href='https://webmention.io/...' />"
  # customCSS = ".my-class { color: red; }"
  # customJS = "console.log('hello')"

  # Fuse.js search (CDN with optional SRI)
  # fuseJSCDN = "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"
  # fuseJSCDNIntegrity = "sha384-..."
  # fuseJSLocal = "/vendor/fuse.min.js"

  # KaTeX (CDN or local)
  # katexCSS = "/vendor/katex/katex.min.css"
  # katexCSSLocal = "/vendor/katex/katex.min.css"
  # katexCSSCDN = "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
```

## Content

### Post Frontmatter

```yaml
---
title: "Post Title"
date: 2024-01-01
draft: false
tags: ["tag1"]
categories: ["Tech"]
description: "Custom meta description"
coverImage: "/images/cover.jpg"
heroImage: "/images/hero.jpg"
epigraph: "A quote at the top of the post"
abstract: "A short summary shown before content"
series: "my-series"
author:
  homepage: "https://example.com"
---
```

### Frontmatter Options

All options are optional and default to `false` unless noted.

| Option | Type | Description |
|--------|------|-------------|
| `showToc` | bool | Show table of contents sidebars (desktop) and mobile toggle |
| `showTitle` | bool | Show the post title (default: `true`) |
| `showDate` | bool | Show publish date in meta |
| `showAuthor` | bool | Show author name in meta |
| `showWordCount` | bool | Show word count in meta |
| `showReadingTime` | bool | Show estimated reading time |
| `showLastModified` | bool | Show "Updated" date if different from publish date |
| `showTags` | bool | Show tags at bottom of post |
| `showShare` | bool | Show share buttons |
| `showRelatedPosts` | bool | Show related posts section |
| `showPostNav` | bool | Show older/newer post navigation |
| `showComments` | bool | Show Disqus comments (if configured) |
| `dropCap` | bool | Show a large drop cap on the first paragraph |
| `numberedHeadings` | bool | Auto-number headings (e.g. 1.1, 1.2) |
| `justify` | bool | Justify body text |
| `imageFullBleed` | bool | Images break out of content width |
| `progressBar` | bool | Show a reading progress bar at the top |
| `noMeta` | bool | Hide all post meta (date, author, reading time) |
| `hideFooter` | bool | Hide tags, share, related, comments, and post nav |
| `noindex` | bool | Add `<meta name="robots" content="noindex">` |
| `noSearch` | bool | Exclude from search index |
| `font` | string | Override body font: `serif`, `sans`, `mono`, or custom font stack |
| `contentWidth` | string | Override content width: `normal`, `wide`, `full`, or CSS value |
| `codeMaxHeight` | string | Override code block max height (e.g. `48rem`) |
| `hrStyle` | string | Horizontal rule style: `full`, `small`, or CSS width |
| `viewMode` | string | Layout mode: `goofy`, `docs`, `poem`, `minimal`, or a palette name |
| `leftSidebarContent` | string | Raw HTML injected into left sidebar (TOC area) |
| `rightSidebarContent` | string | Raw HTML injected into right sidebar |
| `tocTitle` | string | Custom title for the mobile TOC toggle (default: "Contents") |

### View Modes

Set `viewMode` in frontmatter to change the post layout:

- **`goofy`** — Large readable text, no meta/footer, drop cap enabled
- **`docs`** — Numbered headings, reading time, progress bar, taller code blocks
- **`poem`** — Centered narrow text, large line height, no meta/footer
- **`minimal`** — Wide content, no footer, auto-noindex
- Any other value is treated as a **palette name** (e.g. `viewMode: "Dracula"`)

### Gallery Page

```yaml
---
title: "Photo Album"
date: 2024-01-01
type: gallery
album: "/images/cover.jpg"
gallery:
  - url: "/images/photo1.jpg"
    name: "Caption"
---
```

## Shortcodes

| Shortcode | Usage | Description |
|-----------|-------|-------------|
| `warning` | `{{</* warning */>}}...{{</* /warning */>}}` | Warning callout box |
| `danger` | `{{</* danger */>}}...{{</* /danger */>}}` | Danger callout box (uses `role="alert"`) |
| `tip` | `{{</* tip */>}}...{{</* /tip */>}}` | Tip callout box |
| `note` | `{{</* note */>}}...{{</* /note */>}}` | Note callout box |
| `info` | `{{</* info */>}}...{{</* /info */>}}` | Info callout box |
| `details` | `{{</* details "Title" */>}}...{{</* /details */>}}` | Collapsible `<details>` section |
| `spoiler` | `{{</* spoiler */>}}...{{</* /spoiler */>}}` | Spoiler (click to reveal) |
| `epigraph` | `{{</* epigraph author="Name" source="Book" */>}}...{{</* /epigraph */>}}` | Blockquote with attribution |
| `poem` | `{{</* poem title="Title" */>}}...{{</* /poem */>}}` | Styled poem block |
| `chapter` | `{{</* chapter number="1" */>}}Chapter Title{{</* /chapter */>}}` | Chapter heading with number |
| `rating` | `{{</* rating 4 5 */>}}` | Star rating (filled/empty stars) |
| `kbd` | `{{</* kbd */>}}Ctrl+K{{</* /kbd */>}}` | Keyboard shortcut styling |
| `center` | `{{</* center */>}}...{{</* /center */>}}` | Centered content |
| `mermaid` | `{{</* mermaid */>}}...{{</* /mermaid */>}}` | Mermaid diagram (pre-rendered) |
| `katex` | `{{</* katex */>}}\frac{1}{2}{{</* /katex */>}}` | KaTeX math. Add `block="true"` for display mode |
| `rawhtml` | `{{</* rawhtml */>}}<b>HTML</b>{{</* /rawhtml */>}}` | Raw HTML passthrough |

All callout shortcodes accept an optional `title` parameter:
`{{</* warning title="Caution" */>}}...{{</* /warning */>}}`

## Diagrams (Mermaid)

Diagrams are **pre-rendered to SVGs at build time** — no browser-side JS required.
SVGs use CSS variables so they adapt to the active color palette automatically.

### Fenced code block

~~~markdown
```mermaid
graph TD;
    A --> B;
```
~~~

### Shortcode

```markdown
{{< mermaid >}}
graph TD;
    A --> B;
{{< /mermaid >}}
```

### Build setup

```bash
cd themes/spaceboy && npm install   # installs @mermaid-js/mermaid-cli
node scripts/render-mermaid-cache.mjs  # renders SVGs into site/static/mermaid-cache/
```

Or from the site root: `npm run build:diagrams`

Rendered SVGs and `data/mermaid-manifest.json` should be committed to git so
any host running plain `hugo` can serve diagrams without the build scripts.

## Math (KaTeX)

Math is **pre-rendered to HTML at build time** — no KaTeX JS required at runtime.
KaTeX CSS is still needed for the rendered output.

Enable goldmark passthrough in `hugo.toml`:

```toml
[markup.goldmark.extensions.passthrough]
  enable = true
  [markup.goldmark.extensions.passthrough.delimiters]
    block = [["$$", "$$"]]
    inline = [["$", "$"]]
```

### Inline math

```markdown
The sigmoid function $f(x) = \frac{1}{1 + e^{-x}}$ maps any value to (0, 1).
```

### Display math

```markdown
$$
f(x) = \frac{1}{1 + e^{-x}}
$$
```

### Build setup

```bash
node scripts/render-katex-cache.mjs  # renders expressions into site/data/katex-cache.json
```

Or from the site root: `npm run build:diagrams`

`data/katex-cache.json` should be committed to git.

**Detection heuristic:** inline `$...$` is only treated as math if the content
contains a LaTeX command (`\frac`, `\sum`, `\times`, etc.) or `^`/`_`. This
avoids false positives from JavaScript `$('selector')` patterns.

## Color Palettes

33 palettes are defined in `data/color-schemes.yaml`. Switch palettes at runtime
via the palette overlay in the UI. Each palette has 6 fields:

```yaml
PaletteName:
  light: '--bg-color:#fff;...'
  dark: '--bg-color:#111;...'
  syntax-light: '--syn-bg:#fff;--syn-keyword:#d73a49;...'
  syntax-dark: '--syn-bg:#282a36;--syn-keyword:#ff79c6;...'
  mermaid-light: '--link-color:#0070f3;...'   # empty string = use defaults
  mermaid-dark: '--link-color:#ff79c6;...'
```

To add or modify a palette, edit `data/color-schemes.yaml` only — this is the
single source of truth. Changes take effect on the next Hugo build with no
template changes required.

## Syntax Highlighting

Token colors use CSS variables (`--syn-*`) so they adapt to the active palette.

```toml
[markup.highlight]
  style = "tokyonight-moon"   # base style (overridden by --syn-* vars at runtime)
  noClasses = false
```

## Custom CSS

Create `assets/css/override.css` in your site:

```css
:root {
  --link-color: #ff6b6b;
}
```

## Hugo Version Compatibility

The theme requires Hugo **0.132+** (for goldmark passthrough extension and `render-passthrough.html`).

**Important for templates:** use `site.Data`, not `hugo.Data`. The `hugo.Data`
API was added in Hugo 0.156 and breaks on older Hugo versions (e.g. Cloudflare
Pages ships 0.147). `site.Data` works on all supported versions.

## Security Note

Several params accept raw HTML via `safeHTML`: `postHeaderContent`,
`postFooterContent`, `postAds`, `extraHead`, `extraBody`, `customHead`,
`customCSS`, `customJS`, `leftSidebarContent`, `rightSidebarContent`, and
`rawhtml` shortcode. These bypass Hugo's auto-escaping.

**This is safe for single-author sites** where you control all content. For
multi-author or untrusted content, consider removing `safeHTML` from the
relevant templates or restricting which params are allowed.

## Screenshots

![Home](./demo/home.png)

---

![Home Dark](./demo/home-dark.png)

---

![Home List](./demo/home-list.png)

---

![Post](./demo/post.png)
