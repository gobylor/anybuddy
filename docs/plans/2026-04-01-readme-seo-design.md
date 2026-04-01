# README SEO Design

**Date:** 2026-04-01

**Goal:** Rework the repository README so it ranks better for Chinese community searches around Claude Code buddy selection, while still serving English readers and converting GitHub visitors into website or CLI users.

## Context

The current `README.MD` is short, symmetrical, and easy to skim, but it leaves most search intent uncovered:

- the English and Chinese sections largely repeat the same information
- the page does not strongly target queries like `Claude Code buddy 换卡`, `Claude Code 指定 buddy`, or `Claude Code buddy user ID`
- the README explains what AnyBuddy is, but not why someone would search for it
- the CLI exists as a second conversion path, but it is not meaningfully surfaced in the root README

The repository already contains stronger keyword and positioning signals elsewhere:

- site metadata targets terms like `Claude Code buddy`, `claude code buddy reroll`, and `claude code buddy user id`
- the CLI package positions itself around species, rarity, exact user IDs, and direct configuration

The root README should unify those signals into a single landing page for GitHub and search traffic.

## Approaches Considered

### Recommended: Chinese-first hybrid SEO README

Use Chinese as the main narrative language, retain critical English terms and a short English summary, and organize the document around user search intent.

Pros:
- best fit for Chinese community discovery and sharing
- still understandable to English readers
- lets the README target both product keywords and problem-driven queries

Cons:
- longer than the current README
- requires more deliberate structure to stay easy to skim

### Alternative: Brand-first minimal README

Keep the README short and sharp, focusing on slogan, quick explanation, and links.

Pros:
- strong brand feel
- very easy to skim

Cons:
- weak long-tail SEO coverage
- leaves too many user questions unanswered

### Alternative: Technical explainer README

Lead with algorithm, lookup-table generation, and CLI mechanics.

Pros:
- strong developer credibility
- good fit for technical readers

Cons:
- weaker community sharing and conversion
- does not match the most common user search intent

## Approved Direction

Use the Chinese-first hybrid SEO README.

The new README should read like a lightweight landing page in the first screen, a search-answer page in the middle, and a developer entry point near the end.

## Content Strategy

### Primary search targets

The README should naturally cover:

- `Claude Code buddy`
- `Claude Code buddy 换卡`
- `Claude Code 指定 buddy`
- `Claude Code buddy user ID`
- `Claude Code buddy reroll`

### Secondary support terms

The document should also reinforce:

- `species`
- `rarity`
- `user ID`
- `CLI`
- `exact buddy`
- `AnyBuddy`

### Tone and language

- Chinese is the primary explanatory language
- English remains present in headings, product definitions, and technical terms
- keyword usage should feel natural and explanatory rather than stuffed

## Information Architecture

The README should be restructured into the following sections:

1. `H1 + subtitle`
2. `Core value`
3. `Get started`
4. `What is AnyBuddy / 这是什么`
5. `为什么会有人需要它`
6. `How it works / 工作原理`
7. `Use cases / 适用场景`
8. `CLI`
9. `FAQ`
10. `Acknowledgements`
11. `License`

This order prioritizes conversion first, then trust, then technical detail.

## Section-Level Design

### H1 and opening summary

The title should combine brand and intent. Recommended direction:

- `AnyBuddy：自由选择你想要的 Claude Code buddy`

The first summary paragraph should immediately explain:

- this is a tool for choosing a specific Claude Code buddy
- users can search by species and rarity
- the result is a matching user ID
- the project supports both website and CLI usage

### Core value block

This block should stay short and scannable. It should surface the three strongest outcomes:

- choose the exact buddy you want
- look up a matching user ID instantly
- apply it via web or CLI

### Get started block

This block should create a fast conversion path:

- official site link
- one short CLI example
- no long explanation before the first action

### Problem-driven explanation

The README should explicitly name the user problem:

- `/buddy` selection feels luck-based
- users may want a specific species or rarity
- users may want the exact variant they saw on the website

This section is important because it captures search intent that the current README does not address directly.

### Working principle

The technical explanation should preserve credibility while staying brief:

- Claude Code buddy selection depends on user ID and global salt
- AnyBuddy precomputes a lookup table
- users can search by species and rarity to retrieve matching IDs

The algorithm detail supports trust, but should not dominate the README.

### Use cases

This section should list a small number of concrete scenarios:

- choosing a specific legendary buddy
- finding a stable exact variant
- moving from web discovery to CLI application

### CLI section

The root README should not duplicate the entire CLI README. It should instead:

- explain that the CLI can apply the selected buddy locally
- show the strongest 2-3 examples
- link readers toward the package README for deeper operational detail

### FAQ

The FAQ should be written in the shape of real user queries. Recommended questions:

- `AnyBuddy 是什么？`
- `AnyBuddy 可以指定 Claude Code buddy 吗？`
- `AnyBuddy 算不算 Claude Code buddy reroll tool？`
- `为什么选择 buddy 需要 user ID？`
- `AnyBuddy 和 CLI 怎么配合使用？`
- `AnyBuddy 会修改哪些 Claude Code 配置？`

The FAQ is the best place to absorb long-tail search terms without making the main narrative feel bloated.

## Content Removal and Compression

The redesign should remove or reduce the following patterns:

- full English/Chinese mirrored sections
- overly short paragraphs that undersell the product
- license placement before explanatory content
- repeated wording that does not add new search coverage or clarity

## Success Criteria

The finished README should:

- explain the product in one screen without requiring scrolling through duplicate bilingual blocks
- better target Chinese search intent around buddy switching and exact selection
- still remain understandable for English readers
- provide clear next steps for both website and CLI users
- preserve the technical credibility of the project without turning the README into a deep technical paper

## Out of Scope

These items are not part of this design:

- changing site metadata or page SEO implementation
- rewriting the CLI package README in full
- changing product behavior, algorithms, or database generation
- adding badges, screenshots, or heavy promotional sections unless later requested
