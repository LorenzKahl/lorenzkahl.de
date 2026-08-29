# Spec: General Test Infrastructure (lorenzkahl.de)

Traces to: [`docs/future/testing-infrastructure.md`](../future/testing-infrastructure.md).
No separate intent/idea document — the backlog entry already narrowed
the scope to four concrete questions (CI wiring, when a feature needs
an E2E spec, whether to backfill, browser matrix), so this spec
resolves them directly rather than through a dedicated `/idea-refine`
pass.

## Objective

Turn the copy-button round's one-off Playwright spec into a repeatable
pattern: E2E tests run automatically in CI on every push/PR, and
there's a written rule for when a future feature needs one.

## Design Decisions

- **Add an `e2e` job to the existing `.github/workflows/ci.yml`**,
  parallel to the current `lint`/`build` jobs, rather than a separate
  workflow file. It's the same event triggers (`push` to `main`,
  every `pull_request`) and the same repo — a second workflow file
  would just split one CI run's status across two checks for no
  benefit.
- **`npx playwright install --with-deps chromium`**, not the full
  browser suite. `playwright.config.js` only defines a `chromium`
  project — installing `firefox`/`webkit` too would just slow CI down
  for browsers nothing tests against.
- **The `e2e` job runs independently of `build`/`deploy`, not gating
  them.** `playwright.config.js`'s `webServer` already runs its own
  `eleventy --serve` before the spec, so the job doesn't depend on the
  `build` job's artifact. Keeping it non-blocking for `deploy` matches
  today's behavior (a red E2E run currently has zero effect on
  shipping) — making `deploy` depend on it is a real behavior change
  or CI, out of scope here.
- **The written convention (see Boundaries) lives in this spec, cross-
  linked from [`docs/spec/blog-relaunch.md`](blog-relaunch.md)'s
  Decisions & Revisions Log**, rather than a new top-level
  `docs/conventions.md`. There's exactly one rule to state; a new
  standalone doc for one paragraph would be more indirection than the
  content warrants.
- **No backfill.** The only existing interactive Web Awesome component
  outside the copy button is `<wa-button href="#top">` (footer "Back
  to top" link) — a plain anchor navigation, fully verifiable by
  reading the rendered HTML/screenshot (does the link exist, does it
  point at `#top`). It has no runtime behavior a screenshot can't
  prove, so it doesn't meet the rule below and isn't retrofitted with
  a spec just to have one.
- **No mobile-viewport Playwright project added.** Nothing in the
  current or foreseeable E2E suite tests viewport-dependent behavior —
  positioning at narrow widths is a visual concern, already covered by
  the manual/Playwright-MCP checks each round already does (see e.g.
  [`docs/spec/copy-button-code-blocks.md`](copy-button-code-blocks.md)'s
  Testing Strategy). Adding a second project now would run every
  future spec twice for no current test that needs it — revisit if a
  spec actually needs to assert viewport-dependent runtime behavior.

## Files Touched

```
.github/workflows/ci.yml   → new "e2e" job: setup Node, npm ci, install
                              Playwright's chromium browser, run
                              `npm run test:e2e`
docs/spec/blog-relaunch.md → Decisions & Revisions Log: add an entry
                              cross-linking this spec as the E2E-vs-
                              manual convention
docs/future/testing-infrastructure.md → mark resolved, point at this
                              spec instead of describing open questions
```

## Testing Strategy

This round's own test coverage is the CI wiring itself:

- `npm run build` and `npm run lint` still pass (unchanged files
  outside the workflow YAML).
- The new `e2e` job is verified by inspecting a CI run (or a local
  `act`/manual re-creation of its steps) rather than by adding a new
  Playwright spec — there's no new client-side runtime behavior to
  test in this round, only a pipeline change.

## Boundaries

- **Always do:** Add a Playwright E2E spec (in `tests/e2e/`) for
  genuine client-side runtime behavior that a static screenshot or
  DevTools inspection can't prove — the same line the copy-button
  round drew (a clipboard write actually succeeding, a value actually
  persisting, a network call actually firing). For everything else —
  layout, positioning, visual appearance, static markup, plain
  navigation — a manual/visual check (or Playwright MCP screenshot
  during the round) is enough; don't add a spec file just because a
  round touches a Web Awesome component.
- **Ask first:** Adding a second Playwright project (e.g. a mobile
  viewport, another browser engine) before a spec actually needs one.
  Making the `e2e` CI job block `deploy`.
- **Never do:** Introduce a unit-test framework (Jest/Vitest/etc.) —
  still no business logic to unit test, per
  [`docs/spec/blog-relaunch.md`](blog-relaunch.md)'s Decisions &
  Revisions Log #1. Backfill E2E specs for existing UI that has no
  runtime behavior to prove, just for coverage's sake.

## Success Criteria

- [x] `.github/workflows/ci.yml` runs `npm run test:e2e` on every push
      to `main` and every pull request, in its own job.
- [x] The written rule for "does this need an E2E spec" lives in this
      spec's Boundaries and is cross-linked from
      [`docs/spec/blog-relaunch.md`](blog-relaunch.md).
- [x] `npm run build` and `npm run lint` still pass.

## Open Questions

None outstanding.
