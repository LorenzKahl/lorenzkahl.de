# Task List: General Test Infrastructure (lorenzkahl.de)

Plan: [`tasks/plan.md`](plan.md) · Spec: [`docs/spec/testing-infrastructure.md`](../docs/spec/testing-infrastructure.md)

Round 4 (copy-button-code-blocks) is archived at
[`tasks/todo-copy-button-code-blocks.md`](todo-copy-button-code-blocks.md).
Round 3 (callout-icons-and-shortcode) is archived at
[`tasks/todo-callout-icons-and-shortcode.md`](todo-callout-icons-and-shortcode.md).
Round 2 (content-typography-and-breakouts) is archived at
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Phase 1: CI wiring + convention

### Task 1: Add `e2e` job to `.github/workflows/ci.yml` ✅ done

**Description:** Add a new top-level job, styled like the existing
`lint`/`build` jobs (checkout, Node setup via `.nvmrc` + npm cache,
`npm ci`), that installs Playwright's Chromium browser
(`npx playwright install --with-deps chromium`) and runs
`npm run test:e2e`. Runs on the same `push`/`pull_request` triggers
already defined for the workflow; does not gate `build` or `deploy`.

**Acceptance criteria:**
- [x] `e2e` job appears in `.github/workflows/ci.yml`, using the same
      checkout/Node-setup pattern as `lint`/`build`
- [x] Job installs the Chromium browser before running tests
- [x] Job runs `npm run test:e2e`
- [x] `deploy` job's `needs:` is unchanged (still only `build`)

**Verification:**
- [x] YAML is well-formed (parses cleanly)
- [x] Job step order matches: checkout → Node setup → `npm ci` →
      Playwright browser install → `npm run test:e2e`

**Dependencies:** None

**Files touched:**
- `.github/workflows/ci.yml`

**Estimated scope:** Small (1 file)

---

### Task 2: Cross-link the convention from `blog-relaunch.md` and resolve `docs/future/testing-infrastructure.md` ✅ done

**Description:** Add an entry to
[`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)'s
Decisions & Revisions Log pointing at
[`docs/spec/testing-infrastructure.md`](../docs/spec/testing-infrastructure.md)'s
Boundaries as the canonical "does this need an E2E spec" rule. Update
[`docs/future/testing-infrastructure.md`](../docs/future/testing-infrastructure.md)
to mark itself resolved and point at the new spec instead of
restating the now-answered open questions.

**Acceptance criteria:**
- [x] `blog-relaunch.md`'s Decisions & Revisions Log has a new,
      numbered entry linking to `testing-infrastructure.md`
- [x] `docs/future/testing-infrastructure.md` marks itself resolved
      and links to the spec, rather than describing open questions
      that are now answered

**Dependencies:** None (independent of Task 1)

**Files touched:**
- `docs/spec/blog-relaunch.md`
- `docs/future/testing-infrastructure.md`

**Estimated scope:** Small (2 files, doc-only)

---

## Checkpoint: Complete (after Task 2)
- [x] `npm run build` and `npm run lint` pass clean
- [x] `.github/workflows/ci.yml` YAML is well-formed and mirrors the
      existing jobs' style
- [x] Every Success Criteria checkbox in the spec is checked
- [x] Ready for human review
