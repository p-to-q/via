#!/usr/bin/env node
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { validateRouteSpec } from "./validate-route.mjs";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("usage: node scripts/render-route.mjs <route-spec.json> <output.svg>");
    process.exit(2);
  }
  const spec = JSON.parse(fs.readFileSync(input, "utf8"));
  const errors = validateRouteSpec(spec);
  if (errors.length) { errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
  fs.writeFileSync(output, renderRouteMap(spec));
  console.log(`rendered ${output}`);
}

export function renderRouteMap(spec) {
  const W = 1080;
  const H = 660;
  const palette = {
    lime: "#72B600",
    amber: "#F0AE00",
    violet: "#92709D",
    green: "#40C878",
    yellow: "#FFBD2E",
    red: "#FF5F57",
    ink: "#16181D",
    muted: "#858990",
    grid: "#DADDE2",
    paper: "#FBFBFC",
    soft: "#F1F2F4"
  };
  const routes = new Map(spec.routes.map((route) => [route.id, route]));
  const nodes = new Map(spec.graph.nodes.map((node) => [node.id, node]));
  const point = (node) => ({ x: 72 + node.column * 132, y: 142 + node.lane * 68 });
  const routeColor = (id) => palette[routes.get(id).color];

  const grid = [0, 1, 2, 3, 4].map((lane) => {
    const y = point({ column: 0, lane }).y;
    return `<path d="M36 ${y}H1044" stroke="${palette.grid}" stroke-dasharray="4 8"/>`;
  }).join("");

  const edges = spec.graph.edges.map((edge, index) => {
    const from = point(nodes.get(edge.from));
    const to = point(nodes.get(edge.to));
    const shared = edge.routes.length > 1;
    const color = shared ? palette.ink : routeColor(edge.routes[0]);
    const width = shared ? 7 : edge.kind === "branch" ? 4 : 6;
    const dash = edge.kind === "branch" ? ` stroke-dasharray="6 7"` : "";
    const curve = Math.min(54, (to.x - from.x) * 0.42);
    const d = `M${from.x} ${from.y} C${from.x + curve} ${from.y} ${to.x - curve} ${to.y} ${to.x} ${to.y}`;
    return `<path class="edge e${index}" d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash}/><path class="flow" d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
  }).join("");

  const nodeRoutes = new Map();
  for (const edge of spec.graph.edges) {
    for (const id of [edge.from, edge.to]) nodeRoutes.set(id, new Set([...(nodeRoutes.get(id) || []), ...edge.routes]));
  }
  const nodeSvg = spec.graph.nodes.map((node) => {
    const { x, y } = point(node);
    const membership = nodeRoutes.get(node.id) || new Set();
    const shared = membership.size > 1;
    const color = shared ? palette.ink : routeColor([...membership][0]);
    const gate = node.gate ? `<g transform="translate(${x + 13} ${y - 17})"><circle r="6" fill="${palette[node.gate]}" stroke="${palette.paper}" stroke-width="3"/></g>` : "";
    const label = node.id === "intent" || node.id === "ship" ? "" : `<text x="${x}" y="${y + 29}" text-anchor="middle" class="node-label">${xml(node.label)}</text>`;
    return `<g class="node"><circle cx="${x}" cy="${y}" r="11" fill="${palette.paper}" stroke="${color}" stroke-width="4"/>${gate}${label}</g>`;
  }).join("");

  const windowLights = `<g class="window-lights" transform="translate(38 35)">
    <circle cx="0" cy="0" r="6" fill="${palette.red}"/>
    <circle cx="20" cy="0" r="6" fill="${palette.yellow}"/>
    <circle cx="40" cy="0" r="6" fill="${palette.green}"/>
  </g>`;

  const cards = [...spec.routes].sort((a, b) => Number(b.recommended) - Number(a.recommended)).map((route, index) => {
    const x = 36 + index * 342;
    const color = palette[route.color];
    const token = `${num(route.tokens.min)}–${num(route.tokens.max)}`;
    const outline = route.recommended ? color : "#E1E3E7";
    return `<g class="card" transform="translate(${x} 494)">
      <rect width="322" height="126" rx="18" fill="#FFFFFF" stroke="${outline}" stroke-width="${route.recommended ? 3 : 1}"/>
      <circle cx="22" cy="25" r="5" fill="${color}"/>
      <text x="35" y="30" class="card-label">${xml(route.label)}</text>
      ${route.recommended ? `<text x="292" y="29" text-anchor="end" class="recommended">REC</text>` : "<!-- not recommended -->"}
      <text x="20" y="69" class="cost">${token}<tspan class="unit"> tok</tspan></text>
      <text x="20" y="94" class="meta">${route.minutes.min}–${route.minutes.max} min · ${route.gates} gate${route.gates === 1 ? "" : "s"}</text>
      <text x="20" y="115" class="summary">${xml(route.summary)}</text>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${xml(spec.destination)}">
  <style>
    text{font-family:Inter,ui-sans-serif,system-ui,sans-serif}.title{font-size:20px;font-weight:680;fill:${palette.ink}}.eyebrow{font-size:10px;font-weight:700;letter-spacing:1.6px;fill:${palette.muted}}.node-label{font-size:11px;font-weight:560;fill:${palette.ink}}.card-label{font-size:14px;font-weight:650;fill:${palette.ink}}.cost{font-size:25px;font-weight:730;fill:${palette.ink}}.unit{font-size:12px;font-weight:600;fill:${palette.muted}}.meta{font-size:12px;fill:${palette.muted}}.summary{font-size:11px;fill:${palette.ink}}.recommended{font-size:10px;font-weight:750;letter-spacing:1px;fill:${palette[spec.routes.find(r=>r.recommended).color]}}.flow{opacity:.34;stroke-dasharray:2 15;animation:travel 1.25s linear infinite}.window-lights circle{transform-box:fill-box;transform-origin:center}.window-lights:hover circle{animation:light-pop .32s ease both}.window-lights circle:nth-child(2){animation-delay:.04s}.window-lights circle:nth-child(3){animation-delay:.08s}@keyframes travel{to{stroke-dashoffset:-34}}@keyframes light-pop{50%{transform:scale(1.2)}}@media(prefers-reduced-motion:reduce){.flow{animation:none}.window-lights circle{animation:none!important}}
  </style>
  <rect width="${W}" height="${H}" rx="24" fill="${palette.soft}"/>
  <rect x="18" y="14" width="1044" height="628" rx="20" fill="${palette.paper}" stroke="#E0E2E6"/>
  ${windowLights}
  <text x="100" y="39" class="eyebrow">VIA / ROUTE</text>
  <text x="36" y="82" class="title">${xml(spec.destination)}</text>
  <g class="map">${grid}${edges}${nodeSvg}</g>
  <text x="72" y="447" text-anchor="middle" class="eyebrow">START</text>
  <text x="996" y="447" text-anchor="middle" class="eyebrow">DONE</text>
  ${cards}
  </svg>\n`;
}

function num(value) { return value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value); }
function xml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
