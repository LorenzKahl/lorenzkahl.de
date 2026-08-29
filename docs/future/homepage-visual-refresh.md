# Future: Homepage Visual Refresh

Status: resolved — see
[`docs/spec/homepage-visual-refresh.md`](../spec/homepage-visual-refresh.md).
Kept here for history; new work should read the spec, not this
document.

## Why this exists

Idea: a more visually distinctive homepage — graphics that reflect
Lorenz's personality better than the current plain post-list page.

## Rough shape (to refine when this round starts)

- "Personality" is subjective and currently undefined — this needs an
  `/idea-refine` pass (or at least a few concrete reference examples)
  before it's buildable, not a direct-to-spec jump.
- Existing constraints to design within, per
  [`docs/spec/blog-relaunch.md`](../spec/blog-relaunch.md): no image
  optimization pipeline, OS system fonts only (no web fonts), Web
  Awesome as the only component/design system, any new npm dependency
  needs asking first.
- Precedent already in the codebase: the callout-icons round used
  Web Awesome's bundled icon set (`<wa-icon>`, Font Awesome Free, no
  new dependency); the content-typography-and-breakouts round hand-
  authored self-contained placeholder SVGs instead of fetching or
  generating images. A homepage refresh likely extends one of these
  approaches rather than introducing a new asset pipeline.

## How it was resolved

- The `/idea-refine` pass this document called for took the form of
  three visual directions drafted as artboards in a Claude Design
  canvas artifact, rather than a written `/idea-refine` doc — see
  [`docs/spec/homepage-visual-refresh.md`](../spec/homepage-visual-refresh.md)'s
  "Design reference".
- The chosen direction stayed within the flagged constraints: no new
  npm dependency, no image pipeline, existing `tokens.css` values
  reused throughout (one previously-unused type-scale step, `--step-5`,
  is the only new usage).
