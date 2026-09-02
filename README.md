# lorenzkahl.de

Meine persönliche Spielwiese um Stuff™ auszuprobieren.

🔗 [lorenzkahl.de](https://lorenzkahl.de)

## Stack

- [Eleventy (11ty) v3](https://www.11ty.dev/) — statischer Seitengenerator
- [Web Awesome](https://webawesome.com) — Komponenten, per CDN geladen
- Plain CSS mit nativem Nesting, kein Preprocessor
- Fluide Typo-/Space-Skala nach [Utopia](https://utopia.fyi)
- Build-Time Syntax-Highlighting via `@11ty/eleventy-plugin-syntaxhighlight`
- RSS-Feed via `@11ty/eleventy-plugin-rss`

Details zu Architektur und Entscheidungen: [`docs/`](docs).

## Entwicklung

```bash
npm install
npm run dev      # lokaler Dev-Server
npm run build    # Production-Build nach public/
npm run lint     # ESLint + Stylelint
npm run format   # Prettier
```

Für echte Inhalte auf `/reads` (statt einer leeren Seite) `.env.example`
nach `.env` kopieren und einen Readeck-API-Token eintragen (in der
eigenen Readeck-Instanz unter den Account-Einstellungen erzeugt).

## Lizenz

[MIT](LICENSE)
