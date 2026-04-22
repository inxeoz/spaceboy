# Spaceboy Hugo Theme

Minimal Hugo blog theme with dark/light mode, syntax highlighting, responsive design, Mermaid diagrams, and KaTeX math.

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

  [[params.socials]]
    name = "GitHub"
    link = "https://github.com/username"
```

## Configuration

```toml
[params]
  mainSections = ["posts"]
  enableCopyCode = true
  lazyImage = true
  favicon = "/favicon.ico"
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
---
```

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

### Table of Contents

```yaml
showToc: true
```

## Diagrams

### Mermaid (markdown)

```mermaid

  graph TD;
      A --> B;

```

### Mermaid (shortcode)

```mermaid
{{< mermaid >}}
graph TD;
    A --> B;
{{< /mermaid >}}
```

## Math

### KaTeX (native)

Inline: `$x^2 + y^2 = z^2$`

Display:
```
$$
f(x) = \frac{1}{1 + e^{-x}}
$$
```

### KaTeX (shortcode)

```markdown
{{< katex >}}x^2{{< /katex >}}
{{< katex block >}}f(x) = \frac{1}{1 + e^{-x}}{{< /katex >}}
```

## Shortcodes

### Center

```markdown
{{< center >}}
![img](url)
{{< /center >}}
```

## Custom CSS

Create `assets/css/override.css`:

```css
:root {
  --link-color: #ff6b6b;
}
```

## Full hugo.toml

```toml
theme = "spaceboy"

title = "Your Site Title"

[markup]
  [markup.highlight]
    style = "catppuccin-frappe"
    noClasses = true

[params]
  mainSections = ["posts"]
  enableCopyCode = true
  lazyImage = true
  favicon = "/favicon.ico"

  [[params.nav]]
    name = "Home"
    link = "/"
  [[params.nav]]
    name = "About"
    link = "/about"
  [[params.nav]]
    name = "Gallery"
    link = "/gallery"

  [[params.socials]]
    name = "GitHub"
    link = "https://github.com/username"

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

## Screenshots

![Home](./demo/home.png)

---

![Home Dark](./demo/home-dark.png)

---

![Home List](./demo/home-list.png)

---

![Post](./demo/post.png)
