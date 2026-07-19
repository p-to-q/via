# RouteSpec 0.3

RouteSpec is the serialization contract for the renderer, not a planning method or a replacement for the written answer. Use model judgment to understand and compare the work first, choose a topology that matches the work, then encode the additional visual as one graph. Give the user the useful route explanations, recommendation, and feedback separately. Validate against [route-spec.schema.json](route-spec.schema.json), then run the bundled structural validator.

## Shape

```json
{
  "schemaVersion": "0.3",
  "destination": "Ship passkeys without breaking mobile",
  "routes": [
    {
      "id": "dual-session",
      "label": "Dual session",
      "color": "cyan",
      "recommended": true,
      "tokens": { "min": 5000, "max": 9000 },
      "minutes": { "min": 35, "max": 70 },
      "summary": "Add passkeys behind the current session contract"
    }
  ],
  "graph": {
    "terminals": {
      "origins": {
        "dual-session": "legacy-auth",
        "gateway": "legacy-auth",
        "cutover": "new-release"
      },
      "destinations": {
        "dual-session": "stable-passkeys",
        "gateway": "gateway-plan",
        "cutover": "cutover-plan"
      }
    },
    "nodes": [
      { "id": "legacy-auth", "label": "legacy auth", "column": 0, "lane": 2 },
      { "id": "contract", "label": "lock contract", "column": 1, "lane": 2, "gate": "yellow", "control": "boundary" }
    ],
    "edges": [
      { "from": "audit", "to": "contract", "routes": ["dual-session", "gateway", "cutover"] }
    ]
  }
}
```

The excerpt illustrates fields; a valid spec needs exactly three complete route objects, 5–18 nodes, and 4–28 edges. `destination` is the map's visible title: generate it from the task in the style of a clear PR title, not a fixed slogan. Omit `graph.terminals` for the common case where all routes share one origin and one destination. Add it only when routes genuinely start from different current states or lead to different outcomes. Use `examples/web-coder-route.json` from the repository as a complete specimen when available.

## Atoms

- `node`: one action at a fixed integer `column` (0–9) and `lane` (0–4)
- `edge`: a forward dependency between node IDs
- `route`: an identity carried by edges
- `terminal`: optional per-route origin and destination node IDs
- `gate`: optional local node state: `green`, `yellow`, or `red`
- `control`: an auditable engineering stop: `decision`, `proof`, `boundary`, or `release`
- `cost`: non-negative token and minute ranges

The renderer displays the origin role as `START` and the destination role as `DONE`; those role labels are fixed. The node labels underneath are not fixed. Use the origin node label to name where the user is starting from: from scratch, a prototype, a failing build, an existing design round, a draft repo, or whatever stage the context supports. Use the destination node label to name the concrete state this run can produce: validated patch, roadmap, migration plan, release ready, narrowed investigation, and so on. Avoid generic labels like `intent` and `ship` unless they are genuinely the most specific available terms.

## Route

Each route requires:

- lowercase kebab-case `id`
- `label` up to 22 characters
- unique `color` chosen from `blue`, `orange`, `green`, `pink`, `purple`, and `cyan`
- exactly one route with `recommended: true`
- `tokens` and `minutes` objects with `min <= max`
- `summary` up to 54 characters

The renderer derives the card's `checks` count from unique route nodes with a `control` value. Do not enter a route total by hand, and do not add controls merely to inflate the number. A route may legitimately have zero route-specific controls; shared controls still count when its path passes through them.

Choose any three distinct route colors when creating a new spec. The choice may vary between newly generated maps, but it is written into RouteSpec and must remain stable across every re-render of that map.

Time ranges compare anticipated active work, including inspection, edits, dependencies, and verification. Widen ranges when repository state, external systems, or proof work is uncertain; do not imply precision unsupported by evidence.

## Graph

Each node requires `id`, `label`, `column`, and `lane`. No two nodes may occupy the same position.

Each edge requires `from`, `to`, and one to three route IDs. Set `kind: branch` only for a genuine local detour, parallel probe, optional proof, or small implementation offset. Branch edges render dashed.

Without `graph.terminals`, the structural validator requires:

- one origin and one destination;
- every route to connect the common origin and destination.

With `graph.terminals`, declare every route's visible start and finish:

```json
"terminals": {
  "origins": {
    "route-a": "scratch",
    "route-b": "prototype",
    "route-c": "incident"
  },
  "destinations": {
    "route-a": "mvp-ready",
    "route-b": "patch-ready",
    "route-c": "cause-known"
  }
}
```

Each terminal value must be a node ID. A route's origin must have no incoming edge for that route, and its destination must have no outgoing edge for that route. Different routes may still share the same origin or destination by pointing to the same node ID.

Every visible node must participate in an edge, each route must move between two different terminal nodes, and one `from → to` connection appears only once. When routes share that connection, put all relevant route IDs on the same edge.

Use judgment for semantic topology. Show shared nodes where work genuinely overlaps, unique edges where approaches genuinely differ, and branches only for real detours or parallel probes. A good graph does not need to split all three routes at the same column or merge them all at the same moment. It may use:

- different origin nodes when the options begin from different assumptions, assets, or existing states;
- different destination nodes when the options intentionally produce different useful outcomes;
- a long shared trunk with one or two small route-specific offsets;
- a two-route shared segment while the third route stays separate;
- a dashed probe that leaves and rejoins the same route;
- an early merge for a lightweight option and a later merge for a heavier option;
- several small checkpoints when the user's choice depends on sequencing or proof.

Do not force this variety. Use it only when it represents the task better than a simple fork. Mark meaningful proofs with `control: proof`; never change labels merely to satisfy a keyword.

Keep detailed user-facing analysis outside the graph and include it in the written response. Visible graph text must remain short enough to scan.
