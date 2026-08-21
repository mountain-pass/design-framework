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
//
// The page itself is styled the same way a kitchen sink is: markup built from
// shadcn-style Tailwind utility classes, compiled at runtime by the vendored
// Tailwind browser build against a design's theme.css (see designs/*/index.html
// for the pattern this borrows). A "Preview design" dropdown swaps which
// theme.css is compiled against, so this page can demonstrate what each
// design actually looks like — not just its token colours.

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

const option = (item) => `<option value="${esc(item.name)}" title="${esc(item.description)}">${esc(item.name)}</option>`;

const kindLabel = (kind) => (kind === "design" ? "kitchen sink" : kind === "layout" ? "wireframe" : "string sink");

const codeClass = "rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.85em]";

const card = (item, kind) => `
        <a href="${esc(item.href)}" class="group flex flex-col gap-1 rounded-lg border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <span class="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">${kind}</span>
          <span class="font-mono text-base font-semibold">${esc(item.name)}</span>
          <span class="text-sm text-muted-foreground">${esc(item.description)}</span>
          <span class="mt-2 text-xs text-muted-foreground/80">${esc(item.doc.split("/").pop())} &middot; ${kindLabel(kind)}</span>
        </a>`;

const empty = (what) => `
        <p class="text-sm text-muted-foreground">No ${what} yet. Follow <code class="${codeClass}">CREATE-${what.toUpperCase().replace(/S$/, "")}.md</code> to add one.</p>`;

