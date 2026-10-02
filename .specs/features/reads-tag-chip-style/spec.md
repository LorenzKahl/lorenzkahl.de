# Reads Tag-Chips im Card-Stil Specification

## Problem Statement

Die Tag-Chips im Bild der Cards auf `/reads` wirken wie fremde UI-Bausteine: ein dunkelbrauner, fast eckiger Block (Radius 6 px) mit fetter, kleiner Schrift auf dem Foto. Sie passen nicht zur warmen, typografischen Card. Zusätzlich sitzt der Text nicht mittig im Chip: Die Zeilenhöhe beträgt 33 px, der Chip ist aber nur 28 px hoch (live gemessen), der Text rutscht dadurch nach unten.

## Goals

- [ ] Die Chips sind helle, leicht transparente Pills in den Farben der Card.
- [ ] Der Text sitzt vertikal mittig im Chip.
- [ ] Schrift und Größe passen zu Autorenzeile und Badges der Card.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Position, Anzahl, `+N`-Chip, Ellipsis, Ausrichtung an der Headline | Bleiben wie in `reads-card-tags` |
| Tags im Header, anklickbare Tags | Nicht Teil dieser Änderung |
| Weichzeichner (`backdrop-filter`) hinter dem Chip | Nicht gewünscht, hält die Änderung klein |
| Ersatz von `<wa-tag>` durch eigenes Markup | Web Awesome bleibt Pflicht |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Gestaltungsrichtung | Heller Pill, leicht transparent | Entscheidung des Nutzers | y |
| Anlass der Änderung | Chips passen nicht zum Rest der Card | Entscheidung des Nutzers | y |
| Hintergrund | `--color-bg` mit 85 % Deckkraft | Hell und warm wie die Card, Bild scheint leicht durch | y |
| Textfarbe | `--color-text` | Vorhandenes Token, dunkel auf hell | y |
| Kontrast | Mindestens 4.5:1 auch im ungünstigsten Fall, also wenn der Hintergrund über schwarzem Untergrund liegt (rechnerisch etwa 7:1) | Lesbar bei jedem Foto | y |
| Schrift | `--font-body`, `--step-n2`, Gewicht 500 | Wie Autorenzeile und Badges, nur etwas kräftiger für Lesbarkeit auf dem Bild | n |
| Form | Volle Rundung (Radius mindestens halbe Chip-Höhe) | Pill | y |
| Mittige Textlage | Zeilenhöhe und Chip-Höhe sind so gesetzt, dass der Text mittig steht | Behebt den gemessenen Versatz | y |
| Schrumpfen bei wenig Platz | Nur Chips von Tags mit mehr als 12 Zeichen dürfen schrumpfen (Klasse `reads-card__tag--long`), alle anderen behalten ihre Breite | Mit dem größeren Pill-Padding würden kurze Chips sonst auf schmalen Cards zu "te…" gequetscht | y |
| Frühere Anforderung TAGS-04 (deckender Hintergrund) | Wird durch CHIP-04 ersetzt: Kontrast statt Deckkraft | Nutzer wünscht leichte Transparenz | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Chips im Stil der Card ⭐ MVP

**User Story**: As a Besucher von `/reads`, I want Tag-Chips sehen, die zur Card passen so that das Bild und die Chips als ein Ganzes wirken.

**Why P1**: Das ist die gesamte Anforderung.

**Acceptance Criteria**:

1. Die Reads-Seite SHALL jeden Tag-Chip als Pill darstellen, mit einem Eckenradius von mindestens der halben Chip-Höhe.
2. Die Reads-Seite SHALL den Chip-Hintergrund in der Farbe `--color-bg` mit einer Deckkraft von 85 % (Abweichung höchstens 0.01) darstellen.
3. Die Reads-Seite SHALL den Chip-Text in der Farbe `--color-text` darstellen.
4. Die Reads-Seite SHALL zwischen Chip-Text und Chip-Hintergrund ein Kontrastverhältnis von mindestens 4.5:1 einhalten, berechnet mit dem Hintergrund über schwarzem Untergrund.
5. Die Reads-Seite SHALL den Chip-Text vertikal mittig setzen, sodass sich der Abstand zwischen Chip-Oberkante und Text-Oberkante und der Abstand zwischen Text-Unterkante und Chip-Unterkante um höchstens 1 px unterscheiden.
6. Die Reads-Seite SHALL die Chip-Schrift in `--font-body` mit der Größe `--step-n2` und dem Gewicht 500 darstellen.
7. WHERE ein `+N`-Chip angezeigt wird, die Reads-Seite SHALL ihn mit denselben Werten wie die Tag-Chips gestalten.
8. Die Reads-Seite SHALL Position, Anzahl, Ellipsis und Ausrichtung der Chips aus der Spec `reads-card-tags` beibehalten (TAGS-01 bis TAGS-03 und TAGS-05 bis TAGS-10).
9. WHILE ein Tag höchstens 12 Zeichen hat, die Reads-Seite SHALL seinen Chip bei jeder Card-Breite ab 16 rem ungekürzt darstellen; nur Chips von Tags mit mehr als 12 Zeichen dürfen schrumpfen.

**Independent Test**: `/reads` mit Fixture öffnen, Eigenschaften der Chips per `getComputedStyle` lesen und die Textlage mit einem DOM-Range gegen die Chip-Box messen.

---

## Edge Cases

- WHEN ein Tag-Name länger als 9 rem ist THEN die Reads-Seite SHALL ihn weiterhin mit Ellipsis kürzen und den Text dabei mittig halten.
- WHEN das Foto unter dem Chip schwarz ist THEN die Reads-Seite SHALL den Kontrast von mindestens 4.5:1 einhalten.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| CHIP-01 | P1: Chips im Stil der Card | - | Verified |
| CHIP-02 | P1: Chips im Stil der Card | - | Verified |
| CHIP-03 | P1: Chips im Stil der Card | - | Verified |
| CHIP-04 | P1: Chips im Stil der Card | - | Verified |
| CHIP-05 | P1: Chips im Stil der Card | - | Verified |
| CHIP-06 | P1: Chips im Stil der Card | - | Verified |
| CHIP-07 | P1: Chips im Stil der Card | - | Verified |
| CHIP-08 | P1: Chips im Stil der Card | - | Verified |
| CHIP-09 | P1: Chips im Stil der Card | - | Verified |

**Coverage:** 9 total, 0 mapped to tasks, 9 unmapped ⚠️

---

## Success Criteria

- [ ] Der e2e-Test misst Radius, Hintergrund, Textfarbe, Schrift und Textlage der Chips.
- [ ] Alle bestehenden Chip-Tests aus `reads-card-tags` bleiben grün, bis auf die Deckkraft-Prüfung, die durch CHIP-04 ersetzt wird.
