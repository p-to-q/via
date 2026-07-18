# RouteSpec 0.2

RouteSpec is one graph, not three prose plans. Validate against [route-spec.schema.json](route-spec.schema.json), then run the bundled structural validator.

## Shape

```json
{
  "schemaVersion": "0.2",
  "destination": "Ship passkeys without breaking mobile",
  "routes": [
    {
      "id": "dual-session",
      "label": "Dual session",
      "color": "lime",
      "recommended": true,
      "tokens": { "min": 5000, "max": 9000 },
      "minutes": { "min": 35, "max": 70 },
      "gates": 1,
      "summary": "Add passkeys behind the current session contract"
    }
  ],
  "graph": {
    "nodes": [
      { "id": "audit", "label": "audit clients", "column": 0, "lane": 2 },
      { "id": "contract", "label": "lock contract", "column": 1, "lane": 2, "gate": "yellow" }
    ],
    "edges": [
      { "from": "audit", "to": "contract", "routes": ["dual-session", "gateway", "cutover"] }
    ]
  }
}
```

The excerpt illustrates fields; a valid spec needs exactly three complete route objects, 5–18 nodes, and 4–28 edges. Use `examples/web-coder-route.json` from the repository as a complete specimen when available.

## Atoms

- `node`: one action at a fixed integer `column` (0–9) and `lane` (0–4)
- `edge`: a forward dependency between node IDs
- `route`: an identity carried by edges
- `gate`: optional local node state: `green`, `yellow`, or `red`
- `cost`: non-negative token and minute ranges

## Route

Each route requires:

- lowercase kebab-case `id`
- `label` up to 22 characters
- unique `color`: `lime`, `violet`, or `amber`
- exactly one route with `recommended: true`
- `tokens` and `minutes` objects with `min <= max`
- integer `gates` from 0–9
- `summary` up to 54 characters

## Graph

Each node requires `id`, `label`, `column`, and `lane`. No two nodes may occupy the same position.

Each edge requires `from`, `to`, and one to three route IDs. Set `kind: branch` only for a genuine local detour or parallel probe.

The structural validator also requires:

- one origin and one destination;
- every route connects origin to destination;
- at least two edges shared by several routes;
- at least one unique edge per route;
- at least one branch edge;
- at least one visible proof checkpoint whose label includes test, verify, validate, proof, or check.

Keep deeper reasoning outside the graph. Visible text must remain short enough to scan.
