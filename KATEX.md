# KaTeX Support in Spaceboy Theme

## Overview
The spaceboy theme now includes built-in support for KaTeX mathematical notation rendering. Math expressions can be written using standard LaTeX syntax and are automatically rendered on the page.

## Configuration

Add these optional parameters to your `hugo.toml` file to customize KaTeX CDN URLs:

```toml
[params]
  # KaTeX CSS CDN URL (defaults to jsDelivr)
  katexCSSCDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
  
  # KaTeX main JS CDN URL (defaults to jsDelivr)
  katexJSCDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
  
  # KaTeX auto-render extension JS CDN URL (defaults to jsDelivr)
  katexAutoRenderJSCDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
```

### Configuring Delimiters

You can customize which delimiters trigger math rendering by adding `katexDelimiters` to your `hugo.toml`. **Important: Delimiters must be defined AFTER the `[params]` section at the root level:**

```toml
[params]
  # ... other params ...

# KaTeX delimiters - note the placement OUTSIDE [params] section!
[[params.katexDelimiters]]
  left = "$$"
  right = "$$"
  display = true

[[params.katexDelimiters]]
  left = "$"
  right = "$"
  display = false

[[params.katexDelimiters]]
  left = "\\("
  right = "\\)"
  display = false

[[params.katexDelimiters]]
  left = "\\["
  right = "\\]"
  display = true
```

**Delimiter options:**
- `left` - Opening delimiter string
- `right` - Closing delimiter string  
- `display` - Whether this is display mode (true) or inline mode (false)

**Examples of custom configurations:**

Only dollar signs (no LaTeX delimiters):
```toml
[[params.katexDelimiters]]
  left = "$"
  right = "$"
  display = false

[[params.katexDelimiters]]
  left = "$$"
  right = "$$"
  display = true
```

Only LaTeX delimiters (no dollar signs):
```toml
[[params.katexDelimiters]]
  left = "\\("
  right = "\\)"
  display = false

[[params.katexDelimiters]]
  left = "\\["
  right = "\\]"
  display = true
```

Only double dollars (no single dollar):
```toml
[[params.katexDelimiters]]
  left = "$$"
  right = "$$"
  display = true
```

**Important:** Always place the `[[params.katexDelimiters]]` arrays after all `[params]` content and before any other root-level sections.

### Using Local Files
To use locally hosted KaTeX files instead of CDN, place them in:
- `static/vendor/katex/katex.min.css`
- `static/vendor/katex/katex.min.js`
- `static/vendor/katex/contrib/auto-render.min.js`

The theme will use local files if available and fall back to CDN.

## Usage

### Inline Math
Use single dollar signs for inline math:

```markdown
Einstein's famous equation is $E = mc^2$.
```

Renders as: Einstein's famous equation is $E = mc^2$.

### Display Math (Block)
Use double dollar signs for display math (centered on its own line):

```markdown
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### Using Shortcode (Inline)
```markdown
{{< katex >}}E = mc^2{{< /katex >}}
```

### Using Shortcode (Block)
```markdown
{{< katex block="true" >}}
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
{{< /katex >}}
```

### LaTeX Delimiters Supported
- `$...$` - inline math
- `$$...$$` - display math
- `\(...\)` - inline math (alternative)
- `\[...\]` - display math (alternative)

## Examples

### Greek Letters
```markdown
$\alpha + \beta = \gamma$
```

### Fractions
```markdown
The fraction is $\frac{1}{2}$ or $\frac{3}{4}$.
```

### Matrices
```markdown
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$
```

### Summations
```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

## Performance

KaTeX is only loaded and rendered on pages that contain math expressions. The theme detects:
- Pages using the `{{< katex >}}` shortcode
- Pages containing inline math delimiters (`$...$`)
- Pages containing display math delimiters (`$$...$$`)

Math is re-rendered automatically when the theme is toggled (light/dark mode).

## Troubleshooting

### Math not rendering
1. Check that JavaScript is enabled
2. Verify CDN URLs are accessible
3. Check browser console for errors
4. Ensure math is wrapped in proper delimiters

### CDN fallback not working
If using a custom local path, set `enableCDNFallback = false` in `hugo.toml` to disable CDN fallback.

### Custom KaTeX configuration
To customize KaTeX rendering options, modify the `renderKaTeX()` function in `layouts/partials/scripts.html`.
