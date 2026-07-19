# Via interface system

Via is shown inside agent interfaces repeatedly. Its shell should therefore feel native to Codex: quiet neutral surfaces, precise spacing, light separators, no ornamental shadows. Route topology remains Via's own visual signature.

These tokens are inferred from the current Codex desktop interface and normalized for a portable 1080 × 660 SVG. They are not an official OpenAI design-system export.

## Type

The portable SVG uses the host system UI stack:

```css
-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", Arial, sans-serif
```

This avoids relying on a remote or proprietary font that may disappear when the SVG is opened offline. Use tabular figures for token and time ranges.

| role | size / line | weight | use |
|---|---:|---:|---|
| destination | 22 / 28 | 600 | one task only |
| route metric | 24 / 28 | 600 | token range |
| route name | 14 / 20 | 600 | card identity |
| node | 12 / 16 | 450 | graph actions |
| metadata | 12 / 16 | 500 | time and gate count |
| route sub | 12 / 16 | 400 | one-line route difference |
| utility | 11 / 16 | 600 | VIA, START, DONE |

A global subtitle is optional, not structural. Add one only when it contributes scope or a constraint that the destination cannot express. Each route keeps one sub line, capped at 28 characters, because it answers a distinct question: why this route differs.

## Space

Use a 4 px atom and an 8 px primary rhythm. Preferred values are `4, 8, 12, 16, 20, 24, 32, 48`.

- frame inset: 16 px
- content inset: 48 px
- header to graph: 32 px minimum
- graph to route dock: 24 px minimum
- dock inset: 12 px
- card gap: 12 px
- card inset: 16 px
- label → metric: 8 px optical gap
- metric → metadata: 8 px
- metadata → sub: 8 px
- card bottom clearance: 16 px

Do not add blank text lines to create space. Use fixed line height and geometric gaps.

## Shape and surfaces

| token | value |
|---|---|
| surround | `#F4F4F4` |
| paper | `#FFFFFF` |
| dock | `#F7F7F7` |
| selected | `#F2F5F5` |
| ink | `#1F1F1F` |
| muted | `#6B6B6B` |
| hairline | `#E5E5E5` |
| grid | `#E8E8E8` |

Route identity draws any three distinct colors from the [public Codex visualization family](https://github.com/openai/codex/blob/0fb559f0f6e231a88ac02ea002d3ecd248e2b515/codex-rs/tui/src/inline_visualization/assets/visualize.css): Blue `#339CFF`, Orange `#F3883B`, Green `#5DC977`, Pink `#EB77B1`, Purple `#9B79EC`, and Cyan `#3AB9B1`. These bright values belong on graph lines. Route-name text uses darker Via companions (`#246FA6`, `#A95227`, `#267A43`, `#A84177`, `#674BA8`, `#247C78`) for white-background readability. A newly generated map may choose a different trio, but RouteSpec stores the result; re-rendering never randomizes it.

The outer surface uses an 18 px radius, the paper frame 16 px, the route dock 22 px, and cards 12 px. The dock is `1016 × 162` at `(32, 476)`; three `320 × 132` cards sit at x=`48, 380, 712`, y=`491`, creating symmetric 16 px horizontal and 15 px vertical insets. Use 1 px separators. Individual cards never cast shadows; the route dock is the single elevation exception, echoing the Codex composer with a deliberately visible three-layer neutral shadow (`0 7 24 / 11%`, `0 2 8 / 8%`, `0 1 2 / 5%`). Selection is expressed through a subtle surface shift and border contrast, never elevation or glow.

## Alignment

- The header and lane guides share the 48 px content line.
- All text inside a card shares its 16 px inset.
- All three card metrics, metadata, and sub lines align on common baselines.
- Gate count and traffic-light pictogram form one right-aligned inline group on the metadata baseline.
- Route cards are ordered exactly as their routes are presented. Their names carry the graph's route color; metrics, summaries, frames, and surfaces remain neutral.
- START and DONE align to graph endpoints, not card edges.

## Guides

Lane guides exist only to explain graph lanes. Use 1 px `#E8E8E8`, dash `2 10`, between x=48 and x=1032. Do not add vertical guides or a graph container. The route dock is the only sectional background.

## Static and interactive delivery

`route.svg` is the portable snapshot for Codex, GitHub, Markdown, and documents. Keep it script-free. It may carry `data-route-id` and accessible labels, but when embedded through `<img>` its internal cards are not interactive.

For the product UI, read the same RouteSpec into an HTML view:

- render the graph as trusted inline SVG;
- render the three options as real HTML buttons in a radiogroup;
- keep keyboard focus, touch targets, selection state, and analytics in HTML;
- export SVG, and PNG only when a destination cannot render SVG.

Do not put product state or inline event handlers inside the portable SVG.
