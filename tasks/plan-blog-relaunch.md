# Implementation Plan: Blog Relaunch (lorenzkahl.de)

Traces to: [`docs/spec/blog-relaunch.md`](../docs/spec/blog-relaunch.md)

## Overview

Rebuild lorenzkahl.de as an empty 11ty v3 project on a new branch. Work
proceeds as vertical slices — each task leaves `npm run dev` in a working,
visually-checkable state — rather than building all config, then all
content, then all styling. Web Awesome (CDN) and the warm/fluid design
system get wired in early so every later page benefits from them
immediately, instead of being retrofitted at the end.

## Architecture Decisions

- **Single flat `.eleventy.js`**, not the old `src/config/*.js` split —
  small site, one readable file (per spec).
- **Foundation before design before content-that-needs-design**: config
  → base layout + Web Awesome → CSS tokens/fluid scale → pages/posts that
  consume all of the above. This avoids styling pages twice.
- **Existing tooling configs (`eslint.config.js`, `.stylelintrc`,
  `.prettierrc.json`) get rebuilt/simplified in Task 1**, not left as-is —
  the current Stylelint config targets SCSS, which no longer applies once
  the preprocessor is dropped.
- **`netlify.toml`, `CNAME`, `.nvmrc`, `.github/`, `LICENSE`, `README*` are
  left untouched** — deployment and repo metadata are explicitly out of
  scope per the spec's Boundaries section.

## Task List

### Phase 1: Foundation (walking skeleton)

- [ ] Task 1: New branch + clean-slate config
- [ ] Task 2: Base layout with Web Awesome CDN integration

### Checkpoint: Foundation
- [ ] `npm run dev` serves a minimal page with no build errors
- [ ] A Web Awesome component renders correctly in the browser (not
      unstyled fallback markup)
- [ ] `npm run lint` passes on the rebuilt config

### Phase 2: Design system

- [ ] Task 3: Warm palette + Utopia fluid scale in CSS tokens
- [ ] Task 4: Base + layout CSS wired into the base layout

### Checkpoint: Design system
- [ ] Home page (even empty) visibly uses the warm palette
- [ ] Resizing the browser between ~375px and ~1400px shows heading/body
      text size and section spacing scale smoothly (no snap at a
      breakpoint)

### Phase 3: Content

- [ ] Task 5: Placeholder posts + posts collection + home page list
- [ ] Task 6: Post layout + syntax highlighting
- [ ] Task 7: About page

### Checkpoint: Content
- [ ] Home page lists both placeholder posts with title + date, linked
- [ ] Each post page renders through the shared post layout
- [ ] The code-sample post shows highlighted syntax (not plain text)
- [ ] About page renders

### Phase 4: Feed + final verification

- [ ] Task 8: RSS feed
- [ ] Task 9: Full success-criteria pass

### Checkpoint: Complete
- [ ] Every checkbox in the spec's Success Criteria section is checked
- [ ] `npm run build` and `npm run lint` both pass clean
- [ ] Ready for human review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Web Awesome CDN autoloader tag/version syntax used incorrectly (unfamiliar library) | Med | Check Web Awesome's own docs/CDN snippet directly during Task 2 before writing the script tag from memory (`source-driven-development` posture) |
| Utopia clamp() values miscalculated by hand | Low | Generate values from utopia.fyi's calculator directly, paste the output — don't hand-derive the clamp() math |
| Stylelint/ESLint configs still assume SCSS/old structure, causing false failures | Med | Rebuild these configs in Task 1 as part of the clean slate, not left as leftover config pointing at deleted files |
| Wipe accidentally deletes deployment/repo files (`netlify.toml`, `CNAME`, `.github/`) | Med | Task 1 explicitly scopes deletion to `src/`, `.eleventy.js`, `package.json` dependencies, and `public/` — verify with `git status` before committing the wipe |
| RSS feed template producing invalid XML | Low | Validate `/feed.xml` output with a feed validator or by eye against RSS 2.0 spec in Task 8's verification step |

## Open Questions

- Final branch name — plan assumes `blog-relaunch` (per the spec's open
  question) unless corrected before Task 1.
