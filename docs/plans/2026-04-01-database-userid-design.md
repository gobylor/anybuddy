# Database userID Generation Design

## Goal

Make AnyBuddy generate and ship only database `userID` values that come from the same source shape as the correct Claude buddy reroll script, so the CLI and the website both use valid 64-character lowercase hex IDs.

## Problem

The current generator in [scripts/generate-db.mjs](/Users/rl.yang/Repo/anybuddy/scripts/generate-db.mjs) creates candidate `userID` values as 16-character alphanumeric strings. That is not the same generation shape as the correct reference script, which generates candidates with `crypto.randomBytes(32).toString('hex')`.

This means the current databases in [src/lib/database.json](/Users/rl.yang/Repo/anybuddy/src/lib/database.json) and [packages/cli/lib/database.json](/Users/rl.yang/Repo/anybuddy/packages/cli/lib/database.json) are internally self-consistent with the roll algorithm, but they are still wrong because the stored `userID` values were generated from the wrong source logic.

## Approaches

### Recommended: Single source of truth for candidate generation and roll verification

Refactor the database generator so it has one explicit function for generating candidate `userID` values and one explicit function for rolling buddy traits from a `userID`. Then regenerate both databases from scratch using only 64-character lowercase hex candidates.

Pros:
- Fixes the root cause instead of patching output data
- Keeps the website and CLI databases aligned
- Makes future verification straightforward

Cons:
- Requires regenerating both databases
- Needs test coverage around generator rules

### Alternative: Minimal hotfix to `randomUserId()`

Change only the candidate generation function to use 64-character hex IDs, then rerun the current script.

Pros:
- Smallest code change
- Fastest path to new output

Cons:
- Leaves the generator structure easy to drift again
- Does not add enough guardrails around future database updates

### Alternative: Build an append-only database pipeline now

Add explicit append mode, dedupe rules, and richer generation controls in the same change.

Pros:
- Better long-term ergonomics for growing the dataset

Cons:
- Expands scope beyond the current correctness fix
- Increases implementation and review risk

## Design

### Source of truth

Keep buddy roll behavior aligned with the known-good script:

- `SALT` remains `friend-2026-401`
- roll seeding remains `Bun.hash(userId + SALT)` truncated to 32 bits
- PRNG remains `mulberry32`
- rarity, species, eye, hat, shiny, and stat generation keep the same ordering and rules

Candidate `userID` generation changes to a strict rule:

- generate with `crypto.randomBytes(32).toString('hex')`
- accept only `/^[0-9a-f]{64}$/`

### Generator structure

Refactor [scripts/generate-db.mjs](/Users/rl.yang/Repo/anybuddy/scripts/generate-db.mjs) so the responsibilities are explicit:

- `generateCandidateUserId()` creates only correctly shaped candidate IDs
- `rollFromUserId(userId)` computes buddy traits from a candidate ID
- the collection loop fills species/rarity buckets until `ENTRIES_PER_COMBO` is satisfied

The script should still write two outputs:

- website database to [src/lib/database.json](/Users/rl.yang/Repo/anybuddy/src/lib/database.json) with full trait details
- CLI database to [packages/cli/lib/database.json](/Users/rl.yang/Repo/anybuddy/packages/cli/lib/database.json) with only `userID` values

### Validation and failure behavior

The script should fail closed instead of writing questionable data:

- reject any candidate `userID` that is not 64-character lowercase hex
- round-trip every accepted entry through `rollFromUserId`
- verify the CLI database is the exact `userID` projection of the website database
- abort without writing output if any mismatch is found

### Incremental support boundary

This fix should support safe future expansion without building a complex append pipeline now:

- keep `ENTRIES_PER_COMBO` as the only growth control
- allow future dataset expansion by raising that value and regenerating
- avoid partial migration logic for old 16-character IDs

## Testing

Add automated coverage for:

- candidate `userID` format is always 64-character lowercase hex
- website database entries all have correctly shaped `userID` values
- CLI database entries all have correctly shaped `userID` values
- CLI database matches the website database's `userID` projection
- Bun-based roll verification still matches every stored bucket

## Success Criteria

- AnyBuddy no longer ships 16-character alphanumeric database `userID` values
- Both databases are regenerated from the correct candidate `userID` logic
- Validation fails before writing output if any entry drifts from the reference roll logic
- Tests catch regressions if someone reintroduces the wrong `userID` generation shape
