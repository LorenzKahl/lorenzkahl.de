# Task List: Blog Relaunch (lorenzkahl.de)

Plan: [`tasks/plan.md`](plan.md) · Spec: [`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)

## Phase 1: Foundation

### Task 1: New branch + clean-slate config ✅ done

**Description:** Create the new branch, remove the old design/config/content
approach, and stand up an empty, working 11ty v3 project skeleton with
rebuilt tooling configs.

**Acceptance criteria:**
- [ ] New git branch created off `main` (e.g. `blog-relaunch`)
- [ ] `src/config/`, `src/assets/styles/`, `src/assets/views/`,
      `src/content/` and their contents are removed
- [ ] `@fontsource*` packages removed from `package.json`; `@11ty/eleventy`
      kept; `@11ty/eleventy-plugin-rss` and
      `@11ty/eleventy-plugin-syntaxhighlight` added
- [ ] New flat `.eleventy.js` exists with `dir` config (`input: "src"`,
      `output: "public"`) and both plugins registered
- [ ] `eslint.config.js` and `.stylelintrc` updated to match the new
      structure (no SCSS-specific rules)
- [ ] `netlify.toml`, `CNAME`, `.nvmrc`, `.github/`, `LICENSE`, `README*`
      are untouched

**Verification:**
- [ ] `npm run dev` starts without errors (even serving a bare
      placeholder `src/index.njk`)
- [ ] `npm run lint` passes
- [ ] `git status` confirms only the intended files/dirs were removed

**Dependencies:** None

**Files likely touched:**
- `.eleventy.js`
- `package.json`
- `eslint.config.js`
- `.stylelintrc`
- (deletions) `src/config/`, `src/assets/`, `src/content/`

**Estimated scope:** Medium (mostly deletion + a few new small files)

---

### Task 2: Base layout with Web Awesome CDN integration ✅ done

**Description:** Add the base Nunjucks layout with `<head>`, nav/footer
partials, and the Web Awesome CDN autoloader script tag (pinned version).

**Acceptance criteria:**
- [ ] `src/_includes/layouts/base.njk` exists with a valid HTML shell
- [ ] Web Awesome is loaded via a pinned-version `<script type="module">`
      CDN tag (checked against Web Awesome's own docs, not guessed)
- [ ] `src/_includes/partials/header.njk` and `footer.njk` exist and are
      included in the base layout
- [ ] At least one Web Awesome component (e.g. `<wa-button>`) is placed
      in the header or footer to prove the autoloader works

**Verification:**
- [ ] `npm run dev`, open in a real browser: the Web Awesome component
      renders styled (not as unstyled fallback content), confirmed via
      browser dev tools showing no failed script/network requests
- [ ] `npm run lint` passes

**Dependencies:** Task 1

**Files likely touched:**
- `src/_includes/layouts/base.njk`
- `src/_includes/partials/header.njk`
- `src/_includes/partials/footer.njk`
- `src/index.njk` (temporary content to render the layout)

**Estimated scope:** Small (2-4 files)

---

## Phase 2: Design system

### Task 3: Warm palette + Utopia fluid scale in CSS tokens

**Description:** Create `tokens.css` with warm-burnout-inspired color
custom properties and a Utopia-generated fluid type/space scale.

**Acceptance criteria:**
- [ ] `src/assets/css/tokens.css` defines color custom properties
      (background, text, accent, etc.) visually consistent with
      warm-burnout's palette
- [ ] Font stack custom properties defined: serif for headings,
      sans-serif for body (system fonts only)
- [ ] Fluid type scale (`--step-*`) and space scale (`--space-*`) custom
      properties generated via utopia.fyi and pasted in as `clamp()`
      values — not hand-approximated

**Verification:**
- [ ] `npm run lint` (stylelint) passes on the new file
- [ ] Manual check: resizing the browser shows `--step-*`/`--space-*`
      values change smoothly via dev tools computed styles

**Dependencies:** Task 1

**Files likely touched:**
- `src/assets/css/tokens.css`

**Estimated scope:** Small (1 file)

---

### Task 4: Base + layout CSS wired into the base layout

**Description:** Add reset/base element styles and page-level layout CSS,
link all three stylesheets from the base layout, and apply the tokens
(palette, fonts, fluid scale) to real elements.

**Acceptance criteria:**
- [ ] `src/assets/css/base.css` sets body background/text color from
      tokens, heading font-family from `--font-heading`, body
      font-family from `--font-body`, and body font-size from a
      `--step-*` token
- [ ] `src/assets/css/layout.css` defines the page container/grid and
      uses `--space-*` tokens for gaps/padding (native CSS nesting used
      where it simplifies selectors)
- [ ] All three stylesheets (`tokens.css`, `base.css`, `layout.css`)
      linked in `base.njk`

**Verification:**
- [ ] `npm run dev`, visual check: page background/text use the warm
      palette; heading is visibly serif, body visibly sans-serif
- [ ] Resizing the browser between ~375px and ~1400px shows smooth
      (non-stepped) size/spacing changes
- [ ] `npm run lint` passes

**Dependencies:** Task 2, Task 3

**Files likely touched:**
- `src/assets/css/base.css`
- `src/assets/css/layout.css`
- `src/_includes/layouts/base.njk`

**Estimated scope:** Small (2-3 files)

---

## Phase 3: Content

### Task 5: Placeholder posts + posts collection + home page list

**Description:** Add placeholder post content, an 11ty collection built
from the `src/posts/` directory, and a home page that lists them.

**Acceptance criteria:**
- [ ] `src/posts/hello-world.md` and one more placeholder post exist,
      each with `title`, `date`, `description` front matter
- [ ] `.eleventy.js` (or a data file) defines a `posts` collection sourced
      from `src/posts/*.md`, sorted newest-first
- [ ] `src/index.njk` lists all posts (title + date, linked to
      `/posts/{slug}/`)

**Verification:**
- [ ] `npm run dev`: home page shows both placeholder posts, links
      resolve to working post pages (even if unstyled at this point)
- [ ] `npm run build` succeeds

**Dependencies:** Task 4

**Files likely touched:**
- `src/posts/hello-world.md`
- `src/posts/<second-post>.md`
- `src/index.njk`
- `.eleventy.js`

**Estimated scope:** Small (3-4 files)

---

### Task 6: Post layout + syntax highlighting

**Description:** Add a dedicated post layout and wire up build-time
syntax highlighting; ensure one placeholder post contains a fenced code
block to prove it works.

**Acceptance criteria:**
- [ ] `src/_includes/layouts/post.njk` extends `base.njk`, renders title
      and formatted date above the content
- [ ] Both placeholder posts use the post layout via front matter
- [ ] One placeholder post contains a fenced code block (e.g. a short JS
      or CSS snippet)
- [ ] `@11ty/eleventy-plugin-syntaxhighlight` is registered in
      `.eleventy.js`

**Verification:**
- [ ] `npm run dev`: the code-sample post shows syntax-highlighted code
      (colored tokens, not plain monochrome text)
- [ ] `npm run build` succeeds

**Dependencies:** Task 5

**Files likely touched:**
- `src/_includes/layouts/post.njk`
- `src/posts/<code-sample-post>.md`
- `.eleventy.js`

**Estimated scope:** Small (2-3 files)

---

### Task 7: About page

**Description:** Add a static About page using the base layout.

**Acceptance criteria:**
- [ ] `src/about.md` (or `.njk`) exists with placeholder bio content
- [ ] Renders at `/about/` using the base layout
- [ ] Linked from the header/footer nav

**Verification:**
- [ ] `npm run dev`: `/about/` renders correctly, styled consistently
      with the rest of the site
- [ ] `npm run build` succeeds

**Dependencies:** Task 4

**Files likely touched:**
- `src/about.md`
- `src/_includes/partials/header.njk` (nav link)

**Estimated scope:** XS (1-2 files)

---

## Phase 4: Feed + final verification

### Task 8: RSS feed

**Description:** Add an RSS feed of all posts using
`@11ty/eleventy-plugin-rss`.

**Acceptance criteria:**
- [ ] `@11ty/eleventy-plugin-rss` registered in `.eleventy.js`
- [ ] `src/feed.njk` (or `.xml`) template generates a feed listing all
      posts with title, link, date, and description
- [ ] `src/_data/site.js` (or similar) supplies site title/description/URL
      used by the feed

**Verification:**
- [ ] `npm run build`: output includes a feed file (e.g. `public/feed.xml`)
- [ ] Feed content validates as well-formed RSS/XML (validator or manual
      inspection against the RSS 2.0 spec)

**Dependencies:** Task 5

**Files likely touched:**
- `src/feed.njk`
- `src/_data/site.js`
- `.eleventy.js`

**Estimated scope:** Small (2-3 files)

---

### Task 9: Full success-criteria pass

**Description:** Walk every checkbox in the spec's Success Criteria
section against the running site and fix any gaps found.

**Acceptance criteria:**
- [ ] Every item in `docs/spec/blog-relaunch.md`'s Success Criteria list
      is verified true
- [ ] No React/framework dependency, no dark-mode toggle, no
      tags/categories UI, no comments/analytics/newsletter present
      (confirmed by inspection, not just by omission)

**Verification:**
- [ ] `npm run build` and `npm run lint` both pass clean
- [ ] Manual full walkthrough in a real browser: home → post → about →
      feed

**Dependencies:** Task 6, Task 7, Task 8

**Files likely touched:** Varies — whatever gaps Task 9 surfaces

**Estimated scope:** Small (fixes only, no new structure expected)

---

## Checkpoint: Foundation (after Task 2)
- [ ] `npm run dev` serves a minimal page with no build errors
- [ ] A Web Awesome component renders correctly (not unstyled fallback)
- [ ] `npm run lint` passes

## Checkpoint: Design system (after Task 4)
- [ ] Page visibly uses the warm palette, serif headings, sans body
- [ ] Type/spacing scale fluidly between ~375px and ~1400px viewport

## Checkpoint: Content (after Task 7)
- [ ] Home lists both posts; post pages render via the post layout
- [ ] Code-sample post shows highlighted syntax
- [ ] About page renders

## Checkpoint: Complete (after Task 9)
- [ ] Every Success Criteria checkbox in the spec is checked
- [ ] `npm run build` and `npm run lint` pass clean
- [ ] Ready for human review
