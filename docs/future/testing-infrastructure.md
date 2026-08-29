# Future: General Test Infrastructure

Status: resolved — see
[`docs/spec/testing-infrastructure.md`](../spec/testing-infrastructure.md).
Kept here for history; new work should read the spec, not this
document.

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

## How it was resolved

- CI integration: an `e2e` job runs `npm run test:e2e` in
  `.github/workflows/ci.yml` on every push/PR, alongside `lint`/`build`
  (not gating `deploy`) — rather than the originally-considered
  `.github/actions/build/action.yml`, which only builds the static
  site and has no reason to also drive a browser.
- Convention: written explicitly into
  [`docs/spec/testing-infrastructure.md`](../spec/testing-infrastructure.md)'s
  Boundaries, cross-linked from
  [`docs/spec/blog-relaunch.md`](../spec/blog-relaunch.md)'s Decisions
  & Revisions Log #2.
- Backfill: decided against — no existing interactive surface besides
  the copy button has runtime behavior a screenshot can't prove (see
  that spec's Design Decisions).
- Browser matrix stays single-project (`chromium` desktop) — no
  current spec needs a mobile viewport project; revisit if one does.
