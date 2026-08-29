# Future: Dark-Mode Toggle

Status: backlog — not scheduled, not scoped in detail. Written as a
placeholder so the intent isn't lost between rounds, not as a spec to
implement from directly.

## Why this exists

Idea: let readers switch between a light and dark palette.

## Conflict to resolve before this can start

[`docs/spec/blog-relaunch.md`](../spec/blog-relaunch.md)'s Boundaries
section explicitly lists this under "Never do": *"Add a dark-mode
toggle."* Starting this round means deliberately revisiting and
amending that boundary first (with a logged reason, like the
Playwright exception in that spec's Decisions & Revisions Log #1) —
not something to just start building. Worth asking: has the reasoning
behind the original "never" changed, or does it still hold?

## Rough shape (to refine when this round starts)

- The palette is currently a single warm light-mode theme defined as
  CSS custom properties in `tokens.css` — a dark variant would need
  its own set of values, not just inverted lightness, to stay
  legible/warm rather than generically inverted.
- Toggle mechanism: `prefers-color-scheme` alone (no user override) is
  far simpler than a persisted user choice (needs `localStorage` +
  actual client-side JS, which runs into the same "ask first" JS
  boundary the copy-button round used — see
  [`docs/spec/copy-button-code-blocks.md`](../spec/copy-button-code-blocks.md)
  for how that was resolved for a different feature).

## Not deciding here

Any of the above — this is a backlog pointer, not a plan. Run
`/idea-refine` or `/spec` against this document when the round actually
starts, and resolve the boundary conflict first.
