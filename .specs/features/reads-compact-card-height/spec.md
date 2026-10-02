# Reads Cards in kompakter Höhe Specification

## Problem Statement

Die Cards auf `/reads` sind höher, als ihr Inhalt braucht. Gemessen auf der Live-Seite ist die Zeile 436 px hoch, obwohl die höchste Card natürlich nur 424 px braucht; lokal mit der Fixture sind es bei 1280 px Breite 406 px statt 364 px. Ursache laut Messung: `main` ist ein Grid und streckt seine Auto-Zeilen auf die Restfläche des Viewports (Body hat `min-height: 100vh`). Dadurch wird auch das `.reads-grid` höher als sein Inhalt, und dessen Auto-Zeilen werden gestreckt (`align-content: normal`). Die Zeilenhöhe hängt so von der Viewport-Höhe ab.

## Goals

- [ ] Jede Grid-Zeile ist genau so hoch wie ihre höchste Card von ihrem Inhalt her braucht.
- [ ] Die Zeilenhöhe hängt nicht von der Viewport-Höhe ab.

## Out of Scope

| Feature                                               | Reason                                             |
| ----------------------------------------------------- | -------------------------------------------------- |
| Padding in Header und Body straffen                   | Entscheidung des Nutzers: nur toter Platz entfällt |
| Flacheres Cover-Seitenverhältnis                      | Entscheidung des Nutzers: Cover bleibt 16:9        |
| Titel auf 3 Zeilen begrenzen oder mit Ellipsis kürzen | Entscheidung des Nutzers: Titel werden nie gekürzt |
| Änderung am Layout von `main`, Header oder Footer     | Nur die Cards sind betroffen                       |

---

## Assumptions & Open Questions

| Assumption / decision                          | Chosen default                                                                            | Rationale                                                        | Confirmed? |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| Bedeutung von "so klein wie möglich"           | Nur toter Platz entfällt; Abstände und Cover bleiben                                      | Entscheidung des Nutzers                                         | y          |
| Lange Titel                                    | Werden nie gekürzt; ein vierzeiliger Titel macht die Zeile höher                          | Entscheidung des Nutzers                                         | y          |
| Natürliche Höhe                                | Card-Höhe, wenn `.reads-grid` `align-items: start` hat und die Card `height: auto`        | Messbar ohne Annahmen über den Inhalt                            | y          |
| Messtoleranz                                   | 1 px                                                                                      | Subpixel-Rundung der Layout-Engine                               | y          |
| Abstand Headline zu Autor in der höchsten Card | Entspricht dem oberen Rand des Autors (`--space-2xs`), Toleranz 1 px                      | Der Rand ist der gewollte Abstand, alles darüber ist toter Platz | y          |
| Technische Lösung                              | Wird im Design-Schritt entschieden; Kandidat ist `align-content: start` auf `.reads-grid` | Spec beschreibt nur das Verhalten                                | y          |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Cards ohne toten Platz ⭐ MVP

**User Story**: As a Besucher von `/reads`, I want Cards in kompakter Höhe sehen so that kein leerer Platz unter oder zwischen Inhalten entsteht.

**Why P1**: Das ist die gesamte Anforderung.

**Acceptance Criteria**:

1. Die Reads-Seite SHALL die Höhe jeder Grid-Zeile gleich der natürlichen Höhe der höchsten Card dieser Zeile setzen (Abweichung höchstens 1 px).
2. WHEN sich die Viewport-Höhe ändert THEN die Reads-Seite SHALL die Höhe jeder Grid-Zeile unverändert lassen (gleiche Höhe bei 600 px, 900 px und 1400 px Viewport-Höhe, Abweichung höchstens 1 px).
3. WHILE eine Card die höchste ihrer Zeile ist, die Reads-Seite SHALL zwischen Headline-Unterkante und Autoren-Oberkante höchstens den oberen Rand des Autors (`--space-2xs`) zuzüglich 1 px Abstand lassen.
4. Die Reads-Seite SHALL den vollständigen Titel jeder Card ohne Abschneiden darstellen.
5. Die Reads-Seite SHALL die Cards weiterhin als `<wa-card>` rendern und das Verhalten aus den Specs `reads-equal-height` und `reads-card-tags` beibehalten (gleiche Höhe und gleicher oberer Rand pro Zeile, Autor am Trenner, Chips im Bild).
6. Die Reads-Seite SHALL Padding, Abstände und Seitenverhältnis des Covers unverändert lassen.

**Independent Test**: `/reads` mit Fixture bei 1280 px Breite öffnen, die Zeilenhöhe messen, dann `align-items: start` und `height: auto` per Stil einsetzen und die natürliche Höhe messen; beide Werte müssen übereinstimmen. Wiederholen bei 600 px, 900 px und 1400 px Viewport-Höhe.

---

## Edge Cases

- WHEN eine Zeile nur eine Card enthält THEN die Reads-Seite SHALL deren natürliche Höhe verwenden.
- WHEN die Spaltenanzahl wechselt (390 px, 800 px, 1280 px Breite) THEN die Reads-Seite SHALL jede neue Zeile nach AC 1 setzen.
- IF die Seite höher als der Viewport ist THEN die Reads-Seite SHALL dieselben Zeilenhöhen wie bei einem hohen Viewport verwenden.

---

## Requirement Traceability

| Requirement ID | Story                      | Phase | Status  |
| -------------- | -------------------------- | ----- | ------- |
| CCH-01         | P1: Cards ohne toten Platz | -     | Verified |
| CCH-02         | P1: Cards ohne toten Platz | -     | Verified |
| CCH-03         | P1: Cards ohne toten Platz | -     | Verified |
| CCH-04         | P1: Cards ohne toten Platz | -     | Verified |
| CCH-05         | P1: Cards ohne toten Platz | -     | Verified |
| CCH-06         | P1: Cards ohne toten Platz | -     | Verified |

**Coverage:** 6 total, 0 mapped to tasks, 6 unmapped ⚠️

---

## Success Criteria

- [ ] Im e2e-Test stimmt die Zeilenhöhe bei 390 px, 800 px und 1280 px Breite mit der natürlichen Höhe überein.
- [ ] Die Zeilenhöhe ist bei 600 px, 900 px und 1400 px Viewport-Höhe identisch.
