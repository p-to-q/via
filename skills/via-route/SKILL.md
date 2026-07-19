---
name: via-route
description: Generate and render a compact Git-tree comparison for open-ended planning questions. Use when the user asks how to approach, plan, architect, redesign, migrate, investigate, or choose a path, or explicitly asks for options, routes, a token map, or visual planning. Default to three useful options when the task genuinely permits choice. Skip factual questions, tiny edits, and tasks whose path is already fixed.
---

# via route

Turn an open planning question into three options and a detailed route map. Use your own judgment to understand the task. RouteSpec constrains what is displayed, not how you reason. Create the artifact yourself; do not make the user assemble JSON or run commands.

Before proposing routes, think deeply about the user's intent and purpose. Look beyond the literal request to understand the outcome they are actually trying to achieve, using context and evidence without inventing hidden requirements. Then use your own judgment to form three genuinely useful ways forward.

## Create the map

1. Use the available context and your engineering intuition to understand the task. Inspect evidence in proportion to uncertainty and risk; do not research merely to fill the map.
2. For an open planning question, naturally propose three useful options. Treat three as the interface default, not a demand to fabricate distinctions: if the task truly has fewer viable directions, continue normally and say so.
3. Choose and recommend the options from the user's goal, constraints, and likely journey through the work. Let meaningful differences emerge from the problem—such as boundary, dependency strategy, reversibility, learning path, risk, or proof—rather than forcing a taxonomy or generic quick/balanced/robust labels.
4. Encode the result as RouteSpec 0.3 using [the contract](references/route-spec.md) and bundled [JSON Schema](references/route-spec.schema.json). Write `destination` as a short model-generated title for what this map is about, similar to a clear PR title. Share, split, branch, and merge nodes only where the real work does.
5. Resolve `SKILL_DIR` to this Skill directory. Validate with `node "$SKILL_DIR/scripts/validate-route.mjs" <spec.json>`, repair structural errors, then render with `node "$SKILL_DIR/scripts/render-route.mjs" <spec.json> <map.svg>`.
6. Present the SVG first. Keep any additional response brief and include it only when decision-critical context cannot fit in the map. Do not repeat generic instructions like choosing, combining, or customizing routes after every render.

## Map what matters

- A node is a concrete action or checkpoint, not hidden reasoning.
- The origin node names the user's current starting state, such as `from scratch`, an existing stage, or the live artifact being continued. The destination node names what this run can leave behind, not an abstract finish line.
- Preserve real overlap between routes. Do not manufacture symmetry, branches, merges, or checks for visual richness.
- Make the selected route startable and summaries useful for choosing.
- Pick three distinct colors from blue, orange, green, pink, purple, and cyan when creating a map. Write the choices into RouteSpec so re-rendering stays stable. Use the bright color on the Git tree and its accessible dark companion on the time label. Keep route names, primary metrics, and card shells neutral.
- Use broad token/time ranges as comparative estimates. Base them on anticipated inspection, change surface, dependencies, and verification; widen them for uncertainty rather than implying precision.
- `control` marks a meaningful decision, boundary, proof, or release checkpoint. The number beside the traffic-signal glyph counts these checkpoints; its two lenses are pictographic, not status indicators.
- Keep visible labels concrete and scan-friendly.
- Never expose hidden chain-of-thought.

Read the contract when composing or repairing RouteSpec. Use [the evaluation guide](references/eval.md) only for forward testing, not as a generation checklist.
