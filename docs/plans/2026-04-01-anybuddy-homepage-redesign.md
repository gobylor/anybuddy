# AnyBuddy Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the AnyBuddy homepage into a premium black-obsidian minimal experience with a visible `Lor —— AI Builder` author signature, while preserving the existing species, rarity, and user ID lookup flow.

**Architecture:** Keep the current single-page Next.js App Router structure and existing lookup logic. Concentrate changes in the homepage and presentational components, add a small jsdom-based UI test harness for the homepage flow, and verify the redesign through focused tests, a production build, and responsive manual QA.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS 3, next/font, Vitest, React Testing Library, jsdom

---

### Task 1: Enable homepage interaction tests

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/app/__tests__/page.test.tsx`

**Step 1: Write the failing test**

Create a homepage smoke test that renders the page and confirms the current interaction flow still works after the future redesign.

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

describe('Home page', () => {
  it('renders the title and reveals a buddy after species selection', async () => {
    const user = userEvent.setup()
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'AnyBuddy' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Select duck/i }))

    expect(screen.getByText(/Your legendary duck/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: FAIL because jsdom and Testing Library are not configured yet.

**Step 3: Write minimal implementation**

Add the missing test support:

- add `@testing-library/react`
- add `@testing-library/jest-dom`
- add `@testing-library/user-event`
- add `jsdom`
- create `vitest.config.ts` with `environment: 'jsdom'` and the `@/*` alias
- create `src/test/setup.ts` to import `@testing-library/jest-dom/vitest`

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/test/setup.ts src/app/__tests__/page.test.tsx
git commit -m "test: add homepage interaction coverage"
```

### Task 2: Add the new hero narrative and author signature

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Step 1: Write the failing test**

Extend the homepage test to assert the new signed hero content:

```tsx
expect(screen.getByText(/A small utility by Lor —— AI Builder/i)).toBeInTheDocument()
expect(screen.getByText(/Pick the exact Claude Code buddy you want/i)).toBeInTheDocument()
expect(screen.getByText(/Choose a species to reveal your companion profile/i)).toBeInTheDocument()
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: FAIL because the current homepage does not include the new author line or hero copy.

**Step 3: Write minimal implementation**

Update `src/app/page.tsx` to:

- rebuild the top of the page into a proper hero section
- place `A small utility by Lor —— AI Builder` inside the hero cluster
- tighten the English and Chinese framing copy
- replace the plain empty state with a more intentional message

Update `src/app/layout.tsx` to:

- align `title`, `description`, and social metadata with the new premium homepage framing
- prepare the root font variables for a display font, body font, and mono font

Example hero structure:

```tsx
<section className="hero-shell">
  <p className="author-mark">A small utility by Lor —— AI Builder</p>
  <h1>AnyBuddy</h1>
  <p lang="zh-CN">抽卡靠运气，换卡靠 AnyBuddy。</p>
  <p>Any Buddy You Want.</p>
  <p>Pick the exact Claude Code buddy you want.</p>
</section>
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx src/app/__tests__/page.test.tsx
git commit -m "feat: redesign anybuddy hero"
```

### Task 3: Establish the obsidian visual system

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Write minimal implementation**

Introduce the new design tokens and typography:

- load a display font and body font with `next/font/google`
- keep a dedicated mono font for commands and IDs
- define CSS variables for obsidian backgrounds, soft text, muted text, copper accent, border tone, and surface glow
- add subtle background texture, radial lighting, and calmer focus treatment
- map the new tokens into Tailwind theme extensions

Example token direction:

```css
:root {
  --bg-0: #11110f;
  --bg-1: #171613;
  --surface: rgba(29, 27, 22, 0.78);
  --text-0: #f4efe6;
  --text-1: #c8bfb1;
  --accent: #c98b49;
  --border: rgba(201, 139, 73, 0.22);
}
```

**Step 2: Run focused verification**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: PASS, confirming the visual-system refactor did not break homepage rendering.

**Step 3: Run local build verification**

Run: `pnpm build`

Expected: PASS

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css tailwind.config.ts
git commit -m "feat: add anybuddy obsidian visual system"
```

### Task 4: Rebuild the selection surfaces

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/SpeciesGrid.tsx`
- Modify: `src/components/RarityPicker.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Step 1: Write the failing test**

Extend the homepage test so it checks the new selection framing while preserving the old behavior:

```tsx
expect(screen.getByText(/species gallery/i)).toBeInTheDocument()
expect(screen.getByText(/rarity filter/i)).toBeInTheDocument()
await user.click(screen.getByRole('button', { name: /Select duck/i }))
expect(screen.getByText(/Your legendary duck/i)).toBeInTheDocument()
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: FAIL because the new section framing does not exist yet.

**Step 3: Write minimal implementation**

Update the selection UI to match the approved design:

- replace the current phase indicator with calmer editorial step markers
- wrap species controls in a titled gallery section
- restyle species buttons into softer collectible surfaces
- keep the current `onSelect` logic and first-pick legendary auto-default
- restyle rarity buttons into lighter secondary filters

Example section shell:

```tsx
<section aria-labelledby="species-heading">
  <p className="section-kicker">01</p>
  <h2 id="species-heading">Species gallery</h2>
  <SpeciesGrid selected={species} onSelect={handleSpeciesSelect} />
</section>
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: PASS

**Step 5: Manual responsive check**

Run: `pnpm dev`

Expected: The page loads locally and the selection surfaces remain readable at roughly `390px` and `1440px` widths.

**Step 6: Commit**

```bash
git add src/app/page.tsx src/components/SpeciesGrid.tsx src/components/RarityPicker.tsx src/app/__tests__/page.test.tsx
git commit -m "feat: redesign anybuddy selection surfaces"
```

### Task 5: Upgrade the result profile and instruction panels

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/ResultCard.tsx`
- Modify: `src/components/Instructions.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Step 1: Write the failing test**

Extend the homepage test to assert the richer result framing:

```tsx
await user.click(screen.getByRole('button', { name: /Select duck/i }))
expect(screen.getByText(/companion profile/i)).toBeInTheDocument()
expect(screen.getByText(/npx anybuddy --species duck --rarity legendary/i)).toBeInTheDocument()
expect(screen.getByText(/Lor —— AI Builder/i)).toBeInTheDocument()
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: FAIL because the result area and footer do not yet match the new copy and framing.

**Step 3: Write minimal implementation**

Update the result and instruction surfaces to:

- frame the result as a companion profile instead of a plain output block
- improve spacing between sprite, traits, and `userID`
- restyle the copy button, shuffle affordance, and recovery panel
- add a subtle footer echo of the author signature
- keep the existing clipboard, shuffle, and command-generation behavior intact

Example profile heading:

```tsx
<div className="profile-header">
  <p className="section-kicker">02</p>
  <h2>Companion profile</h2>
</div>
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/app/__tests__/page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/ResultCard.tsx src/components/Instructions.tsx src/app/__tests__/page.test.tsx
git commit -m "feat: redesign anybuddy result panels"
```

### Task 6: Run full verification and final polish

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/components/SpeciesGrid.tsx`
- Modify: `src/components/RarityPicker.tsx`
- Modify: `src/components/ResultCard.tsx`
- Modify: `src/components/Instructions.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Step 1: Run the test suite**

Run: `pnpm test`

Expected: PASS

**Step 2: Run the production build**

Run: `pnpm build`

Expected: PASS

**Step 3: Run final manual QA**

Run: `pnpm dev`

Expected:

- desktop hero feels spacious and balanced
- mobile layout keeps headline hierarchy and readable control spacing
- selection -> result flow still auto-scrolls correctly
- copy feedback still works
- author signature appears in the hero and footer without overpowering the brand

**Step 4: Commit final polish**

```bash
git add src/app/layout.tsx src/app/globals.css src/app/page.tsx src/components/SpeciesGrid.tsx src/components/RarityPicker.tsx src/components/ResultCard.tsx src/components/Instructions.tsx src/app/__tests__/page.test.tsx
git commit -m "feat: polish anybuddy homepage redesign"
```
