#!/usr/bin/env node
// Compiles a design's React preview: bundles react-preview/app.tsx and the
// design's components/ui/*.tsx (with React + Radix) into a single self-contained
// react-preview/app.bundle.js. The bundle needs no CDN and no runtime source
// fetch, so react-preview/index.html opens on any static host, online or off.
//
// This is also the build-time gate: if a generated component does not compile,
// esbuild fails here and so does `npm run build:preview`.
//
//   node scripts/build-preview.mjs slate                # write the bundle
//   node scripts/build-preview.mjs slate --check-only    # compile, but don't write (CI verify)
//
// Requires `npm install` (esbuild, react, radix, …). The static demos still need
// none of this — only the React previews do.

import { build } from "esbuild";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const design = process.argv[2] || "slate";
const checkOnly = process.argv.includes("--check-only");
const designDir = join(ROOT, "designs", design);
const entry = join(designDir, "react-preview", "app.tsx");

if (!existsSync(entry)) {
  console.error(`No react-preview/app.tsx for '${design}' (${entry})`);
  process.exit(2);
}

try {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    jsx: "automatic",
    loader: { ".tsx": "tsx", ".ts": "ts" },
    alias: { "@": designDir },
    define: { "process.env.NODE_ENV": '"production"' },
    write: !checkOnly,
    outfile: join(designDir, "react-preview", "app.bundle.js"),
    logLevel: "info",
  });
  const warnings = result.warnings?.length ?? 0;
  console.log(
    `${design}: components compiled cleanly${warnings ? ` (${warnings} warning(s))` : ""}${checkOnly ? " — not written" : " → react-preview/app.bundle.js"}`
  );
} catch (err) {
  console.error(`\n${design}: build FAILED — a component does not compile (see above).`);
  process.exit(1);
}
