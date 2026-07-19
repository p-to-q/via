import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateRouteSpec } from "../skills/via-route/scripts/validate-route.mjs";
import { renderRouteMap } from "../skills/via-route/scripts/render-route.mjs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixture = JSON.parse(fs.readFileSync(new URL("../examples/web-coder-route.json", import.meta.url), "utf8"));

test("example graph is valid", () => assert.deepEqual(validateRouteSpec(fixture), []));

test("graph requires exactly three routes", () => {
  const invalid = structuredClone(fixture);
  invalid.routes.pop();
  assert.match(validateRouteSpec(invalid).join("\n"), /exactly three/);
});

test("graph requires one recommended route", () => {
  const invalid = structuredClone(fixture);
  invalid.routes.forEach((route) => { route.recommended = false; });
  assert.match(validateRouteSpec(invalid).join("\n"), /exactly one route/);
});

test("route colors come from the six-color pool and stay distinct", () => {
  const validColors = ["blue", "orange", "green", "pink", "purple", "cyan"];
  for (const color of validColors) {
    const candidate = structuredClone(fixture);
    candidate.routes[0].color = color;
    if (candidate.routes.slice(1).some((route) => route.color === color)) continue;
    assert.doesNotMatch(validateRouteSpec(candidate).join("\n"), /color is invalid/);
  }
  const duplicate = structuredClone(fixture);
  duplicate.routes[1].color = duplicate.routes[0].color;
  assert.match(validateRouteSpec(duplicate).join("\n"), /colors must be distinct/);
});

test("ranges reject inverted cost", () => {
  const invalid = structuredClone(fixture);
  invalid.routes[0].tokens = { min: 9000, max: 1000 };
  assert.match(validateRouteSpec(invalid).join("\n"), /not exceed/);
});

test("runtime validator matches strict schema-shaped inputs", () => {
  const invalid = structuredClone(fixture);
  invalid.extra = true;
  invalid.routes[1].recommended = "no";
  invalid.graph.edges[0].routes.push(invalid.graph.edges[0].routes[0]);
  invalid.graph.edges[0].kind = "magic";
  const errors = validateRouteSpec(invalid).join("\n");
  assert.match(errors, /unknown field extra/);
  assert.match(errors, /recommended must be boolean/);
  assert.match(errors, /routes must be unique/);
  assert.match(errors, /kind is invalid/);
});

test("malformed nodes return errors instead of throwing", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.nodes[0] = null;
  assert.doesNotThrow(() => validateRouteSpec(invalid));
  assert.match(validateRouteSpec(invalid).join("\n"), /node must be an object/);
});

test("edges must reference real nodes", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges[0].to = "missing";
  assert.match(validateRouteSpec(invalid).join("\n"), /missing node/);
});

test("every route must reach the shared destination", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges.find((edge) => edge.from === "measure").routes = ["skill-first"];
  assert.match(validateRouteSpec(invalid).join("\n"), /telemetry-first must connect/);
});

test("renderer contract permits routes without shared overlap", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges.forEach((edge) => { if (edge.routes.length > 1) edge.routes = [edge.routes[0]]; });
  assert.doesNotMatch(validateRouteSpec(invalid).join("\n"), /shared edges/);
});

test("renderer contract permits a graph without a decorative branch", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges.forEach((edge) => { delete edge.kind; });
  assert.doesNotMatch(validateRouteSpec(invalid).join("\n"), /branch/);
});

test("proof semantics do not depend on English label keywords", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.nodes.forEach((node) => { node.label = node.label.replace(/validate|check/gi, "finish"); });
  assert.doesNotMatch(validateRouteSpec(invalid).join("\n"), /proof checkpoint/);
});

test("renderer contract permits zero checks when none are meaningful", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.nodes.forEach((node) => { delete node.control; });
  assert.doesNotMatch(validateRouteSpec(invalid).join("\n"), /engineering control check/);
});

