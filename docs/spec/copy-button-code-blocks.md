# Spec: Copy Button on Code Blocks (lorenzkahl.de)

Traces to: a direct feature request ("Copy-Button an Codeblöcken"). No
separate intent/idea document — the request was small and unambiguous
enough to resolve its open technical questions during spec research
(see Decisions below) rather than through a dedicated `/interview-me`
or `/idea-refine` pass.

## Objective

Let a reader copy a fenced code block's plain-text content to the
clipboard with one click, without retyping or manually selecting the
highlighted (span-wrapped) text.

## Design Decisions

- **`<wa-copy-button>`, not hand-written clipboard JS.** Web Awesome
  (already loaded via its CDN autoloader at `webawesome@3.12.0`, per
  `src/_includes/layouts/base.njk`) ships a native copy-button
  component with built-in `clipboard.writeText()` handling and
  success/error feedback. Using it stays inside the blog-relaunch
  spec's boundary ("ask first" before "introducing any client-side
  JavaScript beyond what a Web Awesome component needs natively") —
  no hand-rolled `<script>`, no new npm dependency, same autoloader
  already in place for `<wa-icon>`.
- **`from="<id>"`, not `value="..."`.** `value` would require baking
  each block's plain-text content into an HTML attribute a second
  time (escaping risk, and drift from the rendered code if either
  copy changes independently). `from` points the button at the
  `<pre>` element's `id` and copies its `textContent` — since
  Prism's syntax-highlighting markup is `<span>` elements around the
  same text, `textContent` yields exactly the code, with none of the
  `<span class="token ...">` wrapper markup.
- **Wrapping happens by overriding `md.renderer.rules.fence`**, not by
  passing `preAttributes`/`codeAttributes` to
  `@11ty/eleventy-plugin-syntaxhighlight`. Confirmed against that
  plugin's actual source
  (`node_modules/@11ty/eleventy-plugin-syntaxhighlight/src/markdownSyntaxHighlightOptions.js`):
  it registers a markdown-it highlighter function that always returns
  a complete `<pre><code>...</code></pre>` string with no wrapper
  hook — `preAttributes`/`codeAttributes` can only add attributes
  onto those two elements, not insert a sibling `<wa-copy-button>` or
  a containing `<div>`. Overriding `fence` directly (call the
  existing default renderer for the highlighted markup, then wrap its
  return value) reuses the exact same `amendLibrary("md", …)`
  extension point the callout shortcode already installs — see
  [`docs/spec/callout-icons-and-shortcode.md`](callout-icons-and-shortcode.md) —
  rather than introducing a second, competing customization mechanism
  (e.g. an 11ty HTML-output transform).
- **A per-build incrementing counter generates each block's `id`**
  (e.g. `code-block-1`, `code-block-2`, …), assigned inside the same
  `fence` override closure. IDs only need to be unique within a
  rendered page for `from` to resolve correctly; a monotonic counter
  guarantees that more simply than hashing content or tracking
  per-page state.
- **Labels are German**, matching the site's language (posts, nav, and
  `readableDate`'s `de-DE` formatting are all German): `copy-label`
  ("Code kopieren"), `success-label` ("Kopiert!"), `error-label`
  ("Fehler beim Kopieren").
