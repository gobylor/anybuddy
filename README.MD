# AnyBuddy：自由选择你想要的 Claude Code buddy

抽卡靠运气，换卡靠 AnyBuddy。

Any Buddy You Want.

自由选择你想要的 Claude Code buddy，按 `species` 和 `rarity` 找到匹配的 `user ID`，然后在网页或 CLI 里直接使用。

官网入口：**[anybuddy.cc](https://anybuddy.cc)**

## 核心价值 / Core value

- 想要指定的 Claude Code buddy，不用反复碰运气。
- 直接按 `species + rarity` 搜索，快速拿到可用的 `user ID`。
- 既可以在网页里查，也可以用 CLI 一键应用到本地 Claude 配置。

## 立即开始 / Get started

先去网站挑一个你想要的 buddy，或者直接在终端里试 CLI：

```bash
npx @openlor/anybuddy --list
npx @openlor/anybuddy --species duck --rarity legendary
```

如果你已经在 AnyBuddy 上看到具体那一只，也可以直接把 exact variant 的 `user ID` 应用到本地：

```bash
npx @openlor/anybuddy --species turtle --rarity legendary --user-id 14a197f94a5767f008c89e62829f69374037680b6f424715fffc309eee535ca2
```

## 什么是 AnyBuddy / What is this

AnyBuddy 是一个帮助你选择 Claude Code buddy 的工具。你可以按物种和稀有度浏览全部可用结果，找到你喜欢的那一只，再拿到对应的 `user ID`。

它适合两类人：

- 想稳定指定某个 `Claude Code buddy` 的人
- 想把网页里看到的 buddy 结果，直接带到本地 CLI 的人

## 为什么会有人需要它

Claude Code 的 `/buddy` 结果并不是手动点名出来的，很多时候更像是在一堆候选里抽到某个结果。AnyBuddy 的作用，就是把这个过程变成可控的选择流程。

如果你在意下面这些事，这个工具会更顺手：

- 你想要特定的 species，而不是随缘抽到一个
- 你想要特定的 rarity，比如 legendary 或 epic
- 你已经在网页里看到某个 exact buddy variant，想把它带回本地继续用
- 你在找一个更像 `buddy reroll` 的入口，而不是从头猜运气

## How it works

Claude Code 会用 `wyhash`，并以你的 `user ID` 和一个全局 `salt` 作为种子来分配 buddy。AnyBuddy 预先生成了一张 lookup table，所以你可以直接按 `species + rarity` 搜索，再拿到匹配的 `user ID`。

这一切都在浏览器里完成，不需要把你的选择过程交给外部服务。

## Use cases

- 你想固定一个 legendary duck，而不是每次都重新抽。
- 你在网站上找到了一个 exact variant，想立刻应用到本地 Claude 配置。
- 你更习惯终端工作流，希望从网页查找自然切到 CLI 执行。

## CLI

`anybuddy` 是一个 one-click Claude Code buddy configurator。它会根据你选的 `species` 和 `rarity`，找到匹配的 `user ID`，然后把结果应用到本地 Claude 配置里。

需求很简单：

- Node.js 18 或更新版本
- 已安装 Claude Code CLI: `npm install -g @anthropic-ai/claude-code`

常用命令：

```bash
npx @openlor/anybuddy --list
npx @openlor/anybuddy --species dragon --rarity epic
npx @openlor/anybuddy --help
```

如果你想看完整的 CLI 流程和发布说明，请看 [packages/cli/README.md](packages/cli/README.md).

## FAQ

### AnyBuddy 是什么？

AnyBuddy 是一个让你更容易选择 Claude Code buddy 的工具。它支持按 `species` 和 `rarity` 查找，并返回可用的 `user ID`。

### AnyBuddy 可以指定 Claude Code buddy 吗？

可以。它的核心目标就是让你不必只靠运气抽到想要的 buddy，而是可以直接找目标结果。

### AnyBuddy 算不算 Claude Code buddy reroll tool？

可以把它理解成一种 buddy reroll 辅助工具，但它更准确地说是一个选择和查找工具，而不只是“重抽”。

### 为什么选择 buddy 需要 user ID？

因为 Claude Code 的 buddy 分配逻辑和 `user ID` 有关。AnyBuddy 通过查找与目标结果匹配的 `user ID`，让你能稳定复现那个 buddy。

### AnyBuddy 和 CLI 怎么配合使用？

先在网站上按 `species + rarity` 找到你想要的 buddy，再用 CLI 把对应的 `user ID` 应用到本地。

### AnyBuddy 会修改哪些 Claude Code 配置？

CLI 会更新你的 `~/.claude.json`，并把 `CLAUDE_CODE_OAUTH_TOKEN` 持久化到你的 shell rc 文件里，方便后续直接使用 `/buddy`。

## Acknowledgements

Thanks to Linux.do user [nemomen](https://linux.do/u/nemomen) for the buddy reroll idea. 感谢其提供的 buddy reroll 思路。

## License

MIT
