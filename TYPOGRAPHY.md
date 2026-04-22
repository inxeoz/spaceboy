# Typography Specification - Spaceboy Theme

## Font Stack

All typography uses monospace fonts only for consistency and technical aesthetic.

### Primary Fonts
- **Body & Headers**: `JetBrains Mono` (fallback: `Fira Code`, then system `monospace`)
- **Code Blocks**: `Fira Code` (fallback: `JetBrains Mono`, then system `monospace`)

No sans-serif fonts. Pure monospace throughout.

---

## Font Sizing & Weight Hierarchy

### Base & Body Text
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|---|
| Body/Base | 1rem (16px) | 300 (light) | 1.8 | normal |
| Navigation | 0.9rem | 400 (normal) | 1.6 | normal |
| Footer | 0.85rem | 300 (light) | 1.7 | normal |

### Content Text
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|---|
| Paragraph | 1rem | 400 (normal) | 1.85 | normal |
| List items | 1rem | 400 (normal) | 1.8 | normal |
| Blockquote | 1rem | 400 (normal) | 1.8 | normal |
| Excerpt (card) | 0.9rem | 300 (light) | 1.65 | normal |
| Meta (date/tags) | 0.9rem | 400 (normal) | 1.6 | normal |
| Code inline | 0.9rem | 400 (normal) | 1 | normal |
| Code block | 0.9rem | 400 (normal) | 1.6 | normal |

### Headers
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|---|
| Post Title (H0) | 2.25rem | 700 (bold) | 1.3 | tight (-0.02em) |
| H1 | 1.85rem | 700 (bold) | 1.4 | tight |
| H2 | 1.6rem | 700 (bold) | 1.35 | tight |
| H3 | 1.4rem | 600 (semibold) | 1.35 | tight |
| H4 | 1.2rem | 600 (semibold) | 1.35 | tight |
| H5 | 1.1rem | 500 (medium) | 1.3 | tight |
| H6 | 1rem | 500 (medium) | 1.3 | tight |
| Site Title | 1.65rem | 700 (bold) | 1.3 | tight |
| Card Title | 1.35rem | 600 (semibold) | 1.35 | tight |

### Taxonomy & Lists
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Taxonomy title | 2rem | 700 (bold) | 1.4 |
| Related title | 1.25rem | 600 (semibold) | 1.35 |

---

## Spacing & Vertical Rhythm

### Margins
| Element | Top | Bottom |
|---------|-----|--------|
| Paragraph | — | 1.75em |
| H1 | 2.5rem | 1.25rem |
| H2 | 2.25rem | 1.1rem |
| H3 | 2rem | 0.9rem |
| H4 | 1.75rem | 0.75rem |
| H5 | 1.5rem | 0.6rem |
| H6 | 1.25rem | 0.5rem |
| Blockquote | 1.75em | 1.75em |
| Code block (pre) | 1.75em | 1.75em |
| Post title | 0 | 1.5rem |
| Related posts | 3rem top border | — |

### Padding
| Element | Padding |
|---------|---------|
| Content area | 0 (auto margins) | 
| Blockquote | 1.25em left/right, 1.25em top/bottom |
| Code block | 1.25rem all sides |
| Inline code | 0.25em horizontal, 0em vertical |
| Gallery caption | 1rem all sides |
| List indent | 1.75em left |
| Footer | 2.5rem vertical, 0 horizontal |

### Gaps
| Element | Gap |
|---------|-----|
| Navigation groups | 1.25rem |
| List items | 0.65em (bottom margin) |
| Footer text | 0.5rem |
| Post meta | 1.25rem (between items) |

---

## Letter Spacing

Three letter-spacing levels for differentiation:

| Level | Value | Usage |
|-------|-------|-------|
| **Tight** | -0.02em | All headers (H1–H6), site title, post title, card titles |
| **Normal** | 0em | Body text, code, navigation, meta |
| **Wide** | 0.02em | Reserved for future emphasis (not currently used) |

---

## Line Height Strategy

Staggered by content type for clarity:

