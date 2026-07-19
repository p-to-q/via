#!/usr/bin/env node
import fs from "node:fs";
import { pathToFileURL } from "node:url";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/validate-route.mjs <route-spec.json>");
    process.exit(2);
  }
  try {
    const spec = JSON.parse(fs.readFileSync(file, "utf8"));
    const errors = validateRouteSpec(spec);
    if (errors.length) {
      errors.forEach((error) => console.error(`- ${error}`));
      process.exit(1);
    }
    console.log(`valid RouteSpec: ${file}`);
  } catch (error) {
    console.error(`via: cannot validate ${file}: ${error.message}`);
    process.exit(1);
  }
}

export function validateRouteSpec(spec) {
  const errors = [];
  if (!object(spec)) return ["RouteSpec must be an object."];
  checkKeys(errors, "RouteSpec", spec, ["schemaVersion", "destination", "routes", "graph"]);
  if (spec.schemaVersion !== "0.3") errors.push("schemaVersion must be 0.3.");
  if (!text(spec.destination) || spec.destination.length > 72) errors.push("destination must be 1-72 characters.");
  const routes = Array.isArray(spec.routes) ? spec.routes : [];
  if (routes.length !== 3) errors.push("routes must contain exactly three routes.");
  const routeIds = new Set();
  const routeColors = new Set();
  let recommended = 0;
  for (const route of routes) {
    if (!object(route)) { errors.push("each route must be an object."); continue; }
    checkKeys(errors, `route ${route.id || "?"}`, route, ["id", "label", "color", "recommended", "tokens", "minutes", "summary"]);
    if (!/^[a-z0-9-]+$/.test(route.id || "")) errors.push("route.id must be lowercase kebab-case.");
    if (routeIds.has(route.id)) errors.push(`duplicate route id: ${route.id}.`);
    routeIds.add(route.id);
    if (!text(route.label) || route.label.length > 22) errors.push(`${route.id}.label must be 1-22 characters.`);
    if (!text(route.summary) || route.summary.length > 54) errors.push(`${route.id}.summary must be 1-54 characters.`);
    if (!["blue", "orange", "green", "pink", "purple", "cyan"].includes(route.color)) errors.push(`${route.id}.color is invalid.`);
    if (routeColors.has(route.color)) errors.push("route colors must be distinct.");
    routeColors.add(route.color);
    if (typeof route.recommended !== "boolean") errors.push(`${route.id}.recommended must be boolean.`);
    if (route.recommended === true) recommended += 1;
    checkRange(errors, `${route.id}.tokens`, route.tokens);
    checkRange(errors, `${route.id}.minutes`, route.minutes);
  }
  if (recommended !== 1) errors.push("exactly one route must be recommended.");

  const graph = object(spec.graph) ? spec.graph : {};
  if (object(spec.graph)) checkKeys(errors, "graph", spec.graph, ["nodes", "edges"]);
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph.edges) ? graph.edges : [];
  if (nodes.length < 5 || nodes.length > 18) errors.push("graph.nodes must contain 5-18 nodes.");
  if (edges.length < 4 || edges.length > 28) errors.push("graph.edges must contain 4-28 edges.");

  const nodeIds = new Set();
  const positions = new Set();
  for (const node of nodes) {
    if (!object(node)) { errors.push("each node must be an object."); continue; }
    checkKeys(errors, `node ${node.id || "?"}`, node, ["id", "label", "column", "lane", "gate", "control"]);
    if (!/^[a-z0-9-]+$/.test(node.id || "")) { errors.push("node.id must be lowercase kebab-case."); continue; }
    if (nodeIds.has(node.id)) errors.push(`duplicate node id: ${node.id}.`);
    nodeIds.add(node.id);
    if (!text(node.label) || node.label.length > 24) errors.push(`${node.id}.label must be 1-24 characters.`);
    if (!Number.isInteger(node.column) || node.column < 0 || node.column > 9) errors.push(`${node.id}.column must be 0-9.`);
    if (!Number.isInteger(node.lane) || node.lane < 0 || node.lane > 4) errors.push(`${node.id}.lane must be 0-4.`);
    const position = `${node.column}:${node.lane}`;
    if (positions.has(position)) errors.push(`two nodes occupy ${position}.`);
    positions.add(position);
    if (node.gate && !["green", "yellow", "red"].includes(node.gate)) errors.push(`${node.id}.gate is invalid.`);
    if (node.control && !["decision", "proof", "boundary", "release"].includes(node.control)) errors.push(`${node.id}.control is invalid.`);
  }

  const validNodes = nodes.filter(object);
  const adjacency = new Map(validNodes.map((node) => [node.id, []]));
  const indegree = new Map(validNodes.map((node) => [node.id, 0]));
  const routeEdges = new Map([...routeIds].map((id) => [id, []]));
  for (const edge of edges) {
    if (!object(edge)) { errors.push("each edge must be an object."); continue; }
    checkKeys(errors, `edge ${edge.from || "?"}->${edge.to || "?"}`, edge, ["from", "to", "routes", "kind"]);
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      errors.push(`edge ${edge?.from || "?"}->${edge?.to || "?"} references a missing node.`);
      continue;
    }
    const from = validNodes.find((node) => node.id === edge.from);
    const to = validNodes.find((node) => node.id === edge.to);
    if (to.column <= from.column) errors.push(`edge ${edge.from}->${edge.to} must move forward by column.`);
    if (!Array.isArray(edge.routes) || edge.routes.length < 1 || edge.routes.length > 3) errors.push(`edge ${edge.from}->${edge.to} needs 1-3 routes.`);
    if (new Set(edge.routes || []).size !== (edge.routes || []).length) errors.push(`edge ${edge.from}->${edge.to} routes must be unique.`);
    if (edge.kind && !["main", "branch"].includes(edge.kind)) errors.push(`edge ${edge.from}->${edge.to} kind is invalid.`);
    for (const routeId of edge.routes || []) {
      if (!routeIds.has(routeId)) errors.push(`edge ${edge.from}->${edge.to} uses unknown route ${routeId}.`);
      else routeEdges.get(routeId).push(edge);
    }
    adjacency.get(edge.from)?.push(edge.to);
    indegree.set(edge.to, (indegree.get(edge.to) || 0) + 1);
  }

  const origins = validNodes.filter((node) => (indegree.get(node.id) || 0) === 0);
  const destinations = validNodes.filter((node) => (adjacency.get(node.id) || []).length === 0);
  if (origins.length !== 1) errors.push("graph must have exactly one origin node.");
  if (destinations.length !== 1) errors.push("graph must have exactly one destination node.");
  if (origins.length === 1 && destinations.length === 1) {
    for (const routeId of routeIds) {
      if (!hasRoutePath(origins[0].id, destinations[0].id, routeEdges.get(routeId) || [])) {
        errors.push(`${routeId} must connect origin to destination.`);
      }
    }
  }

  return errors;
}

function hasRoutePath(origin, destination, edges) {
  const next = new Map();
  for (const edge of edges) next.set(edge.from, [...(next.get(edge.from) || []), edge.to]);
  const seen = new Set();
  const stack = [origin];
  while (stack.length) {
    const node = stack.pop();
    if (node === destination) return true;
    if (seen.has(node)) continue;
    seen.add(node);
    stack.push(...(next.get(node) || []));
  }
  return false;
}

function checkRange(errors, path, value) {
  if (!object(value) || !Number.isFinite(value.min) || !Number.isFinite(value.max)) {
    errors.push(`${path} needs numeric min and max.`);
  } else {
    checkKeys(errors, path, value, ["min", "max"]);
    if (value.min < 0 || value.min > value.max) {
    errors.push(`${path}.min must be non-negative and not exceed max.`);
    }
  }
}

function object(value) { return value && typeof value === "object" && !Array.isArray(value); }
function text(value) { return typeof value === "string" && value.trim().length > 0; }
function checkKeys(errors, path, value, allowed) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) errors.push(`${path} has unknown field ${key}.`);
}
