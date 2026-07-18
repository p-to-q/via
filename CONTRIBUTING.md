# Contributing

via has one job: turn an engineering task into a Git-tree map. Changes should make that map faster to understand, easier to generate, or more reliable to render.

## Development

Requirements: Node.js 20 or newer. The project has no runtime dependencies.

```bash
npm install
npm test
npm run build:example
```

Open `example-output/route.svg` after changing the renderer. Tests prove graph invariants; they do not prove visual quality.

## Pull requests

- Keep `SKILL.md` short and move deterministic behavior into scripts.
- Add a failing test before changing a graph invariant.
- Update `skills/via-route/references/route-spec.schema.json`, the validator, the contract reference, and the example together when RouteSpec changes.
- Do not add required network calls or model-vendor dependencies to rendering.
- Do not present exact token estimates as measurements.

Small, focused pull requests are easiest to review.
