# Future: Homepage Visual Refresh

Status: backlog — not scheduled, not scoped in detail. Written as a
placeholder so the intent isn't lost between rounds, not as a spec to
implement from directly.

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

## Not deciding here

Any of the above — this is a backlog pointer, not a plan. Run
`/idea-refine` against this document when the round actually starts.
