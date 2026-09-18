# Implementation Plan: Sieve King Support Page (lorenzkahl.de)

Traces to: [`docs/spec/sieve-king-support-page.md`](../docs/spec/sieve-king-support-page.md)

Round 6 (reads) is archived at
[`tasks/plan-reads.md`](plan-reads.md) /
[`tasks/todo-reads.md`](todo-reads.md).
Round 5 (testing-infrastructure) is archived at
[`tasks/plan-testing-infrastructure.md`](plan-testing-infrastructure.md) /
[`tasks/todo-testing-infrastructure.md`](todo-testing-infrastructure.md).
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

Note: a separate "Sieve King privacy policy" change
(`src/apps/sieve-king/privacy-policy.md`) landed on `main` between
round 6 and this round without its own spec/plan/todo — a small,
directly-specified addition, not run through this process.

## Overview

A standalone product/support page for the app Sieve King at
`/apps/sieve-king/`, needed as the App Store Connect "Support URL"
before the app can go into review. One vertical slice: page content,
icon passthrough, and the mailto-building contact form all land
together since none is independently useful without the others.

## Architecture Decisions

- `src/apps/sieve-king/index.md`, styled like `src/about.md`
  (Markdown + `layouts/base.njk`, directory-index permalink).
- New passthrough-copy glob in `.eleventy.js` for `src/apps/**/*.png`,
  mirroring the existing `src/assets` passthrough. This also fixes
  `src/apps/sieve-king/icon.png` (added directly on `main` for the
  privacy-policy page) never actually being copied to `public/` —
  no passthrough rule covered it before this round.
- Contact form built from existing Web Awesome components
  (`<wa-input>`, `<wa-textarea>`, `<wa-button>`), with a small
  hand-rolled submit handler that assembles a `mailto:` link instead
  of showing the address in the page or using a form backend —
  explicitly requested, see spec's Design Decisions.
- Privacy note reuses the existing `{% callout %}` shortcode.
- New `.app-header`/`.contact-form` styles added to `base.css`'s
  existing "Component" section convention.
- Cross-links to/from `src/apps/sieve-king/privacy-policy.md`, since
  both pages are about the same app.

## Task List

### Phase 1: Page + assets

- [x] Task 1: Passthrough copy for the app icon
- [x] Task 2: Support page content (`index.md`)
- [x] Task 3: `.app-header`/`.contact-form` styles
- [x] Task 4: Cross-link with the privacy policy page

### Checkpoint: Complete
- [x] `npm run build` and `npm run lint` pass clean
- [x] Page renders at `/apps/sieve-king/` with icon, description,
      feature list, privacy callout, and contact form
- [x] Every Success Criteria checkbox in the spec is checked
- [x] Ready for human review

## Task Detail

### Task 1: Passthrough copy for the app icon

**Description:** Add `eleventyConfig.addPassthroughCopy("src/apps/**/*.png")`
to `.eleventy.js`, alongside the existing `src/assets` passthrough, so
`src/apps/sieve-king/icon.png` is copied to
`public/apps/sieve-king/icon.png` unchanged.

**Acceptance criteria:**
- [x] Glob added in `.eleventy.js`
- [x] `npm run build` succeeds and `public/apps/sieve-king/icon.png`
      exists after the build

**Dependencies:** None

**Files touched:**
- `.eleventy.js`

**Estimated scope:** Small (1 file)

---

### Task 2: Support page content (`index.md`)

**Description:** New `src/apps/sieve-king/index.md`: front matter
(title, layout, meta description), an `.app-header` block (icon +
title + tagline), the app's feature description as prose/list, a
compatibility note, a `{% callout "tip" %}` privacy note, and a
`<form>` (Betreff/Nachricht via Web Awesome inputs, submit builds a
`mailto:` link to `app-sieveking@truck-turner.de` via a small inline
script).

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

**Estimated scope:** Small (1 file)

---

### Task 3: `.app-header`/`.contact-form` styles

**Description:** Add `.app-header` (icon + title flex row) and
`.contact-form` (stacked form fields) component styles to `base.css`,
following the file's existing Component-section convention.

**Acceptance criteria:**
- [x] Icon and title/tagline align in a row, icon has fixed size and
      rounded corners
- [x] Form fields stack vertically with consistent spacing, full width
      up to a readable max-width

**Verification:**
- [x] `npm run lint` passes

**Dependencies:** Task 2 (styles target its markup)

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

### Task 4: Cross-link with the privacy policy page

**Description:** Add a short link from the support page to
`/apps/sieve-king/privacy-policy/`, and one back from the privacy
policy page to the support page, so a visitor lands on either and can
reach the other.

**Acceptance criteria:**
- [x] Support page links to the privacy policy page
- [x] Privacy policy page links back to the support page

**Dependencies:** None (both pages already exist)

**Files touched:**
- `src/apps/sieve-king/index.md`
- `src/apps/sieve-king/privacy-policy.md`

**Estimated scope:** Small (2 files, one line each)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `<wa-input>`/`<wa-textarea>` attribute names (`label`, etc.) can't be verified against a live render — this sandbox can't reach Web Awesome's CDN | Med | Used the same attribute pattern as `<wa-button>` (already proven in this codebase); flagged as an open question in the spec — needs a real-browser check before relying on this page for the App Store submission |
| Rebasing onto `main` after several unrelated rounds landed (homepage redesign, reads, privacy policy) | Low | Resolved conflicts by hand in `base.css` (kept both component sections) and `tasks/plan.md`/`todo.md` (archived `reads` as round 6, chained this round after it) |

## Open Questions

See spec's Open Questions (Web Awesome form-component attributes,
unverified due to sandbox CDN restrictions).
