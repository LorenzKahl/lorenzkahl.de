# Spec: Content Typography & Breakout Layout (lorenzkahl.de)

Traces to: [`docs/intent/content-typography-and-breakouts.md`](../intent/content-typography-and-breakouts.md)

Written retroactively, after implementation and merge, as a record of
what shipped and why — see that document for why this doc exists in
that order.

## Objective

Give the two placeholder posts (`src/posts/hello-world.md`,
`src/posts/a-second-post.md`) the length and HTML variety of a real
article, and give the layout the building blocks such articles need:
richer native-element typography (blockquote/cite, figure/figcaption),
a hand-rolled callout component, and a breakout grid so individual
elements can spill past the text column — one side, both sides, or
full-bleed.

## Design Decisions

- **Breakout grid via named CSS grid lines, not a separate wrapper
  element.** `main` defines `[full-start] … [breakout-start] …
  [content-start] … [content-end] … [breakout-end] … [full-end]`
  columns. `main > article` gets `display: contents` so a post's content
  elements (headings, paragraphs, figures, …) become direct grid items
  of `main` instead of being trapped inside the article's own box —
  otherwise only `<article>` itself could be positioned in the grid, not
  its children. Utility classes (`.breakout-start`, `.breakout-end`,
  `.breakout`, `.full-bleed`) just set `grid-column` on individual
  elements.
- **Logical naming for the breakout utilities.** Named grid lines and
  Logical Properties (`margin-inline`, `border-inline-start`) were
  already used throughout the CSS; the breakout utilities were briefly
  named `.breakout-left`/`.breakout-right` and renamed to
  `.breakout-start`/`.breakout-end` to match — same reasoning, same
  vocabulary, everywhere in the file.
- **Callout is a hand-rolled component, kept in `base.css`.** It was
  raised whether callouts belong in a separate `components/callout.css`
  flattened via a PostCSS build step. Decided against, for now: the
  blog-relaunch spec explicitly excludes a preprocessor unless a
  concrete need arises, and `base.css` is documented as the file for
  content typography. Instead, `base.css` is organized into clearly
  bannered sections (Reset · Headings & inline elements · Native content
  elements · Component: Callout · Code & syntax highlighting) so the
  boundary between native-element styling and the hand-rolled component
  is visually unambiguous without a file split.
- **Callout naming follows BEM:** block (`.callout`), element
  (`.callout__title`), modifiers grouped at the end
  (`.callout--note`/`.callout--tip`/`.callout--warning`) — not
  interleaved with the element rule.
- **Placeholder images are hand-authored SVGs**, not fetched or
  generated — the relaunch spec explicitly excludes an image-
  optimization pipeline, and self-contained SVGs need neither.

## Files Touched

```
src/assets/css/layout.css        → breakout grid on `main`, utility classes
src/assets/css/base.css          → blockquote/cite, figure/figcaption, hr,
                                    h5/h6, callout component, section banners
src/assets/images/
  placeholder-content.svg        → 1200×675, content-width figure
  placeholder-breakout.svg       → 1600×700, breakout-width figure
  placeholder-full-bleed.svg     → 2400×900, full-bleed figure
src/posts/hello-world.md         → rewritten, longer, exercises all of the above
src/posts/a-second-post.md       → rewritten, longer, exercises all of the above
.stylelintrc                     → selector-class-pattern extended to allow
                                    BEM's __/-- separators alongside kebab-case
```

## Testing Strategy

Matches the blog-relaunch spec's existing approach — no automated test
framework for this static, JS-logic-free site. Verification is:

- `npm run build` completes without errors.
- `npm run lint` (ESLint + Stylelint) passes clean.
- Manual/visual check via a real browser (desktop ~1400px and mobile
  ~390px viewports): breakout figures and full-bleed images render at
  the intended width, no horizontal overflow at mobile width, callouts
  are visually distinct per variant, blockquote/cite renders correctly.

## Boundaries

- **Always do:** Keep CSS plain, inside the existing three-file
  structure (`tokens.css`/`base.css`/`layout.css`) — no new CSS files,
  no preprocessor.
- **Ask first:** Any new npm dependency (e.g. PostCSS, if the
  `components/` split is revisited later); any change to the base
  three-file CSS structure documented in the blog-relaunch spec.
- **Never do:** Introduce physical-direction (`left`/`right`) naming in
  CSS where the codebase already uses logical properties; interleave BEM
  modifier rules with element rules.

## Success Criteria

- [x] Both example posts contain multiple heading levels each followed
      by body text (h2–h4).
- [x] Both example posts contain at least one `<blockquote>` with a
      `<cite>`; one is a plain single-direction quote, one is a
      `.breakout` (both-direction) pull-quote.
- [x] Both example posts contain `<figure>`/`<figcaption>` at each
      breakout width: content-width, one-sided breakout (one post
      `.breakout-start`, the other `.breakout-end`), and `.full-bleed`.
- [x] Both example posts contain at least one callout, covering all
      three variants (`--note`, `--tip`, `--warning`) across the two
      posts.
- [x] Breakout grid collapses cleanly on narrow viewports — no
      horizontal overflow (verified at 390px).
- [x] `.callout` follows BEM: block/element/modifier, modifiers grouped
      last.
- [x] `base.css` visually separates native-element typography from the
      hand-rolled callout component via section-banner comments.
- [x] `npm run lint` and `npm run build` pass clean.

## Decisions & Revisions Log

Kept because it explains *why* the code looks the way it does, not just
*what* it does — useful for whoever (human or agent) touches this next.

1. Callout classes were initially `.callout-note`/`.callout-tip` (plain
   kebab-case) and `.callout-title`; renamed to real BEM
   (`.callout--note`, `.callout__title`) on request. Required extending
   `.stylelintrc`'s `selector-class-pattern`, since
   `stylelint-config-standard`'s default rejects `__`/`--`.
2. BEM modifier rules (`.callout--note/--tip/--warning`) were initially
   interleaved with the element rule (`.callout__title`); reordered so
   all modifiers are grouped after the element, per BEM convention.
3. A `components/callout.css` + PostCSS split was proposed and declined
   — see "Design Decisions" above and the "Out of scope" note in the
   intent doc.
4. `base.css` was reorganized into banner-commented sections in the same
   pass that fixed BEM ordering, to make the native-vs-component
   boundary explicit rather than implicit in file order.
5. `.breakout-left`/`.breakout-right` renamed to
   `.breakout-start`/`.breakout-end` for consistency with the codebase's
   existing logical-properties convention.
6. Code review (before merge) found a dead-code cascade bug: the
   "no double margin after a heading" override (`h1..h6 { & + * {
   margin-block-start: 0 } }`) had the same specificity as a later,
   more general vertical-rhythm rule, so the later rule always won the
   cascade tie and the override never applied. Because CSS grid items
   don't collapse margins, this doubled the visual gap after every
   heading (measured 50px instead of the intended 20px). Fixed by
   targeting the override at `:is(p, ul, ol, blockquote, figure,
   .callout, pre)` instead of `*`, which raises its specificity above
   the general rule regardless of source order.
7. `.github/actions/build/action.yml` was found broken (pre-existing,
   unrelated to this spec) while verifying the PR's CI checks and fixed
   in a separate PR (#4) — see the intent doc's "Related, out-of-band
   fix" note.

## Open Questions

None outstanding. If `base.css` grows enough to make a single file
unwieldy, revisit the `components/` + PostCSS split noted above as a
deliberate, separately-scoped decision (new dependency, `docs/spec/
blog-relaunch.md`'s "no preprocessor" boundary would need updating).
