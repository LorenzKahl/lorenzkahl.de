# Task List: Callout Icons & Authoring Shortcode (lorenzkahl.de)

Plan: [`tasks/plan-callout-icons-and-shortcode.md`](plan-callout-icons-and-shortcode.md) · Spec: [`docs/spec/callout-icons-and-shortcode.md`](../docs/spec/callout-icons-and-shortcode.md)

> Archived: this round shipped and merged (commit `fad8120`).
> Superseded as the active plan by [`tasks/plan.md`](plan.md) /
> [`tasks/todo.md`](todo.md).

Written retroactively, after implementation and merge (commit
`fad8120`). Round 2 (content-typography-and-breakouts) is archived at
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Phase 1: Shortcode & rendering

### Task 1: Callout shortcode in `.eleventy.js` ✅ done

**Description:** Add the `CALLOUT_ICONS` variant→icon map, capture
11ty's configured markdown-it instance via `amendLibrary("md", …)`,
and register `addPairedShortcode("callout", …)` emitting the wrapper
div, icon, title, and Markdown-rendered body. Throw on an unrecognized
variant.

**Acceptance criteria:**
- [x] `{% callout "variant" "Title" %}body{% endcallout %}` emits
      `.callout.callout--{variant}` with a `<wa-icon>`,
      `.callout__title`, and `.callout__body`
- [x] Markdown inside the body (bold, code, links) renders as HTML, not
      literal text
- [x] An unrecognized variant throws, naming the valid variants

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check: a scratch shortcode call with `**bold**` inside
      renders `<strong>`, not literal asterisks
- [x] Manual check: an intentionally misspelled variant fails the
      build with the expected error message

**Dependencies:** None

**Files touched:**
- `.eleventy.js`

**Estimated scope:** Small (1 file)

---

## Phase 2: Visual layout

### Task 2: `.callout` grid layout + icon styling in `base.css` ✅ done

**Description:** Turn `.callout` into a 2-column grid (icon column +
title/body column), add `.callout__body` spanning both columns in row
2, move the leading/trailing margin-reset rules from `.callout`'s
direct children to `.callout__body`'s, and size/color `wa-icon` via
`--callout-color`.

**Acceptance criteria:**
- [x] Icon and title share row 1, vertically centered against each
      other; body spans the full width in row 2
- [x] Icon color follows `--callout-color` per variant automatically
- [x] No doubled/missing margin at the top or bottom of a callout's
      body content

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check: all three variants rendered side by side, computed
      icon color inspected via devtools per variant

**Dependencies:** Task 1

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

## Phase 3: Content migration

### Task 3: Convert both example posts' callouts to shortcode form ✅ done

**Description:** Replace the three existing raw-HTML callouts (one
`--note`, one `--tip` in `hello-world.md`; one `--warning` in
`a-second-post.md`) with the one-line shortcode form.

**Acceptance criteria:**
- [x] No raw `<div class="callout">` HTML remains in either post
- [x] Rendered output is visually equivalent to (plus the new icon)
      the prior raw-HTML version

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check in-browser: both posts' callouts render correctly
      with icons

**Dependencies:** Tasks 1–2

**Files touched:**
- `src/posts/hello-world.md`
- `src/posts/a-second-post.md`

**Estimated scope:** Small (2 files)

---

## Checkpoint: Shortcode (after Task 1)
- [x] `npm run build` succeeds with both posts still on raw-HTML
      callouts (shortcode exists but unused)
- [x] A scratch shortcode call renders the expected wrapper/icon/title
      markup with Markdown in the body converted to HTML

## Checkpoint: Layout (after Task 2)
- [x] All three variants render a distinct, correctly colored icon,
      vertically centered against the title, in a scratch page

## Checkpoint: Complete (after Task 3)
- [x] Every Success Criteria checkbox in the spec is checked
- [x] `npm run build` and `npm run lint` pass clean
- [x] Deliberately triggering an unrecognized variant fails the build
      with a message naming the valid variants; removing the trigger
      restores a clean build
- [x] Ready for human review
