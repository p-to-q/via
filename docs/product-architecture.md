# via 0.2

## The product

Input: one engineering task.

Output: one Git-tree map showing three paths through that task.

## Atoms

- point: an action
- link: a dependency
- route: links forming a viable path
- gate: a condition attached to a point
- cost: token and time ranges along a route

Everything visible must represent one of these atoms.

## Screen

```text
┌ ● ● ● ── VIA / ROUTE ──────────────────────┐
│ destination                                  │
│                                              │
│      ○──○━━━━○━━━━━━━━○                      │
│ ○━━━━○━━○────○──╮──○──╯━━○                  │
│          ╰━━━━○━╯                            │
│                                              │
│ [ route / cost ] [ route / cost ] [ route ] │
└──────────────────────────────────────────────┘
```

The window lights are chrome, not data. Petrol, plum, and amber identify routes in the tree. Gate dots are local conditions. Copy stays inside node labels and three cards.

The option tray borrows the calm hierarchy of a maps product without copying its structure. Three plaques sit on a shared route dock. Each uses a neutral 1 px frame and a short route-colored rail embedded in its top edge; the selected route adds a quiet tint and a slightly darker neutral frame. This seam is the visual continuation of the Git tree, not a standard Material selection card. Each plaque has one dominant number, one compact time-and-gate row, and one short status line. The gate count appears before a monochrome two-lamp traffic-light pictogram; the word `gates` is never shown.

Typography, spacing, surfaces, alignment, and static-versus-interactive delivery are defined in [the interface system](design-system.md).

## Motion

The static SVG is always complete. In compatible viewers, a subtle dotted current moves along links and the window controls respond on hover. Reduced-motion users receive the static state.

## Runtime

The Skill inspects the task, writes RouteSpec, validates it, renders it, and presents the SVG. The CLI also writes `route.json` and `route.md`, so the graph documents itself without asking the user to assemble artifacts.
