# via

[![CI](https://github.com/p-to-q/via/actions/workflows/ci.yml/badge.svg)](https://github.com/p-to-q/via/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-17181d.svg)](LICENSE)

Turn an engineering task into a Git-tree map.

![via route map](assets/web-coder-route.svg)

Three routes. Shared checkpoints. Local branches. Merge points. Token and time ranges.

## Install

via requires Node.js 20 or newer and has no runtime dependencies.

### Skill entrypoint

Via is loaded through [`skills/via-route/SKILL.md`](skills/via-route/SKILL.md). That file is the Skill entrypoint: it tells the agent when to use Via and links to the RouteSpec contract, JSON Schema, evaluator, and renderer scripts.

To install and configure Via inside another coding agent, paste this prompt into that agent:

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

In a chat box, type `/via` to wake Via explicitly:

```text
/via plan three ways to migrate this auth flow
```

In Codex Skill contexts, you can also name the installed Skill directly:

```text
$via-route plan three ways to migrate this auth flow
```

Advanced agents can also trigger Via from natural language when the request is clearly route-style planning:

- "show me three routes for this implementation"
- "make a token map for this task"
- "compare architecture options before we build"
- "plan the migration paths and show the tradeoffs"
- "/via for this decision"

### Codex Plugin bundle

The repository contains a validated `.codex-plugin/plugin.json` for plugin packaging and marketplace submission. The first public release is installed as a Skill or CLI; it is not yet published in a Codex marketplace.

### CLI

Install the CLI from GitHub:

```bash
npm install --global github:p-to-q/via
```

After the package is published to npm, the equivalent registry install will be:

```bash
npm install --global @p-to-q/via
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
- every route reaches the same destination;
- `START` and `DONE` are fixed endpoint roles, while the captions below them are generated from the actual origin and achieved state.

The Skill creates the RouteSpec, validates it, renders it, and shows the SVG first. It skips tiny work and tasks without three credible paths.

See the [RouteSpec contract](skills/via-route/references/route-spec.md), [example graph](examples/web-coder-route.json), [product architecture](docs/product-architecture.md), and [interface system](docs/design-system.md).

## What via does not claim

- Token and time values are estimates, not telemetry.
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

See [CONTRIBUTING.md](CONTRIBUTING.md), [SUPPORT.md](SUPPORT.md), [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), and the [0.3.4 release notes](docs/releases/v0.3.4.md).

Apache-2.0 © P-to-Q contributors.
