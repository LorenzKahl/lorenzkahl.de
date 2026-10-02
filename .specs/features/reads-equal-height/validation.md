# Validation: reads-equal-height

## Validation

**Result**: PASS (with 2 documented sensor gaps)

Diff range: 06fe042..45ea8d7 (b8b2114, 45ea8d7). Gate: `npx playwright test tests/e2e/reads.spec.js` 9 passed; `npm run lint` clean.

Verifier note: the author ran this check inline; no fresh sub-agent was dispatched.

## Per-AC evidence

| AC | Evidence | Spec outcome | Covered |
| -- | -------- | ------------ | ------- |
| EQH-01 equal height per row | tests/e2e/reads.spec.js:46 `expect(new Set(row.map((rect) => rect.height)).size).toBe(1)` | 0 px deviation | yes |
| EQH-02 re-equalize on column change | tests/e2e/reads.spec.js:32 loop over widths 1280, 800 | equal height per new row | yes (two widths) |
| EQH-03 rows independent | src/assets/css/base.css:454 `height: 100%` on grid item; rows grouped by top at reads.spec.js:44 | per-row height | partial (fixture has one row) |
| EQH-04 meta at bottom | tests/e2e/reads.spec.js:63 `expect(new Set(gaps).size).toBe(1)` | equal bottom gap | yes |
| EQH-05 no clipping | none | no clip | not asserted |
| EQH-06 cover unchanged | none (cover rules untouched in diff) | unchanged | by diff review |
| EQH-07 same top edge | tests/e2e/reads.spec.js:28 `expect(new Set(tops).size).toBe(1)` | one top value | yes |
| EQH-08 wa-card kept | tests/e2e/reads.spec.js:15 `toHaveCount(fixture.length)` on `wa-card.reads-card` | count = fixture length | yes |

## Discrimination sensor

Mutants ran against the real spec file in the working tree, restored from a saved copy after each run.

| Mutant | Result |
| ------ | ------ |
| remove `li + li` reset | killed (top-edge test) |
| remove `height: 100%` | killed (both equal-height tests) |
| remove `::part(body)` `flex: 1` | survived |
| remove `.reads-card__meta { grid-row: 2 }` | survived |

## Gaps (ranked)

1. `grid-row: 2` survives: both fixture cards have authors, so grid auto-placement already puts the meta row in row 2. A card without authors needs it. Test needs a fixture bookmark without authors.
2. `flex: 1` on `::part(body)` survives: wa-card 3.12.0 appears to grow the body already. The rule may be redundant; not proven.
3. EQH-05 and EQH-03 have no direct assertion (fixture has two cards, one row).
