# Spec: Reads-Seite aus Readeck-Highlights (lorenzkahl.de)

Traces to: [`docs/intent/reads.md`](../intent/reads.md). Format und
Gliederung folgen bewusst dem bestehenden Muster in
[`docs/spec/copy-button-code-blocks.md`](copy-button-code-blocks.md).

## Objective

Eine neue Seite `/reads` zeigt die Artikel, die der Autor in seiner
selbst gehosteten Readeck-Instanz mit dem Label `feature-on-website`
versehen hat, als kuratierte Card-Liste. Jede Card verlinkt auf eine
Detailseite, die die eigenen Markierungen (Highlights) dieses Artikels
zusammen mit den eigenen Anmerkungen dazu zeigt — als Zitat +
Kommentar, nicht als Volltext-Reproduktion des fremden Artikels
(Urheberrecht). Jedes Highlight verlinkt über eine Text-Fragment-URL
zurück auf die exakte Stelle im Original.

Nutzer: der Autor selbst (Kuration) und Website-Besucher (Konsum).
Erfolg bedeutet: die Liste ist immer exakt die Menge der aktuell
getaggten Bookmarks, die Detailseite gibt Zitat und Notiz korrekt
wieder, und der Rücksprung-Link landet im Original an der richtigen
Stelle (soweit der Browser Text Fragments unterstützt).

## Design Decisions

- **Build-Time-Fetch, kein Laufzeit-Call.** Die Site ist rein statisch
  (Eleventy → GitHub Pages). Ein neues asynchrones
  Eleventy-Global-Data-File `src/_data/reads.js` ruft die Readeck-API
  beim Build ab, analog zum bestehenden synchronen `src/_data/site.js`,
  nur async (von Eleventy offiziell unterstütztes Pattern). Kein
  eigenes Backend, kein Client-seitiger Fetch.
- **Kein `addCollection` für Reads.** `reads` ist externe Daten, keine
  Menge von Content-Dateien wie `posts` (das zu Recht
  `eleventyConfig.addCollection` nutzt, weil es echte
  Markdown-Dateien globbt). Templates lesen die globale `reads`-Data
  direkt bzw. paginieren darüber.
- **API-Client als eigenes Modul (`src/lib/readeck.js`), getrennt von
  der Data-Datei.** Hält HTTP-Details (Auth-Header, Timeout,
  Pagination-Handling, Fehlerformat) unabhängig von
  Normalisierung/Sortierung testbar und lesbar.
- **Serverseitiger Filter + Sortierung, mit clientseitigem Filter als
  Sicherheitsnetz.** Laut Live-API-Doku unterstützt
  `GET /api/bookmarks` `?labels=feature-on-website` sowie
  `limit`/`offset`-Pagination (keine Header-basierte Pagination) und
  `sort=-created` für "neueste zuerst" direkt serverseitig.
  `listBookmarksByLabel` nutzt beide Parameter (`labels`,
  `sort=-created`) und paginiert über `limit`/`offset`, bis eine leere
  Seite zurückkommt. Zusätzlich filtert der Code defensiv noch einmal
  clientseitig auf `bookmark.labels.includes("feature-on-website")`
  und sortiert clientseitig nach, da die genaue Match-Semantik von
  `labels` bei mehreren Werten nicht dokumentiert ist (siehe Open
  Questions — für den MVP irrelevant, da nur nach einem Label gefiltert
  wird) — ein falsches Server-Filterverhalten darf nie zu falschen
  Artikeln auf der Seite führen.
- **Fehlende Env-Vars → leere Liste, keine Exception.** Fehlen
  `READECK_HOST`/`READECK_API_TOKEN`, rendert `/reads` einfach leer
  (mit Konsolen-Warnung) statt den Build abzubrechen — das hält
  `npm run build`/`lint`/den E2E-Job für jeden lauffähig, der keine
  Readeck-Zugangsdaten hat.
- **Gesetzte Env-Vars, aber fehlgeschlagener API-Call → Build schlägt
  fehl.** Bewusste Asymmetrie zum vorigen Punkt: Ist Readeck-Zugriff
  konfiguriert (Autor-Laptop, CI-Build-Job nach Secret-Einrichtung),
  ist ein Fehler ein echtes Signal (Instanz down, Token abgelaufen,
  API-Form geändert) und soll das Deployment blockieren statt eine
  leere oder veraltete Seite live zu schicken.
