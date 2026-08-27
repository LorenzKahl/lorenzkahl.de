# Intent: Content Typography & Breakout Layout (lorenzkahl.de)

Confirmed via conversation on 2026-08-27. Documented retroactively after
implementation, review, and merge (PR #3, PR #4).

## Outcome

The two placeholder posts from the blog-relaunch round were too short and
only exercised paragraphs and a single code block — no sense of how a
real long-form article would render. This round rewrites both posts as
substantial articles and adds the typography and layout building blocks
they need: multiple heading levels combined with body text, blockquote
with `<cite>`, `<figure>`/`<figcaption>` with placeholder imagery, and a
hand-rolled callout component (note/tip/warning). The page layout gained
"breakout" elements — content that spills past the readable text column
to one side, both sides, or the full viewport width (full-bleed) — via a
CSS grid on `main`, no JavaScript involved.

## User

Lorenz as author — same as the blog-relaunch round. Readers: the public,
openly visible.

## Why now

The blog-relaunch round (see
[`docs/intent/blog-relaunch.md`](blog-relaunch.md)) deliberately shipped
with two-sentence placeholder posts — enough to prove the build pipeline
(RSS, syntax highlighting, collections) but not enough to see whether the
design system holds up against real editorial content. No blockquote, no
image, no aside, no layout variation had been exercised yet.

## Success (this round)

- Both example posts read as substantial articles: multiple sections,
  h2–h4 combined with body text.
- Every requested element renders and is visually distinct: blockquote +
  `<cite>`, figure + figcaption, callouts, breakout to one side, breakout
  to both sides, full-bleed.
- The callout component follows BEM (block, then element, then modifiers
  grouped at the end — not interleaved).
- `base.css` stays a single file (no PostCSS/component-file split) but is
  internally organized into clearly bannered sections, so native-element
  typography and the hand-rolled callout component don't blur together.
- Breakout utility classes use logical direction naming
  (`.breakout-start`/`.breakout-end`), consistent with the logical
  properties (`margin-inline`, `border-inline-start`) already used
  throughout the CSS, not `-left`/`-right`.
- No regressions: `npm run lint` / `npm run build` stay clean; verified
  in a real browser at desktop and mobile widths (no horizontal
  overflow).

## Constraints

- Same stack as blog-relaunch: plain CSS, no preprocessor, no new npm
  dependency, no image-optimization pipeline — placeholder images are
  hand-authored inline SVGs, not fetched or generated assets.
- Logical properties throughout, including in new class names — no
  physical `left`/`right` in code, even though the article copy itself
  describes the physical direction for human readers.

## Out of scope (this round)

- A `components/`-style CSS split with a PostCSS build step to flatten
  it at build time — considered and explicitly declined in favor of
  staying inside `base.css` with banner-comment sections. Revisit if
  `base.css` grows enough that a single file becomes genuinely unwieldy.
- Real photography or diagrams — SVG placeholders stand in until actual
  post content exists.
- Any additional placeholder posts beyond the two rewritten ones.

## Related, out-of-band fix

While verifying the PR, the "Build Test" / "Deploy to GitHub Pages" CI
checks were found broken — pre-existing since the blog-relaunch merge
itself, unrelated to this round's content work. Fixed separately in
PR #4 (`.github/actions/build/action.yml` referenced a `production` npm
script and a `sharp` install that no longer exist post-relaunch). Not
part of this spec; called out here only because discovering and fixing
it happened in the same working session.
