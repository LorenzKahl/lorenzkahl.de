# Validation: reads-card-tags

## Validation

**Result**: PASS

Diff range: b2353a6..1db5d72 plus the test hardening in the closing commit. Gate: `npx playwright test` 20 passed (6 consecutive runs stable); `npm run lint` clean.

Verifier note: the author ran this check inline; no fresh sub-agent was dispatched.

## Per-AC evidence

| AC | Evidence | Spec outcome | Covered |
| -- | -------- | ------------ | ------- |
| TAGS-01 chips in media, max 2, data order | tests/e2e/reads.spec.js:117 `toHaveCount(1)`; :129-130 `chips.nth(0)/nth(1)` `toHaveText(first/second)` | chips in `.reads-card__media`, in order | yes |
| TAGS-02 `+N` chip | tests/e2e/reads.spec.js:128 `toHaveCount(3)`; :131 `chips.nth(2)).toHaveText("+1")`; :133 third tag absent | `+1` for three tags | yes |
| TAGS-03 12-20px offset, one line | tests/e2e/reads.spec.js:178-183 (`left`, `bottom` between 12 and 20, `new Set(tops).size` is 1) | bottom-left, one line | yes |
| TAGS-04 contrast 4.5:1 | tests/e2e/reads.spec.js:217-218 `expect(alpha).toBe(255)`, `expect(ratio).toBeGreaterThanOrEqual(4.5)` | opaque background, 4.5:1 | yes |
| TAGS-05 no tag in header | tests/e2e/reads.spec.js:119, :134 `.reads-card__header wa-tag` `toHaveCount(0)` | none in header | yes |
| TAGS-06 no tags, no chip | tests/e2e/reads.spec.js:140 `locator("wa-tag")).toHaveCount(0)` | none | yes |
| TAGS-07 long name clipped | tests/e2e/reads.spec.js:243-249 (`chipRight <= coverRight`, `clipped` true, `overflowX` "hidden", `textOverflow` "ellipsis", short chips not clipped, `pageOverflow` false at 390 px) | ellipsis, no overflow | yes |
| TAGS-08 aria-label | tests/e2e/reads.spec.js:132 `toHaveAttribute("aria-label", "und 1 weitere Tags")` | exact label | yes |
| TAGS-09 cover ratio | tests/e2e/reads.spec.js:259 `Math.abs(box.height - box.width*675/1200) <= 1` | 16:9 kept | yes (placeholder cover only) |
| TAGS-10 wa-card and equal-height behavior kept | tests/e2e/reads.spec.js:24 (`wa-card.reads-card` count), :37, :55, :72, :90 | earlier behavior unchanged | yes |
| Edge: headline offset equal | tests/e2e/reads.spec.js:157 `new Set(offsets).size` is 1 | same distance | yes |

## Discrimination sensor

Each mutant ran against the full suite; the file was restored from a saved copy and the dev server given 7 seconds to rebuild before each run.

| Mutant | Result |
| ------ | ------ |
| remove `position: relative` on media | killed (placement) |
| remove `position: absolute` on tags | killed (placement) |
| chip text color to muted | killed (contrast) |
| remove overflow hidden and ellipsis | survived, then killed after adding computed-style assertions (reads.spec.js:245-246) |
| remove 9rem cap | killed (60-character tag test) |
| `slice(0, 3)` | killed (two tests) |
| remove `aria-label` | killed |
| left offset 0 | killed (placement) |

## Gaps (ranked)

1. TAGS-09 is asserted on the placeholder cover only; the fixture cover URL (`example.com`) does not load in tests.
2. Chip contrast is measured on the chip's own colors, not against the image, which the spec defines (opaque background).
3. `.gitignore` carries an uncommitted change from the skill installer; it is unrelated and left untouched.
