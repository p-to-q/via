# via 0.3

## The product

Input: one engineering task.

Output: one Git-tree map showing three paths through that task.

## Atoms

- point: an action
- link: a dependency
- route: links forming a viable path
- gate: a local red/yellow/green condition attached to a point
- check: a decision, proof, boundary, or release control derived from route nodes
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

The window lights are chrome, not data. Three distinct colors drawn from the six-color route pool identify routes in the tree. Gate dots are local conditions. Copy stays inside node labels and three cards.

The option tray borrows the calm hierarchy of a maps product without copying its structure. Three plaques sit on a shared route dock. Route names and card shells stay neutral while time labels carry the same brand color as the Git tree. The selected route adds only a quiet tint and a neutral outline. Each plaque has one dominant number, one compact time-and-check row, and one short status line. The renderer derives checks from route nodes marked as decisions, proofs, boundaries, or releases, then places a monochrome two-lamp traffic-light pictogram before the count and label.

Typography, spacing, surfaces, alignment, and static-versus-interactive delivery are defined in [the interface system](design-system.md).

## Motion

The static SVG is always complete. In compatible viewers, a subtle dotted current moves along links and the window controls respond on hover. Reduced-motion users receive the static state.

## Runtime

The Skill inspects the task, writes RouteSpec, validates it, renders it, and presents the SVG. The CLI also writes `route.json` and `route.md`, so the graph documents itself without asking the user to assemble artifacts.
