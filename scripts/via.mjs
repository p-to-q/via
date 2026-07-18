#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateRouteSpec } from "../skills/via-route/scripts/validate-route.mjs";
import { renderRouteMap } from "../skills/via-route/scripts/render-route.mjs";
import packageJson from "../package.json" with { type: "json" };

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h" || command === "help") {
  console.log(help());
  process.exit(0);
}

if (command === "--version" || command === "-v" || command === "version") {
  console.log(packageJson.version);
  process.exit(0);
}

try {
  if (command === "validate") {
    const input = requireInput(args[1]);
    const spec = readSpec(input);
    assertValid(spec);
    console.log(`valid RouteSpec: ${input}`);
  } else if (command === "build") {
    const input = requireInput(args[1]);
    const outDir = readOutput(args.slice(2));
    const spec = readSpec(input);
    assertValid(spec);
    writeBuild(spec, outDir);
    console.log(`built ${outDir}`);
  } else {
    fail(`unknown command: ${command}\n\n${help()}`);
  }
} catch (error) {
  console.error(`via: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

function readSpec(input) {
  let source;
  try {
    source = fs.readFileSync(input, "utf8");
  } catch {
    fail(`cannot read ${input}`);
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`invalid JSON in ${input}: ${error.message}`);
  }
}

function assertValid(spec) {
  const errors = validateRouteSpec(spec);
  if (errors.length) fail(`invalid RouteSpec:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
}

function requireInput(input) {
  if (!input || input.startsWith("-")) fail("missing RouteSpec path");
  return input;
}

function readOutput(rest) {
  const outFlag = rest.indexOf("--out");
  if (outFlag < 0) return "via-output";
  const value = rest[outFlag + 1];
  if (!value || value.startsWith("-")) fail("--out requires a directory");
  return value;
}

function writeBuild(spec, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "route.svg"), renderRouteMap(spec));
  fs.writeFileSync(path.join(outDir, "route.json"), `${JSON.stringify(spec, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "route.md"), routeNote(spec));
}

function routeNote(value) {
  const rows = [...value.routes]
    .sort((a, b) => Number(b.recommended) - Number(a.recommended))
    .map((route) => `| ${route.recommended ? "→ " : ""}${route.label} | ${format(route.tokens)} | ${format(route.minutes)} min | ${route.summary} |`)
    .join("\n");
  return `# ${value.destination}\n\n![route map](route.svg)\n\n| route | tokens | time | path |\n| --- | ---: | ---: | --- |\n${rows}\n`;
}

function format(range) {
  const number = (value) => value >= 1000 ? `${Math.round(value / 100) / 10}k` : value;
  return `${number(range.min)}–${number(range.max)}`;
}

function fail(message) { throw new Error(message); }

function help() {
  return `via ${packageJson.version}

Turn a RouteSpec into a Git-tree map.

Usage:
  via validate <route.json>
  via build <route.json> [--out <directory>]
  via --version
  via --help`;
}
