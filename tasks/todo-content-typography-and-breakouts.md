# Task List: Content Typography & Breakout Layout (lorenzkahl.de)

Plan: [`tasks/plan-content-typography-and-breakouts.md`](plan-content-typography-and-breakouts.md) · Spec: [`docs/spec/content-typography-and-breakouts.md`](../docs/spec/content-typography-and-breakouts.md)

> Archived: this round shipped and merged (PR #3, PR #4). Superseded as
> the active plan by [`tasks/plan.md`](plan.md) / [`tasks/todo.md`](todo.md).

Written retroactively, after implementation and merge (PR #3, PR #4).
Round 1 (blog-relaunch) is archived at
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Phase 1: Layout & typography primitives

### Task 1: Breakout grid on `main` ✅ done

**Description:** Turn `main` into a CSS grid with named lines, unbox
`main > article` via `display: contents`, and add
`.breakout-start`/`.breakout-end`/`.breakout`/`.full-bleed` utilities.

**Acceptance criteria:**
- [x] `header`/`footer` keep the original fixed-width centered column
- [x] Post content elements can be individually placed in the
      breakout/full-bleed columns, not just `<article>` itself
- [x] Narrow viewports collapse breakout/full-bleed to full width, no
      horizontal overflow

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check: `grid-column` computed value inspected via devtools
      for each utility class

**Dependencies:** None

**Files touched:**
- `src/assets/css/layout.css`

**Estimated scope:** Small (1 file)

---

### Task 2: Native content-element typography ✅ done

**Description:** Style blockquote/cite, figure/figcaption, hr, lists,
add h5/h6.

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

**Dependencies:** Task 1

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

### Task 3: Callout component ✅ done

**Description:** Add a hand-rolled `.callout` component (note/tip/
warning variants) using BEM naming.

**Acceptance criteria:**
- [x] `.callout`, `.callout__title`, `.callout--note`/`--tip`/`--warning`
      exist, block → element → modifiers in source order
- [x] Each variant is visually distinct, colors derived from existing
      palette tokens
- [x] `.stylelintrc`'s `selector-class-pattern` allows BEM's `__`/`--`

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check: all three variants rendered side by side in-browser

**Dependencies:** Task 2

**Files touched:**
- `src/assets/css/base.css`
- `.stylelintrc`

**Estimated scope:** Small (2 files)

---

## Phase 2: Content

### Task 4: Placeholder SVG images ✅ done

**Description:** Hand-author three self-contained SVG placeholder
images at the three widths the layout supports.

**Acceptance criteria:**
- [x] `placeholder-content.svg` (1200×675), `placeholder-breakout.svg`
      (1600×700), `placeholder-full-bleed.svg` (2400×900) exist
- [x] No external assets/fonts/fetches — pure inline SVG markup
- [x] Each includes `<title>`/`<desc>` for accessibility

**Verification:**
- [x] `npm run build` copies them to `public/assets/images/` unchanged
- [x] Manual check: each renders correctly as an `<img src>` target

**Dependencies:** None

**Files touched:**
- `src/assets/images/placeholder-content.svg`
- `src/assets/images/placeholder-breakout.svg`
- `src/assets/images/placeholder-full-bleed.svg`

**Estimated scope:** Small (3 files)

---

### Task 5: Rewrite `hello-world.md` ✅ done

**Description:** Rewrite as a longer article: h2/h3/h4 with body text, a
plain blockquote+cite, a content-width figure, a `.breakout-start`
figure, a `.full-bleed` figure, a `--note` callout, a `--tip` callout.

**Acceptance criteria:**
- [x] All of the above elements present and rendering correctly
- [x] Reads as a coherent article, not a disconnected element showcase

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check in-browser at desktop and mobile widths

**Dependencies:** Tasks 1–4

**Files touched:**
- `src/posts/hello-world.md`

**Estimated scope:** Small (1 file)

---

### Task 6: Rewrite `a-second-post.md` ✅ done

**Description:** Rewrite as a longer article with the complementary
breakout direction and callout variant, plus a both-direction
`.breakout` pull-quote and code blocks for syntax-highlighting coverage.

**Acceptance criteria:**
- [x] All of the above elements present and rendering correctly
- [x] Breakout direction and callout variant complement (not duplicate)
      `hello-world.md`

**Verification:**
- [x] `npm run build` succeeds
- [x] Manual check in-browser at desktop and mobile widths

**Dependencies:** Tasks 1–4

**Files touched:**
- `src/posts/a-second-post.md`

**Estimated scope:** Small (1 file)

---

## Phase 3: Review & fixes

### Task 7: Review pass and fixes ✅ done

**Description:** Five-axis code review of the diff before merge;
address findings.

**Acceptance criteria:**
- [x] Heading-adjacent zero-margin override made order-independent
      (cascade-tie bug found in review — see spec's Decisions &
      Revisions Log)
- [x] BEM naming corrected (block/element/modifier, modifiers grouped
      last)
- [x] `base.css` reorganized into banner-commented sections
- [x] Breakout utility classes renamed to logical direction naming
      (`.breakout-start`/`.breakout-end`)

**Verification:**
- [x] `npm run lint` and `npm run build` pass after each fix
- [x] Manual check: computed margin values before/after the
      heading-margin fix, confirmed via browser devtools

**Dependencies:** Tasks 1–6

**Files touched:**
- `src/assets/css/base.css`
- `src/assets/css/layout.css`
- `src/posts/hello-world.md`
- `src/posts/a-second-post.md`

**Estimated scope:** Medium (4 files, no new structure)

---

## Checkpoint: Primitives (after Task 3)
- [x] `npm run lint` passes
- [x] `npm run build` succeeds
- [x] Manual check: a scratch element with each utility class renders
      at the expected width

## Checkpoint: Content (after Task 6)
- [x] Both posts render every element from the spec's Success Criteria
- [x] No horizontal overflow at 390px viewport width

## Checkpoint: Complete (after Task 7)
- [x] Every Success Criteria checkbox in the spec is checked
- [x] `npm run build` and `npm run lint` pass clean
- [x] PR #3 merged; PR #4 (unrelated CI fix found during PR
      verification) merged separately
- [x] Ready for human review