- **Headers**: 1.3–1.4 (compact, tight) → visual weight & impact
- **Body/List**: 1.8–1.85 (spacious) → readability
- **Code**: 1.6 (compact) → density appropriate for monospace
- **Meta/Small**: 1.6–1.7 (slightly compressed) → distinction

---

## Color Coordination

Font weight + size differentiation works with color variables:

- **Primary text** (headers, body): `--text-color` + weight/size
- **Secondary text** (meta, footer): `--secondary-text` + light weight
- **Code blocks**: `--code-bg` + `--text-color` on darker background

---

## Responsive Adjustments

### Mobile (max-width: 640px)
- Post title: `1.5rem` → `1.5rem` (maintained)
- Post link: `1.25rem` → `1.05rem`
- Content font: `1rem` → `1rem` (maintained for readability)
- H2: `1.5rem` → `1.18rem`
- H3: `1.25rem` → `1.05rem`

### Small Mobile (max-width: 420px)
- Body: `1rem` → `0.9375rem`
- Post content: `1rem` → `0.95rem`
- Site title: `1.65rem` → `1.2rem`
- H1: `1.85rem` → `1.28rem`
- H2: `1.6rem` → `1.18rem`
- H3: `1.4rem` → `1.05rem`
- Line height: `1.8` → `1.6`

### Extra Small (max-width: 320px)
- Body: `1rem` → `0.8125rem`
- Post content: `1rem` → `0.9rem`
- Site title: `1.65rem` → `1.05rem`
- Post title: `2.25rem` → `1.1rem`
- Line height: `1.8` → `1.55`

### Large Screens (min-width: 1600px)
- All typography maintained at base sizes
- Benefit from larger viewport & content width increase

---

## Weight Reference

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Body baseline, excerpts, footer |
| Normal | 400 | Paragraphs, lists, code, nav, meta |
| Medium | 500 | H5, H6 |
| Semibold | 600 | H3, H4, card titles |
| Bold | 700 | H1, H2, post titles, site title |

---

## Visual Hierarchy Implementation

1. **Weight first**: 300→700 creates primary distinction
2. **Size second**: 0.85rem→2.25rem reinforces weight
3. **Letter spacing**: Tight on headers (visual compactness), normal on body (readability)
4. **Color**: Secondary text lighter for visual receding
5. **Line height**: Varies by element type for density control

---

## CSS Variables

```css
:root {
    --font-body: 'JetBrains Mono', 'Fira Code', monospace;
    --font-mono: 'Fira Code', 'JetBrains Mono', monospace;
    
    --line-height-body: 1.8;
    --font-size-base: 1rem;
    
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --letter-spacing-tight: -0.02em;
    --letter-spacing-normal: 0em;
    --letter-spacing-wide: 0.02em;
}
```

---

## Implementation Notes

### Monospace Considerations
- **Readability**: 1rem+ size + light/normal weight prevents "code-heavy" feeling
- **Density**: Tight letter spacing on headers balances monospace width
- **Consistency**: Same fonts everywhere creates cohesive, technical aesthetic
- **Performance**: JetBrains Mono & Fira Code load via system fonts when available

### Accessibility
- Min font size: 0.85rem (footer) - still readable in monospace
- Line heights 1.3+ for headers, 1.6+ for body - WCAG compliant
- Weight contrast: 300–700 provides visual distinction for dyslexic readers
- Color + weight: Never relies on color alone for emphasis

### Maintenance
- All font rules use CSS variables for global updates
- Responsive breakpoints at 640px, 420px, 320px, 1600px+
- Letter spacing variables reserved for future expandability

---

## Testing Checklist

- [ ] Headers render bold/semibold, distinct from body
- [ ] Body text 1rem is readable at arm's length on laptop
- [ ] Code blocks stand out via size + background
- [ ] Lists have clear spacing between items
- [ ] Blockquotes visually distinct via indent + border + weight
- [ ] Mobile: text size reduces gracefully, readability maintained
- [ ] Dark/light modes preserve contrast with weight/size hierarchy
- [ ] Print: monospace fonts render clearly (test in Firefox print preview)