- **Zwei getrennte Zähler, keine Ableitung.** `highlightsCount` (alle
  Annotations) und `annotatedCount` (nur Annotations mit nicht-leerem
  `note`) werden beim Normalisieren in `reads.js` einmal berechnet und
  in den Daten mitgeführt statt im Template gezählt — Template bleibt
  reine Darstellung.
- **Slug = Bookmark-`id`, nicht der Titel.** Stabil und
  kollisionsfrei; Titel können sich ändern oder kollidieren.
- **Text-Fragment-Link wird beim Build als reiner, isoliert testbarer
  Helper gebaut** (`src/lib/text-fragment.js`,
  `buildTextFragmentUrl(pageUrl, rawText)`), nicht inline im Template:
  - Zitate ≤ 20 Wörter → `#:~:text=<ganzes Zitat>` (ein Wert,
    präziser als ein Bereich für kurze Zitate).
  - Zitate > 20 Wörter → `#:~:text=<erste 10 Wörter>,<letzte 10
    Wörter>` (Bereichs-Syntax der Text-Fragment-Spec).
  - Whitespace wird vor der Verarbeitung normalisiert/getrimmt
    (Annotation-Text kann Zeilenumbrüche aus dem HTML-Ursprung
    enthalten).
  - `encodeURIComponent` plus explizites Escaping von `-` zu `%2D`,
    weil Bindestrich in der Text-Fragment-Mikrosyntax reserviert ist.
  - Degradiert automatisch ohne Feature-Detection: Text Fragments sind
    nur ein URL-Hash-Suffix, nicht unterstützende Browser laden die
    Seite normal und ignorieren den Hash.
  - Der sichtbar angezeigte Zitat-Text auf der Detailseite wird
    **nie** gekürzt — nur der Wert in der Fragment-URL.
  - **Bekannte Grenze (akzeptiert, nicht gefixt):** Spannt ein
    Highlight in Readeck mehrere Block-Elemente (z. B. eine
    Überschrift und den folgenden Absatz), liefert Readecks `text`-
    Feld die beiden Textknoten ohne Leerzeichen dazwischen verkettet
    (z. B. `"...FormattingAllow the user..."`). Der Text-Fragment-
    Abgleich im Browser normalisiert Whitespace an Element-Grenzen und
    erwartet dort ein Leerzeichen, daher schlägt der Match in diesem
    Fall still fehl (kein Scroll/Highlight, aber auch kein Fehler —
    die Seite lädt normal von oben). Verifiziert an einem echten
    mehrelementigen Highlight aus der Live-Instanz; einelementige
    Highlights (die große Mehrheit) sind davon nicht betroffen —
    kurze wie lange Zitate wurden beide gegen echte Zielseiten
    erfolgreich verifiziert. Ein Fix müsste Readecks eigene
    Artikel-HTML samt `start_selector`/`end_selector` parsen, um die
    fehlende Grenze zu erkennen — für den MVP nicht gebaut.
- **Kein neues Zwischen-Layout.** `src/reads/index.njk` und
  `src/reads/detail.njk` nutzen `layouts/base.njk` direkt (wie
  `src/index.njk`/`src/about.md`), weil es je Seitentyp nur eine
  Template-Datei gibt — `layouts/post.njk` existiert nur, weil viele
  Content-Dateien es teilen, das trifft hier nicht zu.
