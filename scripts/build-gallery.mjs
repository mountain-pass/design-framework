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

// The design this page itself previews on load. Falls back to the first
// design if `slate` is ever renamed or removed.
const DEFAULT_DESIGN = designs.some((d) => d.name === "slate") ? "slate" : (designs[0]?.name ?? "slate");

// Pulls the flat `--token: value;` declarations out of a design's theme.css
// `:root { ... }` and `.dark { ... }` blocks — the same tokens the kitchen
// sinks use, extracted without the Tailwind build step this plain page
// doesn't run.
const extractThemeVars = (cssText) => ({
  light: (cssText.match(/:root\s*\{([^}]*)\}/) || ["", ""])[1].trim(),
  dark: (cssText.match(/\.dark\s*\{([^}]*)\}/) || ["", ""])[1].trim(),
});

const defaultThemeVars = extractThemeVars(
  readFileSync(join(ROOT, "designs", DEFAULT_DESIGN, "theme.css"), "utf8")
);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Framework</title>
<!-- GENERATED FILE — do not edit by hand.
     Run \`node scripts/build-gallery.mjs\` to regenerate. -->
<style>
  /* Default preview theme (${DEFAULT_DESIGN}) — replaced at runtime by
     #design-vars when a different design is picked from the dropdown. */
  :root {
    ${defaultThemeVars.light}
  }
  @media (prefers-color-scheme: dark) {
    :root {
      ${defaultThemeVars.dark}
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font: 400 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 68rem; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
  h1 { margin: 0; font-size: 2rem; font-weight: 600; letter-spacing: -0.025em; }
  .lede { margin: 0.75rem 0 0; max-width: 60ch; color: var(--muted-foreground); }
  .lede code { font-size: 0.9em; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.1em 0.35em;
  }
  h2 {
    margin: 3.5rem 0 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
  }
  h2:first-child { margin-top: 0; }
  .axis { margin: 0 0 1.25rem; max-width: 60ch; color: var(--muted-foreground); font-size: 0.875rem; }
  .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    text-decoration: none;
    color: inherit;
    transition: border-color 120ms, transform 120ms;
  }
  .card:hover { border-color: var(--primary); transform: translateY(-2px); }
  .card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
  .card-kind {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted-foreground);
  }
  .card-name {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1rem;
    font-weight: 600;
  }
  .card-desc { font-size: 0.875rem; color: var(--muted-foreground); }
  .card-meta {
    margin-top: 0.35rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    opacity: 0.8;
  }
  .empty { color: var(--muted-foreground); font-size: 0.875rem; }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .theme-picker {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted-foreground);
  }
  .theme-picker-note {
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    color: var(--muted-foreground);
    max-width: 16rem;
  }
  .theme-picker-note[hidden] { display: none; }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-top: 2.5rem;
    border-bottom: 1px solid var(--border);
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
    color: var(--muted-foreground);
    cursor: pointer;
  }
  .tab + .tab { margin-left: 1.25rem; }
  .tab:hover { color: var(--foreground); }
  .tab:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
  .tab.active { color: var(--foreground); border-bottom-color: var(--primary); }

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
    color: var(--muted-foreground);
  }
  .picker select,
  .theme-picker select {
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--foreground);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
  }
  .picker select:focus-visible,
  .theme-picker select:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

  .output {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .output-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: var(--card);
    border-bottom: 1px solid var(--border);
  }
  .output-label {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted-foreground);
  }
  .output-actions { display: flex; gap: 0.5rem; }
  .output-actions button {
    appearance: none;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--foreground);
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
  }
  .output-actions button:hover { border-color: var(--primary); }
  .output-actions button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
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

  <div class="page-header">
    <div>
      <h1>Design Framework</h1>
      <p class="lede">
        A library of web page designs, layouts and voices, written to be consumed by AI coding agents.
        Pick the ones you want and name them in your prompt.
      </p>
    </div>
    <label class="theme-picker">
      Preview design
      <select id="preview-design">${designs.map(option).join("")}</select>
      <span id="preview-note" class="theme-picker-note" role="status" hidden></span>
    </label>
  </div>

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

  // Preview design — swaps this page's own token values for a chosen
  // design's, so the framework's own landing page can show what each
  // design looks like without a build step.
  var DEFAULT_DESIGN = ${JSON.stringify(DEFAULT_DESIGN)};
  var DESIGN_NAMES = ${JSON.stringify(designs.map((d) => d.name))};
  var STORAGE_KEY = "design-framework:preview-design";

  var themeSelect = document.getElementById("preview-design");
  var themeNote = document.getElementById("preview-note");
  var themeStyle = null;

  function applyThemeVars(cssText) {
    var light = (cssText.match(/:root\\s*\\{([^}]*)\\}/) || ["", ""])[1];
    var dark = (cssText.match(/\\.dark\\s*\\{([^}]*)\\}/) || ["", ""])[1];
    if (!themeStyle) {
      themeStyle = document.createElement("style");
      themeStyle.id = "design-vars";
      document.head.appendChild(themeStyle);
    }
    themeStyle.textContent =
      ":root {" + light + "}\\n@media (prefers-color-scheme: dark) {\\n  :root {" + dark + "}\\n}";
  }

  var currentDesign = null;

  function loadDesign(name) {
    fetch("designs/" + name + "/theme.css")
      .then(function (res) {
        if (!res.ok) throw new Error("theme.css → " + res.status);
        return res.text();
      })
      .then(function (css) {
        applyThemeVars(css);
        currentDesign = name;
        themeNote.hidden = true;
      })
      .catch(function () {
        if (currentDesign) themeSelect.value = currentDesign;
        themeNote.textContent = "Couldn't load \\"" + name + "\\" — serve this page over http(s) to preview other designs.";
        themeNote.hidden = false;
      });
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var initial = saved && DESIGN_NAMES.indexOf(saved) !== -1 ? saved : DEFAULT_DESIGN;
  themeSelect.value = initial;
  loadDesign(initial);

  themeSelect.addEventListener("change", function () {
    var value = themeSelect.value;
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    loadDesign(value);
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
