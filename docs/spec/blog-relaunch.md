# Spec: Blog Relaunch (lorenzkahl.de)

Traces to: [`docs/intent/blog-relaunch.md`](../intent/blog-relaunch.md)

## Objective

Rebuild lorenzkahl.de from an empty 11ty v3 project on a new branch,
replacing the previous hand-rolled design-token/cascade-layer approach.
The design system is [Web Awesome](https://webawesome.com) (loaded via
CDN autoloader), styled with a single warm light-mode palette in the
spirit of [warm-burnout](https://github.com/felipefdl/warm-burnout).
The site is a personal, publicly-readable blog: home/post list, post
detail pages, an About page, and an RSS feed, seeded with a few
placeholder posts so the design can be verified locally.

**User:** Lorenz, as author. Readers: the public — openly visible, no
auth/gating.

**Success looks like:** `npm run dev` (`eleventy --serve`) renders a
working site with correct navigation, styled with Web Awesome components
and the warm palette, readable body text, and no console/build errors.

## Tech Stack

- **Static site generator:** [Eleventy (11ty) v3](https://www.11ty.dev/),
  ESM-first (`"type": "module"` in `package.json`).
- **Design system:** [Web Awesome](https://webawesome.com), loaded via
  its CDN `<script type="module">` autoloader — pin an exact version in
  the URL, not `@latest`. No npm package, no bundler step for it.
- **Templating:** Nunjucks (`.njk`) for layouts/partials.
- **Content:** Plain Markdown with YAML front matter.
- **Styling:** Plain CSS, native nesting and other baseline-modern
  features (no preprocessor). PostCSS may be added later only if a
  concrete need arises (e.g. autoprefixing) — not included up front.
- **Fluid layout:** A [Utopia](https://utopia.fyi)-style fluid type and
  space scale — `clamp()`-based custom properties generated from a
  min/max viewport and min/max size pair, no JS or build step involved
  (Utopia's site is only used to *generate* the CSS values once; nothing
  is fetched at runtime). Used for heading/body font sizes and for
  spacing (margins, gaps, section padding) instead of fixed breakpoints.
- **Syntax highlighting:** `@11ty/eleventy-plugin-syntaxhighlight`
  (build-time, Prism-based, zero client-side JS).
- **RSS:** `@11ty/eleventy-plugin-rss`.
- **Fonts:** OS system font stack only — a serif stack for headings, a
  sans-serif stack for body text. No web fonts, no `@fontsource-*`
  packages (revisit as a separate later effort).
- **Package manager:** npm.
- **Node:** version pinned in `.nvmrc` (22, matching the environment
  already in use).
- **Explicitly excluded:** React or any other UI framework; any
  interactivity must be built with web standards (matches Web Awesome's
  own custom-element approach). No dark mode / theme toggle. No image
  optimization pipeline, tags/categories, comments, analytics, or
  newsletter in this round.

## Commands

```
Dev:    npm run dev       # eleventy --serve
Build:  npm run build     # eleventy (production output to public/)
Lint:   npm run lint      # eslint . && stylelint "**/*.css"
Format: npm run format    # prettier --write .
```

## Project Structure

A single flat `.eleventy.js` config (no modular `src/config/*` split —
this is a small site and one file stays readable). Content lives
directly under `src/` in 11ty's conventional layout:

```
.eleventy.js          → 11ty config: collections, plugins, dir mapping
package.json
src/
  _includes/
    layouts/
      base.njk         → HTML shell: <head>, Web Awesome CDN tags, nav, footer
      post.njk          → extends base.njk, adds post metadata (date, title)
    partials/
      header.njk
      footer.njk
  posts/
    hello-world.md       → placeholder post
    a-second-post.md      → placeholder post
  about.md
  index.njk              → home page: renders the posts collection
  feed.njk               → RSS feed template (rss plugin)
  assets/
    css/
      tokens.css          → warm-burnout-inspired custom properties, font stacks,
                             Utopia-generated fluid type/space scale (clamp())
      base.css            → resets/base element styles, typography
      layout.css          → page-level layout (containers, grid/flex), using
                             the fluid space scale for gaps/padding
  _data/
    site.js                → site title, description, URL, author
public/                    → build output (gitignored)
```

Front matter for a post (minimal, no tags/categories):

```yaml
---
title: Hello, World
date: 2026-08-27
description: Optional one-line summary for RSS/meta.
---
```

Posts are collected by directory location (`src/posts/*.md`), not by a
front-matter tag — tags/categories as a user-facing feature are out of
scope, so the collection is purely structural.

Permalinks: posts render at `/posts/{slug}/`; pages (About) render at
their own slug (`/about/`).

## Code Style

Nunjucks layout example (`src/_includes/layouts/base.njk`):

```njk
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>{{ title }} · {{ site.title }}</title>
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/layout.css">
  <script type="module" src="https://early.webawesome.com/webawesome@X.Y.Z/dist/webawesome.loader.js"></script>
</head>
<body>
  {% include "partials/header.njk" %}
  <main>{{ content | safe }}</main>
  {% include "partials/footer.njk" %}
</body>
</html>
```

CSS example (`tokens.css` — modern nesting, warm palette as custom
properties, no preprocessor):

```css
:root {
  --color-bg: #fdf6ec;
  --color-text: #3a2e28;
  --color-accent: #b5502d;
  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: -apple-system, "Segoe UI", Roboto, sans-serif;

  /* Utopia-generated fluid scale (values from utopia.fyi, min 320px / max 1240px viewport) */
  --step-0: clamp(1rem, 0.92rem + 0.39vw, 1.19rem);       /* body text */
  --step-2: clamp(1.56rem, 1.34rem + 1.12vw, 2.11rem);    /* h2 */
  --space-m: clamp(1.5rem, 1.35rem + 0.78vw, 1.88rem);
  --space-l: clamp(2.25rem, 2.02rem + 1.17vw, 2.81rem);
}

.post-list {
  & li {
    margin-block-end: 1rem;
  }
}
```

(Palette values above are illustrative placeholders — final values get
picked during implementation by eye against warm-burnout's tones, not
hardcoded in the spec.)

Conventions: kebab-case CSS classes, one selector concern per rule block,
no `!important`, no ID selectors for styling.

## Testing Strategy

This is a static, JS-logic-free site — there is no application logic to
unit test. Verification is:

- **Build check:** `npm run build` completes without errors or 11ty
  warnings.
- **Lint:** `npm run lint` (ESLint for the config/data JS, Stylelint for
  CSS) passes clean.
- **Manual/visual check:** `npm run dev`, then verify in a real browser —
  home page lists placeholder posts, a post page renders with syntax
  highlighting on a code sample, About page renders, `/feed.xml` (or
  equivalent) is valid RSS, Web Awesome components render (not just
  unstyled fallback content), and body text is legible (serif headings /
  sans body, warm palette applied).
- No automated test framework (Jest/Vitest/etc.) is introduced — would
  be disproportionate to a static content site with no business logic.

## Boundaries

- **Always do:** Run `npm run lint` and a local `npm run build` before
  considering a task done. Keep CSS plain (no preprocessor syntax).
  Keep Web Awesome loaded via CDN only.
- **Ask first:** Adding any new npm dependency beyond the two named 11ty
  plugins (RSS, syntax highlight). Introducing any client-side JavaScript
  beyond what a Web Awesome component needs natively. Changing the Node
  version pin. Touching `netlify.toml` / `CNAME` (deployment is out of
  scope for this round).
- **Never do:** Add React/Vue/Svelte or any UI framework. Add a dark-mode
  toggle. Add tags/categories, comments, analytics, or a newsletter
  signup. Reintroduce the old design-token/cascade-layer CSS files.
  Commit secrets or API keys (none are expected in this project).

## Success Criteria

- [ ] New branch created off `main`; old `src/assets/styles/*` and the
      old modular `src/config/*` approach are not carried over.
- [ ] `npm run dev` serves the site locally with no build errors.
- [ ] Home page lists all placeholder posts (title + date, linked).
- [ ] At least 2 placeholder posts exist, one containing a fenced code
      block that renders with syntax highlighting.
- [ ] Individual post pages render via a shared post layout.
- [ ] About page exists and renders.
- [ ] RSS feed is generated and validates as well-formed XML/RSS.
- [ ] Web Awesome is loaded via CDN autoloader and at least one Web
      Awesome component renders correctly (e.g. a `<wa-button>` or
      `<wa-card>` in the nav/footer or post list).
- [ ] Palette is a single warm light-mode theme, visibly inspired by
      warm-burnout, applied via CSS custom properties.
- [ ] Headings render in a serif system font stack, body text in a
      sans-serif system font stack.
- [ ] Font sizes and spacing (headings, body text, section gaps/padding)
      scale fluidly between mobile and desktop viewport widths via
      Utopia-style `clamp()` custom properties, not fixed breakpoints.
- [ ] `npm run lint` passes.
- [ ] No React/framework dependency, no dark-mode toggle, no
      tags/categories UI, no comments/analytics/newsletter present.

## Open Questions

- Exact warm-burnout-derived hex values for the palette — to be picked
  during implementation by eye against the reference repo, not
  prescribed here.
- Exact Utopia scale parameters (min/max font size, min/max viewport,
  number of steps) — to be generated via utopia.fyi during
  implementation; the values in the Code Style example are illustrative
  only.
- Exact Web Awesome components to use on the placeholder pages (e.g.
  card for post list items, button for nav) — an implementation
  decision, not a spec-level one.
- New branch name — proposing `blog-relaunch` unless you'd prefer
  another name.