test("renderer emits Git-tree topology, signal window, and terse cards", () => {
  const svg = renderRouteMap(fixture);
  assert.match(svg, /^<svg /);
  assert.match(svg, /class="edge/);
  assert.match(svg, /class="window-lights"/);
  assert.match(svg, /#E25555/);
  assert.match(svg, /#E6A700/);
  assert.match(svg, /#32A05F/);
  assert.equal((svg.match(/class="card(?: selected)?"/g) || []).length, 3);
  assert.equal((svg.match(/class="gate-light"/g) || []).length, 3);
  assert.doesNotMatch(svg, / gate(?:s)?</);
  assert.doesNotMatch(svg, /<circle cx="22" cy="25"/);
  assert.match(svg, /stroke="#3AB9B1"/);
  assert.match(svg, /stroke="#EB77B1"/);
  assert.match(svg, /stroke="#F3883B"/);
  assert.equal((svg.match(/class="card selected"/g) || []).length, 1);
  assert.match(svg, /class="route-dock"/);
  assert.match(svg, /id="dock-shadow"/);
  assert.match(svg, /class="route-dock"[^>]+rx="22"[^>]+filter="url\(#dock-shadow\)"/);
  assert.doesNotMatch(svg, /class="route-rail"/);
  assert.doesNotMatch(svg, /class="card-label" fill=/);
  assert.match(svg, /class="meta" fill="#247C78"/);
  assert.match(svg, /class="meta" fill="#A84177"/);
  assert.match(svg, /class="meta" fill="#A95227"/);
  assert.match(svg, /fill="#F2F5F5" stroke="#AEBFC0" stroke-width="1"/);
  assert.equal((svg.match(/fill="#FFFFFF" stroke="#E5E5E5" stroke-width="1"/g) || []).length, 2);
  assert.match(svg, /M36 142H1044[^>]+stroke-width="1.35"[^>]+stroke-dasharray="6 9"/);
  assert.match(svg, /class="route-dock" x="32" y="468" width="1016" height="164"/);
  assert.equal((svg.match(/transform="translate\((?:48|380|712) 484\)"/g) || []).length, 3);
  assert.match(svg, /<text x="16" y="33" class="card-label">Skill first<\/text>/);
  assert.match(svg, /<text x="16" y="67" class="cost">3\.5k–9k/);
  assert.match(svg, /<text x="16" y="87" class="meta" fill="#247C78">5–12 min<\/text>/);
  assert.match(svg, /<text x="16" y="117" class="summary">Small contract, fast proof<\/text>/);
  assert.match(svg, /dy="6" stdDeviation="7"[^>]+flood-opacity="\.16"/);
  assert.equal((svg.match(/data-route-id=/g) || []).length, 3);
  assert.match(svg, /font-family:-apple-system,BlinkMacSystemFont/);
  assert.match(svg, /class="endpoint"/);
  assert.match(svg, /class="endpoint-sub"/);
  assert.match(svg, /<rect x="5" y="1.5" width="8" height="15" rx="2.4"/);
  assert.equal((svg.match(/<circle cx="9" cy="(?:6|12)" r="1.45"/g) || []).length, 6);
  assert.match(svg, /<text x="22" y="4" class="check-count">4 checks<\/text>/);
  assert.doesNotMatch(svg, /text x="-8" y="4" text-anchor="end" class="check-count"/);
  assert.doesNotMatch(svg, /fill="#F1F3F4" stroke="#DADCE0"/);
  assert.doesNotMatch(svg, /Recommended ·/);
  assert.match(svg, />Prepare Via for a first public release</);
  assert.match(svg, />Choose how this gets built</);
  assert.doesNotMatch(svg, /Choose, combine, or customize any route/);
  assert.match(svg, /aria-labelledby="route-title route-desc"/);
  assert.match(svg, /<desc id="route-desc">/);
  assert.doesNotMatch(svg, /class="edge-casing"/);
  assert.equal((svg.match(/engineering checks/g) || []).length, 9);
  assert.doesNotMatch(svg, /[123] gate/);
  assert.doesNotMatch(svg, />REC</);
  assert.doesNotMatch(svg, /Recommendation:/);
});

test("renderer fits column nine and truncates long labels", () => {
  const wide = structuredClone(fixture);
  wide.graph.nodes.find((node) => node.column === 7).column = 9;
  wide.graph.nodes.find((node) => node.id === "renderer").label = "a very long renderer checkpoint";
  wide.routes[0].summary = "A summary that is deliberately long enough to require safe truncation";
  const svg = renderRouteMap(wide);
  assert.doesNotMatch(svg, /cx="(?:1[1-9]\d\d|[2-9]\d{3})"/);
  assert.match(svg, /a very long rende…/);
  assert.match(svg, /A summary that is deliberately lo…/);
});

test("via build writes the map and its own short documentation", () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "via-build-"));
  const result = spawnSync(process.execPath, [
    fileURLToPath(new URL("../scripts/via.mjs", import.meta.url)),
    "build",
    fileURLToPath(new URL("../examples/web-coder-route.json", import.meta.url)),
    "--out",
    output
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(output, "route.svg")));
  assert.ok(fs.existsSync(path.join(output, "route.json")));
  assert.match(fs.readFileSync(path.join(output, "route.md"), "utf8"), /\| route \| tokens \| time \| path \|/);
  fs.rmSync(output, { recursive: true, force: true });
});

test("CLI supports help, version, and validate", () => {
  const cli = fileURLToPath(new URL("../scripts/via.mjs", import.meta.url));
  const fixturePath = fileURLToPath(new URL("../examples/web-coder-route.json", import.meta.url));
  const help = spawnSync(process.execPath, [cli, "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /via validate/);
  const version = spawnSync(process.execPath, [cli, "--version"], { encoding: "utf8" });
  assert.equal(version.status, 0);
  assert.match(version.stdout, /^0\.3\.4/);
  const validate = spawnSync(process.execPath, [cli, "validate", fixturePath], { encoding: "utf8" });
  assert.equal(validate.status, 0, validate.stderr);
  assert.match(validate.stdout, /valid RouteSpec/);
});

test("CLI errors are concise and omit Node stacks", () => {
  const cli = fileURLToPath(new URL("../scripts/via.mjs", import.meta.url));
  const missing = spawnSync(process.execPath, [cli, "build", "missing.json"], { encoding: "utf8" });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /^via: cannot read/);
  assert.doesNotMatch(missing.stderr, /at file:|node:internal/);
  const noOut = spawnSync(process.execPath, [cli, "build", "x.json", "--out"], { encoding: "utf8" });
  assert.equal(noOut.status, 1);
  assert.match(noOut.stderr, /--out requires a directory/);
});
