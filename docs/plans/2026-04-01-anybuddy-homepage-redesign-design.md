# AnyBuddy Homepage Redesign Design

## Goal

Redesign the AnyBuddy homepage so it feels like a premium, large-scale utility artifact instead of a default GitHub-styled tool page, while naturally integrating the author signature `Lor —— AI Builder`.

## Current State

The current homepage already has a strong functional core:

- the species -> rarity -> result flow is fast and clear
- the page is lightweight and keeps all buddy lookup logic in the browser
- the tone already hints at terminal culture through monospace typography and dark surfaces

The visual presentation is still too close to a developer default:

- the layout moves from heading straight into controls with little narrative buildup
- the entire page uses one monospace voice, which limits hierarchy and elegance
- the palette reads as GitHub-dark rather than intentionally branded
- the result panel feels like a plain output card instead of a collectible companion profile
- the author is absent from the primary storytelling of the page

## Approaches Considered

### Recommended: Obsidian terminal minimal

Keep the dark tool DNA, but elevate it into a black-obsidian, copper-accent design system with stronger typography, larger breathing room, calmer interaction states, and a signature-grade author mark.

Pros:
- best fit for a Claude Code `/buddy` tool
- easiest way to achieve "grand and minimal" without losing utility
- lets the author signature feel intentional rather than promotional

Cons:
- requires reworking the current one-font visual system
- needs careful restraint so the terminal cues feel premium instead of gimmicky

### Alternative: Editorial landing page minimal

Reframe AnyBuddy as a polished brand page with generous whitespace, softer light surfaces, and a more magazine-like layout.

Pros:
- very elegant and fashionable
- easy to make the headline feel premium

Cons:
- weakens the product's tool-native identity
- creates more tension with the ASCII sprite and CLI usage copy

### Alternative: Companion collectible gallery

Lean into the buddy concept and make the result feel like a rare collectible profile with richer showcase framing.

Pros:
- strongest visual impact
- makes species selection feel playful and memorable

Cons:
- pushes beyond "minimal"
- risks overshadowing the main utility workflow

## Approved Direction

Use the Obsidian terminal minimal approach.

This direction keeps the existing dark product language but upgrades it into a more deliberate brand experience: warmer black surfaces, a restrained copper highlight, stronger typographic scale, and more atmospheric whitespace. The page should feel expensive and composed, not flashy.

## Information Architecture

### 1. Hero

The homepage should open with a true hero section instead of a simple heading block.

Content order:

- oversized `AnyBuddy` title
- bilingual slogan in two short lines
- one concise product definition: "Pick the exact Claude Code buddy you want."
- subtle author line using `Lor —— AI Builder`

Layout intent:

- desktop: the hero feels left-weighted and spacious, with the author line positioned as a small signature near the headline cluster
- mobile: the same hierarchy collapses into a tighter vertical stack without losing the headline's presence

### 2. Selection studio

The selection area should feel like a composed control surface rather than a utility form.

- the current phase indicator becomes a calmer editorial step marker
- species selection becomes a premium gallery of collectible labels
- rarity selection becomes a lighter secondary filter row
- the empty state speaks in more intentional language and visually belongs to the redesigned system

### 3. Buddy profile result

Once a species and rarity are selected, the result area should read like a profile reveal.

- sprite remains the visual anchor
- rarity, eye, hat, shiny state, and user ID sit in a more structured profile panel
- the copy button and shuffle action feel calmer and more refined
- command instructions remain clearly accessible but inherit the same surface quality

### 4. Footer

The footer keeps the disclaimer and salt/version notes, but it should also echo the author presence in a subtler way so the signature feels integrated across the page rather than bolted on.

## Visual System

### Typography

The redesign should stop using one monospace family everywhere.

Recommended typography split:

- display: a sculptural sans such as `Space Grotesk`
- body: a clean sans such as `Manrope`
- code and IDs: a dedicated mono such as `IBM Plex Mono` or the existing `Fira Code`

Rules:

- only hero headlines and key section titles use the display font
- explanatory copy, labels, and support text use the body sans
- `userID`, commands, and code-adjacent details stay monospace
- large headings use tighter tracking and shorter line lengths
- paragraphs should remain narrow enough to feel editorial, not stretched

