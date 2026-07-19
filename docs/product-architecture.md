# via 0.3

## The product

Input: one engineering task.

Output: one Git-tree/Google Map interface showing three paths through that task.

The smallest useful version of via is simple: the model reasons about useful paths, gives its normal planning answer, and adds a picture. The visual is a second representation of the decision, not a compressed substitute for the model's route explanations, recommendation, or feedback.

Each path surfaces three compact decision signals: estimated tokens, anticipated time, and a concise route summary that captures what makes the path useful. These signals help the user compare paths without replacing the fuller explanation below the map.

Three paths build on a familiar model interaction pattern: after reasoning about an open question, models often communicate the result as three comparable options, and users already understand how to read that shape. via makes it a default interface contract when three real choices exist. It does not claim every task has three answers or require the model to manufacture one.

Underneath that interface, via is a lightweight scaffold for both the developer and the model. AI-native interfaces from model companies—including ChatGPT, Codex, and Claude—form one reference family: quiet conversational UI, visible coding work, native reasoning surfaces, and on-demand visual artifacts. Google Maps and Google Earth contribute spatial navigation; Git Tree contributes engineering topology.

via adds one simple mechanism: each run puts the visible routes into a RouteSpec fixture, then the renderer creates the SVG. The schema reduces uncertainty about how the model should organize and express the engineering structure. The content and topology remain open to the model.

## Schema hypothesis

The product hypothesis is that a light output schema can improve the work before rendering. Expressing a plan as nodes, dependencies, shared segments, branches, checks, origins, and outcomes may encourage the model to resolve technical relationships more clearly and form a more principled topology. This is a direction for product evaluation, not a claim that the schema replaces reasoning or always improves it.

The prompt therefore provides only the schema and a few high-leverage cues. The model remains free to use its own intuition, reasoning depth, evidence, and vocabulary. The human receives both the normal explanation and the graphical interface.

The scaffold has a strict boundary. The prompt encourages careful intent reading, first-principles understanding, and model intuition, but does not prescribe a reasoning procedure. RouteSpec organizes the additional visual. Stronger models retain room to do what they already do well; less capable models receive a few useful directional cues without a heavy rubric. Neither is asked to trade away useful written analysis for visual brevity.

Reasoning presentation belongs to the host. via does not suppress a ChatGPT/Codex-style processed panel, progress trace, or host-provided reasoning summary, and it does not demand a private raw chain-of-thought transcript. The model reasons according to its native capabilities and policy; via adds a fixture and visual to the normal result.

## Plan-scale reference

via targets the same product moment as Codex Plan mode: complex or ambiguous work before implementation. OpenAI's current guidance describes Plan mode as gathering context, asking clarifying questions, and building a stronger plan before coding. Codex also permits a separate `plan_mode_reasoning_effort`, while recommending that reasoning effort rise only when a task needs more planning, analysis, or checking.

via adopts the useful scale, not the whole runtime:

- understand relevant context before forming routes;
- ask only questions whose answers would materially change the plan;
- let the host and model choose suitable reasoning depth;
- return the plan before implementation unless implementation was also requested;
- keep the model's normal explanations and feedback;
- add RouteSpec and the map as the planning interface.

Permissions, read-only execution, reasoning controls, and thinking panels remain responsibilities of the host. Sources: [Codex best practices](https://learn.chatgpt.com/guides/best-practices), [Codex configuration sample](https://learn.chatgpt.com/docs/config-file/config-sample), and [Codex developer commands](https://learn.chatgpt.com/docs/developer-commands).

## Conversation lifecycle

via is event-like, not a mode that captures the rest of the conversation:

- **Enter:** use it when the current turn contains a real open planning decision.
- **Continue:** after the user chooses a route, follow that route normally and treat the existing map as context.
- **Redraw:** generate a new map only when changed goals, constraints, evidence, or options materially alter the topology.
- **Exit:** stop applying the route framework when the work narrows to implementation, a small edit, or a factual answer.

The model decides this from each current turn and the conversation context. Do not store via state, ask the user to switch it off, or decide in advance whether a future turn must use it.

## Atoms

- point: an action
- link: a dependency
- route: links forming a viable path
- terminal: a route's origin or destination; shared by default, explicit when routes have different p or q
- gate: a local red/yellow/green condition attached to a point
- check: a decision, proof, boundary, or release control derived from route nodes
- cost: token and time ranges along a route

Everything visible must represent one of these atoms.

## Screen

```text
┌ ● ● ● ── via · a [p → q] project ── ptoq.io ┐
│ destination                                  │
│                                              │
│      ○──○━━━━○━━━━━━━━○                      │
│ ○━━━━○━━○────○──╮──○──╯━━○                  │
│          ╰━━━━○━╯                            │
│                                              │
│ [ route / cost ] [ route / cost ] [ route ] │
└──────────────────────────────────────────────┘
```

The window lights are chrome, not data. Three distinct colors drawn from the six-color route pool identify routes in the tree. Gate dots are local conditions. Copy stays inside node labels and three cards.

The screen above is illustrative, not a prescribed topology. A valid map may share its p and q, share only one of them, or use different origin and destination nodes for each route. The renderer attaches endpoint roles to the actual nodes so the visual surface does not imply overlap that the graph does not contain.

The option tray borrows the calm hierarchy of a maps product without copying its structure. Three plaques sit on a shared route dock. Route names and card shells stay neutral while time labels carry the same brand color as the Git tree. The selected route adds only a quiet tint and a neutral outline. Each plaque has one dominant number, one compact time-and-check row, and one short status line. The renderer derives checks from route nodes marked as decisions, proofs, boundaries, or releases, then places a monochrome two-lamp traffic-light pictogram before the count and label.

Typography, spacing, surfaces, alignment, and static-versus-interactive delivery are defined in [the interface system](design-system.md).

## Motion

The static SVG is always complete. In compatible viewers, a subtle dotted current moves along links and the window controls respond on hover. Reduced-motion users receive the static state.

## Runtime

The Skill inspects the task, forms and explains the routes, writes their visible engineering structure into RouteSpec, validates it, renders it, and presents the SVG alongside the written answer. The CLI also writes `route.json` and `route.md`, so the graph documents its structure without making the user or model repeatedly explain the rendering format.
