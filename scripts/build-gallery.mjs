#!/usr/bin/env node
// Regenerates the root index.html from the folders in designs/, layouts/ and voices/.
// No dependencies — Node 18+.
//
//   node scripts/build-gallery.mjs
//
// Descriptions come from the blockquote line at the top of each DESIGN.md /
// LAYOUT.md / VOICE.md, so the gallery cannot drift from the instruction files.
//
// The page has two tabs:
//   Get Started — pick a design/layout/voice from three dropdowns and get a
//     filled-in DESIGN.md.template, ready to copy or save into a project.
//   Browse — the three kitchen-sink / wireframe / string-sink card grids.

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
const voices = collect("voices", "VOICE.md");

const card = (item, kind) => `
        <a class="card" href="${esc(item.href)}">
          <span class="card-kind">${kind}</span>
          <span class="card-name">${esc(item.name)}</span>
          <span class="card-desc">${esc(item.description)}</span>
          <span class="card-meta">${esc(item.doc.split("/").pop())} &middot; ${kind === "design" ? "kitchen sink" : kind === "layout" ? "wireframe" : "string sink"}</span>
        </a>`;

const empty = (what) => `
        <p class="empty">No ${what} yet. Follow <code>CREATE-${what.toUpperCase().replace(/S$/, "")}.md</code> to add one.</p>`;

const option = (item) => `<option value="${esc(item.name)}" title="${esc(item.description)}">${esc(item.name)}</option>`;