- **No copy button on inline code** (`` `code` ``). Only fenced blocks
  (```` ``` ````) render through `renderer.rules.fence`; inline code
  renders through `renderer.rules.code_inline`, untouched by this
  change. Matches the common convention (GitHub, MDN, Docusaurus) of
  reserving copy affordances for multi-line blocks.
- **A Playwright E2E test verifies the clipboard write**, the first
  automated test in this project. Manual/visual verification (the
  approach every prior round used) can't prove a clipboard write
  actually happened — only that a button exists and looks right. This
  is a deliberately narrow exception to
  [`docs/spec/blog-relaunch.md`](blog-relaunch.md)'s original "no
  automated test framework" call, scoped to this one feature; see that
  spec's Decisions & Revisions Log #1 for the full reasoning. General
  Playwright/CI rollout beyond this is tracked separately in
  [`docs/future/testing-infrastructure.md`](../future/testing-infrastructure.md),
  not built here.
- **No layout changes needed.** `layout.css`'s breakout grid already
  defaults every direct child of `main > article` to `grid-column:
  content` (`main > article > * { grid-column: content; }`); the new
  `.code-block` wrapper div is such a child and inherits that
  placement automatically, same as the `<pre>` it now contains did
  before.

## Files Touched

```
.eleventy.js              → md.renderer.rules.fence override: wraps the
                             existing highlighted <pre><code> output in
                             <div class="code-block">, assigns a unique
                             id to <pre>, appends a <wa-copy-button>
src/assets/css/base.css   → .code-block wrapper (position: relative) and
                             copy-button positioning/sizing in the
                             existing "Code & syntax highlighting" section
package.json              → adds @playwright/test as a devDependency,
                             a "test:e2e" script
playwright.config.js      → new — Playwright config (base URL against
                             a built/served site, one browser project)
tests/e2e/
  copy-button.spec.js     → new — loads a post, clicks the copy button,
                             asserts the clipboard contains the plain
                             code text
```

No changes to `src/posts/*.md` — the feature applies to every existing
and future fenced code block without touching post content, unlike the
callout shortcode (which required rewriting call sites).

## Testing Strategy

This round departs from the project's prior no-automated-tests
approach for one reason: a clipboard write is runtime behavior that
manual/visual inspection can't actually confirm (see Design
Decisions). Verification is:

- `npm run build` completes without errors.
- `npm run lint` (ESLint + Stylelint) passes clean.
- **`npm run test:e2e`** (new) runs a Playwright spec that opens a
  built post page, clicks the copy button, and asserts the clipboard
  contains the fenced block's plain-text code — the automated
  replacement for "did the copy actually work," which no prior round
  needed to prove.
- Manual/visual check via a real browser on both example posts (which
  between them exercise `js`, `css`, and `bash` fenced blocks) for
  everything the E2E spec doesn't cover:
  - Copy button is visible and positioned without overlapping code text
    at desktop and mobile (~390px) widths.
  - Button shows German success feedback after a successful copy.
  - Button is keyboard-reachable (Tab) and activatable (Enter/Space).
  - No regression to existing syntax-highlighting colors or spacing.

## Boundaries

- **Always do:** Use `<wa-copy-button>`'s own feedback states
  (`success-label`/`error-label`) instead of building custom
  success/error UI. Keep the `fence` override inside the existing
  `amendLibrary("md", …)` block in `.eleventy.js` rather than adding a
  second markdown-it customization site.
- **Ask first:** Any change to `@11ty/eleventy-plugin-syntaxhighlight`'s
  own options (`preAttributes`/`codeAttributes`/etc.) if a future need
  arises — this round deliberately avoids touching them (see Design
  Decisions). Any expansion of Playwright beyond this one E2E spec
  (more specs, CI wiring) — tracked, not decided, in
  [`docs/future/testing-infrastructure.md`](../future/testing-infrastructure.md).
- **Never do:** Add a copy button to inline code spans. Write custom
  `clipboard.writeText()` JavaScript when `<wa-copy-button>` already
  covers the need. Grow this round's Playwright setup into general
  test infrastructure — that's a separate, deliberately-scoped future
  round.

## Success Criteria

- [ ] Every fenced code block across the site renders a copy button
      that copies the block's plain-text code content.
- [ ] Copied text contains no syntax-highlighting markup or HTML
      entities — exactly what was in the fenced block.
- [ ] Button is keyboard-focusable and shows a German success/error
      label after activation.
- [ ] Inline code spans are unaffected — no copy button, no id, no
      wrapper.
- [ ] No horizontal overflow or visual overlap with code content at
      390px viewport width.
- [ ] `npm run lint` and `npm run build` pass clean.
- [ ] `npm run test:e2e` passes, covering: clicking the copy button
      results in the fenced block's plain-text code on the clipboard.

## Open Questions

None outstanding — the implementation unknowns going in (how to inject
a sibling element around the plugin's fence output; whether using
`<wa-copy-button>` stays inside the "ask first" JS boundary; whether
introducing Playwright needed a spec-level decision) were all resolved
during spec research and discussion (see Design Decisions and
[`docs/spec/blog-relaunch.md`](blog-relaunch.md)'s Decisions &
Revisions Log #1).
