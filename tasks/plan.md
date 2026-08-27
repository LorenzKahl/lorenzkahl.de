# Implementation Plan: Content Typography & Breakout Layout (lorenzkahl.de)

Traces to: [`docs/spec/content-typography-and-breakouts.md`](../docs/spec/content-typography-and-breakouts.md)

Written retroactively, after implementation and merge (PR #3, PR #4) —
see that spec for why. Round 1 (blog-relaunch) is archived at
[`tasks/plan-blog-relaunch.md`](plan-blog-relaunch.md) /
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Overview

Rewrite the two placeholder posts as long-form articles, and build the
layout/typography primitives they need to do so: a breakout grid on
`main`, native-element typography (blockquote/cite, figure/figcaption),
and a hand-rolled callout component. Work proceeded as one vertical
slice at a time — each layout/typography primitive was built, then
immediately exercised by the post content, rather than building all the
CSS first and writing the posts against it blind.

## Architecture Decisions

- **Breakout grid lives on `main`, not on `article`.** `main > article`
  is unboxed via `display: contents` so post content elements become
  direct grid items of `main`'s column template — see the spec's
  "Design Decisions" for the full reasoning.
- **No CSS file split.** Callout styling stays in `base.css` with
  banner-comment sections, rather than a `components/` directory +
  PostCSS build step (declined — see spec).
- **Logical properties and logical naming throughout**, including the
  breakout utility class names (`.breakout-start`/`.breakout-end`).

## Task List

### Phase 1: Layout & typography primitives

- [x] Task 1: Breakout grid on `main`
- [x] Task 2: Native content-element typography
- [x] Task 3: Callout component

### Checkpoint: Primitives
- [x] `npm run lint` passes
- [x] `npm run build` succeeds
- [x] Manual check: a scratch element with each utility class
      (`.breakout-start`, `.breakout-end`, `.breakout`, `.full-bleed`)
      renders at the expected width

### Phase 2: Content

- [x] Task 4: Placeholder SVG images
- [x] Task 5: Rewrite `hello-world.md`
- [x] Task 6: Rewrite `a-second-post.md`

### Checkpoint: Content
- [x] Both posts render every element from the spec's Success Criteria
- [x] No horizontal overflow at 390px viewport width

### Phase 3: Review & fixes

- [x] Task 7: Review pass and fixes (BEM renaming/ordering, `base.css`
      section banners, breakout class renamed to logical `-start`/`-end`,
      heading-margin cascade bug fix)

### Checkpoint: Complete
- [x] Every Success Criteria checkbox in the spec is checked
- [x] `npm run build` and `npm run lint` pass clean
- [x] PR #3 merged; PR #4 (unrelated CI fix, found during PR
      verification) merged separately

## Task Detail

### Task 1: Breakout grid on `main`

**Description:** Turn `main` into a CSS grid with named lines
(`full-start`/`breakout-start`/`content-start`/`content-end`/
`breakout-end`/`full-end`), unbox `main > article` via
`display: contents`, and add `.breakout-start`/`.breakout-end`/
`.breakout`/`.full-bleed` utility classes.

**Acceptance criteria:**
- [x] `header`/`footer` keep the original fixed-width centered column
- [x] Post content elements (not just `<article>` itself) can be
      individually placed in the breakout/full-bleed columns
- [x] Narrow viewports collapse breakout/full-bleed to full width with
      no horizontal overflow

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check in-browser: `grid-column` computed value inspected
      via devtools for each utility class, confirmed correct

**Dependencies:** None

**Files touched:** `src/assets/css/layout.css`

---

### Task 2: Native content-element typography

**Description:** Style blockquote/cite, figure/figcaption, hr, lists,
and add h5/h6, on top of the existing heading/link/image rules.

**Acceptance criteria:**
- [x] `blockquote > cite` renders as a distinct, dash-prefixed
      attribution line
- [x] `figure`/`figcaption` render correctly across content-width,
      breakout, and full-bleed contexts
- [x] Vertical rhythm between elements is consistent (no doubled or
      missing gaps after headings)

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check: computed `margin-top`/`margin-bottom` inspected for
      a heading immediately followed by a paragraph

**Dependencies:** Task 1 (figure width variants depend on the breakout
grid existing)

**Files touched:** `src/assets/css/base.css`

---

### Task 3: Callout component

**Description:** Add a hand-rolled `.callout` component (note/tip/
warning variants) using BEM naming.

