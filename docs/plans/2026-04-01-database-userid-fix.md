# Database userID Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Regenerate AnyBuddy's website and CLI databases so they contain only correctly generated 64-character lowercase hex `userID` values, while preserving the reference buddy roll behavior.

**Architecture:** Keep one Bun-based generator as the source of truth for buddy rolling, but separate candidate `userID` generation from roll logic. Add format and projection validation so the script fails before writing bad database files, then regenerate both JSON outputs from the corrected pipeline.

**Tech Stack:** Bun, Node.js ESM, Vitest, JSON data files

---

### Task 1: Add failing tests for database `userID` shape and projection

**Files:**
- Create: `packages/cli/lib/__tests__/database.test.ts`
- Test: `packages/cli/lib/__tests__/database.test.ts`

**Step 1: Write the failing test**

Add tests that:

- assert every CLI database `userID` matches `/^[0-9a-f]{64}$/`
- assert every website database `entry.userID` matches `/^[0-9a-f]{64}$/`
- assert the CLI database is the `userID` projection of the website database

**Step 2: Run test to verify it fails**

Run: `pnpm test packages/cli/lib/__tests__/database.test.ts`

Expected: FAIL because the current databases contain 16-character alphanumeric IDs.

### Task 2: Refactor the generator to use correct candidate IDs

**Files:**
- Modify: `scripts/generate-db.mjs`

**Step 1: Write minimal implementation**

Refactor the script to:

- import Node `crypto`
- replace the old 16-character generator with `crypto.randomBytes(32).toString('hex')`
- add a reusable `isValidUserId()` check for `/^[0-9a-f]{64}$/`
- keep buddy roll logic aligned with the reference Bun-based algorithm

**Step 2: Run focused generation script**

Run: `bun scripts/generate-db.mjs`

Expected: PASS and rewrite both database JSON files with only 64-character lowercase hex IDs.

### Task 3: Add fail-closed verification to the generator

**Files:**
- Modify: `scripts/generate-db.mjs`

**Step 1: Write minimal verification**

Before writing output, verify:

- every stored website entry round-trips to the expected species, rarity, and traits
- every stored CLI `userID` round-trips to the expected species and rarity
- every CLI bucket equals the website bucket projected to `userID`

**Step 2: Re-run generator**

Run: `bun scripts/generate-db.mjs`

Expected: PASS with no mismatches reported.

### Task 4: Verify tests turn green

**Files:**
- Modify: `scripts/generate-db.mjs`
- Test: `packages/cli/lib/__tests__/database.test.ts`

**Step 1: Run focused test**

Run: `pnpm test packages/cli/lib/__tests__/database.test.ts`

Expected: PASS

**Step 2: Run full test suite**

Run: `pnpm test`

Expected: PASS

### Task 5: Run CLI smoke verification

**Files:**
- Modify: `packages/cli/lib/database.json`
- Modify: `src/lib/database.json`

**Step 1: Run safe CLI commands**

Run:

```bash
node packages/cli/bin/anybuddy.mjs --help
node packages/cli/bin/anybuddy.mjs --list
```

Expected: Both commands succeed and the listed buddy options still render.

**Step 2: Inspect sample output shape**

Run:

```bash
node -e "const db=require('./packages/cli/lib/database.json'); console.log(db.duck.legendary[0]);"
```

Expected: Sample `userID` is 64-character lowercase hex.
