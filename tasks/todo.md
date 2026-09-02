# Task List: Reads-Seite aus Readeck-Highlights (lorenzkahl.de)

Plan: [`tasks/plan.md`](plan.md) · Spec: [`docs/spec/reads.md`](../docs/spec/reads.md)

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

## Phase 1: Data layer

### Task 1: Readeck API client (`src/lib/readeck.js`) ✅ done

**Description:** New module exporting `listBookmarksByLabel(label)`
and `listAnnotations(bookmarkId)`. Both read `READECK_HOST` and
`READECK_API_TOKEN` from `process.env`, send
`Authorization: Bearer ${READECK_API_TOKEN}`, and use
`AbortSignal.timeout(10_000)`. `listBookmarksByLabel` calls
`GET /api/bookmarks?labels=<label>&sort=-created&limit=<n>&offset=<n>`,
paginating via `limit`/`offset` until an empty page returns, then
additionally filters the combined result on
`bookmark.labels.includes(label)` as a safety net. Non-2xx responses
throw an `Error` including the status code and request URL.

**Acceptance criteria:**
- [x] `listBookmarksByLabel("feature-on-website")` returns exactly the
      bookmarks tagged with that label from the real instance, deduped
      and complete across pages
- [x] `listAnnotations(id)` returns the raw annotations array for a
      given bookmark id
- [x] A non-2xx or timed-out request throws an `Error` whose message
      contains the HTTP status and the request URL
- [x] No secrets are logged, even on error

**Verification:**
- [x] `npm run lint` passes
- [x] Manual check: a throwaway script against the real instance
      confirmed `listAnnotations` matches known-good data exactly, an
      empty-result case for the (not-yet-used) `feature-on-website`
      label returns `[]` without error, and a bad bookmark id throws
      `Readeck API request failed: 404 Not Found (...)`

**Dependencies:** None

**Files touched:**
- `src/lib/readeck.js`

**Estimated scope:** Small (1 file)

---

### Task 2: Text-fragment helper (`src/lib/text-fragment.js`)

**Description:** Pure function `buildTextFragmentUrl(pageUrl, rawText)`:
normalize whitespace; quotes ≤ 20 words → `#:~:text=<quote>`; quotes
> 20 words → `#:~:text=<first 10 words>,<last 10 words>`;
`encodeURIComponent` plus explicit `-` → `%2D` escaping; append to
`pageUrl`'s existing hash (if any) rather than overwriting it.

**Acceptance criteria:**
- [ ] Short quotes produce a single-value `text=` fragment
- [ ] Long quotes (> 20 words) produce a `text=start,end` range using
      exactly the first/last 10 words
- [ ] A quote containing `-` or `,` round-trips correctly
- [ ] A `pageUrl` that already has a hash keeps it, with `:~:text=`
      appended rather than replacing it

**Verification:**
- [ ] `npm run lint` passes
- [ ] A few manual assertions confirm both branches and the escaping
      edge case produce the expected string

**Dependencies:** None

**Files touched:**
- `src/lib/text-fragment.js`

**Estimated scope:** Small (1 file)

---

### Task 3: Eleventy global data (`src/_data/reads.js`)

**Description:** Async default-exported function. Reads
`READECK_HOST`/`READECK_API_TOKEN`; if either is missing, warns and
returns `[]`. Otherwise calls `listBookmarksByLabel("feature-on-website")`,
then `listAnnotations` for each (via `Promise.all`), normalizes into
the spec's data shape, sorted by `createdDate` descending. Supports
`READS_FIXTURE_PATH` to read fixture JSON instead of calling the API.

**Acceptance criteria:**
- [ ] Missing env vars → `[]` returned, one `console.warn`, no thrown
      error
- [ ] Env vars set, API reachable → returns normalized, sorted array
      matching the real tagged bookmarks
- [ ] Env vars set, API call fails → the error propagates (build
      fails)
- [ ] `READS_FIXTURE_PATH` set → data comes from that file, API is
      never called
- [ ] `highlightsCount`/`annotatedCount` match manual counts for at
      least one bookmark

