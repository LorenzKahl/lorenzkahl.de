# Future: /uses Page

Status: backlog — not scheduled, not scoped in detail. Written as a
placeholder so the intent isn't lost between rounds, not as a spec to
implement from directly.

## Why this exists

Idea: a page following the [/uses](https://uses.tech/) convention —
listing the hardware, software, and tools Lorenz actually uses.

## Rough shape (to refine when this round starts)

- Lowest-risk item in this backlog: content-only, no new dependency,
  no new component, no boundary conflicts spotted against
  [`docs/spec/blog-relaunch.md`](../spec/blog-relaunch.md).
- Likely shape mirrors the existing About page almost exactly:
  `src/uses.md`, rendered at `/uses/`, same layout — see
  `src/about.md` / `docs/spec/blog-relaunch.md`'s "Permalinks" note.
- Open question for whenever this starts: plain Markdown list, or
  something structured (grouped by category — hardware/editor/
  terminal/etc.) using the existing typography primitives from the
  content-typography-and-breakouts round (headings, lists) rather than
  a new component.

## Not deciding here

Any of the above — this is a backlog pointer, not a plan. Given how
small this looks, it may not even need a full `/spec` pass — worth
revisiting that call when the round actually starts.