// DESIGN.md.template, stripped of its leading HTML comment (that comment is
// for someone reading the raw file — the generated output doesn't need it).
const templateRaw = readFileSync(join(ROOT, "DESIGN.md.template"), "utf8").replace(/<!--[\s\S]*?-->\n\n/, "");

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
  h2:first-child { margin-top: 0; }
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

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-top: 2.5rem;
    border-bottom: 1px solid var(--line);
  }
  .tab {
    appearance: none;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    padding: 0.65rem 0.25rem;
    font: inherit;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--dim);
    cursor: pointer;
  }
  .tab + .tab { margin-left: 1.25rem; }
  .tab:hover { color: var(--fg); }
  .tab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .tab.active { color: var(--fg); border-bottom-color: var(--accent); }

  .tab-panel { display: none; padding-top: 2.5rem; }
  .tab-panel.active { display: block; }

  .picker {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    margin-bottom: 1.5rem;
  }
  .picker label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--dim);
  }
  .picker select {
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--fg);
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
  }
  .picker select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .output {
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }
  .output-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: var(--panel);
    border-bottom: 1px solid var(--line);
  }
  .output-label {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--dim);
  }
  .output-actions { display: flex; gap: 0.5rem; }
  .output-actions button {
    appearance: none;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--fg);
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
  }
  .output-actions button:hover { border-color: var(--accent); }
  .output-actions button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .output pre {
    margin: 0;
    padding: 1.25rem;
    max-height: 32rem;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
</head>
<body>
<div class="wrap">

  <h1>Design Framework</h1>
  <p class="lede">
    A library of web page designs, layouts and voices, written to be consumed by AI coding agents.
    Pick the ones you want and name them in your prompt.
  </p>

  <div class="tabs" role="tablist">
    <button type="button" class="tab active" role="tab" id="tab-get-started" aria-selected="true" aria-controls="panel-get-started" data-tab="get-started">Get Started</button>
    <button type="button" class="tab" role="tab" id="tab-browse" aria-selected="false" aria-controls="panel-browse" data-tab="browse">Browse</button>
  </div>

  <section id="panel-get-started" class="tab-panel active" role="tabpanel" aria-labelledby="tab-get-started">
    <p class="axis">
      Pick a design, a layout and a voice. This generates a <code>DESIGN.md</code> — copy it, or save it, into your
      project's repo root. Agents look for <code>DESIGN.md</code> by default, so this points them at the right
      combination without you having to name it in every prompt.
    </p>

    <div class="picker">
      <label>Design
        <select id="pick-design">${designs.map(option).join("")}</select>
      </label>
      <label>Layout
        <select id="pick-layout">${layouts.map(option).join("")}</select>
      </label>
      <label>Voice
        <select id="pick-voice">${voices.map(option).join("")}</select>
      </label>
    </div>

    <div class="output">
      <div class="output-bar">
        <span class="output-label">DESIGN.md</span>
        <div class="output-actions">
          <button type="button" id="copy-btn">Copy</button>
          <button type="button" id="save-btn">Save</button>
        </div>
      </div>
      <pre><code id="output-code"></code></pre>
    </div>
  </section>

  <section id="panel-browse" class="tab-panel" role="tabpanel" aria-labelledby="tab-browse">
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

    <h2>Voices</h2>
    <p class="axis">
      How it speaks — attributes, mechanics, vocabulary, and the actual strings a product says.
      Each demo is a <strong>string sink</strong>: the same writing situations, in the same order, in greyscale, so voices can be compared line for line.
    </p>
    <div class="grid">${voices.length ? voices.map((v) => card(v, "voice")).join("") : empty("voices")}
    </div>
  </section>

  <div class="how">
    <h3>Using these</h3>
    <p>The three axes combine freely. Name the ones you want in your prompt:</p>
    <p class="quote">Build me a settings page. Use the styling and components from the
      <code>${esc(designs[0]?.name ?? "&lt;design&gt;")}</code> design, the
      <code>${esc(layouts[0]?.name ?? "&lt;layout&gt;")}</code> layout, and the
      <code>${esc(voices[0]?.name ?? "&lt;voice&gt;")}</code> voice.</p>
    <p>The agent reads the <code>DESIGN.md</code>, <code>LAYOUT.md</code> and <code>VOICE.md</code> in the named folders,
      copies the design's <code>theme.css</code> into the project, and fills the layout's regions with
      the design's components. <code>CLAUDE.md</code> in the repo root has the full agent instructions.</p>
    <h3>Adding your own</h3>
    <p>Point an agent at <code>CREATE-DESIGN.md</code>, <code>CREATE-LAYOUT.md</code> or
      <code>CREATE-VOICE.md</code> along with what you want. All three are written as complete prompts. Run <code>node scripts/check.mjs</code> and
      <code>node scripts/build-gallery.mjs</code> when you are done.</p>
  </div>

  <footer>
    ${designs.length} design${designs.length === 1 ? "" : "s"} &middot;
    ${layouts.length} layout${layouts.length === 1 ? "" : "s"} &middot;
    ${voices.length} voice${voices.length === 1 ? "" : "s"} &middot;
    generated by <code>scripts/build-gallery.mjs</code>
  </footer>

</div>
<script>
(function () {
  var TEMPLATE = ${JSON.stringify(templateRaw)};

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  var designSel = document.getElementById("pick-design");
  var layoutSel = document.getElementById("pick-layout");
  var voiceSel = document.getElementById("pick-voice");
  var output = document.getElementById("output-code");

  function render() {
    var filled = TEMPLATE
      .split("{{DESIGN}}").join(designSel.value)
      .split("{{LAYOUT}}").join(layoutSel.value)
      .split("{{VOICE}}").join(voiceSel.value);
    output.textContent = filled;
  }
  [designSel, layoutSel, voiceSel].forEach(function (sel) {
    sel.addEventListener("change", render);
  });
  render();

  var copyBtn = document.getElementById("copy-btn");
  copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(output.textContent).then(function () {
      var prev = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      setTimeout(function () { copyBtn.textContent = prev; }, 1500);
    });
  });

  document.getElementById("save-btn").addEventListener("click", function () {
    var blob = new Blob([output.textContent], { type: "text/markdown" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "DESIGN.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
</script>
</body>
</html>
`;

writeFileSync(join(ROOT, "index.html"), html);
console.log(
  `\nWrote index.html — ${designs.length} design(s), ${layouts.length} layout(s), ${voices.length} voice(s)\n` +
    [...designs.map((d) => `  design  ${d.name}`), ...layouts.map((l) => `  layout  ${l.name}`),
     ...voices.map((v) => `  voice   ${v.name}`)].join("\n") +
    "\n"
);
