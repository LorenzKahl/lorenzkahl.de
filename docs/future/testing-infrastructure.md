# Future: General Test Infrastructure

Status: backlog — not scheduled, not scoped in detail. Written as a
placeholder so the intent isn't lost between rounds, not as a spec to
implement from directly.

## Why this exists

[`docs/spec/copy-button-code-blocks.md`](../spec/copy-button-code-blocks.md)
introduces Playwright for exactly one thing: an E2E test proving the
copy button actually writes to the clipboard. That was a deliberate,
narrow scope decision (see
[`docs/spec/blog-relaunch.md`](../spec/blog-relaunch.md)'s Decisions &
Revisions Log #1) — not a general test-infrastructure rollout riding
on a feature's coattails.

This document is where that broader rollout gets tracked instead, so
it's picked up as its own deliberately-scoped round (its own
`/idea-refine` or `/spec` pass) rather than growing ad hoc, one
`{ test("...", ...) }` at a time, inside whatever feature spec happens
to need a test next.

## Rough shape (to refine when this round starts)

- CI integration: run Playwright specs in the existing GitHub Actions
  build workflow (`.github/actions/build/action.yml`), not just
  locally.
- Convention for *when* a feature needs an E2E spec vs. staying at
  manual/visual verification — the copy-button round drew that line at
  "genuine client-side runtime behavior a screenshot can't prove"; this
  round should turn that into an explicit, written rule instead of a
  case-by-case judgment call.
- Whether to backfill E2E coverage for already-shipped interactive
  surfaces (e.g. Web Awesome components already in use) or only apply
  the new convention going forward.
- `npm run test:e2e` script, `playwright.config.js` location and
  browser matrix (desktop only, or also a mobile viewport project,
  matching the 390px width already used for manual breakout checks).

## Not deciding here

Any of the above — this is a backlog pointer, not a plan. Run
`/idea-refine` or `/spec` against this document when the round actually
starts.
