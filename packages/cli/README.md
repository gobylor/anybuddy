# anybuddy

One-click Claude Code buddy configurator.

`anybuddy` lets you pick a specific Claude Code buddy by species and rarity, then applies a matching user ID to your local Claude configuration.

## Requirements

- Node.js 18 or newer
- Claude Code CLI installed: `npm install -g @anthropic-ai/claude-code`

## Usage

Run without installing globally:

```bash
npx @openlor/anybuddy --list
```

Pick a buddy:

```bash
npx @openlor/anybuddy --species duck --rarity legendary
```

More examples:

```bash
npx @openlor/anybuddy --species dragon --rarity epic
npx @openlor/anybuddy --help
```

After a successful run:

- AnyBuddy looks up a matching user ID
- captures your Claude Code OAuth token
- updates `~/.claude.json`
- persists `CLAUDE_CODE_OAUTH_TOKEN` in your shell rc file

Then restart your terminal, run `claude`, and use `/buddy`.

## Maintainers

From the repository root:

```bash
npm run pack:cli
npm run release:cli:dry
npm run release:cli
```

Before publishing a new version, bump `packages/cli/package.json` or run:

```bash
cd packages/cli
npm version patch --no-git-tag-version
```