- **Web-Awesome-Komponenten statt hand-rolled Markup, wo eine
  passende existiert.** Die Site lädt Web Awesome bereits global über
  den CDN-Autoloader (`webawesome.loader.js` in `layouts/base.njk`)
  und nutzt es schon für `<wa-copy-button>`/`<wa-icon>`. Vor jedem
  neuen UI-Baustein wird zuerst in Web Awesomes Komponenten-Katalog
  nachgesehen, statt eigenes Markup/CSS zu bauen:
  - **`<wa-card>`** (stabil seit v2.0, Slots
    `media`/`header`/`header-actions`/Default/`footer`/`footer-actions`)
    für jede Bookmark-Card auf `/reads` — `media`-Slot für das
    Vorschaubild, `header`-Slot für den (Stretched-Link-)Titel,
    Default-Slot für Autor:innen, Tags und Zähler.
    `appearance="outlined"` (Default) passt zur bestehenden,
    bordered-lastigen Optik (`.callout`, `.post-index__item`-Divider).
  - **`<wa-tag>`** für jeden Eintrag der "sonstigen Tags"
    (`variant="neutral"`, `size="small"`) statt einer selbstgebauten
    Chip-Klasse.
  - **`<wa-badge>`** für die beiden Zähler (Highlights/Anmerkungen) —
    Web Awesomes eigene Beschreibung ("displaying a status, **count**,
    or label") deckt genau diesen Fall ab. Während der Umsetzung
    visuell prüfen, ob die Badge-Optik als Stat-Zeile überzeugt; falls
    nicht, Fallback auf schlichtes Text-Markup — keine Custom-Chip-
    Klasse als Ersatz bauen, ohne `wa-badge` zuerst ausprobiert zu
    haben.
  - Web Awesome dokumentiert **kein** eingebautes "ganze Card ist ein
    Link"-Pattern — dafür bleibt das unten beschriebene
    CSS-Stretched-Link-Pattern nötig, das ist kein hand-rolled Ersatz
    für eine vorhandene Komponente, sondern schließt eine echte Lücke.
- **Konsistentes Naming mit `reads`-Präfix**, keine Vermischung von
  Singular/Plural: `.reads-grid` (Grid-Wrapper auf der Listenseite),
  `.reads-card` (Klasse auf jedem `<wa-card>`, für
  Positionierung/Stretched-Link), `.reads-card__title-link`,
  `.reads-card__authors`, `.reads-card__meta` (Tag-/Zähler-Zeile),
  `.reads-detail` (Block für die gesamte Detailseite),
  `.reads-detail__meta`, `.reads-detail__annotations`,
  `.reads-detail__annotation`, `.reads-detail__quote`,
  `.reads-detail__note`, `.reads-detail__source-link`. Alle Namen
  folgen der bestehenden BEM-artigen Konvention (`.post-index__item`
  etc.), nutzen ausschließlich vorhandene Design-Tokens (`--space-*`,
  `--step-*`, `--color-*`) und wurden gegen `.stylelintrc`s
  `selector-class-pattern`-Regex geprüft (kompatibel).
- **CSS bleibt in `src/assets/css/base.css`**, keine vierte
  Stylesheet-Datei — konsistent mit der bestehenden Drei-Datei-
  Architektur (immer auf jeder Seite geladen). Deutlich weniger
  Custom-CSS als ursprünglich geplant, weil Card/Tag/Badge jetzt von
  Web Awesome kommen — übrig bleiben im Wesentlichen Grid-Layout,
  Stretched-Link und die Detailseiten-Liste.
- **Card ist als Ganzes klickbar** über das etablierte
  "Stretched-Card"-Pattern
  (`.reads-card__title-link::after { position: absolute; inset: 0; }`,
  `.reads-card { position: relative; }` auf dem `<wa-card>`-Host-
  Element), ein einziger sichtbarer Link bleibt der Accessible Name —
  vermeidet verschachtelte/doppelte Links pro Card.
- **Fehlendes Vorschaubild** (kein `resources.image` am Bookmark)
  fällt auf das bereits vorhandene
  `src/assets/images/placeholder-content.svg` zurück — kein neues
  Asset.
- **Kein neues npm-Package.** Node 22 (`.nvmrc`) bringt globales
  `fetch` und `AbortSignal.timeout` mit; für Env-Dateien wird
  `node --env-file-if-exists=.env` (Node ≥ 22.9) genutzt statt
  `dotenv` — bleibt konsistent mit der Praxis, Dependencies exakt zu
  pinnen und neue nur bei echtem Bedarf hinzuzufügen.
- **E2E-Tests laufen gegen eine Fixture, nie gegen die echte
  Readeck-API.** `reads.js` unterstützt einen `READS_FIXTURE_PATH`-
  Env-Var, der bei gesetztem Wert eine lokale JSON-Datei statt der
  Live-API liest. Vermeidet Flakiness und das Problem, dass Fork-PRs
  keine Repo-Secrets erhalten.
- **Rebuild-Trigger bleibt für den MVP Push-basiert, kein Webhook.**
  Ein Readeck-Webhook, der einen GitHub-Actions-Rebuild auslöst, wurde
  erwogen, ist aber für den MVP explizit zurückgestellt (siehe Open
  Questions) — v1 verlässt sich auf normalen Push/Deploy plus einen
  neuen `workflow_dispatch`-Trigger für manuelles Nachziehen.

## Files Touched

```
src/lib/readeck.js                    → neu: API-Client (listBookmarksByLabel,
                                         listAnnotations), Auth-Header, Timeout,
                                         Pagination-Handling, Fehlerformat
src/lib/text-fragment.js              → neu: buildTextFragmentUrl(pageUrl, rawText)
src/_data/reads.js                    → neu: async Global Data, Env-Handling,
                                         Normalisierung, Sortierung, Fixture-Support
src/reads/index.njk                   → neu: Card-Liste (<wa-card>/<wa-tag>/<wa-badge>),
                                         permalink /reads/
src/reads/detail.njk                  → neu: Pagination über `reads`, permalink
                                         /reads/{{ read.id }}/
src/_includes/partials/header.njk     → +1 Zeile: Nav-Link zu /reads/
src/assets/css/base.css               → neue Sektionen: .reads-grid, .reads-card(*)
                                         (Positionierung/Stretched-Link, kein
                                         Card-Nachbau), .reads-detail(*)
package.json                          → dev/build-Scripts auf
                                         `node --env-file-if-exists=.env` umgestellt
.env.example                          → neu: READECK_HOST, READECK_API_TOKEN
                                         (Platzhalter, getrackt)
README.md                             → Hinweis zu .env.example → .env
.github/actions/build/action.yml      → neue inputs readeck_host, readeck_api_token,
                                         als env: an den Build-Step durchgereicht
.github/workflows/ci.yml              → build-Job bekommt beide Secrets als with:,
                                         zusätzlich workflow_dispatch im Trigger
playwright.config.js                  → webServer.env.READS_FIXTURE_PATH für e2e
tests/fixtures/reads.json             → neu: 2–3 normalisierte Fake-Bookmarks
tests/e2e/reads.spec.js               → neu: Struktur-Checks gegen die Fixture
```

`.env` selbst ist bereits in `.gitignore` erfasst — keine Änderung
nötig. `deploy`- und `lint`-Job in `ci.yml` sind unverändert;
`e2e`-Job bekommt bewusst keine Readeck-Secrets.

## Testing Strategy

- **`npm run lint`** deckt die neuen `src/lib/*.js`/`src/_data/reads.js`
  (ESLint) und die neuen CSS-Klassen (Stylelint) ab — keine
  Sonderbehandlung nötig.
- **`npm run build`** muss lokal gegen die echte Readeck-Instanz (via
  `.env`) fehlerfrei durchlaufen; `public/reads/index.html` und je ein
  `public/reads/{id}/index.html` pro getaggtem Bookmark müssen
  entstehen.
- **Manuelle Browser-Verifikation** (kein automatisierter Ersatz
  möglich für zwei Dinge):
  - Text-Fragment-Links tatsächlich in einem echten Chromium-Browser
    anklicken (kurzes Zitat ≤ 20 Wörter, langes Zitat > 20 Wörter, ein
    Zitat mit Bindestrich/Komma) und bestätigen, dass die
    Originalseite zur richtigen Passage scrollt/hervorhebt — das ist
    Laufzeitverhalten des Zielbrowsers, keine Eleventy-Ausgabe, die
    ein Test lokal prüfen könnte.
  - Zähler auf der Card (Highlights/Anmerkungen) manuell gegen
    `GET /api/bookmarks/{id}/annotations` für mindestens ein Bookmark
    gegenkontrollieren.
- **`npm run test:e2e`** (neuer Spec `tests/e2e/reads.spec.js`,
  Fixture-basiert, siehe Design Decisions) prüft strukturelles
  Verhalten, das sich ohne echte Readeck-Zugangsdaten reproduzieren
  lässt: Card-Anzahl entspricht Fixture-Länge, Klick auf eine Card
  navigiert zu `/reads/{id}/`, eine Notiz erscheint nur bei der
  Fixture-Annotation mit `note`, `.reads-detail__source-link`-Href
  enthält `#:~:text=`.
- Bewusst **kein** Live-API-Aufruf in CI (weder im `build`- noch im
  `e2e`-Job in PR-Kontext ohne Secrets) — vermeidet Flakiness durch
  Netzwerk/Instanz-Verfügbarkeit während Reviews.

## Boundaries

- **Always do:** Vor jedem neuen UI-Baustein zuerst in Web Awesomes
  Komponenten-Katalog nachsehen (`webawesome.com/docs/components`),
  bevor eigenes Markup/CSS gebaut wird — hier umgesetzt für Card
  (`<wa-card>`), Tags (`<wa-tag>`) und Zähler (`<wa-badge>`).
  Clientseitigen Label-Filter immer zusätzlich zum (unbestätigten)
  Server-Filter anwenden. Sichtbaren Zitat-Text nie kürzen — nur die
  Fragment-URL. Neue CSS-Klassen ausschließlich mit bestehenden
  Design-Tokens aufbauen, keine neuen Hardcoded-Werte.
- **Ask first:** Ein neues npm-Package hinzufügen (z. B.
  `@11ty/eleventy-fetch` für HTTP-Caching) — für v1 bewusst nicht
  eingeplant, siehe Design Decisions. Eine Readeck-Webhook-Integration
  nachträglich verdrahten (CI-Trigger-Änderung über
  `workflow_dispatch` hinaus) — für den MVP zurückgestellt, siehe Open
  Questions. Änderungen an `deploy`/`lint`-Jobs in `ci.yml`.
- **Never do:** Volltext eines fremden Artikels auf der Website
  reproduzieren. Live-API-Calls im Browser (alles bleibt Build-Time).
  Den Build stillschweigend mit leerer `/reads`-Seite durchlaufen
  lassen, wenn Zugangsdaten gesetzt sind, der API-Call aber
  fehlschlägt (siehe Design Decisions: das muss laut werden).

## Success Criteria

- [ ] `/reads` zeigt genau die Bookmarks, deren `labels` das Label
      `feature-on-website` enthalten — nicht mehr, nicht weniger.
- [ ] Jede Card zeigt Vorschaubild (oder Platzhalter), Titel,
      Original-Autor(en), sonstige Tags (ohne `feature-on-website`),
      sowie die beiden korrekten Zähler (Highlights gesamt /
      Anmerkungen mit Notiz).
- [ ] Sortierung: neueste zuerst nach `created`.
- [ ] Jede Detailseite (`/reads/{id}/`) zeigt alle Annotations des
      Bookmarks als Zitat; Annotations mit nicht-leerem `note` zeigen
      zusätzlich die Notiz; Annotations mit leerem `note` zeigen nur
      das Zitat.
- [x] Jedes Highlight verlinkt über eine korrekt kodierte
      Text-Fragment-URL auf `url` des Bookmarks; in einem echten
      Chromium-Browser scrollt/hervorhebt der Link tatsächlich die
      richtige Passage, für sowohl kurze als auch lange (einelementige)
      Zitate — verifiziert gegen echte Zielseiten. Bekannte Ausnahme:
      Highlights, die in Readeck mehrere Block-Elemente überspannen,
      s. Design Decisions' "Bekannte Grenze".
- [ ] Fehlen `READECK_HOST`/`READECK_API_TOKEN`, bauen
      `npm run build`/`npm run dev` trotzdem erfolgreich (leere
      `/reads`-Seite, Warnung in der Konsole).
- [ ] Sind die Env-Vars gesetzt und schlägt der Readeck-API-Call fehl,
      bricht der Build mit einer diagnostizierbaren Fehlermeldung ab.
- [ ] `npm run lint`, `npm run build` und `npm run test:e2e` laufen
      fehlerfrei.
- [ ] Kein horizontaler Overflow / keine visuelle Überlappung bei
      390px Viewport-Breite (Card-Grid und Detailseite).
- [ ] CI (`lint`, `build`, `e2e`) ist grün, nachdem die beiden
      Repo-Secrets (`READECK_HOST`, `READECK_API_TOKEN`) angelegt
      wurden; `deploy` liefert eine Live-Seite mit echten Daten.

## Open Questions

Beide Punkte sind für den MVP bewusst zurückgestellt und blockieren
die Implementierung nicht:

1. **`labels`-Match-Semantik bei mehreren Werten** — die API-Doku
   beschreibt `labels` nur als "One or several labels", ohne
   AND/OR-Semantik zu spezifizieren. Für den v1-Anwendungsfall (Filter
   nach genau einem Label, `feature-on-website`) irrelevant; der
   zusätzliche clientseitige Filter fängt jede Fehlinterpretation
   ohnehin ab. Nur relevant, falls die Seite später nach mehreren
   Labels gleichzeitig filtern soll.
2. **Readeck-Webhook-Support** — öffentliche Doku/Changelog/Issues
   zeigen keine Evidenz für ausgehende Webhooks. Für den MVP nicht
   untersucht; v1 verlässt sich vollständig auf normalen Push/Deploy
   plus den manuellen `workflow_dispatch`-Button. Ein späterer Spike
   (Instanz-UI unter Settings/Integrations, Custom-Header-Fähigkeit
   für einen GitHub-`repository_dispatch`-Call) bleibt als eigenes,
   unabhängiges Follow-up offen.
