# Task List: Copy Button on Code Blocks (lorenzkahl.de)

Plan: [`tasks/plan.md`](plan.md) · Spec: [`docs/spec/copy-button-code-blocks.md`](../docs/spec/copy-button-code-blocks.md)

Round 3 (callout-icons-and-shortcode) is archived at
[`tasks/todo-callout-icons-and-shortcode.md`](todo-callout-icons-and-shortcode.md).
Round 2 (content-typography-and-breakouts) is archived at
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Phase 1: Copy button end-to-end

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

**Dependencies:** Task 1

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

## Checkpoint: Visual/build (after Task 2)
- [ ] `npm run build` and `npm run lint` pass clean
- [ ] Manual check in a real browser: every fenced block across both
      example posts (js/css/bash) shows a working, correctly
      positioned copy button; copied content is plain code with no
      markup; keyboard-focusable; German success feedback shown
- [ ] No horizontal overflow or visual overlap at 390px viewport width

## Phase 2: Automated verification

### Task 3: Playwright E2E test for the copy button

**Description:** Add `@playwright/test` as a devDependency, a minimal
`playwright.config.js` (one browser project, base URL against a served
build, `webServer` option to start the site automatically), and
`tests/e2e/copy-button.spec.js`: navigate to a built post page
containing a fenced code block, click its copy button, grant clipboard
permissions on the browser context, and assert the clipboard contains
the block's plain-text code — no Prism markup. Add a `test:e2e` npm
script. Scope stops here: no CI wiring, no other specs — see
[`docs/future/testing-infrastructure.md`](../docs/future/testing-infrastructure.md)
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

**Dependencies:** Tasks 1–2

**Files touched:**
- `package.json` (new devDependency + script)
- `playwright.config.js` (new)
- `tests/e2e/copy-button.spec.js` (new)

**Estimated scope:** Small (3 files, one new devDependency)

---

## Checkpoint: Complete (after Task 3)
- [ ] `npm run test:e2e` passes
- [ ] Every Success Criteria checkbox in the spec is checked
- [ ] Ready for human review
