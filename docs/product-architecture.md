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

The window lights are chrome, not data. Route color is identity. Gate dots are local conditions. Copy stays inside node labels and three cards.

## Motion

The static SVG is always complete. In compatible viewers, a subtle dotted current moves along links and the window controls respond on hover. Reduced-motion users receive the static state.

## Runtime

The Skill inspects the task, writes RouteSpec, validates it, renders it, and presents the SVG. The CLI also writes `route.json` and `route.md`, so the graph documents itself without asking the user to assemble artifacts.
