# Intent: Blog Relaunch (lorenzkahl.de)

Confirmed via `interview-me` on 2026-08-27.

## Outcome

A fresh 11ty v3 static site for lorenzkahl.de, personal blog, built on a new
branch — existing repo work (design tokens, cascade layers, native-elements
CSS) is discarded, not migrated. Design system is Web Awesome (web
components via CDN autoloader, no build step). Styled with plain CSS
(PostCSS only if truly needed) using modern native CSS features (nesting,
etc.) and a single warm light-mode palette in the spirit of
["warm burnout"](https://github.com/felipefdl/warm-burnout). Typography:
system font stack for now — serif for headlines, sans-serif for body.

## User

Lorenz as author; openly public readers — publicly visible, not
gated/access-restricted. "Privat" describes ownership (his own blog), not
access control.

## Why now

Deliberate restart: standardizing on Web Awesome as the design system
instead of continuing the hand-rolled token/cascade-layer approach already
in the repo.

## Success (this round)

- Runs locally via `eleventy --serve`.
- Pages: home/post list, individual post pages, About page, RSS feed.
- Content authored as plain Markdown with front matter, rendered through
  Nunjucks layouts.
- Code blocks get build-time syntax highlighting (official 11ty
  syntax-highlight plugin).
- A few placeholder posts populate the site for local visual testing.
- npm as package manager.

## Constraints

- 11ty v3 (ESM-first).
- Web Awesome as the design system, loaded via CDN autoloader.
- No frameworks — no React. Interactivity only via web standards (fits Web
  Awesome's own custom-element approach).
- Plain CSS; PostCSS only if a concrete need arises. Use modern
  browser-native CSS features (nesting, etc.).
- Single warm light-mode palette — no dark mode, no theme toggle.
- System font stack (serif headlines, sans-serif body) — custom web fonts
  are an explicit "later" experiment, not part of this scope.
- Nunjucks for layouts/templates.

## Out of scope (for now)

- Deployment/hosting/DNS/CI.
- Migrating any old content (none exists to migrate).
- Tags/categories.
- Dark mode / theme toggle.
- Comments, analytics, newsletter.
- Custom/self-hosted web fonts.
