#!/usr/bin/env node
// Assembles dist/ — the deployable site — from the repo. dist/ contains ONLY the
// browsable pages and the assets they load at runtime; no source is copied, so a
// deploy that serves dist/ exposes no .tsx / .mjs / .json / .md / node_modules.
//
// Served (allowlist):
//   index.html                                  the gallery
//   vendor/tailwind-browser-*.js                the pinned Tailwind compiler
//   designs/<name>/index.html                   kitchen sinks (fetch their theme.css)
//   designs/<name>/theme.css                    tokens the kitchen sinks load at runtime
//   designs/<name>/react-preview/index.html     compiled React preview (where present)
//   designs/<name>/react-preview/app.bundle.js  its bundle
//   layouts/<name>/index.html, voices/<name>/index.html
//
// Everything else (DESIGN.md, classes.json, components/, lib/, scripts/,
// package.json, node_modules, …) is deliberately left out.
//
//   node scripts/build-site.mjs

import { rmSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

let count = 0;
const copy = (rel) => {
  const src = join(ROOT, rel);
  if (!existsSync(src)) return;
  const dst = join(DIST, rel);
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  count++;
};

const dirs = (base) => {
  const p = join(ROOT, base);
  if (!existsSync(p)) return [];
  return readdirSync(p).filter(
    (n) => !n.startsWith(".") && n !== "_template" && statSync(join(p, n)).isDirectory()
  );
};

// Gallery + the pinned Tailwind compiler.
copy("index.html");
for (const f of readdirSync(join(ROOT, "vendor")).filter((f) => /^tailwind-browser-.+\.js$/.test(f))) {
  copy(join("vendor", f));
}

// Designs: kitchen sink + its theme.css + any compiled react-preview.
for (const name of dirs("designs")) {
  copy(join("designs", name, "index.html"));
  copy(join("designs", name, "theme.css"));
  copy(join("designs", name, "react-preview", "index.html"));
  copy(join("designs", name, "react-preview", "app.bundle.js"));
}

// Layouts and voices: single-file demos.
for (const kind of ["layouts", "voices"]) {
  for (const name of dirs(kind)) copy(join(kind, name, "index.html"));
}

console.log(`built dist/ — ${count} file(s)`);
