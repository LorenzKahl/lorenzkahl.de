# Callout Icons & Authoring Shortcode

## Problem Statement

How might we give each callout variant (note/tip/warning) a legible icon
and a one-line Markdown authoring form, so callouts are both visually
clearer and cheaper to write than the current raw-HTML-plus-blank-line
construct?

## Recommended Direction

**Icons:** `<wa-icon>` (Web Awesome, already loaded via CDN — default
icon library is Font Awesome Free, 2000+ icons, no new dependency) in a
two-column grid: fixed icon column on the left (~1.75rem), title+body on
the right, icon vertically centered to the title line. Icon color
follows `--callout-color` automatically per modifier. This is the
standard, low-risk admonition layout (MDN/Docusaurus/GitHub Alerts) —
preferred over a badge/corner-overlap treatment, which needs
`position: absolute` + rotation to look intentional rather than
accidental.

**Authoring:** An 11ty shortcode so a callout is one line instead of:

```html
<div class="callout callout--tip">

<p class="callout__title">Tipp</p>

Text mit **Markdown**-Formatierung...

</div>
```

Target shape (exact syntax to confirm during implementation):

```
{% callout "tip", "Tipp" %}
Text mit **Markdown**-Formatierung, `code`, [links](...).
{% endcallout %}
```

The shortcode emits the wrapper div, icon (variant → icon name mapping
lives in the shortcode, not in each call site), and title — the author
only supplies the variant, the title, and the body.

## Key Assumptions to Validate

- [ ] `wa-icon` is themeable via `color`/`currentColor` — verify visually
- [ ] `circle-info`/`lightbulb`/`triangle-exclamation` exist in the free
      bundled Font Awesome set — check against Web Awesome's icon
      browser, don't guess
- [ ] Grid layout on `.callout` doesn't conflict with the existing
      `:first-child`/`:last-child` margin-reset rules — selectors need
      to target the content wrapper, not the icon
- [ ] **Markdown files in this project use Liquid, not Nunjucks, as
      their template engine** (confirmed: no `markdownTemplateEngine`
      override in `.eleventy.js`, and `npm run build` output already
      shows posts writing "(liquid)"). The shortcode must be registered
      for Liquid (`addLiquidShortcode`/`addPairedShortcode`), or
      `markdownTemplateEngine` would need to change to `"njk"` — a
      separate decision with its own blast radius, not assumed here.
- [ ] 11ty does **not** automatically run paired-shortcode content
      through the Markdown renderer — the shortcode body needs to be
      explicitly piped through a markdown filter (e.g. via
      `markdown-it`) so `**bold**`, `` `code` ``, and links inside a
      callout keep working, matching what today's raw-HTML callouts
      already rely on.

## MVP Scope

**In:**
- `.callout` as a 2-column grid; one `wa-icon` per variant
  (note/tip/warning), color via `--callout-color`, `aria-hidden="true"`
  (decorative — the text label already carries the meaning)
- One paired shortcode/helper that emits the full callout markup
  (wrapper, icon, title, Markdown-rendered body)
- Both example posts' three existing callouts converted to the new
  shortcode syntax (dogfoods it, proves it works)

**Out:**
- No shortcode for other content types (figure, blockquote) this round
  — callouts only
- No per-instance icon override — icon is fixed per variant
- No client-side JS or custom element — stays a build-time 11ty
  shortcode

## Not Doing (and Why)

- **A markdown-it container plugin** (e.g. `markdown-it-container` with
  `::: tip` fenced syntax) — would add a new npm dependency; an 11ty
  shortcode gets the same one-line authoring ergonomics with tools
  already in the project, and the blog-relaunch spec requires asking
  first before adding a dependency.
- **Badge/corner-overlap icon treatment** — visually more interesting,
  but harder to make look intentional; the grid layout is the safer
  first pass.
- **Per-instance icon override, hover/animation effects, new callout
  variants** — no evidence any of these are needed yet; speculative.

## Open Questions

- Exact shortcode name/argument order/syntax (Liquid vs. switching
  `markdownTemplateEngine` to Nunjucks) — a real decision with
  tradeoffs, to make deliberately during planning, not guessed here.
- Exact Font Awesome icon names — confirm against Web Awesome's icon
  set at implementation time.
- Icon size relative to the `--step-*` scale — pick by eye during
  implementation.
