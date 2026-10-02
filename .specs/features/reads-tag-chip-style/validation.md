# Validierung: reads-tag-chip-style

## Validation

**Result**: PASS

Diff-Bereich: origin/main..HEAD (ein Commit). Gate: `npx playwright test` 27 bestanden, drei Läufe stabil; `npm run lint` mit Exit 0.

Hinweis zur Prüfung: Die Validierung hat der Autor selbst durchgeführt, es wurde kein unabhängiger Verifier-Sub-Agent gestartet.

## Nachweis je Kriterium

| Kriterium | Nachweis | Erwartetes Ergebnis | Abgedeckt |
| --------- | -------- | ------------------- | --------- |
| CHIP-01 Pill | tests/e2e/reads.spec.js:300 `expect(chip.radius).toBeGreaterThanOrEqual(chip.height / 2)` | Radius mindestens halbe Höhe | ja |
| CHIP-02 Hintergrund 85 % | tests/e2e/reads.spec.js:301 `expect(Math.abs(chip.alpha - 0.85)).toBeLessThanOrEqual(0.01)`; :302 `backgroundDelta` höchstens 1 gegen `--color-bg` | `--color-bg` bei 0.85 | ja |
| CHIP-03 Textfarbe | tests/e2e/reads.spec.js:303 `expect(chip.textDelta).toBeLessThanOrEqual(1)` gegen `--color-text` | `--color-text` | ja |
| CHIP-04 Kontrast gegen Schwarz | tests/e2e/reads.spec.js:304 `expect(chip.contrast).toBeGreaterThanOrEqual(4.5)` | mindestens 4.5:1 | ja |
| CHIP-05 Text mittig | tests/e2e/reads.spec.js:305 `expect(chip.offCenter).toBeLessThanOrEqual(1)` | höchstens 1 px | ja |
| CHIP-06 Schrift | tests/e2e/reads.spec.js:306-308 Schriftfamilie und -größe gleich der Autorenzeile, Gewicht "500" | `--font-body`, `--step-n2`, 500 | ja |
| CHIP-07 `+N`-Chip gleich gestaltet | dieselbe Schleife (tests/e2e/reads.spec.js:299) läuft über alle Chips, auch `+1` (Anzahl aus der Fixture berechnet) | gleiche Werte | ja |
| CHIP-08 frühere Chip-Anforderungen | bestehende Tests (Anzahl, `+N`-aria-label, Ausrichtung an der Headline, Ellipsis, Abstand nach unten) bleiben grün | unverändert | ja |
| CHIP-09 kurze Chips ungekürzt | tests/e2e/reads.spec.js:340-341 `expect(result.shortClipped).toBe(false)`, `expect(result.moreClipped).toBe(false)` bei 390 und 1000 px | keine Kürzung | ja |

## Discrimination Sensor

Jede Mutante lief gegen die gesamte Suite, die Dateien wurden danach aus Kopien wiederhergestellt, und der Dev-Server bekam 7 Sekunden zum Neubau.

| Mutante | Ergebnis |
| ------- | -------- |
| Radius 6 px | erkannt |
| Hintergrund 100 % deckend | erkannt |
| Hintergrund 40 % (zu transparent) | erkannt |
| Textfarbe weiß | erkannt |
| Gewicht 600 | erkannt |
| Serifenschrift | erkannt |
| `flex: none` entfernt | erkannt (Test bei 1000 px) |
| Klasse `reads-card__tag--long` entfernt | zuerst überlebt, dann erkannt, nachdem der Test alle Chips gegen den Bildrand prüft statt nur den langen |
| `line-height: 33px` | überlebt |

## Lücken (nach Rang)

1. `line-height: 33px` überlebt: Mit `block-size: auto` wächst der Chip mit der Zeilenhöhe und der Text bleibt mittig. Die Spec legt keine Chip-Höhe fest, daher gibt es keine Anforderung, die das verletzt.
2. Die Textlage wird über einen DOM-Range gemessen; die Schriftmetrik schwankt je nach Zeilenhöhe und Schriftgröße um bis zu 1,5 px. `line-height: 1.7` hält bei 1280 und 390 px Breite unter 1 px, andere Breiten wurden nicht gemessen.
3. Nur in Chromium gemessen; die Tests nutzen die Fixture-Platzhalterbilder, nicht echte Fotos. Der Kontrast wird gegen den schlechtesten Fall (schwarz) gerechnet.