**Verification:**
- [ ] `npm run lint` passes
- [ ] `npm run build` with real `.env` values succeeds and shows
      correctly shaped data

**Dependencies:** Tasks 1–2

**Files touched:**
- `src/_data/reads.js`

**Estimated scope:** Small (1 file)

---

## Checkpoint: Data layer (after Task 3)
- [ ] `npm run lint` passes on the three new files
- [ ] `reads` data confirmed to have the expected normalized shape
      against at least one real tagged bookmark

## Phase 2: Templates, nav, CSS

### Task 4: List page (`src/reads/index.njk`)

**Description:** Flat template, `permalink: /reads/`,
`layout: layouts/base.njk`. One `<wa-card class="reads-card">` per
bookmark: `media` slot = image (fallback to
`placeholder-content.svg`), `header` slot = stretched-link title,
default slot = authors, `<wa-tag>` per non-feature tag, `<wa-badge>`
per count.

**Acceptance criteria:**
- [ ] Renders one card per entry in `reads`, no more, no fewer
- [ ] Card title links to `/reads/{{ read.id }}/`
- [ ] Missing image falls back to `placeholder-content.svg`
- [ ] `feature-on-website` never appears among rendered tags
- [ ] Both counts render and match the underlying data

**Verification:**
- [ ] `npm run build` succeeds; `public/reads/index.html` has the
      expected number of cards
- [ ] Manual browser check (paired with Task 7)

**Dependencies:** Task 3

**Files touched:**
- `src/reads/index.njk`

**Estimated scope:** Small (1 file)

---

### Task 5: Detail page (`src/reads/detail.njk`)

**Description:** Paginated template over `reads`,
`permalink: "/reads/{{ read.id }}/"`. Renders each annotation's quote,
its note when present, and a source link to `textFragmentUrl`.

**Acceptance criteria:**
- [ ] One detail page per entry in `reads`
- [ ] Every annotation renders its full, untruncated quote
- [ ] A note renders only when present
- [ ] Source link's `href` is the annotation's `textFragmentUrl`

**Verification:**
- [ ] `npm run build` succeeds; one detail page per tagged bookmark
- [ ] Manual browser check including clicking a source link in
      Chromium to confirm the text-fragment jump/highlight works

**Dependencies:** Task 3

**Files touched:**
- `src/reads/detail.njk`

**Estimated scope:** Small (1 file)

---

### Task 6: Nav link (`src/_includes/partials/header.njk`)

**Description:** Add `<a href="/reads/">Reads</a>` alongside the
existing links.

**Acceptance criteria:**
- [ ] Nav link to `/reads/` appears on every page

**Verification:**
- [ ] `npm run build` succeeds; spot-check built HTML

**Dependencies:** None

**Files touched:**
- `src/_includes/partials/header.njk`

**Estimated scope:** Trivial (1 file, 1 line)

---

### Task 7: CSS additions (`src/assets/css/base.css`)

**Description:** New sections: `.reads-grid`, `.reads-card` (+
stretched-link `__title-link`, `__authors`, `__meta`), `.reads-detail`
(+ `__meta`, `__annotations`, `__annotation`, `__quote`, `__note`,
`__source-link`). Existing design tokens only.

**Acceptance criteria:**
- [ ] Card grid reflows responsively, no fixed breakpoints
- [ ] Entire card is clickable (stretched-link), title text is the
      accessible link name
- [ ] Detail-page annotation list has a visible divider between
      entries
- [ ] No class name violates `.stylelintrc`'s `selector-class-pattern`

**Verification:**
- [ ] `npm run lint` (Stylelint) passes
- [ ] Manual browser check at ~1400px and ~390px: no overflow, no
      overlap, card clickable via mouse and keyboard

**Dependencies:** Tasks 4–5

**Files touched:**
- `src/assets/css/base.css`

**Estimated scope:** Small (1 file)

---

## Checkpoint: Visual/build (after Task 7)
- [ ] `npm run build` and `npm run lint` pass clean
- [ ] Manual browser check against the real Readeck instance: card
      grid, detail page, tag/badge rendering, stretched card click
      target, no overflow at 390px
