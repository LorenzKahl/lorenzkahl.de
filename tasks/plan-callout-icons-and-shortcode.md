# Implementation Plan: Callout Icons & Authoring Shortcode (lorenzkahl.de)

Traces to: [`docs/spec/callout-icons-and-shortcode.md`](../docs/spec/callout-icons-and-shortcode.md)

Written retroactively, after implementation and merge (commit
`fad8120`) — see that spec for why. Round 2
(content-typography-and-breakouts) is archived at
[`tasks/plan-content-typography-and-breakouts.md`](plan-content-typography-and-breakouts.md) /
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/plan-blog-relaunch.md`](plan-blog-relaunch.md) /
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Overview

Give each callout variant a legible icon and replace the raw-HTML
authoring form with a one-line Markdown shortcode. Scoped via
`/idea-refine` first (`docs/ideas/callout-icons-and-shortcode.md`),
which flagged four assumptions to validate against 11ty's actual
source before committing to an approach — those were resolved during a
plan-mode research session, then implemented as a single vertical
slice (config change → CSS change → both posts converted), since the
shortcode, its icon, and its layout only prove out together.

## Architecture Decisions

- **Icon mapping lives once, in `.eleventy.js`**, not at each call
  site — a post author supplies only variant + title.
- **Reuse 11ty's own configured markdown-it instance** (via
  `amendLibrary("md", …)`) inside the shortcode, instead of a second,
  independently configured `markdown-it` import — keeps one source of
  truth for Markdown rendering (including already-registered plugins
  like syntax highlighting).
- **No new npm dependency.** Both the icon (Web Awesome's bundled Font
  Awesome Free, already loaded via CDN) and the Markdown rendering
  (11ty's transitive `markdown-it`) reuse what the project already
  loads — ruled out a `markdown-it-container` plugin for this reason,
  per the blog-relaunch spec's "ask first" boundary on new
  dependencies.
- **Unknown variant throws at build time**, not a silent fallback —
  cheaper to catch a typo at `npm run build` than in production HTML.

## Task List

### Phase 1: Shortcode & rendering

- [x] Task 1: Callout shortcode in `.eleventy.js`

### Checkpoint: Shortcode
- [x] `npm run build` succeeds with both posts still on raw-HTML
      callouts (shortcode exists but unused) — confirms the shortcode
      registration itself doesn't break the build
- [x] A scratch shortcode call renders the expected wrapper/icon/title
      markup with Markdown in the body converted to HTML

### Phase 2: Visual layout

- [x] Task 2: `.callout` grid layout + icon styling in `base.css`

### Checkpoint: Layout
- [x] All three variants render a distinct, correctly colored icon,
      vertically centered against the title, in a scratch page

### Phase 3: Content migration

- [x] Task 3: Convert both example posts' callouts to shortcode form

### Checkpoint: Complete
- [x] Every Success Criteria checkbox in the spec is checked
- [x] `npm run build` and `npm run lint` pass clean
- [x] Deliberately triggering an unrecognized variant fails the build
      with a message naming the valid variants; removing the trigger
      restores a clean build

## Task Detail

### Task 1: Callout shortcode in `.eleventy.js`

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

### Task 2: `.callout` grid layout + icon styling in `base.css`

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

**Dependencies:** Task 1 (styling targets the markup the shortcode
emits)

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

### Task 3: Convert both example posts' callouts to shortcode form

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

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Assuming Liquid can't run paired shortcodes, prompting an unnecessary `markdownTemplateEngine` switch | Med | Confirmed against 11ty's own source (not just docs) during the idea-refine research pass before implementation started |
| Paired-shortcode body not passed through Markdown rendering, breaking `**bold**`/links inside callouts | Med (would have silently broken existing content) | Resolved by capturing 11ty's own `md` library via `amendLibrary` and explicitly rendering the body through it |
| Moving the icon into `.callout`'s grid disrupts the existing `:first-child`/`:last-child` margin resets | Low (realized, caught in implementation not after) | Resets retargeted to a new `.callout__body` wrapper instead of `.callout`'s direct children |
| Icon name doesn't exist in the bundled Font Awesome Free set | Low | Verified against Web Awesome's icon browser before writing the map, per the idea doc's assumption list |

## Open Questions

None outstanding.
