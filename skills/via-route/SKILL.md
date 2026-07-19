---
name: via-route
description: Generate and render a compact Git-tree map for an engineering task with three materially different routes, shared steps, local branches, blocked points, and token/time ranges. Use before ambiguous, expensive, risky, or hard-to-reverse implementation work, or when the user asks for routes, architecture options, a token map, or visual planning. Skip factual questions, tiny edits, and tasks whose path is already fixed.
---

# via route

Create the map yourself. Do not make the user assemble JSON or run commands.

1. Inspect only enough evidence to distinguish real paths.
2. Identify shared actions first, then unique route segments, local branches, and the final shared proof.
3. If fewer than three credible paths exist, skip the map instead of inventing one.
4. Write RouteSpec 0.3 using [references/route-spec.md](references/route-spec.md) and its bundled [JSON Schema](references/route-spec.schema.json).
5. Resolve `SKILL_DIR` to the directory containing this `SKILL.md`.
6. Run `node "$SKILL_DIR/scripts/validate-route.mjs" <spec.json>` and fix every error.
7. Run `node "$SKILL_DIR/scripts/render-route.mjs" <spec.json> <map.svg>`.
8. Show the SVG first. Add at most two sentences only when a blocking gate needs explanation.

## Keep it useful

- Put actions in nodes, not paragraphs.
- Reuse nodes and edges when routes share work.
- Add a small branch only when a route contains a genuine detour or parallel check.
- Keep visible labels concrete and under the contract limits.
- Pick three distinct colors from blue, orange, green, pink, purple, and cyan when creating a map. Write the choices into RouteSpec so re-rendering stays stable. Use the bright color on the Git tree and its accessible dark companion on route-name text. Keep card frames neutral.
- Keep the red/yellow/green window lights decorative. Put real gate state only on graph nodes.
- Use token/time ranges, never exact predictions.
- Estimate active agent work, not human calendar time: use roughly 5–12 minutes for a small bounded path, 10–25 for a multi-surface path, and 20–45 for runtime or integration work. Widen only when evidence justifies it.
- Never expose hidden chain-of-thought.

For forward testing, use [references/eval.md](references/eval.md).