const chevron = `<svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const selectField = (id, labelText, optionsHtml) => `
      <div class="space-y-2">
        <label for="${id}" class="text-sm font-medium leading-none">${labelText}</label>
        <div class="relative">
          <select id="${id}" class="flex h-9 w-full appearance-none rounded-md border border-input bg-background py-1 pl-3 pr-9 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            ${optionsHtml}
          </select>
          ${chevron}
        </div>
      </div>`;

const BTN_OUTLINE =
  "inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const TAB_ACTIVE =
  "shrink-0 whitespace-nowrap border-b-2 border-primary px-1 pb-3 text-sm font-medium text-foreground";
const TAB_INACTIVE =
  "shrink-0 whitespace-nowrap border-b-2 border-transparent px-1 pb-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground";

// DESIGN.md.template, stripped of its leading HTML comment (that comment is
// for someone reading the raw file — the generated output doesn't need it).
const templateRaw = readFileSync(join(ROOT, "DESIGN.md.template"), "utf8").replace(/<!--[\s\S]*?-->\n\n/, "");

// The design this page itself previews on load. Falls back to the first
// design if `slate` is ever renamed or removed.
const DEFAULT_DESIGN = designs.some((d) => d.name === "slate") ? "slate" : (designs[0]?.name ?? "slate");

// The vendored Tailwind browser compiler — same file every kitchen sink loads
// (see vendor/README.md). Resolved by scanning rather than hardcoding the
// version, so an upgrade there doesn't silently go stale here.
const vendorFiles = existsSync(join(ROOT, "vendor"))
  ? readdirSync(join(ROOT, "vendor")).filter((f) => /^tailwind-browser-.+\.js$/.test(f))
  : [];
if (vendorFiles.length !== 1) {
  throw new Error(`expected exactly one vendor/tailwind-browser-*.js, found ${vendorFiles.length}`);
}
const TAILWIND_SRC = `vendor/${vendorFiles[0]}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Framework</title>
<!-- GENERATED FILE — do not edit by hand.
     Run \`node scripts/build-gallery.mjs\` to regenerate. -->

<!-- This page previews each design the same way its own kitchen sink does:
     fetch theme.css, hand it to the Tailwind browser compiler as a
     style[type="text/tailwindcss"] block, and load the vendored compiler.
     Swapping the "Preview design" dropdown replaces that block's text —
     the compiler's own MutationObserver notices and recompiles. See
     designs/*/index.html for the same pattern applied to a single, fixed
     design. This means, like a kitchen sink, this page must be served over
     http(s) — opened from file://, the fetch is blocked. -->
<link rel="preload" as="script" href="${TAILWIND_SRC}">

<script>
  // Applied before first paint to avoid a light flash on a dark-mode reload.
  (function () {
    try {
      if (matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
</script>
</head>
<body class="bg-background text-foreground antialiased">
<div class="mx-auto max-w-6xl px-6 py-16 pb-24">

  <div class="flex flex-wrap items-start justify-between gap-6">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight">Design Framework</h1>
      <p class="mt-3 max-w-[60ch] text-muted-foreground">
        A library of web page designs, layouts and voices, written to be consumed by AI coding agents.
        Pick the ones you want and name them in your prompt.
      </p>
    </div>

    <div class="w-56 shrink-0 space-y-2">
      <label for="preview-design" class="text-sm font-medium leading-none">Preview design</label>
      <div class="relative">
        <select id="preview-design" class="flex h-9 w-full appearance-none rounded-md border border-input bg-background py-1 pl-3 pr-9 text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">${designs.map(option).join("")}</select>
        ${chevron}
      </div>
      <p id="preview-note" role="status" class="hidden text-xs text-muted-foreground"></p>
    </div>
  </div>

  <div class="mt-10 border-b border-border">
    <nav class="-mb-px flex gap-6" role="tablist">
      <button type="button" role="tab" id="tab-get-started" aria-selected="true" aria-controls="panel-get-started" data-tab="get-started" class="${TAB_ACTIVE}">Get Started</button>
      <button type="button" role="tab" id="tab-browse" aria-selected="false" aria-controls="panel-browse" data-tab="browse" class="${TAB_INACTIVE}">Browse</button>
    </nav>
  </div>

  <section id="panel-get-started" role="tabpanel" aria-labelledby="tab-get-started" class="pt-8">
    <p class="max-w-[60ch] text-sm text-muted-foreground">
      Pick a design, a layout and a voice. This generates a <code class="${codeClass}">DESIGN.md</code> — copy it, or save it, into your
      project's repo root. Agents look for <code class="${codeClass}">DESIGN.md</code> by default, so this points them at the right
      combination without you having to name it in every prompt.
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-3">${selectField("pick-design", "Design", designs.map(option).join(""))}${selectField("pick-layout", "Layout", layouts.map(option).join(""))}${selectField("pick-voice", "Voice", voices.map(option).join(""))}
    </div>

    <div class="mt-6 overflow-hidden rounded-lg border border-border bg-card">
      <div class="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span class="font-mono text-xs font-semibold text-muted-foreground">DESIGN.md</span>
        <div class="flex gap-2">
          <button type="button" id="copy-btn" class="${BTN_OUTLINE}">Copy</button>
          <button type="button" id="save-btn" class="${BTN_OUTLINE}">Save</button>
        </div>
      </div>
      <pre class="max-h-[32rem] overflow-auto p-5"><code id="output-code" class="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed"></code></pre>
    </div>
  </section>

  <section id="panel-browse" role="tabpanel" aria-labelledby="tab-browse" class="hidden pt-8">
    <h2 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Designs</h2>
    <p class="mt-1 max-w-[60ch] text-sm text-muted-foreground">
      What it looks like — colour, type, spacing, and the styling of every component.
      Each demo is a <strong class="font-semibold text-foreground">kitchen sink</strong>: the same components, in the same order, so designs can be compared directly.
    </p>
    <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${designs.length ? designs.map((d) => card(d, "design")).join("") : empty("designs")}
    </div>

    <h2 class="mt-14 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Layouts</h2>
    <p class="mt-1 max-w-[60ch] text-sm text-muted-foreground">
      Where everything goes — regions, sizes, scroll behaviour, and responsive rules.
      Each demo is a <strong class="font-semibold text-foreground">wireframe</strong>: greyscale, with <code class="${codeClass}">&lt;placeholder&gt;</code> labels marking what belongs where.
    </p>
    <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${layouts.length ? layouts.map((l) => card(l, "layout")).join("") : empty("layouts")}
    </div>

    <h2 class="mt-14 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Voices</h2>
    <p class="mt-1 max-w-[60ch] text-sm text-muted-foreground">
      How it speaks — attributes, mechanics, vocabulary, and the actual strings a product says.
      Each demo is a <strong class="font-semibold text-foreground">string sink</strong>: the same writing situations, in the same order, in greyscale, so voices can be compared line for line.
    </p>
    <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${voices.length ? voices.map((v) => card(v, "voice")).join("") : empty("voices")}
    </div>
  </section>

</div>
<script>
(function () {
  var TEMPLATE = ${JSON.stringify(templateRaw)};

  var TAB_ACTIVE = ${JSON.stringify(TAB_ACTIVE)};
  var TAB_INACTIVE = ${JSON.stringify(TAB_INACTIVE)};
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.className = active ? TAB_ACTIVE : TAB_INACTIVE;
        t.setAttribute("aria-selected", active ? "true" : "false");
        document.getElementById("panel-" + t.dataset.tab).classList.toggle("hidden", !active);
      });
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

  // Preview design — this page renders itself the same way a kitchen sink
  // renders a design: fetch theme.css, feed it to the Tailwind browser
  // compiler as a style[type="text/tailwindcss"] block, load the compiler.
  // Switching designs just replaces that block's text; the compiler watches
  // it for changes and recompiles the whole page's utility classes against
  // the new tokens.
  var DEFAULT_DESIGN = ${JSON.stringify(DEFAULT_DESIGN)};
  var DESIGN_NAMES = ${JSON.stringify(designs.map((d) => d.name))};
  var TAILWIND_SRC = ${JSON.stringify(TAILWIND_SRC)};
  var STORAGE_KEY = "design-framework:preview-design";

  var themeSelect = document.getElementById("preview-design");
  var themeNote = document.getElementById("preview-note");
  var themeStyle = null;
  var compilerLoaded = false;
  var currentDesign = null;

  function showBanner(message) {
    var banner = document.createElement("p");
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "margin:0;padding:1rem 1.25rem;font:500 14px/1.5 ui-sans-serif,system-ui,sans-serif;" +
      "background:#7f1d1d;color:#fff";
    banner.textContent =
      "This page could not load its design tokens (" + message + "), so it is rendering unstyled. " +
      "Serve this folder over http(s) rather than opening the file directly.";
    document.body.prepend(banner);
  }

  function loadDesign(name) {
    fetch("designs/" + name + "/theme.css")
      .then(function (res) {
        if (!res.ok) throw new Error("theme.css \\u2192 " + res.status);
        return res.text();
      })
      .then(function (css) {
        if (!themeStyle) {
          themeStyle = document.createElement("style");
          themeStyle.type = "text/tailwindcss";
          document.head.prepend(themeStyle);
        }
        themeStyle.textContent = '@import "tailwindcss";\\n' + css;
        if (!compilerLoaded) {
          compilerLoaded = true;
          var script = document.createElement("script");
          script.src = TAILWIND_SRC;
          document.head.appendChild(script);
        }
        currentDesign = name;
        themeNote.classList.add("hidden");
      })
      .catch(function (err) {
        if (currentDesign) {
          themeSelect.value = currentDesign;
          themeNote.textContent = "Couldn't load \\"" + name + "\\" — serve this page over http(s) to preview designs.";
          themeNote.classList.remove("hidden");
        } else {
          showBanner(err.message);
        }
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
