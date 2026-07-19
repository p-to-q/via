# Changelog

## Unreleased

## 0.3.9 — 2026-07-19

- Replace the implementation-led tagline with `See the paths before you build.` and a supporting sentence.
- Use `A Git-tree/Google Map interface for vibe coding decisions.` for GitHub, npm, Plugin, and Skill product descriptions.
- Standardize visible organization copy as `[p → q]` while preserving repository URLs, npm scopes, and machine identifiers that use `p-to-q` or `ptoq.io`.
- Align Skill and Plugin UI metadata with the new product language.

## 0.3.8 — 2026-07-19

- Add a lightweight conversation lifecycle: enter on open decisions, continue normally after route selection, redraw only after material change, and exit when work becomes straightforward.
- State the schema effect as a product hypothesis: technical topology may become clearer while the model reasons, without prescribing its reasoning process.
- Combine ChatGPT, Codex, and Claude under one model-company / AI-native interface reference family.
- Keep adjacent design, architecture, agent-surface, and Skill-research documents in the npm package while relying on progressive disclosure to keep normal turns light.

## 0.3.7 — 2026-07-19

- Clarify via's design philosophy: preserve model autonomy and its useful written analysis while using RouteSpec as a lightweight scaffold for an additional visual, not a replacement response.
- Record Google Earth spatial overview alongside Google Maps route choice and Git Tree topology as an interface influence.
- Remove the two-sentence response ceiling and require the SVG to accompany—not compress—the model's route explanations, recommendation, tradeoffs, and implementation feedback.
- Update the Skill, RouteSpec guidance, evaluation criteria, product architecture, interface system, and agent-surface notes around the corrected output contract.
- Explain the three-route default as a familiar model communication pattern, and distinguish ChatGPT/Codex UI context, Claude's on-demand artifacts, and via's RouteSpec fixture.
- Keep host-native thinking and reasoning-summary surfaces untouched; via governs the additional visual rather than the model's internal reasoning display.
- Align via with the scale of Plan mode—context, consequential clarification, task-appropriate reasoning, then planning before implementation—while replacing only the text-only interface limitation.

## 0.3.6 — 2026-07-19

- Teach the Skill to choose a task-shaped graph topology instead of defaulting to a symmetrical three-way fork.
- Update the example RouteSpec/SVG to show shared trunks, two-route overlap, route offsets, and dashed probe branches.
- Add optional `graph.terminals` so routes can have distinct origin and destination nodes when the task calls for it.
- Attach START and DONE labels directly to their endpoint nodes so multiple p and q states remain legible.
- Reject isolated nodes, zero-length routes, and duplicate connections that would add visual structure without graph meaning.
- Synchronize README, RouteSpec, product architecture, and interface guidance with the more expressive graph contract.

## 0.3.5 — 2026-07-19

- Make the generated SVG identity quieter: lowercase `via`, `a [p → q] project`, and right-aligned `ptoq.io`.
- Keep `via` lowercase across user-facing documentation and example output.
- Add internal agent-surface research for Codex, Claude Code, OpenCode, Aider, and unresolved OpenCloud/OpenClaw-like targets.
- Add a warmer README explanation of what via helps humans and agents do before implementation.
- Keep README installation compact around the copy-paste agent prompt while moving platform-specific invocation notes to internal docs.
- Publish the first npm package from the maintainer scope as `@afkv/via` while the `@p-to-q` npm organization is prepared.
- Publish package contents are trimmed to runtime and core agent docs rather than the whole repository.

## 0.3.4 — 2026-07-19

- Document `/via` as the explicit chat-box wake-up phrase and `$via-route` as the direct Codex Skill invocation.
- Clarify that `SKILL.md` is the Skill entrypoint and provide a copy-paste prompt for another model or coding agent to read it and configure via.
- Clarify that `via -v` is a CLI version check, not the agent wake-up command.
- Keep npm install guidance conditional until `@p-to-q/via` is actually published to the registry.

## 0.3.3 — 2026-07-19

- Document common wake-up patterns across coding-agent surfaces: Codex `$via-route`, ChatGPT-style `/via`, Claude Code-style `/via`, and natural-language route planning.
- Clarify that `via -v` is a CLI version check, not the agent wake-up command.
- Keep npm install guidance conditional until `@p-to-q/via` is actually published to the registry.

## 0.3.2 — 2026-07-19

- Tag the post-0.3.1 visual rhythm pass: tighter token/time metric grouping and regenerated README SVG.
- Keep `START` and `DONE` as fixed endpoint roles while making their captions model-generated origin and achieved-state labels.
- Replace generic example endpoint labels with concrete `from scratch` and `release ready` captions.
- Document the ChatGPT/Codex-inspired interface philosophy: neutral shells, compact spacing, restrained radius, controlled elevation, and selective color.
- Update Skill and RouteSpec guidance so models choose meaningful origin/destination labels without adding a heavy framework.

## 0.3.1 — 2026-07-19

- Restore neutral route names and card shells, color only time labels, and strengthen the lane guides.
- Remove the repeated choice hint from the SVG surface, swap the traffic-light/check-count order, and make START/DONE read as stronger semantic endpoints.
- Move the selector up into symmetric 16 px nesting and contain its heavier shadow within the SVG canvas.
- Treat RouteSpec as a display contract rather than a reasoning recipe; remove forced branches, overlap, checks, English proof keywords, and fixed time anchors from validation and generation guidance.
- Make open-ended planning the natural trigger for three options while preserving the model's intuition about what genuinely differs.
- Add a short intent-and-purpose reflection before route formation without introducing another checklist.
- Synchronize Plugin and package versions for release validation.

## 0.3.0 — 2026-07-19

- Upgrade RouteSpec to 0.3: replace hand-entered route gate totals with engineering checks derived from decision, proof, boundary, and release nodes.
- Remove card-top color rails; carry route identity in accessible route-name colors derived from Codex's public visualization family.
- Expand route identity to a six-color Codex-derived pool; each new map selects three distinct colors and persists them in RouteSpec.
- Move route color from card names to time labels and route-colored outlines; lengthen and strengthen graph lane guides.
- Recalculate the selector as a symmetric 16/15 px enclosure around three 320 × 132 cards and strengthen its composer-like shadow.
- Use `Choose how this gets built` as the runtime prompt and show the user's task as its subtitle.
- Align the portable surface, type scale, spacing, radii, and separators with the quiet neutral grammar of the Codex desktop interface.
- Give the route selector one composer-like soft perimeter and a 20 px parent radius while keeping individual cards flat.
- Document the static SVG and interactive HTML delivery boundary.
- Rework the option tray around a calm maps-style information hierarchy without copying a familiar Material selection card.
- Introduce the balanced Harbor palette and continue each Git-tree route as a short top rail on a neutral option plaque.
- Replace the `gates` label and RGB capsule with a custom monochrome, two-lamp traffic-light pictogram based on common road-signal geometry.
- Recalibrate example time ranges to active agent work.

## 0.2.0 — 2026-07-19

- Replace independent route lanes with a shared DAG.
- Require overlap, unique route segments, a local branch, one destination, and a proof checkpoint.
- Add deterministic SVG rendering with window chrome and reduced-motion support.
- Add `via build` to write SVG, JSON, and Markdown artifacts.
- Add Codex Skill and Plugin packaging, eval cases, and release checks.
