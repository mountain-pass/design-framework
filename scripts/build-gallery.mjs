#!/usr/bin/env node
// Regenerates the root index.html from the folders in designs/ and layouts/.
// No dependencies — Node 18+.
//
//   node scripts/build-gallery.mjs
//
// Descriptions come from the blockquote line at the top of each DESIGN.md /
// LAYOUT.md, so the gallery cannot drift from the instruction files.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const folders = (dir) => {
  const p = join(ROOT, dir);
  if (!existsSync(p)) return [];
  return readdirSync(p)
    .filter((n) => !n.startsWith(".") && !n.startsWith("_") && n !== "README.md")
    .filter((n) => statSync(join(p, n)).isDirectory())
    .sort();
};

// The `> ...` blockquote immediately under the `# Title` heading.
const description = (mdPath) => {
  if (!existsSync(mdPath)) return "";
  const lines = readFileSync(mdPath, "utf8").split("\n");
  const out = [];
  for (const line of lines) {
    if (line.startsWith(">")) out.push(line.replace(/^>\s?/, "").trim());
    else if (out.length) break;
  }
  return out.join(" ").trim();
};

const collect = (dir, mdName) =>
  folders(dir).map((name) => ({
    name,
    href: `${dir}/${name}/index.html`,
    doc: `${dir}/${name}/${mdName}`,
    description: description(join(ROOT, dir, name, mdName)),
  }));

const designs = collect("designs", "DESIGN.md");
const layouts = collect("layouts", "LAYOUT.md");

const card = (item, kind) => `
        <a class="card" href="${esc(item.href)}">
          <span class="card-kind">${kind}</span>
          <span class="card-name">${esc(item.name)}</span>
          <span class="card-desc">${esc(item.description)}</span>
          <span class="card-meta">${esc(item.doc.split("/").pop())} &middot; ${kind === "design" ? "kitchen sink" : "wireframe"}</span>
        </a>`;

const empty = (what) => `
        <p class="empty">No ${what} yet. Follow <code>CREATE-${what.toUpperCase().replace(/S$/, "")}.md</code> to add one.</p>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Framework</title>
<!-- GENERATED FILE — do not edit by hand.
     Run \`node scripts/build-gallery.mjs\` to regenerate. -->
<style>
  :root {
    --bg: #ffffff;
    --fg: #18181b;
    --dim: #71717a;
    --line: #e4e4e7;
    --panel: #fafafa;
    --accent: #4338ca;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0c0c0f;
      --fg: #f4f4f5;
      --dim: #a1a1aa;
      --line: #27272a;
      --panel: #17171a;
      --accent: #a5b4fc;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font: 400 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 68rem; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
  h1 { margin: 0; font-size: 2rem; font-weight: 600; letter-spacing: -0.025em; }
  .lede { margin: 0.75rem 0 0; max-width: 60ch; color: var(--dim); }
  .lede code { font-size: 0.9em; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0.1em 0.35em;
  }
  h2 {
    margin: 3.5rem 0 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--dim);
  }
  .axis { margin: 0 0 1.25rem; max-width: 60ch; color: var(--dim); font-size: 0.875rem; }
  .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.25rem;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--panel);
    text-decoration: none;
    color: inherit;
    transition: border-color 120ms, transform 120ms;
  }
  .card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .card-kind {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--dim);
  }
  .card-name {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1rem;
    font-weight: 600;
  }
  .card-desc { font-size: 0.875rem; color: var(--dim); }
  .card-meta {
    margin-top: 0.35rem;
    font-size: 0.75rem;
    color: var(--dim);
    opacity: 0.8;
  }
  .empty { color: var(--dim); font-size: 0.875rem; }
  .how {
    margin-top: 4rem;
    padding: 1.5rem;
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  .how h3 { margin: 0 0 0.5rem; font-size: 0.9375rem; font-weight: 600; }
  .how p { margin: 0 0 1rem; color: var(--dim); font-size: 0.875rem; max-width: 68ch; }
  .how p:last-child { margin-bottom: 0; }
  .quote {
    border-left: 2px solid var(--line);
    padding-left: 0.85rem;
    font-style: italic;
  }
  footer { margin-top: 3rem; color: var(--dim); font-size: 0.8125rem; }
  a.plain { color: var(--accent); }
</style>
</head>
<body>
<div class="wrap">

  <h1>Design Framework</h1>
  <p class="lede">
    A library of web page designs and layouts, written to be consumed by AI coding agents.
    Pick one of each and name them in your prompt.
  </p>

  <h2>Designs</h2>
  <p class="axis">
    What it looks like — colour, type, spacing, and the styling of every component.
    Each demo is a <strong>kitchen sink</strong>: the same components, in the same order, so designs can be compared directly.
  </p>
  <div class="grid">${designs.length ? designs.map((d) => card(d, "design")).join("") : empty("designs")}
  </div>

  <h2>Layouts</h2>
  <p class="axis">
    Where everything goes — regions, sizes, scroll behaviour, and responsive rules.
    Each demo is a <strong>wireframe</strong>: greyscale, with <code>&lt;placeholder&gt;</code> labels marking what belongs where.
  </p>
  <div class="grid">${layouts.length ? layouts.map((l) => card(l, "layout")).join("") : empty("layouts")}
  </div>

  <div class="how">
    <h3>Using these</h3>
    <p>Any design combines with any layout. Name them in your prompt:</p>
    <p class="quote">Build me a settings page. Use the styling and components from the
      <code>${esc(designs[0]?.name ?? "&lt;design&gt;")}</code> design, and the
      <code>${esc(layouts[0]?.name ?? "&lt;layout&gt;")}</code> layout.</p>
    <p>The agent reads the <code>DESIGN.md</code> and <code>LAYOUT.md</code> in the named folders,
      copies the design's <code>theme.css</code> into the project, and fills the layout's regions with
      the design's components. <code>CLAUDE.md</code> in the repo root has the full agent instructions.</p>
    <h3>Adding your own</h3>
    <p>Point an agent at <code>CREATE-DESIGN.md</code> or <code>CREATE-LAYOUT.md</code> along with what
      you want. Both are written as complete prompts. Run <code>node scripts/check.mjs</code> and
      <code>node scripts/build-gallery.mjs</code> when you are done.</p>
  </div>

  <footer>
    ${designs.length} design${designs.length === 1 ? "" : "s"} &middot;
    ${layouts.length} layout${layouts.length === 1 ? "" : "s"} &middot;
    generated by <code>scripts/build-gallery.mjs</code>
  </footer>

</div>
</body>
</html>
`;

writeFileSync(join(ROOT, "index.html"), html);
console.log(
  `\nWrote index.html — ${designs.length} design(s), ${layouts.length} layout(s)\n` +
    [...designs.map((d) => `  design  ${d.name}`), ...layouts.map((l) => `  layout  ${l.name}`)].join("\n") +
    "\n"
);