**Acceptance criteria:**
- [x] `.callout`, `.callout__title`, `.callout--note`/`--tip`/`--warning`
      exist, in that order in the source (block → element → modifiers)
- [x] Each variant is visually distinct (accent color derived from
      existing palette tokens, not new hex values)
- [x] `.stylelintrc`'s `selector-class-pattern` allows BEM's `__`/`--`
      separators

**Verification:**
- [x] `npm run lint` passes (confirms the stylelint pattern update
      actually permits the new class names)
- [x] Manual check: all three variants rendered side by side in-browser

**Dependencies:** Task 2 (shares the vertical-rhythm rule)

**Files touched:** `src/assets/css/base.css`, `.stylelintrc`

---

### Task 4: Placeholder SVG images

**Description:** Hand-author three self-contained SVG placeholder
images at the three widths the layout supports.

**Acceptance criteria:**
- [x] `placeholder-content.svg` (1200×675), `placeholder-breakout.svg`
      (1600×700), `placeholder-full-bleed.svg` (2400×900) exist
- [x] No external assets, fonts, or fetches — pure inline SVG markup
- [x] Each includes `<title>`/`<desc>` for accessibility

**Verification:**
- [x] `npm run build` copies them to `public/assets/images/` unchanged
      (passthrough copy)
- [x] Manual check: each renders correctly as an `<img src>` target

**Dependencies:** None

**Files touched:** `src/assets/images/*.svg`

---

### Task 5: Rewrite `hello-world.md`

**Description:** Rewrite as a longer article exercising: h2/h3/h4 with
body text, one plain blockquote+cite, a content-width figure, a
`.breakout-start` figure, a `.full-bleed` figure, a `--note` callout, a
`--tip` callout.

**Acceptance criteria:**
- [x] All of the above elements present and rendering correctly
- [x] Reads as a coherent article, not a disconnected element showcase

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check in-browser at desktop and mobile widths

**Dependencies:** Tasks 1–4

**Files touched:** `src/posts/hello-world.md`

---

### Task 6: Rewrite `a-second-post.md`

**Description:** Rewrite as a longer article exercising the same
element set as Task 5 but with the complementary breakout direction and
callout variant, plus the both-direction `.breakout` pull-quote: h2/h3/h4
with body text, a plain blockquote+cite, a content-width figure, a
`.breakout-end` figure, a `.breakout` pull-quote, a `.full-bleed` figure,
a `--warning` callout, JS and CSS code blocks for syntax-highlighting
coverage.

**Acceptance criteria:**
- [x] All of the above elements present and rendering correctly
- [x] Breakout direction and callout variant complement (not duplicate)
      Task 5's post

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check in-browser at desktop and mobile widths

**Dependencies:** Tasks 1–4

**Files touched:** `src/posts/a-second-post.md`

---

### Task 7: Review pass and fixes

**Description:** Five-axis code review of the diff before merge;
address findings.

**Acceptance criteria:**
- [x] Confirmed bug fixed: heading-adjacent zero-margin override made
      order-independent (see spec's Decisions & Revisions Log #6)
- [x] BEM naming corrected to real BEM (block/element/modifier,
      modifiers grouped last)
- [x] `base.css` reorganized into banner-commented sections
- [x] Breakout utility classes renamed to logical direction naming

**Verification:**
- [x] `npm run lint` and `npm run build` pass after each fix
- [x] Manual check: computed margin values before/after the heading-
      margin fix, confirmed via browser devtools

**Dependencies:** Tasks 1–6

**Files touched:** `src/assets/css/base.css`, `src/assets/css/layout.css`,
`src/posts/*.md`

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| CSS grid auto-placement overlapping breakout items unpredictably | Med | Verified computed `grid-column` and bounding rects in a real browser via Playwright rather than reasoning about the spec alone |
| `display: contents` accessibility-tree gaps in older engines | Low | Project's browserslist is "last 2 versions"; current engines expose the accessibility tree correctly through `display: contents` |
| Equal-specificity cascade ties silently no-op a rule (materialized as the heading-margin bug) | Med (realized) | Caught in code review by measuring computed styles, not just visual inspection; fixed by raising specificity instead of relying on source order |
| Reusing the CI-broken build action to validate the PR | Low | Diagnosed as pre-existing and unrelated; fixed in a separate, isolated PR (#4) rather than folding an unrelated fix into this change |

## Open Questions

None outstanding.
