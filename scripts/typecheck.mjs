#!/usr/bin/env node
// Type-checks each design's generated components + preview with tsc, using that
// design's own designs/<name>/tsconfig.json (so the `@` alias resolves to its
// own folder). esbuild (build-preview) strips types without checking them, so
// this is the real type gate.
//
//   node scripts/typecheck.mjs            # every design that has a tsconfig.json
//   node scripts/typecheck.mjs slate      # just one
//
// Requires `npm install` (typescript). The static demos need none of this.

import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = process.argv[2];

// A design is type-checkable once build-components.mjs has generated its
// tsconfig.json (which only happens when it ships components/).
const hasConfig = (name) => existsSync(join(ROOT, "designs", name, "tsconfig.json"));
const designs = arg
  ? [arg]
  : readdirSync(join(ROOT, "designs")).filter(
      (n) => !n.startsWith(".") && n !== "_template" && hasConfig(n)
    );

if (designs.length === 0) {
  console.log("no designs with a tsconfig.json — nothing to type-check");
  process.exit(0);
}

const tsc = join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");

let failed = 0;
for (const name of designs) {
  const cfg = join(ROOT, "designs", name, "tsconfig.json");
  if (!existsSync(cfg)) {
    console.error(`${name}: no tsconfig.json — run \`node scripts/build-components.mjs ${name}\``);
    failed++;
    continue;
  }
  process.stdout.write(`${name}: typecheck… `);
  try {
    execFileSync(tsc, ["--noEmit", "-p", cfg], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
  } catch (e) {
    console.log("FAILED");
    process.stdout.write(e.stdout?.toString() ?? "");
    process.stderr.write(e.stderr?.toString() ?? "");
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} design(s) failed type-check`);
  process.exit(1);
}
console.log(`\n${designs.length} design(s) type-check cleanly`);
