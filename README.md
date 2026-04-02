# Spaceboy

A clean, modern Hugo blog theme with dark/light mode, code syntax highlighting, and responsive design.

![Screenshot](./images/screenshot.png)

## Features

### Core
- **Dark/Light Mode** - Toggle between themes with system preference detection
- **Responsive Design** - Mobile-friendly layout that adapts to all screen sizes
- **Blog-Ready** - Optimized for blog content with post listings, tags, and categories
- **SEO Optimized** - Built-in meta tags, Open Graph, Twitter Cards, and canonical URLs

### Content
- **Code Blocks** - Syntax highlighting with one-click copy button
- **Image Gallery** - Grid-based gallery layout with lightbox
- **Image Modal** - Click-to-zoom with pan and scroll support
- **Lazy Loading** - Optional lazy loading for images
- **Related Posts** - Display related content at the end of articles

### Customization
- **Navigation** - Customizable menu links
- **Social Links** - GitHub and other social profiles in header
- **Multi-Language** - Support for Hugo multilingual sites
- **Comments** - Disqus integration
- **Analytics** - Google Analytics support
- **Custom CSS** - Override and extend styles

### Technical
- **RSS/Atom Feeds** - Automatic feed generation
- **Hugo 0.50+** - Compatible with modern Hugo versions
- **No Dependencies** - Vanilla JS, no framework required

## Installation

### Option 1: Clone Repository

```bash
cd themes
git clone https://github.com/yourusername/spaceboy.git
```

### Option 2: Submodule

```bash
git submodule add https://github.com/yourusername/spaceboy.git themes/spaceboy
```

### Option 3: Hugo Module

```bash
hugo mod init github.com/yourusername/spaceboy
hugo mod get -u
```

## Configuration

Add to your site's `hugo.toml`:

```toml
theme = "spaceboy"

[params]
  # Site metadata
  title = "Your Site Title"
  description = "Your site description"
  author = "Your Name"

  # Required: Author info (displayed in posts)
  [params.author]
    name = "Your Name"

  # Main content sections
  mainSections = ["posts"]

  # Navigation menu
  [[params.nav]]
    name = "Home"
    link = "/"
  [[params.nav]]
    name = "About"
    link = "/about"

  # Social links (displayed in header)
  [[params.socials]]
    name = "GitHub"
    link = "https://github.com/yourusername"
```

### Full Configuration Options

```toml
[params]
  # Required
  title = "Your Site Title"
  description = "Your site description"
  author = "Your Name"
  
  [params.author]
    name = "Your Name"
    # Optional: homepage for author link
    homepage = "https://yourwebsite.com"

  # Content sections (default: ["posts"])
  mainSections = ["posts"]

  # Show categories on home page
  showCategories = true

  # Static files prefix (for CDN)
  staticPrefix = ""

  # Favicon
  favicon = "/favicon.ico"

  # Navigation
  [[params.nav]]
    name = "Home"
    link = "/"
  [[params.nav]]
    name = "About"
    link = "/about"
  [[params.nav]]
    name = "Blog"
    link = "/posts"

  # Social links
  [[params.socials]]
    name = "GitHub"
    link = "https://github.com/yourusername"
  [[params.socials]]
    name = "Twitter"
    link = "https://twitter.com/yourusername"

  # Footer links
  [[params.footerLinks]]
    name = "RSS"
    link = "/index.xml"

  # Disqus comments (set your shortname)
  disqus = "your-disqus-shortname"

  # Lazy load images (not on home page)
  lazyImage = true

  # Google Analytics (automatic with Hugo)
  googleAnalytics = "UA-XXXXX-X"

  # Twitter Cards
  TwitterCards = true

  # Extra CSS files
  extraCSSFiles = ["css/custom.css"]

  # Custom content (injected before/after posts)
  postHeaderContent = ""  # HTML before post content
  postFooterContent = ""  # HTML after post content
  postAds = ""            # Ad code before comments

  # Extra head/body content
  extraHead = ""  # Additional HTML in <head>
  extraBody = ""  # Additional HTML before </body>
```

## Creating Content

### Blog Post

```markdown
---
title: "My First Post"
date: 2024-01-01
draft: false
author: "Your Name"
tags: ["hugo", "blog"]
categories: ["tech"]
---

Your content here...
```

### Gallery Page

Create `content/gallery/my-album.md`:

```markdown
---
title: "Photo Album"
date: 2024-01-01
type: gallery
album: "/images/album-cover.jpg"
---

Add gallery images using Hugo figure shortcodes or markdown images.
```

## Directory Structure

```
spaceboy/
├── archetypes/
│   └── default.md      # Content archetype
├── assets/
│   └── css/
│       ├── index.css   # Main styles
│       └── override.css # Custom overrides
├── layouts/
│   ├── 404.html        # Not found page
│   ├── _default/
│   │   ├── list.html   # Taxonomy listings
│   │   └── single.html # Post/page layout
│   ├── gallery/
│   │   └── single.html # Gallery layout
│   ├── index.html      # Home page
│   └── partials/
│       ├── disqus.html
│       ├── footer.html
│       ├── head.html
│       ├── header.html
│       ├── icons/      # SVG icons
│       ├── post-list.html
│       ├── related.html
│       ├── scripts.html
│       └── seo.html
├── static/
│   ├── fonts/          # Theme fonts
│   ├── images/         # Static images
│   └── js/             # JavaScript files
├── images/
│   ├── screenshot.png
│   └── tn.png
├── LICENSE.md
├── theme.toml
└── README.md
```

## Customization

### Custom CSS

Create `assets/css/override.css` in your site:

```css
/* Override theme colors */
:root {
  --accent-color: #ff6b6b;
  --accent-hover: #ee5a5a;
}

/* Custom styles */
.my-custom-class {
  padding: 1rem;
}
```

### Extra JavaScript

Add to your `hugo.toml`:

```toml
[params]
  extraBody = '<script src="/js/custom.js"></script>'
```

## License

MIT License - See [LICENSE.md](./LICENSE.md) for details.
