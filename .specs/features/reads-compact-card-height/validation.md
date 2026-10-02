# Validierung: reads-compact-card-height

## Validation

**Result**: PASS

Diff-Bereich: origin/main..HEAD (ein Commit). Gate: `npx playwright test` 26 bestanden, dreimal hintereinander stabil; `npm run lint` mit Exit 0.

Hinweis zur Prüfung: Die Validierung hat der Autor selbst durchgeführt, es wurde kein unabhängiger Verifier-Sub-Agent gestartet.

## Nachweis je Kriterium

| Kriterium | Nachweis | Erwartetes Ergebnis | Abgedeckt |
| --------- | -------- | ------------------- | --------- |
| CCH-01 Zeilenhöhe gleich natürliche Höhe | tests/e2e/reads.spec.js:308 `expect(Math.abs(height - naturalRows[index])).toBeLessThanOrEqual(1)` bei 390, 800 und 1280 px | Abweichung höchstens 1 px | ja |
| CCH-02 unabhängig von Viewport-Höhe | tests/e2e/reads.spec.js:326 `expect(Math.abs(value - heights[0][index])).toBeLessThanOrEqual(1)` bei 600, 900 und 1400 px | gleiche Höhe | ja |
| CCH-03 Abstand Headline zu Autor in der höchsten Card | tests/e2e/reads.spec.js:339 `expect(rendered[tallest].gap).toBeLessThanOrEqual(rendered[tallest].authorsMargin + 1)` | Autoren-Rand plus 1 px | ja |
| CCH-04 Titel vollständig | tests/e2e/reads.spec.js:357 `expect(clipped.every((value) => value === false)).toBe(true)` | kein Abschneiden | ja |
| CCH-05 wa-card und frühere Specs | bestehende Tests: reads.spec.js `wa-card.reads-card` Anzahl, gleiche Höhe, gleicher oberer Rand, Autor am Trenner, Chips | unverändert grün | ja |
| CCH-06 Padding, Abstände, Cover-Verhältnis | tests/e2e/reads.spec.js:293 Cover-Verhältnis; Padding und Abstände nur per Diff-Prüfung (Diff berührt nur `.reads-grid`) | unverändert | teilweise |
| Randfall Zeile mit einer Card | 800 px Breite: Fixture ergibt Zeilen mit 2 und 1 Card, reads.spec.js:308 | natürliche Höhe | ja |

## Discrimination Sensor

Jede Mutante lief gegen die gesamte Suite, die Datei wurde danach aus einer Kopie wiederhergestellt, und der Dev-Server bekam 7 Sekunden zum Neubau.

| Mutante | Ergebnis |
| ------- | -------- |
| `align-content: start` entfernt | erkannt (3 Tests rot) |
| Auto-Zeilen mit `minmax(450px, auto)` aufgebläht | erkannt (5 Tests rot) |
| `min-height: 440px` auf `.reads-card` | erkannt (2 Tests rot) |
| Titel auf eine Zeile begrenzt | erkannt (Titel-Test rot) |

Eine erste Fassung des Tests maß die natürliche Höhe an der `<li>` statt an der Card. Damit hätte eine Mindesthöhe auf der `<li>` unbemerkt gepasst. Die Messung verwendet jetzt die Card-Höhe.

## Lücken (nach Rang)

1. CCH-06 prüft Padding und Abstände nicht direkt, sondern nur über den Diff. Ein späteres Straffen von Abständen würde keinen Test rot färben, passt aber zur Entscheidung, dass es nicht Teil dieses Features ist.
2. Die Fixture-Titel haben alle zwei Zeilen; der Test für vollständige Titel sieht daher keinen vierzeiligen Titel wie auf der Live-Seite.
3. Die Ursache wurde in Chrome (Playwright-Chromium) gemessen; andere Browser wurden nicht geprüft.