- [ ] Text-fragment links manually verified in Chromium (short quote,
      long quote, quote with a hyphen/comma)

## Phase 3: Env & CI wiring

### Task 8: Local env handling

**Description:** Add `.env.example`. Update `package.json`'s
`dev`/`build` scripts to use `node --env-file-if-exists=.env`. Add a
"Local setup" note to `README.md`.

**Acceptance criteria:**
- [ ] `npm run dev`/`npm run build` work with no `.env` present
- [ ] They pick up real values from a local `.env` file when present
- [ ] `README.md` documents the setup step

**Verification:**
- [ ] Manually toggle `.env` present/absent, confirm both behaviors

**Dependencies:** Task 3

**Files touched:**
- `package.json`
- `.env.example`
- `README.md`

**Estimated scope:** Small (3 files)

---

### Task 9: GitHub Actions wiring

**Description:** Add `readeck_host`/`readeck_api_token` inputs to
`.github/actions/build/action.yml`, forwarded as env vars. Update
`ci.yml`'s `build` job to pass the two repo secrets. Add
`workflow_dispatch:` to the workflow trigger.

**Acceptance criteria:**
- [ ] `action.yml` declares and forwards both inputs
- [ ] `ci.yml`'s `build` job passes both secrets
- [ ] Manual "Run workflow" trigger available
- [ ] `e2e`/`lint`/`deploy` jobs unchanged

**Verification:**
- [ ] YAML parses cleanly
- [ ] After repo secrets are added (manual, out-of-band), a pushed
      commit's `build` job succeeds

**Dependencies:** Task 3

**Files touched:**
- `.github/actions/build/action.yml`
- `.github/workflows/ci.yml`

**Estimated scope:** Small (2 files)

---

## Checkpoint: CI green (after Task 9)
- [ ] Repo secrets `READECK_HOST`/`READECK_API_TOKEN` added manually
- [ ] `lint`, `build`, `e2e` jobs pass on a PR; `deploy` succeeds on
      merge to `main` with real `/reads` content live

## Phase 4: Automated tests

### Task 10: Fixture data + Playwright wiring

**Description:** Add `tests/fixtures/reads.json` (2–3 fake bookmarks
in `reads.js`'s normalized shape, covering an image-less bookmark and
both an annotated and unannotated highlight). Wire
`playwright.config.js`'s `webServer.env.READS_FIXTURE_PATH`.

**Acceptance criteria:**
- [ ] Fixture matches `reads.js`'s normalized output shape exactly
- [ ] Fixture covers annotated + unannotated highlight, and a
      no-image bookmark
- [ ] `playwright.config.js`'s `webServer` sets `READS_FIXTURE_PATH`

**Verification:**
- [ ] `npm run dev` with `READS_FIXTURE_PATH` set manually shows the
      fixture content at `/reads/`

**Dependencies:** Task 3, Tasks 4–5

**Files touched:**
- `tests/fixtures/reads.json`
- `playwright.config.js`

**Estimated scope:** Small (2 files)

---

### Task 11: E2E spec (`tests/e2e/reads.spec.js`)

**Description:** Playwright spec asserting, against the fixture: card
count matches fixture length; clicking a card navigates to
`/reads/{id}/`; a note renders only for the annotated fixture
highlight; a source link's href contains `#:~:text=`.

**Acceptance criteria:**
- [ ] `npm run test:e2e` includes and passes this spec
- [ ] The spec fails if any of the four assertions is broken (verified
      by deliberately breaking one, confirming red, then restoring)
- [ ] No live Readeck API call happens during the test run

**Verification:**
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` and `npm run build` still pass

**Dependencies:** Task 10

**Files touched:**
- `tests/e2e/reads.spec.js`

**Estimated scope:** Small (1 file)

---

## Checkpoint: Complete (after Task 11)
- [ ] `npm run test:e2e` passes
- [ ] Every Success Criteria checkbox in
      [`docs/spec/reads.md`](../docs/spec/reads.md) is checked
- [ ] Ready for human review
