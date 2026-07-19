# Agent surface notes

Snapshot date: 2026-07-19.

via should install through the smallest native surface each agent already understands. The public README stays short; this file records platform decisions and the reasoning behind them.

## Decision

Keep via's public installation path as a copy-paste prompt:

```text
Read https://github.com/p-to-q/via/blob/main/skills/via-route/SKILL.md and follow the instructions to install and configure via.
```

That prompt is for the user's model or coding agent, not for the human to read manually. `SKILL.md` remains the entrypoint because it already points to the renderer, validator, RouteSpec contract, schema, and evaluation guide.

Use `/via` as the short chat-box wake phrase in surfaces that support slash-style user commands. Use natural language when the model can infer the route-planning intent. Use the native skill name where the host has a stronger convention.

## Surface behavior

| surface | native mechanism | via stance |
| --- | --- | --- |
| Codex | Skills live under `CODEX_HOME` and can be invoked by skill name; plugin skills use `$plugin:skill`-style names in documented examples. | Keep `$via-route` for direct Codex Skill invocation. Keep `/via` as a conversational wake phrase, not as a claim about Codex CLI command registration. |
| ChatGPT / Codex app | Users can type ordinary prompts in the chat box; plugins and Skills may expose their own names depending on the active surface. | `/via` is the product mnemonic: a tiny phrase the model can recognize without extra setup. |
| Claude Code | Skills are directories with `SKILL.md`; Claude can auto-load relevant skills or users can invoke `/skill-name`. Custom command files are now merged into Skills. | A Claude adapter should install via as `.claude/skills/via/SKILL.md` or symlink it, giving the user `/via` naturally. |
| OpenCode | OpenCode discovers `SKILL.md` under `.opencode/skills`, `.claude/skills`, or `.agents/skills`, and loads skills through its `skill` tool. It also supports `.opencode/commands/*.md` slash commands. | Prefer the cross-host `.agents/skills/via-route/SKILL.md` or `.opencode/skills/via/SKILL.md`; add an optional `/via` command wrapper only if a team wants a visible command. |
| Aider | Aider documents built-in in-chat slash commands, but not a first-class Skill folder contract like Claude Code/OpenCode. | Treat via as a CLI plus prompt convention here: install `via`, then ask the agent to use the copied Skill prompt or natural language. |
| OpenCloud / OpenClaw-like names | No stable official source was found during this pass for a broadly adopted coding-agent Skill contract under these names. | Do not ship README claims for them. Add an adapter only after a concrete official surface is identified. |

## Why this shape

via is not trying to become a universal command framework. The durable thing is the RouteSpec contract plus the renderer. Each host can decide how the user invokes it:

- native Skill loading where available;
- a slash command wrapper where the surface supports custom slash commands;
- natural language for capable agents;
- CLI rendering when the host cannot load Skills.

The Skill body should stay light. The prompt should activate model judgment with a few high-leverage hints—think carefully, understand intent from first principles, follow model intuition, form three meaningful options when real choices exist, encode the visual—then rely on validation and rendering scripts for determinism. The agent still gives its normal user-facing analysis, route explanations, recommendation, and feedback. The SVG is an added interface, not a replacement response.

Do not override host-native reasoning presentation. A host may show thinking progress, tool activity, a processed panel, or a reasoning summary while the model works. via leaves those surfaces intact and follows the host's policy on private internal reasoning; it neither requires nor disables a raw chain-of-thought transcript.

The three-option default follows a familiar model communication pattern rather than forcing a new reasoning pattern. Claude Artifacts is a useful interaction precedent for generating a visual alongside an answer. via adds a RouteSpec fixture so the model has a clear shape for this particular engineering map.

via is also an alternative interface for the Plan-mode moment. Match Plan mode's useful scale—context gathering, consequential clarification, task-appropriate reasoning, and planning before implementation—then add the route map. Do not claim that the Skill controls host permissions, a read-only runtime, reasoning effort, or thinking UI. When a host supports a planning-specific reasoning setting, leave that choice to the host or user rather than simulating it with a longer prompt.

## Sources checked

- Codex manual fetched from OpenAI docs on 2026-07-19: `https://developers.openai.com/codex/codex-manual.md`
- Claude Code Skills: `https://code.claude.com/docs/en/skills`
- Claude Artifacts overview: `https://www.anthropic.com/news/artifacts`
- Codex planning best practices: `https://learn.chatgpt.com/guides/best-practices`
- Codex configuration sample (`plan_mode_reasoning_effort`): `https://learn.chatgpt.com/docs/config-file/config-sample`
- Codex `/plan` command: `https://learn.chatgpt.com/docs/developer-commands`
- OpenCode Skills: `https://opencode.ai/docs/skills/`
- OpenCode Commands: `https://opencode.ai/docs/commands/`
- Aider in-chat commands: `https://aider.chat/docs/usage/commands.html`
