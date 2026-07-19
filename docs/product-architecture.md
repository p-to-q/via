# via 0.3

## The product

Input: one engineering task.

Output: one Git-tree map showing three paths through that task.

The smallest useful version of via is simple: the model offers useful paths and the user gets a picture instead of a long planning answer. Compact representation can avoid token expenditure on repeated explanation while making the decision easier to scan.

Underneath that interface, via is a lightweight scaffold for both the developer and the model. Its ChatGPT-like surface keeps the artifact natural inside coding agents, while the spatial navigation language of Google Maps and Google Earth and the topology of a Git Tree turn the model's existing judgment into structured context that is easier to compare and use in programming work.

The scaffold has a strict boundary. The prompt encourages careful intent reading, first-principles understanding, and model intuition, but does not prescribe a reasoning procedure. RouteSpec organizes the visible answer. Deterministic scripts validate and render it. Stronger models retain room to do what they already do well; less capable models receive a few useful directional cues without a heavy rubric.

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

The Skill inspects the task, writes only the visible decisions into RouteSpec, validates it, renders it, and presents the SVG. The CLI also writes `route.json` and `route.md`, so the graph documents itself without asking the user or model to repeatedly explain the format.
