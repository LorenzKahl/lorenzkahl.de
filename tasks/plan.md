# Implementation Plan: Copy Button on Code Blocks (lorenzkahl.de)

Traces to: [`docs/spec/copy-button-code-blocks.md`](../docs/spec/copy-button-code-blocks.md)

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

Add a copy-to-clipboard button to every fenced code block, using Web
Awesome's native `<wa-copy-button>` component. Work proceeds as one
vertical slice: the build-time markup change (config) and its styling
are inseparable — neither is independently verifiable without the
other — so they're built together and proven with a single end-to-end
manual check, rather than landing the config change first and styling
"later."

## Architecture Decisions

- **Override `md.renderer.rules.fence`** inside the existing
  `amendLibrary("md", …)` block in `.eleventy.js` (already used to
  capture the library for the callout shortcode) — call the current
  default fence renderer to get the plugin's highlighted
  `<pre><code>...</code></pre>`, then wrap it: assign a unique `id` to
  `<pre>`, wrap the whole thing in `<div class="code-block">`, and
  append a `<wa-copy-button from="<id>">`.
- **No changes to `@11ty/eleventy-plugin-syntaxhighlight`'s own
  options** (`preAttributes`/`codeAttributes`) — confirmed against its
  source that they can't add a sibling element, so this round doesn't
  touch them at all (see spec's Design Decisions).
- **A monotonic per-build counter** generates each block's id
  (`code-block-1`, `code-block-2`, …) — simplest way to guarantee
  uniqueness without hashing content or tracking per-page state.
- **German feedback labels** on `<wa-copy-button>`
  (`copy-label`/`success-label`/`error-label`), matching the rest of
  the site's language.
- **Playwright, scoped to one E2E spec, is this project's first
  automated test.** Approved as a deliberate, narrow exception to the
  blog-relaunch spec's "no automated test framework" call — see
  [`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)'s
  Decisions & Revisions Log #1. General Playwright/CI rollout is
  deferred to a separate future round, tracked in
  [`docs/future/testing-infrastructure.md`](../docs/future/testing-infrastructure.md)
  — this plan does not build toward it.

## Task List

### Phase 1: Copy button end-to-end

- [x] Task 1: Fence-renderer override in `.eleventy.js`
- [x] Task 2: `.code-block` wrapper + button positioning in `base.css`

### Checkpoint: Visual/build
- [x] `npm run build` and `npm run lint` pass clean
- [x] Manual check in a real browser (Playwright MCP, 1400px + 390px):
      copy buttons correctly positioned, no overlap, no overflow
- [ ] Clipboard-content proof deferred to Task 3

### Phase 2: Automated verification

- [ ] Task 3: Playwright E2E test for the copy button

### Checkpoint: Complete
- [ ] `npm run test:e2e` passes
- [ ] Every Success Criteria checkbox in the spec is checked
- [ ] Ready for human review

## Task Detail

### Task 1: Fence-renderer override in `.eleventy.js`

**Description:** Inside the existing `amendLibrary("md", …)` callback,
capture the current `mdLib.renderer.rules.fence`, replace it with a
function that calls the original to get the highlighted
`<pre><code>` HTML, injects a unique `id` (from a per-build counter)
into the `<pre>` tag, and returns it wrapped in
`<div class="code-block">…<wa-copy-button from="<id>" copy-label="Code
kopieren" success-label="Kopiert!" error-label="Fehler beim
Kopieren"></wa-copy-button></div>`.

**Acceptance criteria:**
- [ ] Every fenced code block in the built HTML is wrapped in
      `<div class="code-block">` and followed by a `<wa-copy-button
      from="...">` referencing its `<pre>`'s `id`
- [ ] IDs are unique across a given page
- [ ] Inline code (`` `code` ``) is unaffected — no wrapper, no id, no
      button
- [ ] Existing Prism syntax-highlighting markup inside `<code>` is
      unchanged (this only wraps the existing output, doesn't
      regenerate it)

**Verification:**
- [ ] `npm run build` succeeds
- [ ] Manual check: inspect built HTML (`public/posts/*/index.html`)
      for the expected wrapper/id/button markup around each fenced
      block

**Dependencies:** None

**Files touched:**
- `.eleventy.js`

**Estimated scope:** Small (1 file)

---

### Task 2: `.code-block` wrapper + button positioning in `base.css`

**Description:** In the existing "Code & syntax highlighting" section,
add `.code-block { position: relative; }` and position the
`wa-copy-button` (e.g. `position: absolute; inset-block-start:
var(--space-2xs); inset-inline-end: var(--space-2xs);`) so it sits in
the block's corner without overlapping code text or breaking `pre`'s
horizontal scroll.

**Acceptance criteria:**
- [ ] Button is visibly positioned in a corner of the code block,
      readable against `--color-code-bg` at both narrow and wide
      viewports
- [ ] Button does not obscure code text or trigger unwanted horizontal
      scroll inside `pre`
- [ ] Uses logical properties (`inset-inline-end`, not `right`),
      consistent with the rest of the codebase

**Verification:**
- [ ] `npm run lint` passes
- [ ] Manual check: both example posts' code blocks at desktop
      (~1400px) and mobile (~390px) widths, computed position
      inspected via devtools

**Dependencies:** Task 1 (styles target the markup Task 1 emits)

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

### Task 3: Playwright E2E test for the copy button

**Description:** Add `@playwright/test` as a devDependency, a minimal
`playwright.config.js` (one browser project, base URL against a served
build), and `tests/e2e/copy-button.spec.js`: navigate to a built post
page containing a fenced code block, click its copy button, and assert
the clipboard (via Playwright's clipboard permissions/read API)
contains the block's plain-text code — no Prism markup. Add a
`test:e2e` npm script. Scope stops here: no CI wiring, no other specs
— see [`docs/future/testing-infrastructure.md`](../docs/future/testing-infrastructure.md)
for that.

**Acceptance criteria:**
- [ ] `npm run test:e2e` runs the new spec against a built/served site
- [ ] The spec fails if the copy button doesn't populate the clipboard
      (verified by deliberately breaking the feature once, confirming
      a red run, then restoring it)
- [ ] The spec passes against the finished Task 1 + Task 2 output
- [ ] `package.json`/`package-lock.json` reflect the new devDependency
      only — no other dependency changes

**Verification:**
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` and `npm run build` still pass (new files don't
      break existing tooling)

**Dependencies:** Tasks 1–2 (tests the markup and behavior they
produce)

**Files touched:**
- `package.json` (new devDependency + script)
- `playwright.config.js` (new)
- `tests/e2e/copy-button.spec.js` (new)

**Estimated scope:** Small (3 files, one new devDependency)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `preAttributes`/`codeAttributes` seemed like the "official" extension point but can't add a sibling element | Med (would have blocked the approach entirely) | Confirmed against `eleventy-plugin-syntaxhighlight`'s actual source before planning, not assumed from its README |
| Copying `<pre>`'s `textContent` accidentally includes stray whitespace/newlines Prism's line-wrapping introduces | Low | Verify copied output by pasting it during Task 1/2 manual checks, not just visually inspecting the button |
| `<wa-copy-button>` absolutely positioned over `pre`'s own `overflow-x: auto` scroll area causes it to scroll out of view on long lines | Low | Positioned relative to the outer `.code-block` wrapper (not inside the scrolling `pre`), so it stays fixed in the corner regardless of horizontal scroll |
| Using a new Web Awesome component reads as introducing "new client-side JavaScript" and should have been asked about first | Low (assessed, not blocking) | The blog-relaunch spec's boundary explicitly carves out JS "a Web Awesome component needs natively" — `<wa-copy-button>` is exactly that, loaded via the same autoloader already in place, no new script tag or npm dependency |
| Headless Chromium blocks clipboard read/write by default (permissions) | Med | Grant `clipboard-read`/`clipboard-write` permissions on the Playwright browser context explicitly in the test, rather than assuming default access |
| Playwright test needs a served build (`npm run build` + a static server, or `eleventy --serve`), not just source files | Low | `playwright.config.js`'s `webServer` option starts the site itself before running specs, matching Playwright's own recommended pattern — no separate manual server step |

## Open Questions

None outstanding.
