# Spec: Homepage Visual Refresh (lorenzkahl.de)

Traces to: [`docs/future/homepage-visual-refresh.md`](../future/homepage-visual-refresh.md)

Written retroactively, after implementation, review against the design
reference, and fidelity fixes, as a record of what shipped and why. The
backlog entry flagged "personality" as too subjective for a
direct-to-spec jump and called for an `/idea-refine` pass or reference
examples first; that step took the form of three visual directions
drafted in a Claude Design canvas (see "Design reference" below) rather
than a written `/idea-refine` doc — Lorenz picked one, and this spec
documents the picked direction and how the implementation was brought
into line with it.

## Objective

Replace the homepage's plain domain-title-plus-bare-`<ul>` layout with
a personal hero (name, tagline, small accent divider) and a post index
that reads as a typographic list — date, title, excerpt per entry —
instead of a link dump, within the constraints already fixed by
[`docs/spec/blog-relaunch.md`](blog-relaunch.md): no
image-optimization pipeline, OS system fonts only, Web Awesome as the
only component system, existing `tokens.css` palette/type-scale only
(no new tokens).

## Design reference

Three directions were drafted as artboards in a Claude Design canvas
artifact ("lorenzkahl.de Homepage-Redesign"): `Main` (plain flexbox
list, fixed-width date column), `DirectionB` (hand-drawn SVG hero
illustration, colored icon cards per post), `DirectionC` (tag pills,
colored left-border cards, "Weiterlesen" read-more buttons). `Main` was
chosen — closest to the site's existing restrained, typographic
aesthetic and reusing the most existing tokens verbatim.

## Design Decisions

- **Single `<ol>`, not a `<ul>` or a grid of `<article>` cards.**
  Semantics: an ordered list gives assistive tech a correct item
  count/order announcement for what is, in fact, an ordered
  (reverse-chronological) list.
- **One `<h1>`/`<h2>` hierarchy**, not `<h1>` per post: the page has
  one subject (Lorenz / the blog), posts are index entries, not
  independent page sections.
- **Flexbox reflow instead of a media-query breakpoint** for the
  date/title stacking on narrow viewports (`flex-wrap: wrap`,
  `.post-index__body { flex: 999 1 16rem }` so the title column claims
  space first) — matches the project's fluid-scale approach elsewhere
  (no `@media` breakpoints in `base.css`).
- **No new tokens.** Colors, fonts, and spacing all reuse existing
  `tokens.css` custom properties; the only genuinely new value is
  `.home-hero-title`'s use of `--step-5`, the largest fluid type-scale
  step already defined but previously unused.
- **Hero heading isolated in its own class (`.home-hero-title`), not a
  bare `h1` rule.** `<h1>` is reused for post titles
  (`layouts/post.njk`) and the About page's Markdown `# About` — giving
  the shared `h1..h6` rule a 64px/light-weight treatment would have
  bled into those, so the homepage name gets a dedicated class instead,
  scoped only to `src/index.njk`.
- **Post-index divider lives between items
  (`.post-index__item + .post-index__item`), not on every item's
  trailing edge.** Originally every `.post-index__item` had its own
  `border-block-end`, so the last item's border sat right next to the
  page footer's own `border-top` — two near-identical thin rules
  bracketing a large empty gap (the footer is pinned to the viewport
  bottom via `body { display: flex }` / `main { flex: 1 }` when content
  is short), reading as an accidental duplicate. Moving the rule to the
  adjacent-sibling selector keeps the divider between posts and lets
  the footer's rule be the sole closing line.
- **Date/title alignment via `align-items: baseline`, not a fixed
  `padding-top`.** The design reference nudges the date down with a
  magic-number `padding-top: 4px`, tuned to that artboard's exact font
  sizes. `align-items: baseline` on `.post-index__item` aligns the
  date's text baseline with the title's baseline (the first line box of
  `.post-index__body`, i.e. the `<h2>`) directly from font metrics, so
  it stays correct if the type scale changes later.
- **Post-title links drop the default underline**
  (`.post-index__title a { text-decoration: none }`, accent-secondary
  color on hover) instead of the site-wide `a` underline — matches the
  design reference's `.post-title-link` treatment; regular prose links
  elsewhere keep the underline.
