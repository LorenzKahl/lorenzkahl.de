# Reads Card Tags im Bildbereich Specification

## Problem Statement

Auf den Cards von `/reads` stehen die Tags als Textzeile über der Headline. Sie unterbrechen den Lesefluss von Bild zu Titel zu Autor, und Cards ohne Tags beginnen im Header anders als Cards mit Tags. Die Tags wandern als Chips in den Bildbereich der Card.

## Goals

- [ ] Kein Tag erscheint mehr im Header-Bereich (zwischen Bild und Headline).
- [ ] Tags erscheinen als `<wa-tag>`-Chips über dem unteren linken Rand des Cover-Bildes.
- [ ] Der Header jeder Card besteht nur aus der Headline, unabhängig von der Tag-Anzahl.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Tags auf der Detailseite `/reads/<id>/` | Nicht betroffen |
| Anklickbare Tags, Filter nach Tag | Eigenes Feature |
| Ersatz von `<wa-card>` oder `<wa-tag>` durch eigenes Markup | Web Awesome bleibt Pflicht |
| Änderung der Tag-Daten oder ihrer Reihenfolge | Reihenfolge bleibt wie in den Daten |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Position | Overlay unten links im Bild | Entscheidung des Nutzers | y |
| Anzahl | Höchstens 2 Chips, weitere als ein `+N`-Chip | Entscheidung des Nutzers | y |
| Optik | `<wa-tag>` in Chip-Form statt der heutigen Text-mit-Punkt-Optik | Entscheidung des Nutzers, Web Awesome zuerst | y |
| Lesbarkeit auf dem Bild | Deckender Chip-Hintergrund, kein Verlauf | Kontrast hängt nicht vom Bildinhalt ab | y |
| Chip-Farben | Dunkler Hintergrund (`--color-text`), heller Text (`--color-bg`) | Vorhandene Tokens, Kontrast über 4.5:1 | y |
| Chip-Abstand zum Bildrand | Links wie das Card-Padding (`--spacing` von `wa-card`), damit der erste Chip mit der Headline fluchtet; unten `--space-xs` | Nutzerwunsch: erster Tag linksbündig mit der Headline | y |
| Lange Tag-Namen | Jeder Chip ist höchstens 9 rem breit und wird darüber mit Ellipsis gekürzt; kurze Chips bleiben dabei ungekürzt | Verhindert Überlauf bei 390 px, ohne kurze Chips zu quetschen | y |
| Cards ohne Tags | Kein Overlay, kein leerer Chip | Nichts anzuzeigen | y |
| Tags sind nicht interaktiv | Reiner Text, kein Link, kein Fokus | Die Card ist bereits als Ganzes klickbar | y |
| Screenreader | Tag-Text bleibt im DOM lesbar; der `+N`-Chip trägt `aria-label="und N weitere Tags"` | `+N` allein ist ohne Kontext unklar | y |
| Platzhalterbild | Overlay gilt gleich für Platzhalter und echte Covers | Einheitliches Verhalten | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Tags als Chips im Bild ⭐ MVP

**User Story**: As a Besucher von `/reads`, I want die Tags einer Bookmark im Bild zu sehen so that Bild, Titel und Autor ohne Unterbrechung in einer Linie gelesen werden.

**Why P1**: Das ist die gesamte Anforderung.

**Acceptance Criteria**:

1. WHILE eine Bookmark Tags hat, die Reads-Seite SHALL deren erste höchstens zwei als `<wa-tag>`-Elemente innerhalb des Media-Bereichs der Card rendern, in Datenreihenfolge.
2. WHILE eine Bookmark mehr als zwei Tags hat, die Reads-Seite SHALL einen weiteren Chip mit dem Text `+N` anzeigen, wobei N die Anzahl der nicht gezeigten Tags ist.
3. Die Reads-Seite SHALL die Tag-Chips in einer Zeile nebeneinander anordnen, mit der linken Kante des ersten Chips bündig zur linken Kante der Headline (Abweichung höchstens 1 px) und mit 12 px bis 20 px (`--space-xs`) Abstand zur unteren Kante des Bildes.
4. Die Reads-Seite SHALL zwischen Chip-Text und Chip-Hintergrund ein Kontrastverhältnis von mindestens 4.5:1 einhalten.
5. Die Reads-Seite SHALL keinen Tag-Text im Header-Bereich der Card rendern.
6. IF eine Bookmark keine Tags hat THEN die Reads-Seite SHALL im Media-Bereich kein `<wa-tag>` rendern.
7. IF ein Tag-Name breiter als 9 rem ist THEN die Reads-Seite SHALL ihn mit Ellipsis kürzen, ohne dass kurze Chips derselben Card gekürzt werden und ohne horizontalen Überlauf der Seite bei 390 px Viewport-Breite.
8. WHERE ein `+N`-Chip angezeigt wird, die Reads-Seite SHALL ihm `aria-label="und N weitere Tags"` geben.
9. Die Reads-Seite SHALL Cover-Bildhöhe und Seitenverhältnis des Bildes unverändert lassen.
10. Die Reads-Seite SHALL jede Card weiterhin als `<wa-card>` rendern und das Verhalten aus der Spec `reads-equal-height` (gleiche Höhe und gleicher oberer Rand pro Zeile, Autor am Trenner) beibehalten.

**Independent Test**: `/reads` mit Fixture öffnen, die Chips per Locator im Media-Bereich der Card suchen und prüfen: Anzahl, Text, Position relativ zum Bild, kein `wa-tag` im Header.

---

## Edge Cases

- WHEN eine Bookmark genau zwei Tags hat THEN die Reads-Seite SHALL beide anzeigen und keinen `+N`-Chip.
- WHEN eine Bookmark genau drei Tags hat THEN die Reads-Seite SHALL zwei Tags und einen `+1`-Chip anzeigen.
- WHEN die Card ohne Tags nur Headline im Header hat THEN die Reads-Seite SHALL die Headline mit demselben Abstand zum Bild beginnen wie bei Cards mit Tags.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| TAGS-01 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-02 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-03 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-04 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-05 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-06 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-07 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-08 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-09 | P1: Tags als Chips im Bild | - | Verified |
| TAGS-10 | P1: Tags als Chips im Bild | - | Verified |

**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️

---

## Success Criteria

- [ ] Im e2e-Test steht in keinem Header ein Tag-Text, und die Chips liegen innerhalb der Bildfläche.
- [ ] Bei 390 px, 800 px und 1280 px Viewport-Breite gibt es keinen horizontalen Überlauf.
