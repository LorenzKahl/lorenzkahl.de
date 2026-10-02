# Reads Equal-Height Cards Specification

## Problem Statement

Auf `/reads` haben Cards in derselben Grid-Zeile unterschiedliche Höhen, weil Titel, Tags und Autoren unterschiedlich lang sind. Das Raster wirkt unruhig. Zusätzlich beginnt die zweite Card einer Zeile tiefer als die erste: die globale Regel `ul li + li { margin-block-start: var(--space-2xs) }` (`base.css:154`) trifft die `<li>` von `.reads-grid`, das sie anders als `.post-index` (`base.css:253`) nicht zurücksetzt. Commit d5d2815 hat einen früheren Equal-Height-Ansatz bewusst zurückgebaut; diese Spec definiert das Verhalten neu, bevor erneut Code entsteht.

## Goals

- [ ] Alle Cards einer Grid-Zeile haben identische gerenderte Höhe, gleich der Höhe der höchsten Card dieser Zeile.
- [ ] Zeilen sind voneinander unabhängig: eine hohe Card in Zeile 1 verändert Zeile 2 nicht.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Feste Mindest- oder Maximalhöhe, Text-Abschneiden (line-clamp) | Höhe folgt allein der höchsten Card |
| Änderung von Spaltenanzahl, Gap oder Card-Inhalt | Nur die Höhe ist betroffen |
| Gleiche Höhe über Zeilen hinweg | Gewünscht ist Angleichung pro Zeile |
| Detailseite `/reads/<id>/` | Nicht betroffen |
| Ersatz von `<wa-card>` durch eigenes Markup | Ausdrücklich ausgeschlossen (EQH-10) |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Überschüssiger Platz in kürzeren Cards | Meta-Zeile (Badges) sitzt am unteren Card-Rand, Leerraum liegt darüber | Badges bleiben in der Zeile auf einer Linie | y |
| Früherer Revert (d5d2815) | Wird durch diese Anforderung bewusst überstimmt | Nutzer fordert Equal-Height ausdrücklich | y |
| Einspaltiges Layout (schmaler Viewport) | Kein Effekt, jede Zeile enthält eine Card | Höhe folgt dem Inhalt | y |
| Letzte, unvollständige Zeile | Gleiche Regel: Cards darin gleichen sich an die höchste dieser Zeile an | Konsistent mit der Zeilenregel | y |
| Mechanismus | Wird im Design-Schritt entschieden (Grid-Stretch über `<li>` bis `wa-card`) | Spec beschreibt nur das Verhalten | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Gleich hohe Cards pro Zeile ⭐ MVP

**User Story**: As a Besucher von `/reads`, I want Cards einer Zeile gleich hoch zu sehen so that das Raster ruhig und aufgeräumt wirkt.

**Why P1**: Das ist die gesamte Anforderung.

**Acceptance Criteria**:

1. WHEN `/reads` gerendert wird THEN the Reads-Seite SHALL jede `.reads-card` einer Grid-Zeile auf die gerenderte Höhe der höchsten `.reads-card` dieser Zeile bringen (Abweichung 0 px).
2. WHEN sich die Spaltenanzahl durch die Viewport-Breite ändert THEN the Reads-Seite SHALL die Cards pro neuer Zeile erneut auf die höchste Card dieser Zeile angleichen.
3. The Reads-Seite SHALL die Höhe jeder Zeile allein aus der höchsten Card dieser Zeile bestimmen, ohne Einfluss anderer Zeilen.
4. WHILE eine Card höher als ihr Inhalt ist, the Reads-Seite SHALL die Badge-Zeile (`.reads-card__meta`) am unteren Rand der Card positionieren.
5. WHILE eine Card die höchste ihrer Zeile ist, the Reads-Seite SHALL deren Inhalt ohne Abschneiden und ohne Überlauf darstellen.
6. The Reads-Seite SHALL die Cover-Bildhöhe und das Seitenverhältnis des Bildes unverändert lassen.
7. The Reads-Seite SHALL alle Cards einer Grid-Zeile mit identischem oberen Rand beginnen lassen (gleicher `getBoundingClientRect().top`), also ohne Versatz durch Listen-Abstände zwischen Geschwister-`<li>`.
8. WHILE eine Card Autoren hat, the Reads-Seite SHALL den Autorentext am unteren Ende des Inhaltsbereichs direkt über dem Trenner der Badge-Zeile ausrichten, sodass der Abstand Autor-Unterkante zu Trenner in allen Cards einer Zeile gleich ist.
9. WHILE eine Card nicht gestreckt wird (einspaltiges Layout bei 390 px Viewport-Breite), the Reads-Seite SHALL zwischen Headline-Unterkante und Autoren-Oberkante höchstens 16 px Abstand lassen.
10. The Reads-Seite SHALL jede Card weiterhin als `<wa-card>` (Web Awesome) rendern, ohne sie durch eine handgebaute Card-Komponente zu ersetzen.

**Independent Test**: `/reads` mit Fixture (`READS_FIXTURE_PATH`) bei Desktop-Breite öffnen und per `getBoundingClientRect().height` prüfen, dass alle Cards mit gleichem `top` gleiche Höhe haben.

---

## Edge Cases

- WHEN eine Zeile nur eine Card enthält THEN the Reads-Seite SHALL deren natürliche Inhaltshöhe verwenden.
- WHEN eine Card keine Tags oder keine Autoren hat THEN the Reads-Seite SHALL sie trotzdem auf die Höhe der höchsten Card ihrer Zeile bringen.
- IF kein Cover-Bild vorhanden ist THEN the Reads-Seite SHALL den Platzhalter anzeigen und die Höhe nach derselben Regel bestimmen.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| EQH-01 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-02 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-03 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-04 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-05 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-06 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-07 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-08 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-09 | P1: Gleich hohe Cards pro Zeile | - | Verified |
| EQH-10 | P1: Gleich hohe Cards pro Zeile | - | Verified |

**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️

---

## Success Criteria

- [ ] Im e2e-Test sind alle Cards einer Zeile bei gleichem `top` und bei 1280 px und 800 px Viewport-Breite exakt gleich hoch.
- [ ] Keine Card zeigt abgeschnittenen Inhalt.
- [ ] `/reads` rendert alle Cards als `<wa-card>`; die Anzahl `wa-card.reads-card` entspricht der Fixture-Länge.
