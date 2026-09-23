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
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const design = process.argv[2] || "slate";
const checkOnly = process.argv.includes("--check-only");
const designDir = join(ROOT, "designs", design);
const entry = join(designDir, "react-preview", "app.tsx");

// The kitchen sink sections re-rendered by React in the preview, from the actual
// components. Everything else is kept verbatim, so the preview is the kitchen
// sink 1:1 with these sections powered by the real components.
//
// Deliberately excluded, and kept verbatim:
//   - menu, dialog: the kitchen sink draws these overlays statically *open and
//     inline* as a documentation device; a real Radix component opens in a
//     portal on interaction, so it cannot reproduce that static-open panel.
//   - form, nav: bespoke page compositions (a specific form layout; a top bar +
//     sidebar + rail + mobile bar). They render identically verbatim and
//     componentising them ports layout, not new components.
const COMPONENT_SECTIONS = ["buttons", "inputs", "card", "table", "badges", "alerts", "tabs"];

// Generate react-preview/index.html FROM the kitchen sink: same shell (styles,
// header, table of contents), the same non-component sections verbatim, and a
// <div data-preview-mount="id"> placeholder where each component section's demo
// body was — app.tsx mounts the React version into it.
function generatePreviewHtml() {
  let html = readFileSync(join(designDir, "index.html"), "utf8");
  // Relative paths shift by one folder in react-preview/.
  html = html.replace(/fetch\(\s*["']theme\.css["']\s*\)/g, 'fetch("../theme.css")');
  html = html.replace(/\.\.\/\.\.\/vendor\/tailwind-browser-/g, "../../../vendor/tailwind-browser-");
  // The DESIGN.md link points at source the deploy does not serve.
  html = html.replace(/\s*<a href="\.\/DESIGN\.md"[\s\S]*?<\/a>/, "");

  // Tag each section so a reader can tell, at a glance, what is actually React
  // on this page. A "React component" pill marks the sections mounted from
  // components/ui/*.tsx; a muted "Static markup" pill marks the rest (a
  // foundation, a page composition, or an overlay a portalled component can't
  // draw open inline). Preview-only chrome — the kitchen sink never carries it.
  const live = new Set(COMPONENT_SECTIONS);
  const pill = (isLive) =>
    isLive
      ? `<span class="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[0.6875rem] font-medium text-primary sm:right-6"><span class="h-1.5 w-1.5 rounded-full bg-current"></span>React component</span>`
      : `<span class="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground sm:right-6"><span class="h-1.5 w-1.5 rounded-full bg-current opacity-40"></span>Static markup</span>`;
  html = html.replace(
    /<section id="([^"]+)" class="ks-section([^"]*)">/g,
    (_m, id, extra) => `<section id="${id}" class="ks-section${extra} relative">\n  ${pill(live.has(id))}`
  );

  // A legend, so the two pills read without guesswork.
  const legend = `  <div class="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
    <span class="font-medium">Live preview</span>
    <span class="inline-flex items-center gap-2"><span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[0.6875rem] font-medium text-primary"><span class="h-1.5 w-1.5 rounded-full bg-current"></span>React component</span><span class="text-muted-foreground">rendered from <span class="font-mono text-xs">components/ui/*.tsx</span></span></span>
    <span class="inline-flex items-center gap-2"><span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground"><span class="h-1.5 w-1.5 rounded-full bg-current opacity-40"></span>Static markup</span><span class="text-muted-foreground">kitchen-sink HTML — a foundation, a composition, or an overlay shown statically open</span></span>
  </div>\n`;
  html = html.replace(/(<main[^>]*>\n)/, `$1${legend}`);

  // Swap each component section's demo body (everything after its ks-note) for a
  // mount point, keeping the section's id, class and its title/lede/note.
  for (const id of COMPONENT_SECTIONS) {
    const re = new RegExp(`(<section id="${id}"[\\s\\S]*?<p class="ks-note">[\\s\\S]*?</p>)[\\s\\S]*?(</section>)`);
    if (!re.test(html)) throw new Error(`kitchen sink section #${id} not found (or has no ks-note)`);
    html = html.replace(re, `$1\n  <div data-preview-mount="${id}"></div>\n$2`);
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${design} — live component preview</title>`);
  html = html.replace("</body>", '<script src="app.bundle.js"></script>\n</body>');
  writeFileSync(join(designDir, "react-preview", "index.html"), html);
  console.log(`${design}: wrote react-preview/index.html (kitchen sink shell + ${COMPONENT_SECTIONS.length} React sections)`);
}

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
  if (!checkOnly) generatePreviewHtml();
} catch (err) {
  console.error(`\n${design}: build FAILED — a component does not compile (see above).`);
  process.exit(1);
}
