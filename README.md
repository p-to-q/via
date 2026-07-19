# via

[![CI](https://github.com/p-to-q/via/actions/workflows/ci.yml/badge.svg)](https://github.com/p-to-q/via/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-17181d.svg)](LICENSE)

Turn an engineering task into a Git-tree map.

```text
Read https://github.com/p-to-q/via/blob/main/skills/via-route/SKILL.md and follow the instructions to install and configure via.
```

![via route map](assets/web-coder-route.svg)

Three routes. Real overlap. Local branches. Distinct starts or outcomes when the task calls for them. Token and time ranges.

At its simplest, via asks a model for the useful paths and gives you a picture instead of a wall of planning text. The compact map makes the alternatives easier to scan and can avoid spending tokens on repetitive prose that does not help the decision.

via keeps the prompt light. It nudges the model to think carefully, understand the user's real intent, and work from the task itself, then leaves the model room to use its own judgment. RouteSpec constrains the visible result—not the model's reasoning—and the bundled scripts handle validation and SVG rendering.

The interface borrows three ideas without copying any one product: the quiet, readable feel of ChatGPT/Codex; the spatial and route-choice intuition of Google Maps and Google Earth; and the branching/merging topology of a Git tree. The result is a user-friendly planning surface for humans and a small, programming-native scaffold for agents.

## Install

via requires Node.js 20 or newer and has no runtime dependencies.

### Skill entrypoint

via is loaded through [`skills/via-route/SKILL.md`](skills/via-route/SKILL.md). That file is the Skill entrypoint: it tells the agent when to use via and links to the RouteSpec contract, JSON Schema, evaluator, and renderer scripts.

To install and configure via inside another coding agent, paste this prompt into that agent:

```text
Read https://github.com/p-to-q/via/blob/main/skills/via-route/SKILL.md and follow the instructions to install and configure via.
```

For Codex, you can also install the Skill from this GitHub repository with the Skill installer:

```text
$skill-installer install p-to-q/via skills/via-route
```

The installer places the Skill under `$CODEX_HOME/skills` and makes it available on the next turn.

You can also clone the repository and symlink the Skill manually:

```bash
git clone https://github.com/p-to-q/via.git
mkdir -p ~/.agents/skills
ln -s "$(cd via && pwd)/skills/via-route" ~/.agents/skills/via-route
```

### Wake it up

In a chat box, type `/via` to wake via explicitly:

```text
/via plan three ways to migrate this auth flow
```

In Codex Skill contexts, you can also name the installed Skill directly:

```text
$via-route plan three ways to migrate this auth flow
```

Advanced agents can also trigger via from natural language when the request is clearly route-style planning:

- "show me three routes for this implementation"
- "make a token map for this task"
- "compare architecture options before we build"
- "plan the migration paths and show the tradeoffs"
- "/via for this decision"

### Codex Plugin bundle

The repository contains a validated `.codex-plugin/plugin.json` for plugin packaging and marketplace submission. The first public release is installed as a Skill or CLI; it is not yet published in a Codex marketplace.

### CLI

Install the CLI from npm:

```bash
npm install --global @afkv/via
```

The source repository remains [`p-to-q/via`](https://github.com/p-to-q/via). The npm package is published from the maintainer scope while the `@p-to-q` npm organization is being prepared.

Or install directly from GitHub:

```bash
npm install --global github:p-to-q/via
```

Check the installed version:

```bash
via -v
```

Build any RouteSpec:

```bash
via build route.json --out via-output
```

Validate without rendering:

```bash
via validate route.json
```

The output documents itself:

```text
via-output/
├── route.svg
├── route.json
└── route.md
```

## Try the example

```bash
git clone https://github.com/p-to-q/via.git
cd via
npm install
npm run build:example
```

Open `example-output/route.svg`.

## How it works

The source is one directed graph:

- nodes are engineering checkpoints;
- edges carry one or more route IDs;
- shared edges create overlap;
- branch edges create local detours;
- routes may share all, some, or none of their path;
- routes normally share a start and finish, but may declare different origins or outcomes when that is true of the task;
- `START` and `DONE` are fixed endpoint roles attached to their graph nodes, while their captions are generated from the actual origin and achieved state.

The Skill creates the RouteSpec, validates it, renders it, and shows the SVG first. It skips tiny work and tasks without three credible paths.

This separation is deliberate: the model decides what the task means and which paths are useful; the schema organizes only what needs to be shown; the renderer turns that compact representation into the interface. via does not ask the model to follow a second reasoning system.

See the [RouteSpec contract](skills/via-route/references/route-spec.md), [example graph](examples/web-coder-route.json), [product architecture](docs/product-architecture.md), [interface system](docs/design-system.md), and [agent surface notes](docs/agent-surfaces.md).

## What via does not claim

- Token and time values are estimates, not telemetry.
- via can reduce unnecessary explanatory output, but it does not promise that every run uses fewer total tokens; difficult tasks may deserve deeper inspection.
- Three routes are useful only when three materially different paths exist.
- A passing validator proves graph structure, not that a recommendation is correct.
- via is not a mandatory planning workflow. If the map does not save reading time, skip it.

## Research and evaluation

The [Skill landscape](docs/skill-landscape.md) records the repository and community research behind the design, with sources and measurement caveats. The [evaluation set](evals/README.md) covers trigger precision, fake-route cases, topology, proof checkpoints, and scan speed.

## Development

```bash
npm install
npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md), [SUPPORT.md](SUPPORT.md), [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), and the [0.3.6 release notes](docs/releases/v0.3.6.md).

Apache-2.0 © P-to-Q contributors.
