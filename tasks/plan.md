# Implementation Plan: Reads-Seite aus Readeck-Highlights (lorenzkahl.de)

Traces to: [`docs/spec/reads.md`](../docs/spec/reads.md)

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

## Overview

Add a `/reads` page backed by a build-time fetch against the author's
self-hosted Readeck instance. Work proceeds in four phases: data layer
(API client, text-fragment helper, Eleventy global data) → templates
and styling (list + detail pages, nav, CSS) → env/CI wiring (secrets,
scripts) → automated tests (fixture-based Playwright spec). Each phase
has its own checkpoint since they're independently verifiable, unlike
the copy-button round's single vertical slice.

## Architecture Decisions

See [`docs/spec/reads.md`](../docs/spec/reads.md)'s Design Decisions
for full reasoning. Key points repeated here for quick reference:

- Async Eleventy global data (`src/_data/reads.js`), no `addCollection`
  — `reads` is external data, not content files.
- API client (`src/lib/readeck.js`) and text-fragment helper
  (`src/lib/text-fragment.js`) are separate, isolated modules — no
  new npm dependency (Node 22's native `fetch`/`AbortSignal.timeout`).
- Missing env vars → empty `/reads` (warn, don't fail); env vars set
  but API call fails → fail the build (deliberate asymmetry).
- `<wa-card>`/`<wa-tag>`/`<wa-badge>` (Web Awesome, already loaded via
  the site's CDN autoloader) instead of hand-rolled card/chip CSS —
  only the grid layout and the "whole card is a link" stretched-link
  pattern are genuinely new CSS.
- Consistent `reads-*` class naming (`.reads-grid`, `.reads-card*`,
  `.reads-detail*`) — no singular/plural mixing.
- Webhook-triggered rebuild is explicitly deferred (Open Question #2
  in the spec) — this round only adds a manual `workflow_dispatch`
  trigger as the stopgap.
- E2E tests run against a fixture (`READS_FIXTURE_PATH`), never the
  live Readeck API — keeps `e2e` job secret-free and non-flaky.

## Task List

### Phase 1: Data layer

- [x] Task 1: Readeck API client (`src/lib/readeck.js`)
- [x] Task 2: Text-fragment helper (`src/lib/text-fragment.js`)
- [x] Task 3: Eleventy global data (`src/_data/reads.js`)

### Checkpoint: Data layer
- [x] `npm run lint` passes on the three new files
- [x] A throwaway local check (e.g. a one-off `node -e` against the
      real instance, or temporarily logging `reads` data during
      `npm run build`) confirms `reads.js` returns the expected
      normalized shape for at least one real tagged bookmark

### Phase 2: Templates, nav, CSS

- [x] Task 4: List page (`src/reads/index.njk`)
- [x] Task 5: Detail page (`src/reads/detail.njk`)
- [x] Task 6: Nav link (`src/_includes/partials/header.njk`)
- [x] Task 7: CSS additions (`src/assets/css/base.css`)

### Checkpoint: Visual/build
- [x] `npm run build` and `npm run lint` pass clean
- [x] Manual browser check (`npm run dev`) against the real Readeck
      instance: card grid, detail page, tag/badge rendering, stretched
      card click target, no overflow at 390px
- [x] Text-fragment links manually verified in a real Chromium browser
      (short quote, long single-element quote with a comma — both
      correct; one multi-element-spanning quote found and documented
      as a known limitation, see `docs/spec/reads.md`)

### Phase 3: Env & CI wiring

- [x] Task 8: Local env handling (`package.json` scripts,
      `.env.example`, `README.md`)
- [ ] Task 9: GitHub Actions wiring (`.github/actions/build/action.yml`,
      `.github/workflows/ci.yml`)

### Checkpoint: CI green
- [ ] Repo secrets `READECK_HOST`/`READECK_API_TOKEN` added manually
      (prerequisite, not a code task)
- [ ] `lint`, `build`, `e2e` jobs pass on a PR; `deploy` succeeds on
      merge to `main` with real `/reads` content live

### Phase 4: Automated tests

- [ ] Task 10: Fixture data + Playwright wiring (`tests/fixtures/reads.json`,
      `playwright.config.js`)
- [ ] Task 11: E2E spec (`tests/e2e/reads.spec.js`)

### Checkpoint: Complete
- [ ] `npm run test:e2e` passes
- [ ] Every Success Criteria checkbox in
      [`docs/spec/reads.md`](../docs/spec/reads.md) is checked
- [ ] Ready for human review

## Task Detail

### Task 1: Readeck API client (`src/lib/readeck.js`)

**Description:** New module exporting `listBookmarksByLabel(label)`
and `listAnnotations(bookmarkId)`. Both read `READECK_HOST` and
`READECK_API_TOKEN` from `process.env`, send
`Authorization: Bearer ${READECK_API_TOKEN}`, and use
`AbortSignal.timeout(10_000)`. `listBookmarksByLabel` calls
`GET /api/bookmarks?labels=<label>&sort=-created&limit=<n>&offset=<n>`,
paginating via `limit`/`offset` until an empty page returns, then
additionally filters the combined result on
`bookmark.labels.includes(label)` as a safety net (see spec's Design
Decisions). Non-2xx responses throw an `Error` including the status
code and request URL.

**Acceptance criteria:**
- [ ] `listBookmarksByLabel("feature-on-website")` returns exactly the
      bookmarks tagged with that label from the real instance, deduped
      and complete across pages
- [ ] `listAnnotations(id)` returns the raw annotations array for a
      given bookmark id
- [ ] A non-2xx or timed-out request throws an `Error` whose message
      contains the HTTP status and the request URL
- [ ] No secrets are logged, even on error

**Verification:**
- [ ] `npm run lint` passes
- [ ] Manual check: a throwaway script or temporary log call against
      the real instance confirms correct filtering/pagination

**Dependencies:** None

**Files touched:**
- `src/lib/readeck.js`

**Estimated scope:** Small (1 file)

---

### Task 2: Text-fragment helper (`src/lib/text-fragment.js`)

**Description:** Pure function `buildTextFragmentUrl(pageUrl, rawText)`
per the spec's algorithm: normalize whitespace; quotes ≤ 20 words →
`#:~:text=<quote>`; quotes > 20 words → `#:~:text=<first 10
words>,<last 10 words>`; `encodeURIComponent` plus explicit `-` →
`%2D` escaping; append to `pageUrl`'s existing hash (if any) rather
than overwriting it.

**Acceptance criteria:**
- [ ] Short quotes produce a single-value `text=` fragment
- [ ] Long quotes (> 20 words) produce a `text=start,end` range using
      exactly the first/last 10 words
- [ ] A quote containing `-` or `,` round-trips correctly (escaped, and
      the escaping doesn't corrupt the surrounding fragment syntax)
- [ ] A `pageUrl` that already has a hash keeps it, with `:~:text=`
      appended rather than replacing it

**Verification:**
- [ ] `npm run lint` passes
- [ ] A few manual assertions (throwaway `node -e` or a temporary
      script) confirm both branches (short/long) and the escaping edge
      case produce the expected string

**Dependencies:** None (independent of Task 1)

**Files touched:**
- `src/lib/text-fragment.js`

**Estimated scope:** Small (1 file)

---

### Task 3: Eleventy global data (`src/_data/reads.js`)

**Description:** Async default-exported function. Reads
`READECK_HOST`/`READECK_API_TOKEN`; if either is missing, warns and
returns `[]`. Otherwise calls `listBookmarksByLabel("feature-on-website")`,
then `listAnnotations` for each (via `Promise.all`), and normalizes
into the shape described in the spec (`id`, `url`, `title`, `authors`,
`tags` minus the feature label, `created`/`createdDate`, `image` or
`null`, `annotations[]` with `text`/`note`/`textFragmentUrl`,
`highlightsCount`, `annotatedCount`), sorted by `createdDate`
descending. Supports `READS_FIXTURE_PATH`: if set, reads that JSON
file (already in normalized shape) instead of calling the API.

**Acceptance criteria:**
- [ ] Missing env vars → `[]` returned, one `console.warn`, no thrown
      error
- [ ] Env vars set, API reachable → returns normalized, sorted array
      matching the real tagged bookmarks
- [ ] Env vars set, API call fails → the error propagates (build
      fails), not swallowed
- [ ] `READS_FIXTURE_PATH` set → data comes from that file, API is
      never called
- [ ] `highlightsCount`/`annotatedCount` match manual counts from
      `listAnnotations`'s raw output for at least one bookmark

**Verification:**
- [ ] `npm run lint` passes
- [ ] `npm run build` with real `.env` values succeeds and (via a
      temporary log statement, removed before commit) shows correctly
      shaped data

**Dependencies:** Tasks 1–2 (uses both modules)

**Files touched:**
- `src/_data/reads.js`

**Estimated scope:** Small (1 file)

---

### Task 4: List page (`src/reads/index.njk`)

**Description:** Flat template file, `permalink: /reads/`,
`layout: layouts/base.njk` (same pattern as `src/index.njk`). Iterates
`reads`, rendering one `<wa-card class="reads-card">` per bookmark:
`media` slot = image (`read.image.src` or the existing
`placeholder-content.svg` fallback), `header` slot = title wrapped in
a `.reads-card__title-link` (the stretched-link target), default slot
= authors, a `<wa-tag>` per non-feature tag, and a `<wa-badge>` each
for `highlightsCount`/`annotatedCount`.

**Acceptance criteria:**
- [ ] Renders one card per entry in `reads`, no more, no fewer
- [ ] Card title links to `/reads/{{ read.id }}/`
- [ ] Missing `read.image` falls back to
      `/assets/images/placeholder-content.svg`
- [ ] Feature label (`feature-on-website`) never appears among the
      rendered tags
- [ ] Both counts render and match the underlying data

**Verification:**
- [ ] `npm run build` succeeds; `public/reads/index.html` exists and
      contains the expected number of cards
- [ ] Manual browser check (paired with Task 7's CSS)

**Dependencies:** Task 3 (consumes `reads` data)

**Files touched:**
- `src/reads/index.njk`

**Estimated scope:** Small (1 file)

---

### Task 5: Detail page (`src/reads/detail.njk`)

**Description:** Paginated template
(`pagination: { data: reads, size: 1, alias: read }`,
`permalink: "/reads/{{ read.id }}/"`, `eleventyComputed.title`),
`layout: layouts/base.njk`. Renders an ordered list of
`read.annotations`: each item shows the quote (`text`) in a
`.reads-detail__quote`, the note (`.reads-detail__note`) only when
`note` is non-null, and a `.reads-detail__source-link` to
`annotation.textFragmentUrl`.

**Acceptance criteria:**
- [ ] One detail page is generated per entry in `reads`, at
      `/reads/{{ id }}/`
- [ ] Every annotation renders its full, untruncated quote
- [ ] A note renders only when present; annotations without a note
      show just the quote
- [ ] The source link's `href` is the annotation's `textFragmentUrl`

**Verification:**
- [ ] `npm run build` succeeds; one `public/reads/{id}/index.html` per
      tagged bookmark exists and contains the expected annotations
- [ ] Manual browser check (paired with Task 7's CSS), including
      clicking a source link in a real Chromium browser to confirm the
      text-fragment jump/highlight works

**Dependencies:** Task 3

**Files touched:**
- `src/reads/detail.njk`

**Estimated scope:** Small (1 file)

---

### Task 6: Nav link (`src/_includes/partials/header.njk`)

**Description:** Add `<a href="/reads/">Reads</a>` alongside the
existing `/`/`/about/` links.

**Acceptance criteria:**
- [ ] Nav link to `/reads/` appears on every page (shared partial)

**Verification:**
- [ ] `npm run build` succeeds; spot-check the built HTML of any page

**Dependencies:** None (can land independently, but grouped here since
it's part of the same visual round)

**Files touched:**
- `src/_includes/partials/header.njk`

**Estimated scope:** Trivial (1 file, 1 line)

---

### Task 7: CSS additions (`src/assets/css/base.css`)

**Description:** New banner-commented sections: `.reads-grid`
(`display: grid`, `auto-fill`/`minmax`, fluid `--space-*` gap);
`.reads-card` (`position: relative`, sizing); `.reads-card__title-link`
(stretched-link `::after`); `.reads-card__authors`/`__meta` (spacing,
muted text); `.reads-detail`/`__meta`/`__annotations`
(divider between items, mirroring `.post-index__item + .post-index__item`)/
`__annotation`/`__quote`/`__note`/`__source-link`. All values via
existing design tokens, no new hardcoded colors/spacing.

**Acceptance criteria:**
- [ ] Card grid reflows responsively with no fixed breakpoints
      (`auto-fill`/`minmax`)
- [ ] Entire card is clickable (stretched-link), only the title text is
      the accessible link name
- [ ] Detail-page annotation list has a visible divider between
      entries, consistent with `.post-index__item`'s existing pattern
- [ ] No new class name violates `.stylelintrc`'s
      `selector-class-pattern`

**Verification:**
- [ ] `npm run lint` (Stylelint) passes
- [ ] Manual browser check at ~1400px and ~390px: no horizontal
      overflow, no visual overlap, card fully clickable via click and
      keyboard (Tab to the title link, Enter activates)

**Dependencies:** Tasks 4–5 (styles target their markup)

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

### Task 8: Local env handling

**Description:** Add `.env.example` (`READECK_HOST=`,
`READECK_API_TOKEN=` placeholders, tracked). Update `package.json`'s
`dev`/`build` scripts to
`node --env-file-if-exists=.env ./node_modules/.bin/eleventy [--serve]`.
Add a short "Local setup" note to `README.md` pointing at
`.env.example`.

**Acceptance criteria:**
- [ ] `npm run dev`/`npm run build` work with no `.env` present (empty
      `/reads`, per Task 3's fallback)
- [ ] `npm run dev`/`npm run build` pick up real values from a local
      `.env` file when present
- [ ] `README.md` tells a new contributor how to get real `/reads`
      content locally

**Verification:**
- [ ] Manually delete/rename `.env`, confirm `npm run build` still
      succeeds (empty `/reads`); restore it, confirm real data returns

**Dependencies:** Task 3 (env-var contract must already exist)

**Files touched:**
- `package.json`
- `.env.example`
- `README.md`

**Estimated scope:** Small (3 files)

---

### Task 9: GitHub Actions wiring

**Description:** Add `readeck_host`/`readeck_api_token` as required
`inputs` on `.github/actions/build/action.yml`, passed as `env:` to
the existing "Build Site" step. Update `.github/workflows/ci.yml`'s
`build` job to pass `secrets.READECK_HOST`/`secrets.READECK_API_TOKEN`
as those inputs. Add `workflow_dispatch:` to the workflow's top-level
`on:` block. `deploy`/`lint`/`e2e` jobs are otherwise untouched.

**Acceptance criteria:**
- [ ] `action.yml` declares both new inputs and forwards them as env
      vars to the build step
- [ ] `ci.yml`'s `build` job passes both secrets through
- [ ] A manual "Run workflow" trigger is available in the Actions UI
- [ ] `e2e`/`lint`/`deploy` jobs are unchanged

**Verification:**
- [ ] YAML parses cleanly (e.g. `npx js-yaml` or GitHub's own UI
      validation on push)
- [ ] After the repo secrets are added (manual, out-of-band step), a
      pushed commit's `build` job succeeds using them

**Dependencies:** Task 3 (env-var names must match)

**Files touched:**
- `.github/actions/build/action.yml`
- `.github/workflows/ci.yml`

**Estimated scope:** Small (2 files)

---

### Task 10: Fixture data + Playwright wiring

**Description:** Add `tests/fixtures/reads.json` — 2–3 fake bookmarks
in the exact normalized shape `reads.js` produces, covering: a
bookmark with an image and one with none (placeholder-fallback case),
an annotation with a note and one without. Wire
`playwright.config.js`'s `webServer.env.READS_FIXTURE_PATH` to point
at this file so the dev server used by e2e tests never touches the
live API.

**Acceptance criteria:**
- [ ] Fixture data matches `reads.js`'s normalized output shape exactly
- [ ] Fixture includes at least one annotated and one unannotated
      highlight, and one bookmark without an image
- [ ] `playwright.config.js`'s `webServer` sets `READS_FIXTURE_PATH`
      so `npm run test:e2e`'s dev server serves fixture-backed `/reads`

**Verification:**
- [ ] `npm run dev` with `READS_FIXTURE_PATH` set manually shows the
      fixture content at `/reads/`

**Dependencies:** Task 3 (fixture must match its output contract),
Tasks 4–5 (pages must exist to render it against)

**Files touched:**
- `tests/fixtures/reads.json`
- `playwright.config.js`

**Estimated scope:** Small (2 files)

---

### Task 11: E2E spec (`tests/e2e/reads.spec.js`)

**Description:** New Playwright spec asserting, against the fixture:
card count on `/reads/` equals the fixture length; clicking a card
navigates to `/reads/{id}/`; a note renders only for the fixture
annotation that has one; a `.reads-detail__source-link` href contains
`#:~:text=`.

**Acceptance criteria:**
- [ ] `npm run test:e2e` includes and passes this new spec
- [ ] The spec fails if any of the four assertions above is broken
      (verified by deliberately breaking one, confirming red, then
      restoring)
- [ ] No live Readeck API call happens during the test run

**Verification:**
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` and `npm run build` still pass

**Dependencies:** Task 10

**Files touched:**
- `tests/e2e/reads.spec.js`

**Estimated scope:** Small (1 file)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `labels` server-side filter's AND/OR semantics for multiple values are undocumented | Low (MVP only filters on one label) | Defensive client-side filter always re-checks `labels.includes(...)` regardless of server behavior |
| Text Fragments have inconsistent cross-browser support (Chromium-only in practice) | Low | Degrades to a plain link with no error in unsupported browsers — no feature-detection needed, explicitly verified in Chromium during manual checks |
| `wa-card`'s `::after` stretched-link may behave unexpectedly across its shadow-DOM boundary | Med (would force a custom card if it fails) | Verify visually early in Task 7; documented fallback is a plain `<div>` card only if `wa-card` genuinely can't support the pattern — not decided preemptively |
| Composite GitHub Action inputs required before secrets exist will fail `build` in CI until the repo owner adds them | Med (one-time, expected) | Called out explicitly as a manual prerequisite in Task 9 and the Phase 3 checkpoint — not a code defect |
| Fixture data drifts from `reads.js`'s real normalized shape over time | Low | Task 10 derives the fixture directly from Task 3's documented shape; revisit if `reads.js`'s shape changes later |

## Open Questions

None outstanding for this round — see
[`docs/spec/reads.md`](../docs/spec/reads.md)'s Open Questions for the
two items explicitly deferred past the MVP (label match semantics for
multiple values, webhook-triggered rebuild).
