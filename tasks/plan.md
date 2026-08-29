# Implementation Plan: General Test Infrastructure (lorenzkahl.de)

Traces to: [`docs/spec/testing-infrastructure.md`](../docs/spec/testing-infrastructure.md)

Round 4 (copy-button-code-blocks) is archived at
[`tasks/plan-copy-button-code-blocks.md`](plan-copy-button-code-blocks.md) /
[`tasks/todo-copy-button-code-blocks.md`](todo-copy-button-code-blocks.md).
Round 3 (callout-icons-and-shortcode) is archived at
[`tasks/plan-callout-icons-and-shortcode.md`](plan-callout-icons-and-shortcode.md) /
[`tasks/todo-callout-icons-and-shortcode.md`](todo-callout-icons-and-shortcode.md).
Round 2 (content-typography-and-breakouts) is archived at
[`tasks/plan-content-typography-and-breakouts.md`](plan-content-typography-and-breakouts.md) /
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/plan-blog-relaunch.md`](plan-blog-relaunch.md) /
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Overview

Wire the copy-button round's Playwright spec into CI, and write down
the rule for when a future feature needs an E2E spec at all. No new
client-side behavior is added this round — this is pipeline and
documentation work only.

## Architecture Decisions

- **New `e2e` job in the existing `.github/workflows/ci.yml`**,
  parallel to `lint`/`build`, not a separate workflow file or a
  dependency of `deploy` — see spec's Design Decisions.
- **`npx playwright install --with-deps chromium` only** — matches the
  single `chromium` project already in `playwright.config.js`.
- **No backfill, no mobile project, no unit-test framework** — see
  spec's Boundaries for why each is out of scope.
- **The convention itself is written directly into the spec's
  Boundaries** and cross-linked from
  [`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)'s
  Decisions & Revisions Log, rather than a new standalone doc.

## Task List

### Phase 1: CI wiring + convention

- [x] Task 1: Add `e2e` job to `.github/workflows/ci.yml`
- [x] Task 2: Cross-link the convention from `blog-relaunch.md` and
      resolve `docs/future/testing-infrastructure.md`

### Checkpoint: Complete
- [x] `npm run build` and `npm run lint` pass clean
- [x] `.github/workflows/ci.yml` YAML is well-formed and mirrors the
      existing jobs' style
- [x] Every Success Criteria checkbox in the spec is checked
- [x] Ready for human review

## Task Detail

### Task 1: Add `e2e` job to `.github/workflows/ci.yml`

**Description:** Add a new top-level job, styled like the existing
`lint`/`build` jobs (checkout, Node setup via `.nvmrc` + npm cache,
`npm ci`), that installs Playwright's Chromium browser
(`npx playwright install --with-deps chromium`) and runs
`npm run test:e2e`. Runs on the same `push`/`pull_request` triggers
already defined for the workflow; does not gate `build` or `deploy`.

**Acceptance criteria:**
- [ ] `e2e` job appears in `.github/workflows/ci.yml`, using the same
      checkout/Node-setup pattern as `lint`/`build`
- [ ] Job installs the Chromium browser before running tests
- [ ] Job runs `npm run test:e2e`
- [ ] `deploy` job's `needs:` is unchanged (still only `build`)

**Verification:**
- [ ] YAML is well-formed (parses cleanly)
- [ ] Job step order matches: checkout → Node setup → `npm ci` →
      Playwright browser install → `npm run test:e2e`

**Dependencies:** None

**Files touched:**
- `.github/workflows/ci.yml`

**Estimated scope:** Small (1 file)

---

### Task 2: Cross-link the convention from `blog-relaunch.md` and resolve `docs/future/testing-infrastructure.md`

**Description:** Add an entry to
[`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)'s
Decisions & Revisions Log pointing at
[`docs/spec/testing-infrastructure.md`](../docs/spec/testing-infrastructure.md)'s
Boundaries as the canonical "does this need an E2E spec" rule. Update
[`docs/future/testing-infrastructure.md`](../docs/future/testing-infrastructure.md)
to mark itself resolved and point at the new spec instead of
restating the now-answered open questions.

**Acceptance criteria:**
- [ ] `blog-relaunch.md`'s Decisions & Revisions Log has a new,
      numbered entry linking to `testing-infrastructure.md`
- [ ] `docs/future/testing-infrastructure.md` marks itself resolved
      and links to the spec, rather than describing open questions
      that are now answered

**Dependencies:** None (independent of Task 1)

**Files touched:**
- `docs/spec/blog-relaunch.md`
- `docs/future/testing-infrastructure.md`

**Estimated scope:** Small (2 files, doc-only)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Playwright's `--with-deps` install can be slow/flaky in CI (installs OS-level libraries) | Low | Scoped to a single browser (`chromium`) only, matching the existing config; no multi-browser matrix to multiply the cost |
| Adding an `e2e` job could be read as quietly making E2E tests a merge-blocking requirement | Low | Job doesn't gate `build`/`deploy` — a red run today has no more effect on shipping than before this round, just better visibility |

## Open Questions

None outstanding.
