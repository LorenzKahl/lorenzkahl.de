# Reads Card Tags Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: none (inline: tags move into an `<div slot="media">` wrapper that holds the cover and an absolutely positioned chip row)
**Status**: In Progress

---

## Test Coverage Matrix

| Layer | Pattern in repo | Tests | Coverage Expectation |
| ----- | --------------- | ----- | -------------------- |
| Page markup and layout (`/reads`) | `tests/e2e/reads.spec.js` (Playwright, fixture build) | e2e | Every AC measured in the browser via DOM and `getBoundingClientRect`; one assertion per criterion |
| Fixture data | `tests/fixtures/reads.json` | none | Build and the existing e2e suite stay green |

## Gate Check Commands

| Level | Command |
| ----- | ------- |
| quick | `npx playwright test tests/e2e/reads.spec.js` |
| full | `npx playwright test` |
| build | `npm run lint && npx playwright test` |

Wait about 6 seconds after a CSS edit before running the gate: the dev server behind Playwright is reused and rebuilds lazily.

---

## Execution Plan

### Phase 1: Test data

```
T1
```

### Phase 2: Markup and style

```
T1 → T2 → T3
```

---

## Task Breakdown

### T1: Add a many-tags fixture bookmark

**What**: Add a third bookmark with three tags, one of them 60 characters long, to the fixture.
**Where**: `tests/fixtures/reads.json`
**Depends on**: None
**Reuses**: Shape of the existing fixture entries
**Requirement**: TAGS-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `fixture-many-tags` exists with `tags` of length 3 (second tag is a 60-character name, for the overflow check) and `image: null`, one annotation, counts consistent
- [x] Existing e2e suite still passes (count tests use `fixture.length`)
- [x] Full suite unchanged: 12 pass (11 reads, copy-button incl.)

**Tests**: none
**Gate**: build

---

### T2: Move tags into the media area as chips

**What**: Render at most two `<wa-tag>` chips plus an `+N` chip with `aria-label` inside a media wrapper, and remove tags from the header.
**Where**: `src/reads/index.njk`
**Depends on**: T1
**Reuses**: `<wa-tag>` already in use; `read.tags` data
**Requirement**: TAGS-01, TAGS-02, TAGS-05, TAGS-06, TAGS-08

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] e2e: card with one tag shows one chip in the media area and none in the header
- [x] e2e: card with three tags shows two chips and a `+1` chip with `aria-label="und 1 weitere Tags"`
- [x] e2e: card with no tags has no `wa-tag` in the media area
- [x] e2e: headline top sits at the same distance below the image in every card
- [x] Tests were red before the markup change

**Tests**: e2e
**Gate**: full

---

### T3: Style the chip overlay

**What**: Position the chips at the bottom left of the image with deckend dark chips, ellipsis for long names, and drop the old plain-text tag styling.
**Where**: `src/assets/css/base.css`
**Depends on**: T2
**Reuses**: `--color-text`, `--color-bg`, `--space-xs`; `.reads-card::part(media)` pattern
**Requirement**: TAGS-03, TAGS-04, TAGS-07, TAGS-09, TAGS-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] e2e: chips lie inside the image box, left and bottom offset equal `--space-xs`, all on one line
- [ ] e2e: computed text and background colors of a chip give a contrast of at least 4.5:1
- [ ] e2e: with the 60-character fixture tag at 390 px the document has no horizontal overflow
- [ ] e2e: image height and aspect ratio unchanged; existing equal-height, top-edge and author tests still pass
- [ ] `npm run lint` clean; old `.reads-card__tag` and `.reads-card__tags` plain-text rules removed

**Tests**: e2e
**Gate**: build
