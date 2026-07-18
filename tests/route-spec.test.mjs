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

test("ranges reject inverted cost", () => {
  const invalid = structuredClone(fixture);
  invalid.routes[0].tokens = { min: 9000, max: 1000 };
  assert.match(validateRouteSpec(invalid).join("\n"), /not exceed/);
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

test("graph requires shared overlap", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges.forEach((edge) => { if (edge.routes.length > 1) edge.routes = [edge.routes[0]]; });
  assert.match(validateRouteSpec(invalid).join("\n"), /shared edges/);
});

test("graph requires a small branch", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.edges.forEach((edge) => { delete edge.kind; });
  assert.match(validateRouteSpec(invalid).join("\n"), /small branch/);
});

test("graph requires a visible proof checkpoint", () => {
  const invalid = structuredClone(fixture);
  invalid.graph.nodes.forEach((node) => { node.label = node.label.replace(/validate|check/gi, "finish"); });
  assert.match(validateRouteSpec(invalid).join("\n"), /proof checkpoint/);
});

test("renderer emits Git-tree topology, signal window, and terse cards", () => {
  const svg = renderRouteMap(fixture);
  assert.match(svg, /^<svg /);
  assert.match(svg, /class="edge/);
  assert.match(svg, /class="window-lights"/);
  assert.match(svg, /#E8615E/);
  assert.match(svg, /#E4A83B/);
  assert.match(svg, /#38B879/);
  assert.equal((svg.match(/class="card(?: selected)?"/g) || []).length, 3);
  assert.equal((svg.match(/class="gate-light"/g) || []).length, 3);
  assert.doesNotMatch(svg, / gate(?:s)?</);
  assert.doesNotMatch(svg, /<circle cx="22" cy="25"/);
  assert.match(svg, /stroke="#1A73E8"/);
  assert.match(svg, /stroke="#7B6A9B"/);
  assert.match(svg, /stroke="#B7791F"/);
  assert.equal((svg.match(/class="card selected"/g) || []).length, 1);
  assert.match(svg, /fill="#F7FAFF" stroke="#1A73E8"/);
  assert.match(svg, /stroke="#DADCE0" stroke-width="1.25"/);
  assert.match(svg, /Recommended · Small contract/);
  assert.doesNotMatch(svg, />REC</);
  assert.doesNotMatch(svg, /Recommendation:/);
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
  assert.match(version.stdout, /^0\.2\.0/);
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
