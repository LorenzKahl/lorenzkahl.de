# Intent: Reads-Seite aus Readeck-Highlights (lorenzkahl.de)

Bestätigt via `/interview-me`-Session am 2026-09-02/03.

## Outcome

Eine neue Seite `/reads` zeigt Artikel, die der Autor in seiner selbst
gehosteten Readeck-Instanz mit dem Label `feature-on-website`
versehen hat, als kuratierte Card-Liste. Jede Card verlinkt auf eine
Detailseite, die die eigenen Highlights dieses Artikels zusammen mit
den eigenen Notizen dazu zeigt — als Zitat + Kommentar, nicht als
Volltext-Reproduktion des fremden Artikels. Jedes Highlight verlinkt
über eine Text-Fragment-URL zurück auf die exakte Stelle im Original.

## User

Der Autor selbst (Kuration: taggt Artikel in Readeck) und
Website-Besucher (Konsum: lesen die kuratierte Liste und die
kommentierten Highlights).

## Why now

Der Autor sammelt und markiert Artikel bereits aktiv in Readeck. Diese
Arbeit ist bisher nur ihm selbst zugänglich; er möchte sie — kuratiert
über ein Tag — auch auf seiner Website teilen, ohne fremde
Artikeltexte zu reproduzieren.

## Success

- `/reads` zeigt genau die Bookmarks, deren Readeck-Labels
  `feature-on-website` enthalten, neueste zuerst.
- Jede Card zeigt Vorschaubild, Titel, Original-Autor(en), sonstige
  Tags sowie zwei Zähler: Anzahl Highlights insgesamt und Anzahl davon
  mit eigener Notiz.
- Jede Detailseite zeigt jedes Highlight als Zitat; ist eine Notiz
  vorhanden, erscheint sie als Kommentar darunter — unkommentierte
  Highlights erscheinen nur als Zitat.
- Jedes Highlight verlinkt auf die exakte Stelle im Original-Artikel
  (Text-Fragment-Link), nicht auf eine eigene Kopie des Inhalts.
- Neue Artikel erscheinen automatisch beim nächsten Build/Deploy — kein
  manuelles Nachpflegen von Inhalten auf der Website nötig.

## Constraints

- Rein statische Site (Eleventy → GitHub Pages): Datenabruf passiert
  ausschließlich zur Build-Zeit, kein Laufzeit-Call im Browser, kein
  eigenes Backend.
- Kein neues npm-Package, wo Node 22 (`.nvmrc`) bereits ausreicht
  (globales `fetch`, `--env-file-if-exists`).
- CI baut aktuell nur bei Push auf `main` — kein Cron. Neue getaggte
  Artikel ziehen entsprechend erst beim nächsten Build/Deploy nach,
  sofern kein Webhook nachgerüstet wird.

## Out of scope (v1 / MVP)

- Volltext-Reproduktion des Original-Artikels.
- Pagination, Suche oder Filter-UI auf `/reads`.
- Ein eigenes RSS-Feed für Reads.
- Live-Updates im Browser ohne Rebuild.
- Ein Readeck-Webhook zum automatischen Auslösen eines Rebuilds — für
  den MVP bewusst zurückgestellt, siehe
  [`docs/spec/reads.md`](../spec/reads.md)'s Open Questions.
