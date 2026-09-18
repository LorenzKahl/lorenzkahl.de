# Spec: Sieve King Support Page (lorenzkahl.de)

Traces to: a direct feature request ("Support-URL für die App-Store-Review
von Sieve King"). No separate intent/idea document — a single,
concretely-specified page, resolved via a short clarifying round
(hosting location, contact mechanism, language) rather than a full
`/idea-refine` pass.

## Objective

A support/product page for the iOS/macOS app Sieve King, reachable at
`/apps/sieve-king/`, that satisfies Apple's App Store Connect "Support
URL" requirement: app identity (icon, name, description) plus a way to
reach the developer.

## Design Decisions

- **`src/apps/sieve-king/index.md`**, mirroring `src/about.md`'s
  pattern (Markdown + `layouts/base.njk`, directory-index permalink →
  `/apps/sieve-king/`). No new collection or layout needed — this is a
  standalone page like About, not part of `posts`.
- **App icon via a new passthrough-copy glob**
  (`src/apps/**/*.png` → `public/apps/**/*.png`), matching the existing
  `src/assets` → `public/assets` pattern in `.eleventy.js`. The actual
  `icon.png` file is supplied by the user directly, not generated here.
- **Contact is a `<form>` that builds a `mailto:` link on submit, not a
  visible email address or a hosted form backend.** Explicit user
  request, to keep `app-sieveking@truck-turner.de` out of the page's
  static HTML as plain scrapable text. The address is assembled from
  two JS string parts (`user` + `domain`) at click-time rather than
  written as one literal string — deters naive regex scrapers of the
  rendered HTML; doesn't defend against a scraper that executes JS.
  Genuine hand-rolled client-side JS (event listener, `URLSearchParams`,
  `window.location.href = "mailto:..."`), which the
  [`blog-relaunch`](blog-relaunch.md) spec's Boundaries mark "ask
  first" for — covered here by the user's explicit request for exactly
  this mechanism, in this conversation.
- **Form fields use existing Web Awesome components** (`<wa-input>` for
  Betreff, `<wa-textarea>` for Nachricht, `<wa-button>` for the
  submit action) — same autoloader already in place, no new
  dependency, consistent with `<wa-button>`/`<wa-icon>`/
  `<wa-copy-button>` already used elsewhere.
- **Privacy note reuses the existing `{% callout %}` shortcode**
  (`tip` variant) instead of a new component, for the "no ads, no
  tracking, no third-party servers" line from the app's description.
- **New `.app-header` and `.contact-form` CSS in `base.css`**, following
  the file's existing "Component" section convention (see `.callout`).
  Not put in `layout.css` — these are page-content components, not
  page-level structure.

## Files Touched

```
.eleventy.js                    → new passthrough-copy glob for
                                   src/apps/**/*.png
src/apps/sieve-king/
  index.md                      → new — the support page content
  icon.png                      → supplied by the user (not created
                                   by this round; landed on main
                                   between spec and implementation)
  privacy-policy.md             → one line added, linking back to the
                                   support page (this page already
                                   existed on main, from a separate,
                                   unrelated change)
src/assets/css/base.css         → new .app-header and .contact-form
                                   component styles
```

## Testing Strategy

No new client-side runtime behavior warranting a Playwright spec under
[`docs/spec/testing-infrastructure.md`](testing-infrastructure.md)'s
rule — a `mailto:` navigation isn't something Playwright can assert
against a real mail client opening, and a screenshot / manual click
covers "does the form build the right link." Verification is:

- `npm run build` and `npm run lint` pass clean.
- Manual check: the rendered page shows the icon (once supplied),
  title, description, feature list, and privacy callout; submitting
  the form with a filled-in message navigates to a `mailto:` URL
  containing the encoded subject/body.

## Boundaries

- **Always do:** Keep the raw email address out of the page's visible
  HTML text — only ever assembled in the submit handler.
- **Never do:** Add a real form backend/service for this — the
  explicit point of this round was avoiding exactly that.

## Open Questions

- Whether `<wa-input>`/`<wa-textarea>` accept exactly a `label`
  attribute as used here — consistent with the rest of the Web Awesome
  family already in use (`<wa-button>`'s `appearance`/`size`), but not
  verified against a live render: this sandbox can't reach Web
  Awesome's CDN (see prior conversation), so the component never
  actually upgrades here. Worth a real-browser check before relying on
  this page for the App Store submission.
