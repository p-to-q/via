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
    green: "#32A05F",
    yellow: "#E6A700",
    red: "#E25555",
    ink: "#1F1F1F",
    muted: "#6B6B6B",
    grid: "#E8E8E8",
    paper: "#FFFFFF",
    soft: "#F4F4F4",
    selectedTint: "#F2F5F5",
    selectedLine: "#AEBFC0",
    hairline: "#E5E5E5",
    dock: "#F7F7F7"
  };
  const routePalette = {
    blue: { line: "#339CFF", text: "#246FA6" },
    orange: { line: "#F3883B", text: "#A95227" },
    green: { line: "#5DC977", text: "#267A43" },
    pink: { line: "#EB77B1", text: "#A84177" },
    purple: { line: "#9B79EC", text: "#674BA8" },
    cyan: { line: "#3AB9B1", text: "#247C78" }
  };
  const routes = new Map(spec.routes.map((route) => [route.id, route]));
  const nodes = new Map(spec.graph.nodes.map((node) => [node.id, node]));
  const maxColumn = Math.max(...spec.graph.nodes.map((node) => node.column), 1);
  const point = (node) => ({ x: 72 + node.column * (924 / maxColumn), y: 142 + node.lane * 68 });
  const routeColor = (id) => routePalette[routes.get(id).color].line;
  const terminals = terminalNodes(spec);

  const grid = [0, 1, 2, 3, 4].map((lane) => {
    const y = point({ column: 0, lane }).y;
    return `<path d="M36 ${y}H1044" stroke="${palette.grid}" stroke-width="1.35" stroke-dasharray="6 9"/>`;
  }).join("");

  const edges = spec.graph.edges.map((edge, index) => {
    const from = point(nodes.get(edge.from));
    const to = point(nodes.get(edge.to));
    const shared = edge.routes.length > 1;
    const color = shared ? palette.ink : routeColor(edge.routes[0]);
    const width = shared ? 6 : edge.kind === "branch" ? 3.5 : 5.5;
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
    const isTerminal = terminals.origins.some((terminal) => terminal.id === node.id) || terminals.destinations.some((terminal) => terminal.id === node.id);
    const label = isTerminal ? "" : `<text x="${x}" y="${y + 29}" text-anchor="middle" class="node-label">${xml(short(node.label, 18))}</text>`;
    return `<g class="node"><circle cx="${x}" cy="${y}" r="11" fill="${palette.paper}" stroke="${color}" stroke-width="3.5"/>${gate}${label}</g>`;
  }).join("");

  const windowLights = `<g class="window-lights" transform="translate(38 35)">
    <circle cx="0" cy="0" r="6" fill="${palette.red}"/>
    <circle cx="20" cy="0" r="6" fill="${palette.yellow}"/>
    <circle cx="40" cy="0" r="6" fill="${palette.green}"/>
  </g>`;

  const cards = [...spec.routes].sort((a, b) => Number(b.recommended) - Number(a.recommended)).map((route, index) => {
    const x = 48 + index * 332;
    const token = `${num(route.tokens.min)}–${num(route.tokens.max)}`;
    const routeBrand = routePalette[route.color];
    const outline = route.recommended ? palette.selectedLine : palette.hairline;
    const fill = route.recommended ? palette.selectedTint : palette.paper;
    const checks = controlStops(spec, route.id);
    return `<g class="card${route.recommended ? " selected" : ""}" data-route-id="${xml(route.id)}" transform="translate(${x} 484)" aria-label="${xml(route.label)}, ${token} tokens, ${route.minutes.min} to ${route.minutes.max} minutes, ${checks} engineering checks">
      <rect width="320" height="132" rx="12" fill="${fill}" stroke="${outline}" stroke-width="1"/>
      <text x="16" y="33" class="card-label">${xml(route.label)}</text>
      <text x="16" y="67" class="cost">${token}<tspan class="unit"> tok</tspan></text>
      <text x="16" y="87" class="meta" fill="${routeBrand.text}">${route.minutes.min}–${route.minutes.max} min</text>
      ${trafficLight(238, 84, checks, palette)}
      <text x="16" y="117" class="summary">${xml(short(route.summary, 34))}</text>
    </g>`;
  }).join("");

  const comparison = [...spec.routes].sort((a, b) => Number(b.recommended) - Number(a.recommended)).map((route) => `${route.label}: ${num(route.tokens.min)} to ${num(route.tokens.max)} tokens, ${route.minutes.min} to ${route.minutes.max} minutes, ${controlStops(spec, route.id)} checkpoints${route.recommended ? ", suggested" : ""}`).join(". ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="route-title route-desc">
  <title id="route-title">route map for ${xml(spec.destination)}</title>
  <desc id="route-desc">${xml(comparison)}</desc>
  <defs>
    <filter id="dock-shadow" x="-8%" y="-30%" width="116%" height="170%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000000" flood-opacity=".16"/>
      <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="#000000" flood-opacity=".09"/>
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity=".06"/>
    </filter>
  </defs>
  <style>
    text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",Arial,sans-serif;font-variant-numeric:tabular-nums}.title{font-size:22px;font-weight:600;fill:${palette.ink}}.subtitle{font-size:13px;font-weight:400;fill:${palette.muted}}.eyebrow{font-size:11px;font-weight:700;letter-spacing:1.1px;fill:${palette.ink}}.endpoint-sub{font-size:11px;font-weight:500;fill:${palette.muted}}.node-label{font-size:12px;font-weight:450;fill:${palette.ink}}.card-label{font-size:14px;font-weight:650;fill:${palette.ink}}.cost{font-size:24px;font-weight:600;fill:${palette.ink}}.unit{font-size:12px;font-weight:500;fill:${palette.muted}}.meta{font-size:12px;font-weight:600}.check-count{font-size:12px;font-weight:500;fill:${palette.muted}}.summary{font-size:12px;font-weight:400;fill:${palette.muted}}.card rect{transition:fill .18s ease,stroke .18s ease}.flow{opacity:.16;stroke-dasharray:2 15;animation:travel 1.25s linear infinite}.window-lights circle{transform-box:fill-box;transform-origin:center}.window-lights:hover circle{animation:light-pop .32s ease both}.window-lights circle:nth-child(2){animation-delay:.04s}.window-lights circle:nth-child(3){animation-delay:.08s}@keyframes travel{to{stroke-dashoffset:-34}}@keyframes light-pop{50%{transform:scale(1.2)}}@media(prefers-reduced-motion:reduce){.flow{animation:none}.window-lights circle{animation:none!important}.card rect{transition:none}}
  </style>
  <rect width="${W}" height="${H}" rx="18" fill="${palette.soft}"/>
  <rect x="16" y="12" width="1048" height="636" rx="16" fill="${palette.paper}" stroke="${palette.hairline}"/>
  ${windowLights}
  <text x="100" y="40" class="eyebrow">via · a [p → q] project</text>
  <text x="1032" y="40" text-anchor="end" class="eyebrow subtle">ptoq.io</text>
  <text x="48" y="80" class="title">${xml(spec.destination)}</text>
  <text x="48" y="104" class="subtitle">Choose how this gets built</text>
  <g class="map">${grid}${edges}${nodeSvg}</g>
  ${endpointLabels(terminals, point)}
  <rect class="route-dock" x="32" y="468" width="1016" height="164" rx="22" fill="${palette.paper}" stroke="#DEDEDE" filter="url(#dock-shadow)"/>
  ${cards}
  </svg>\n`;
}

function num(value) { return value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value); }
function xml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function short(value, limit) { const chars = [...String(value)]; return chars.length <= limit ? chars.join("") : `${chars.slice(0, limit - 1).join("")}…`; }

function trafficLight(x, y, count, palette) {
  return `<g class="gate-light" transform="translate(${x} ${y})" aria-label="${count} engineering checks">
    <title>${count} engineering checks</title>
    <g transform="translate(0 -9)" fill="${palette.ink}">
      <rect x="5" y="1.5" width="8" height="15" rx="2.4" fill="none" stroke="${palette.ink}" stroke-width="1.8"/>
      <circle cx="9" cy="6" r="1.45"/>
      <circle cx="9" cy="12" r="1.45"/>
      <path d="M5 4.8H2.2c.25 1.45 1.15 2.45 2.8 2.85V4.8Zm8 0h2.8c-.25 1.45-1.15 2.45-2.8 2.85V4.8ZM5 10.8H2.2c.25 1.45 1.15 2.45 2.8 2.85v-2.85Zm8 0h2.8c-.25 1.45-1.15 2.45-2.8 2.85v-2.85Z"/>
    </g>
    <text x="22" y="4" class="check-count">${count} checks</text>
  </g>`;
}

function endpointLabel(node, point, role) {
  const { x, y } = point(node);
  return `<g class="endpoint" transform="translate(${x} ${y})">
    <text y="-24" text-anchor="middle" class="eyebrow">${role}</text>
    <text y="29" text-anchor="middle" class="endpoint-sub">${xml(short(node.label, 18))}</text>
  </g>`;
}

function endpointLabels(terminals, point) {
  const roles = new Map();
  for (const node of terminals.origins) roles.set(node.id, "START");
  for (const node of terminals.destinations) {
    roles.set(node.id, roles.has(node.id) ? "START · DONE" : "DONE");
  }
  const nodes = new Map([...terminals.origins, ...terminals.destinations].map((node) => [node.id, node]));
  return [...nodes.values()]
    .sort((a, b) => point(a).x - point(b).x || point(a).y - point(b).y)
    .map((node) => endpointLabel(node, point, roles.get(node.id)))
    .join("");
}

function terminalNodes(spec) {
  const nodes = new Map(spec.graph.nodes.map((node) => [node.id, node]));
  const unique = (ids) => [...new Set(ids)].map((id) => nodes.get(id)).filter(Boolean);
  if (spec.graph.terminals) {
    return {
      origins: unique(Object.values(spec.graph.terminals.origins || {})),
      destinations: unique(Object.values(spec.graph.terminals.destinations || {}))
    };
  }
  return {
    origins: spec.graph.nodes.filter((node) => !spec.graph.edges.some((edge) => edge.to === node.id)),
    destinations: spec.graph.nodes.filter((node) => !spec.graph.edges.some((edge) => edge.from === node.id))
  };
}

function controlStops(spec, routeId) {
  const nodeIds = new Set();
  for (const edge of spec.graph.edges) {
    if (edge.routes.includes(routeId)) {
      nodeIds.add(edge.from);
      nodeIds.add(edge.to);
    }
  }
  return spec.graph.nodes.filter((node) => nodeIds.has(node.id) && node.control).length;
}
