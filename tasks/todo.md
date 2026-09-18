# Task List: Sieve King Support Page (lorenzkahl.de)

Plan: [`tasks/plan.md`](plan.md) · Spec: [`docs/spec/sieve-king-support-page.md`](../docs/spec/sieve-king-support-page.md)

Round 6 (reads) is archived at
[`tasks/todo-reads.md`](todo-reads.md).
Round 5 (testing-infrastructure) is archived at
[`tasks/todo-testing-infrastructure.md`](todo-testing-infrastructure.md).
Round 4 (copy-button-code-blocks) is archived at
[`tasks/todo-copy-button-code-blocks.md`](todo-copy-button-code-blocks.md).
Round 3 (callout-icons-and-shortcode) is archived at
[`tasks/todo-callout-icons-and-shortcode.md`](todo-callout-icons-and-shortcode.md).
Round 2 (content-typography-and-breakouts) is archived at
[`tasks/todo-content-typography-and-breakouts.md`](todo-content-typography-and-breakouts.md).
Round 1 (blog-relaunch) is archived at
[`tasks/todo-blog-relaunch.md`](todo-blog-relaunch.md).

## Phase 1: Page + assets

### Task 1: Passthrough copy for the app icon ✅ done

**Description:** Add `eleventyConfig.addPassthroughCopy("src/apps/**/*.png")`
to `.eleventy.js`, alongside the existing `src/assets` passthrough.

**Acceptance criteria:**
- [x] Glob added in `.eleventy.js`
- [x] `npm run build` succeeds and `public/apps/sieve-king/icon.png`
      exists after the build

**Dependencies:** None

**Files touched:**
- `.eleventy.js`

---

### Task 2: Support page content (`index.md`) ✅ done

**Description:** New `src/apps/sieve-king/index.md` with app header,
description, feature list, compatibility note, privacy callout, and a
contact form that builds a `mailto:` link on submit.

**Acceptance criteria:**
- [x] Page renders at `/apps/sieve-king/`
- [x] Icon, title, tagline, feature list, compatibility note, and
      privacy callout all present
- [x] Contact form present; submitting it builds a `mailto:` URL with
      URL-encoded subject/body and no raw email address visible in the
      page's static HTML

**Dependencies:** None

**Files touched:**
- `src/apps/sieve-king/index.md`

---

### Task 3: `.app-header`/`.contact-form` styles ✅ done

**Description:** Add `.app-header` and `.contact-form` component
styles to `base.css`.

**Acceptance criteria:**
- [x] Icon and title/tagline align in a row, icon has fixed size and
      rounded corners
- [x] Form fields stack vertically with consistent spacing, full width
      up to a readable max-width

**Verification:**
- [x] `npm run lint` passes

**Dependencies:** Task 2

**Files touched:**
- `src/assets/css/base.css`

---

### Task 4: Cross-link with the privacy policy page ✅ done

**Description:** Link the support page to
`/apps/sieve-king/privacy-policy/` and back.

**Acceptance criteria:**
- [x] Support page links to the privacy policy page
- [x] Privacy policy page links back to the support page

**Dependencies:** None

**Files touched:**
- `src/apps/sieve-king/index.md`
- `src/apps/sieve-king/privacy-policy.md`

---

## Checkpoint: Complete (after Task 4)
- [x] `npm run build` and `npm run lint` pass clean
- [x] Every Success Criteria checkbox in the spec is checked
- [x] `icon.png` present (added directly on `main`) and now actually
      served, thanks to Task 1's passthrough copy
- [x] Ready for human review