- **Date column is fixed-width** (`flex: 0 0 8rem`), not allowed to
  grow (`flex: 1 0 8rem` initially) — otherwise it stretches wider than
  the design reference on wide viewports, at the title column's
  expense.

## Files Touched

```
src/index.njk             → hero markup (eyebrow, h1, intro, divider), post
                             index as a single <ol>
src/assets/css/base.css   → .home-eyebrow / .home-hero-title / .home-intro /
                             .home-divider, .post-index and its __date /
                             __body / __title / __excerpt elements
```

## Testing Strategy

Same as every prior round on this static site — no automated test
framework beyond the existing Playwright E2E suite (unrelated
interactive surface; this round has no client-side behavior to test).
Verification is:

- `npm run lint` (ESLint + Stylelint) passes clean.
- `npm run build` completes without errors.
- Manual/visual check via a real browser, both against the shipped page
  and pixel-compared against the `Main` design-canvas artboard: hero
  heading size/weight, post-index divider placement, title underline,
  and date/title baseline alignment all confirmed by screenshot diff
  against the artboard during the fidelity-fix pass.

## Boundaries

- **Always do:** Keep CSS in the existing three-file structure
  (`tokens.css`/`base.css`/`layout.css`); reuse existing tokens over
  introducing new ones.
- **Ask first:** Any new npm dependency; any new CSS custom property
  outside the existing type/space scale.
- **Never do:** Give the shared `h1..h6` rule page-specific sizing —
  page-specific treatments get their own class, scoped to the template
  that needs them.

## Success Criteria

- [x] Homepage has a personal hero (eyebrow, name, intro, accent
      divider) instead of a bare domain-title heading.
- [x] Post index renders as date + title + excerpt per entry,
      semantically a single `<ol>`.
- [x] Layout reflows to stacked date+title on narrow viewports without
      a `@media` breakpoint.
- [x] No new palette, type-scale, or spacing tokens introduced.
- [x] Hero heading renders at the design reference's intended
      size/weight (`--step-5`, `font-weight: 400`), not the shared
      `h1..h6` scale.
- [x] Exactly one horizontal rule closes the page (footer's
      `border-top`) — no duplicate rule from the post index's last
      item.
- [x] Post titles render without the default link underline.
- [x] Date sits on the title's text baseline via
      `align-items: baseline`, not a fixed offset.
- [x] `npm run lint` and `npm run build` pass clean.

## Decisions & Revisions Log

1. Shipped initially (commit `84e1a77`) without checking against the
   chosen `Main` artboard pixel-for-pixel; a follow-up review against
   the design-canvas artifact found four fidelity gaps, fixed in the
   same round rather than filed as a separate one, since they're all
   corrections to the original objective rather than new scope:
   - Hero `<h1>` was inheriting the shared `h1..h6` rule (`--step-4`
     max ≈49px, browser-default bold) instead of the artboard's
     64px/regular-weight treatment — no page ever needed a heading that
     large before, so the gap wasn't caught by reusing existing styles.
   - `.post-index__item`'s per-item `border-block-end` produced a
     duplicate-looking horizontal rule at the page's bottom edge,
     appearing distant from the footer's own rule due to the
     sticky-footer pattern on short content.
   - Post-title links kept the site-wide `a` underline; the design
     reference removes it for index-entry titles specifically.
   - `.post-index__date` used `flex: 1 0 8rem` (grows) instead of a
     fixed `flex: 0 0 8rem`, and had no baseline alignment with the
     title.
2. Considered a fixed `padding-top` on `.post-index__date` (matching
   the artboard's own inline style) to fix the date/title vertical
   alignment; used `align-items: baseline` on the flex container
   instead, since it aligns correctly regardless of font-size changes
   rather than encoding a value tuned to one specific type scale.

## Open Questions

None outstanding. `DirectionB` and `DirectionC` (the SVG-illustration
and tag-pill/read-more directions) remain in the design-canvas artifact
as rejected alternatives, not carried into `docs/`.