### Color

The palette shifts from GitHub-dark orange to a warmer obsidian-and-copper system.

- background: near-black with a warm gray undertone, not pure black
- text: soft bone white instead of bright white
- muted text: warm desaturated gray
- accent: one restrained copper-gold highlight
- success state: keep a green for functional confirmation only

The page should rely on one primary accent family. Remove the feeling of multiple competing accent colors.

### Surfaces and texture

The page should feel atmospheric without becoming busy.

- use subtle radial glow behind the hero and selected surfaces
- add a very light grain or texture overlay in CSS
- prefer layered shadows and soft inner borders over generic card shadows
- keep borders thin and intentional
- avoid loud gradients or heavy neon effects

### Layout

The design should feel spacious and optically balanced.

- use a wider but still constrained max-width container
- increase top padding in the hero so the page opens with more presence
- allow larger vertical gaps between hero, controls, and result
- break the current "everything centered all the time" pattern with more deliberate alignment
- keep mobile spacing tighter, but preserve the same hierarchy

## Components

### Hero block

The hero becomes the primary identity surface for the page.

- large title
- concise supporting lines
- subtle author signature
- short framing copy

### Species grid

The grid remains efficient, but each option should feel more curated.

- stronger spacing and cleaner card proportions
- more refined selected state
- lighter default state, warmer hover state
- species labels feel like product tags, not debugging labels

### Rarity picker

Rarity acts as the secondary control layer.

- visually lighter than species cards
- clear selected state with accent tint
- preserve the current auto-select-to-legendary behavior on first species pick

### Result card

The result area becomes a "buddy profile" surface.

- sprite and profile details align cleanly
- `userID` becomes a premium data row instead of a bare code block
- copy feedback stays quiet and confident
- shuffle reads like an alternate reveal, not a random debug action

### Instructions panel

Instruction copy remains short and practical but should feel designed rather than appended.

- keep the CLI command prominent
- preserve recovery instructions
- maintain functional clarity over decorative wording

## Interaction and Motion

Motion should be sparse and deliberate.

- hero text enters with a short stagger on first load
- species cards lift slightly and brighten on hover
- result area scrolls smoothly into view after selection
- result panel reveals with a light opacity/translate transition
- copy success changes color and text quietly without large movement

All motion should use `transform` and `opacity`, not layout-changing animation.

## Author Signature

`Lor —— AI Builder` should behave like a creator signature, not a marketing badge.

Placement strategy:

- primary signature in the hero near the title cluster
- secondary, quieter echo in the footer

Copy strategy:

- preferred hero line: `A small utility by Lor —— AI Builder`
- footer line can be shorter and lower contrast

Visual strategy:

- use the accent family at lower contrast than primary CTAs
- keep it small, precise, and aligned
- never let it outrank the `AnyBuddy` title

## Technical Boundaries

This redesign should preserve the existing product behavior.

- do not change lookup logic in `src/lib/database.ts`
- do not change species or rarity data definitions in `src/lib/types.ts`
- do not touch CLI flows in `packages/cli`
- focus implementation on:
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `tailwind.config.ts`
  - `src/app/page.tsx`
  - `src/components/SpeciesGrid.tsx`
  - `src/components/RarityPicker.tsx`
  - `src/components/ResultCard.tsx`
  - `src/components/Instructions.tsx`

## Verification

The implementation should be considered complete only if it passes both functional and visual checks.

Functional verification:

- species selection still works for all 18 species
- rarity switching still works across all rarity values
- result auto-scroll still works
- copy user ID still works
- CLI instruction command still reflects the current species and rarity

Visual verification:

- desktop hero feels spacious and high-contrast without clutter
- mobile layout preserves hierarchy and does not collapse into a cramped grid
- the author signature is visible and tasteful in both hero and footer
- the result surface feels more premium than the current card

## Success Criteria

- the page feels grand, minimal, and unmistakably intentional
- AnyBuddy retains its fast tool workflow while looking like a finished product
- `Lor —— AI Builder` is present as a natural author signature, not an afterthought
- the redesign works on both desktop and mobile without breaking current functionality
