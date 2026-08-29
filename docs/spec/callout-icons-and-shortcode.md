# Spec: Callout Icons & Authoring Shortcode (lorenzkahl.de)

Traces to: [`docs/ideas/callout-icons-and-shortcode.md`](../ideas/callout-icons-and-shortcode.md)

Written retroactively, after implementation and merge (commit
`fad8120`), as a record of what shipped and why. This round used
`/idea-refine` rather than `/interview-me`, so there is no separate
`docs/intent/` document — the idea doc above carries that role (problem
statement, MVP scope, and the open questions resolved during
implementation).

## Objective

Give each callout variant (note/tip/warning) a legible icon, and replace
the raw-HTML-plus-blank-line authoring form (needed to keep Markdown
rendering inside a `<div>`) with a one-line Markdown shortcode.

## Design Decisions

- **Icons via `<wa-icon>`, not a new asset pipeline.** Web Awesome is
  already loaded via CDN; its default icon library is bundled Font
  Awesome Free, so `note`→`circle-info`, `tip`→`lightbulb`,
  `warning`→`triangle-exclamation` cost no new dependency. The
  variant→icon mapping lives once in `.eleventy.js` (`CALLOUT_ICONS`),
  not repeated at each call site.
- **`.callout` becomes a 2-column CSS grid**, not a flex row with
  absolute-positioned icon. Icon and title share row 1 (icon column
  `auto`-width, vertically centered via `align-items: center`); the new
  `.callout__body` wrapper spans both columns (`grid-column: 1 / -1`)
  in row 2. This is the standard admonition layout (MDN/Docusaurus/
  GitHub Alerts) — a badge/corner-overlap treatment was considered and
  rejected as needing `position: absolute` + rotation to look
  intentional rather than accidental (see idea doc).
- **Margin-reset rules moved from `.callout` to `.callout__body`.**
  Before this change, `.callout > :first-child` / `:last-child` reset
  the block's own leading/trailing margins. Once the icon became a grid
  item, "first child" was no longer reliably the title, so the reset
  moved to target the body wrapper's children instead — a direct
  consequence of introducing `.callout__body`, not an independent
  choice.
- **An 11ty paired shortcode (`addPairedShortcode`), not a Liquid
  template partial or a markdown-it container plugin.** The project's
  posts use Liquid as their Markdown template engine (confirmed: no
  `markdownTemplateEngine` override in `.eleventy.js`, and build output
  shows posts writing "(liquid)"), and 11ty's paired shortcodes work
  under Liquid without switching engines. A `markdown-it-container`
  plugin (`::: tip` fenced syntax) was rejected per the idea doc: it
  would add a new npm dependency, and the blog-relaunch spec requires
  asking first before adding one.
- **Shortcode body is rendered through 11ty's own configured
  markdown-it instance**, captured once via
  `eleventyConfig.amendLibrary("md", (mdLib) => { markdownLibrary = mdLib })`
  at config time and reused inside the shortcode. This was the
  resolution to the idea doc's open assumption that "11ty does not
  automatically run paired-shortcode content through the Markdown
  renderer" — without it, `**bold**`/`` `code` ``/links inside a
  callout body would render as literal text. `markdown-it` itself is
  not a separate direct dependency; it is 11ty's own transitive one,
  reused rather than re-imported.
- **Unknown variant throws at build time** rather than silently
  emitting a callout with no icon — a typo in a post (`{% callout
  "nte" ... %}`) fails the build instead of shipping a visibly broken
  page.

## Files Touched

```
.eleventy.js                              → CALLOUT_ICONS map, amendLibrary("md", …)
                                             capture, addPairedShortcode("callout", …)
src/assets/css/base.css                   → .callout → 2-column grid, wa-icon sizing/color,
                                             new .callout__body wrapper + margin resets
src/posts/hello-world.md                  → note + tip callouts converted to shortcode form
src/posts/a-second-post.md                → warning callout converted to shortcode form
docs/ideas/callout-icons-and-shortcode.md → pre-existing idea doc (input to this spec)
```

## Testing Strategy

Matches the blog-relaunch spec's existing approach — no automated test
framework for this static, JS-logic-free site. Verification is:

- `npm run build` completes without errors, including the shortcode's
  build-time throw on an unrecognized variant (verified by triggering
  it deliberately, then removing the trigger).
- `npm run lint` (ESLint + Stylelint) passes clean.
- Manual/visual check via a real browser: all three variants render
  their icon, colored per `--callout-color`, vertically centered
  against the title; Markdown inside a callout body (`**bold**`,
  `` `code` ``, links) still renders as formatted HTML, not literal
  text.

## Boundaries

- **Always do:** Keep the variant→icon mapping in one place
  (`.eleventy.js`); keep using 11ty's own markdown-it instance instead
  of importing/configuring a second one.
- **Ask first:** Any new npm dependency (e.g. a markdown-it container
  plugin, if the shortcode approach is revisited); switching
  `markdownTemplateEngine` away from Liquid.
- **Never do:** Hardcode a variant's icon name at a post's call site;
  let an unrecognized variant pass silently.

## Success Criteria

- [x] All three callout variants (`note`, `tip`, `warning`) render a
      distinct icon, colored via `--callout-color`.
- [x] Icon and title are vertically centered against each other; body
      text spans the full callout width below.
- [x] Both example posts author their callouts as `{% callout
      "variant" "Title" %}...{% endcallout %}` — no raw
      `<div class="callout">` HTML remains.
- [x] Markdown formatting inside a callout body renders correctly
      (bold/code/links), matching what the old raw-HTML form supported.
- [x] An unrecognized variant throws a build-time error naming the
      valid variants, rather than emitting broken markup.
- [x] `npm run lint` and `npm run build` pass clean.

## Decisions & Revisions Log

Kept because it explains *why* the code looks the way it does, not just
*what* it does.

1. The idea doc's four "Key Assumptions to Validate" were resolved
   during implementation rather than left as guesses: `wa-icon` themes
   via `color`/`font-size` (used directly, no `currentColor` hack
   needed); `circle-info`/`lightbulb`/`triangle-exclamation` exist in
   the bundled Font Awesome Free set; the grid layout's margin resets
   were retargeted from `.callout`'s direct children to
   `.callout__body`'s, avoiding a conflict with the icon now also being
   a direct child; Liquid was kept (no `markdownTemplateEngine`
   change), with `addPairedShortcode` working under Liquid as assumed.
2. Markdown-inside-shortcode rendering was resolved by capturing 11ty's
   own configured `md` library via `amendLibrary`, rather than
   `require`-ing a fresh `markdown-it` instance — keeps a single
   source of truth for Markdown configuration (e.g. syntax
   highlighting plugins already registered on it) instead of two
   independently configured renderers that could drift apart.

## Open Questions

None outstanding.
