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
  if (object(spec.graph)) checkKeys(errors, "graph", spec.graph, ["terminals", "nodes", "edges"]);
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
  const participatingNodes = new Set();
  const edgePairs = new Set();
  const routeEdges = new Map([...routeIds].map((id) => [id, []]));
  const routeIndegree = new Map([...routeIds].map((id) => [id, new Map(validNodes.map((node) => [node.id, 0]))]));
  const routeOutdegree = new Map([...routeIds].map((id) => [id, new Map(validNodes.map((node) => [node.id, 0]))]));
  for (const edge of edges) {
    if (!object(edge)) { errors.push("each edge must be an object."); continue; }
    checkKeys(errors, `edge ${edge.from || "?"}->${edge.to || "?"}`, edge, ["from", "to", "routes", "kind"]);
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      errors.push(`edge ${edge?.from || "?"}->${edge?.to || "?"} references a missing node.`);
      continue;
    }
    const from = validNodes.find((node) => node.id === edge.from);
    const to = validNodes.find((node) => node.id === edge.to);
    const pair = `${edge.from}->${edge.to}`;
    if (edgePairs.has(pair)) errors.push(`duplicate edge ${pair}; combine its route IDs on one edge.`);
    edgePairs.add(pair);
    participatingNodes.add(edge.from);
    participatingNodes.add(edge.to);
    if (to.column <= from.column) errors.push(`edge ${edge.from}->${edge.to} must move forward by column.`);
    if (!Array.isArray(edge.routes) || edge.routes.length < 1 || edge.routes.length > 3) errors.push(`edge ${edge.from}->${edge.to} needs 1-3 routes.`);
    if (new Set(edge.routes || []).size !== (edge.routes || []).length) errors.push(`edge ${edge.from}->${edge.to} routes must be unique.`);
    if (edge.kind && !["main", "branch"].includes(edge.kind)) errors.push(`edge ${edge.from}->${edge.to} kind is invalid.`);
    for (const routeId of edge.routes || []) {
      if (!routeIds.has(routeId)) errors.push(`edge ${edge.from}->${edge.to} uses unknown route ${routeId}.`);
      else {
        routeEdges.get(routeId).push(edge);
        routeOutdegree.get(routeId).set(edge.from, (routeOutdegree.get(routeId).get(edge.from) || 0) + 1);
        routeIndegree.get(routeId).set(edge.to, (routeIndegree.get(routeId).get(edge.to) || 0) + 1);
      }
    }
    adjacency.get(edge.from)?.push(edge.to);
    indegree.set(edge.to, (indegree.get(edge.to) || 0) + 1);
  }

  const origins = validNodes.filter((node) => (indegree.get(node.id) || 0) === 0);
  const destinations = validNodes.filter((node) => (adjacency.get(node.id) || []).length === 0);
  for (const node of validNodes) {
    if (!participatingNodes.has(node.id)) errors.push(`${node.id} must participate in at least one edge.`);
  }

  const terminals = object(graph.terminals) ? graph.terminals : null;
  if (graph.terminals !== undefined && !object(graph.terminals)) {
    errors.push("graph.terminals must be an object.");
  }
  if (terminals) {
    checkKeys(errors, "graph.terminals", terminals, ["origins", "destinations"]);
    if (!object(terminals.origins)) errors.push("graph.terminals.origins must be an object.");
    if (!object(terminals.destinations)) errors.push("graph.terminals.destinations must be an object.");
    const originMap = object(terminals.origins) ? terminals.origins : {};
    const destinationMap = object(terminals.destinations) ? terminals.destinations : {};
    for (const routeId of routeIds) {
      const origin = originMap[routeId];
      const destination = destinationMap[routeId];
      if (!text(origin)) errors.push(`graph.terminals.origins must name an origin for ${routeId}.`);
      if (!text(destination)) errors.push(`graph.terminals.destinations must name a destination for ${routeId}.`);
      if (origin && !nodeIds.has(origin)) errors.push(`${routeId} origin references a missing node.`);
      if (destination && !nodeIds.has(destination)) errors.push(`${routeId} destination references a missing node.`);
      if (origin && destination && nodeIds.has(origin) && nodeIds.has(destination)) {
        if (origin === destination) errors.push(`${routeId} origin and destination must be different nodes.`);
        if ((routeIndegree.get(routeId).get(origin) || 0) !== 0) errors.push(`${routeId} origin must not have an incoming edge for that route.`);
        if ((routeOutdegree.get(routeId).get(destination) || 0) !== 0) errors.push(`${routeId} destination must not have an outgoing edge for that route.`);
        if (!hasRoutePath(origin, destination, routeEdges.get(routeId) || [])) {
          errors.push(`${routeId} must connect its origin to destination.`);
        }
        const reachable = reachableFrom(origin, routeEdges.get(routeId) || []);
        const canReachDestination = canReach(destination, routeEdges.get(routeId) || []);
        for (const edge of routeEdges.get(routeId) || []) {
          if (!reachable.has(edge.from) || !canReachDestination.has(edge.to)) {
            errors.push(`${routeId} has an edge outside its origin-to-destination path.`);
            break;
          }
        }
      }
    }
    for (const key of Object.keys(originMap)) if (!routeIds.has(key)) errors.push(`graph.terminals.origins has unknown route ${key}.`);
    for (const key of Object.keys(destinationMap)) if (!routeIds.has(key)) errors.push(`graph.terminals.destinations has unknown route ${key}.`);
  } else {
    if (origins.length !== 1) errors.push("graph must have exactly one origin node, or graph.terminals must declare route origins.");
    if (destinations.length !== 1) errors.push("graph must have exactly one destination node, or graph.terminals must declare route destinations.");
    if (origins.length === 1 && destinations.length === 1) {
      for (const routeId of routeIds) {
        if (!hasRoutePath(origins[0].id, destinations[0].id, routeEdges.get(routeId) || [])) {
          errors.push(`${routeId} must connect origin to destination.`);
        }
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

function reachableFrom(origin, edges) {
  const next = new Map();
  for (const edge of edges) next.set(edge.from, [...(next.get(edge.from) || []), edge.to]);
  const seen = new Set();
  const stack = [origin];
  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);
    stack.push(...(next.get(node) || []));
  }
  return seen;
}

function canReach(destination, edges) {
  const previous = new Map();
  for (const edge of edges) previous.set(edge.to, [...(previous.get(edge.to) || []), edge.from]);
  const seen = new Set();
  const stack = [destination];
  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);
    stack.push(...(previous.get(node) || []));
  }
  return seen;
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
