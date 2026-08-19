#!/usr/bin/env node
// Validates every design and layout folder against the contracts in shared/.
// No dependencies — Node 18+.
//
//   node scripts/check.mjs

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The kitchen sink contract — shared/COMPONENTS.md. Order matters.
const SECTIONS = [
  "tokens", "typography", "elevation",
  "buttons", "inputs", "form",
  "card", "table", "list", "badges", "avatar", "dataviz",
  "nav", "tabs", "breadcrumb", "menu",
  "alerts", "dialog", "progress", "toast", "empty",
  "page-header", "hero", "features", "pricing", "testimonial", "cta", "footer",
  "icons", "motion",
];

// The string sink contract — shared/COPY.md. Order matters.
const SLOTS = [
  "attributes", "mechanics",
  "buttons", "menu",
  "labels", "validation",
  "empty", "loading", "errors",
  "confirm", "toast", "alerts",
  "onboarding", "notifications", "microcopy",
  "vocabulary", "antipatterns", "examples",
];

// The token contract — shared/TOKENS.md.
const TOKENS = [
  "radius",
  "background", "foreground",
  "card", "card-foreground",
  "popover", "popover-foreground",
  "primary", "primary-foreground",
  "secondary", "secondary-foreground",
  "muted", "muted-foreground",
  "accent", "accent-foreground",
  "destructive", "destructive-foreground",
  "border", "input", "ring",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  "sidebar", "sidebar-foreground",
  "sidebar-primary", "sidebar-primary-foreground",
  "sidebar-accent", "sidebar-accent-foreground",
  "sidebar-border", "sidebar-ring",
];

const DARK_EXEMPT = new Set(["radius"]); // --radius is defined once, in :root

// The accessibility contract — shared/ACCESSIBILITY.md.
//
// Pairs are [foreground, background, minimum ratio]. 4.5 is WCAG 1.4.3 for body
// text; 3.0 is WCAG 1.4.11 for UI component boundaries and focus indicators.
//
// `--input` is held to 3:1 because a text field's border is usually the only thing
// identifying it as a text field — a UI boundary, not a decorative hairline.
// `--border` is deliberately NOT checked: it is normally a divider, and dividers
// carry no information. A design that identifies controls with `--border` should
// say so in DESIGN.md and hold itself to 3:1 there.
const CONTRAST_PAIRS = [
  ["foreground", "background", 4.5],
  ["muted-foreground", "background", 4.5],
  ["card-foreground", "card", 4.5],
  ["popover-foreground", "popover", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["secondary-foreground", "secondary", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["destructive-foreground", "destructive", 4.5],
  ["primary", "background", 4.5],
  ["destructive", "background", 4.5],
  ["sidebar-foreground", "sidebar", 4.5],
  ["sidebar-primary-foreground", "sidebar-primary", 4.5],
  ["sidebar-accent-foreground", "sidebar-accent", 4.5],
  ["input", "background", 3.0],
  ["ring", "background", 3.0],
];

// Contrast failures are errors. Every design in this repo currently clears the
// baseline, so a new one that does not is a regression, not a known issue. If you
// are mid-way through building a design and want these downgraded while you work,
// set this to `warn` — but do not commit it that way.
const CONTRAST_LEVEL = "fail";

let errors = 0;
let warnings = 0;
const problems = [];

const fail = (folder, msg) => { problems.push({ folder, msg, level: "error" }); errors++; };
const warn = (folder, msg) => { problems.push({ folder, msg, level: "warn" }); warnings++; };

const folders = (dir) => {
  const p = join(ROOT, dir);
  if (!existsSync(p)) return [];
  return readdirSync(p)
    .filter((n) => !n.startsWith(".") && n !== "_template" && n !== "README.md")
    .filter((n) => statSync(join(p, n)).isDirectory())
    .sort();
};

const read = (...parts) => readFileSync(join(ROOT, ...parts), "utf8");

// Extracts the body of a rule block. `selector` must be a regex matching the
// selector AND its opening brace, anchored to the start of a line — matching a
// bare ".dark" would otherwise hit the `@custom-variant dark (&:is(.dark *))`
// declaration and silently validate the wrong block.
const block = (css, selector) => {
  const m = selector.exec(css);
  if (!m) return null;
  const open = css.indexOf("{", m.index);
  if (open === -1) return null;
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}" && --depth === 0) return css.slice(open + 1, j);
  }
  return null;
};

const ROOT_RULE = () => /^[ \t]*:root[ \t]*\{/m;
const DARK_RULE = () => /^[ \t]*\.dark\b[^{]*\{/m;

// ------------------------------------------------------------- contrast ---
// oklch() -> linear-light sRGB, per CSS Color 4. Values are returned before
// gamma encoding, which is exactly what WCAG relative luminance wants, so no
// round trip through 8-bit hex is needed. Out-of-gamut components are clipped,
// which is a rough gamut map but accurate enough to judge a ratio by.

const oklchToLinearSrgb = (L, C, H) => {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const clamp = (c) => Math.max(0, Math.min(1, c));

const luminance = ([r, g, b]) =>
  0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(b);

const contrast = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Only oklch() is understood, because TOKENS.md requires it. Anything else
// returns null and is reported as unresolvable rather than silently passing.
const parseColour = (value) => {
  const m = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(value ?? "");
  if (!m) return null;
  const L = m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  return oklchToLinearSrgb(L, parseFloat(m[2]), parseFloat(m[3]));
};

const customProperties = (cssBlock) => {
  const out = {};
  for (const m of (cssBlock ?? "").matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
};

// ------------------------------------------------------- length budgets ---
// The one place the axes negotiate: a voice publishes character budgets per
// slot and a design sizes its components around them. That contract is only
// real if the voice's own specimens honour it, so the budgets are parsed out
// of VOICE.md and checked against the strings in the string sink.
//
// Specimens opt in with data-budget="<key>". The attribute is deliberately not
// `data-slot`, which shadcn/ui already uses on its own components.

const BUDGET_KEYS = {
  "button label": "button",
  "field label": "field-label",
  "help text": "help",
  "toast": "toast",
  "error message": "error",
  "empty state heading": "empty-heading",
  "empty state body": "empty-body",
  "page title": "page-title",
  "notification subject": "notification-subject",
  "tooltip": "tooltip",
};

// Reads the table under "## Length budgets". The first numeric cell after the
// slot name is that voice's own budget; later columns (a comparison against
// another voice, say) are ignored.
const parseBudgets = (md) => {
  const heading = /^##\s*.*Length budgets\s*$/im.exec(md);
  if (!heading) return null;
  let rest = md.slice(heading.index + heading[0].length);
  const next = /^##\s/m.exec(rest);
  if (next) rest = rest.slice(0, next.index);

  const out = {};
  for (const row of rest.matchAll(/^\|([^|]+)\|([^|]+)\|/gm)) {
    const label = row[1].replace(/[`*]/g, "").trim().toLowerCase();
    const key = BUDGET_KEYS[label];
    if (!key) continue;
    const n = /(\d+)/.exec(row[2]);
    if (n) out[key] = parseInt(n[1], 10);
  }
  return out;
};

// Rendered text of a specimen: inner tags stripped, entities decoded,
// whitespace collapsed — what a reader actually sees, which is what a budget
// is about.
const renderedText = (fragment) =>
  fragment
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&middot;/g, "·")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const budgetSpecimens = (html) =>
  [...html.matchAll(/<([a-z]+)[^>]*\bdata-budget="([a-z-]+)"[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => ({ key: m[2], text: renderedText(m[3]) }));

// ------------------------------------------------------------------ vendor ---
//
// The Tailwind compiler is committed to vendor/ rather than loaded from a CDN,
// so that a demo's rendering is a property of the commit (see vendor/README.md).
// The version lives in the filename, which means a half-finished upgrade would
// leave pages running different compilers. The expected name is derived from
// what is actually on disk, so there is only one place to change it.

const vendored = existsSync(join(ROOT, "vendor"))
  ? readdirSync(join(ROOT, "vendor")).filter((f) => /^tailwind-browser-.+\.js$/.test(f))
  : [];

if (vendored.length !== 1) {
  fail(
    "vendor",
    `expected exactly one tailwind-browser-*.js, found ${vendored.length}${vendored.length ? ` (${vendored.join(", ")})` : ""}`
  );
}

const TAILWIND = vendored.length === 1 ? `../../vendor/${vendored[0]}` : null;

// The vendored compiler is the only local subresource a demo may load. Anything
// else has to be inline: a design folder travels as its index.html plus its
// theme.css, and wireframes and string sinks open straight from disk.
function checkSubresources(label, html, { tailwind = true } = {}) {
  if (tailwind && TAILWIND && !html.includes(TAILWIND)) {
    const found = html.match(/tailwind-browser-[^"']+\.js|cdn\.jsdelivr\.net[^"']*/);
    fail(
      label,
      found
        ? `index.html loads ${found[0]} — every page must run the vendored ${vendored[0]}`
        : `index.html does not load the vendored Tailwind compiler (${TAILWIND})`
    );
  }
  const local = (
    html.match(
      /<(?:link|script|img)[^>]*(?:href|src)="(?!https?:|data:|#|mailto:)[^"]+\.(?:css|js|png|jpe?g|svg|webp)"/g
    ) || []
  ).filter((tag) => !tag.includes("vendor/tailwind-browser-"));
  if (local.length) {
    fail(label, `index.html references ${local.length} local file(s) besides the vendored compiler — inline them instead`);
  }
}

// ---------------------------------------------------------------- designs ---

const designs = folders("designs");

for (const name of designs) {
  const label = `designs/${name}`;

  for (const file of ["DESIGN.md", "theme.css", "index.html"]) {
    if (!existsSync(join(ROOT, "designs", name, file))) {
      fail(label, `missing ${file}`);
    }
  }
  if (problems.some((p) => p.folder === label && p.level === "error")) continue;

  const css = read("designs", name, "theme.css");
  const html = read("designs", name, "index.html");
  const md = read("designs", name, "DESIGN.md");

  // --- tokens, light and dark
  const light = block(css, ROOT_RULE());
  const dark = block(css, DARK_RULE());

  if (!light) fail(label, "theme.css has no :root block");
  if (!dark) fail(label, "theme.css has no .dark block — every design ships light and dark");

  for (const token of TOKENS) {
    if (light && !new RegExp(`--${token}\\s*:`).test(light)) {
      fail(label, `theme.css :root is missing --${token}`);
    }
    if (dark && !DARK_EXEMPT.has(token) && !new RegExp(`--${token}\\s*:`).test(dark)) {
      fail(label, `theme.css .dark is missing --${token}`);
    }
  }

  // --- computed contrast, light and dark (shared/ACCESSIBILITY.md)
  //
  // A design may waive the contrast gate by declaring it in its own DESIGN.md,
  // which is where the reason belongs and where an implementer will read it.
  // The shortfalls are still measured and still reported — waiving suppresses
  // the build failure, not the finding.
  const waived = /<!--\s*check:contrast=waived[\s\S]*?-->/.test(md);
  const shortfalls = [];
  const report = waived
    ? (_l, m) => shortfalls.push(m)
    : CONTRAST_LEVEL === "fail" ? fail : warn;
  for (const [mode, body] of [["light", light], ["dark", dark]]) {
    if (!body) continue;
    const vars = customProperties(body);
    for (const [fg, bg, min] of CONTRAST_PAIRS) {
      const a = parseColour(vars[fg]);
      const b = parseColour(vars[bg]);
      if (!a || !b) {
        if (vars[fg] && vars[bg]) {
          warn(label, `theme.css ${mode}: cannot compute --${fg} on --${bg} (not an oklch() value)`);
        }
        continue;
      }
      const ratio = contrast(a, b);
      if (ratio < min) {
        report(
          label,
          `theme.css ${mode}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1, below the ${min}:1 minimum`
        );
      }
    }
  }

  // --- the kitchen sink must render from theme.css, not from a copy of it
  //
  // The demo used to carry its own <style type="text/tailwindcss"> duplicate of
  // the whole theme, and the two drifted. index.html now fetches theme.css and
  // hands it to the Tailwind browser compiler, so there is only one copy to be
  // wrong. These two checks keep it that way.
  if (!/fetch\(\s*["']theme\.css["']\s*\)/.test(html)) {
    fail(label, "index.html does not fetch theme.css — the demo must render from the same bytes a consumer pastes");
  }
  if (/@theme\s+inline/.test(html)) {
    fail(label, "index.html declares its own `@theme inline` block — the theme belongs in theme.css alone");
  }
  for (const [mode, rule] of [["light", ROOT_RULE], ["dark", DARK_RULE]]) {
    const inline = customProperties(block(html, rule()));
    const copied = TOKENS.filter((t) => inline[t]);
    if (copied.length) {
      fail(
        label,
        `index.html redeclares ${copied.length} ${mode} token(s) (${copied.slice(0, 3).join(", ")}…) — they would shadow theme.css and drift from it`
      );
    }
  }

  if (waived) {
    if (shortfalls.length) {
      warn(label, `contrast gate waived in DESIGN.md — ${shortfalls.length} pair(s) below the WCAG minimum:`);
      for (const m of shortfalls) warn(label, `  ${m.replace(/^theme\.css /, "")}`);
    } else {
      warn(label, "contrast gate waived in DESIGN.md, but nothing is below the minimum — remove the waiver");
    }
  }

  if (!/@theme\s+inline/.test(css)) {
    fail(label, "theme.css has no `@theme inline` block — Tailwind utilities will not resolve");
  }
  if (!/@custom-variant\s+dark/.test(css)) {
    warn(label, "theme.css has no `@custom-variant dark` — `dark:` utilities will not work with the class strategy");
  }

  // --- kitchen sink sections, present and in order
  const found = [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  const missing = SECTIONS.filter((s) => !found.includes(s));
  if (missing.length) {
    fail(label, `index.html is missing section(s): ${missing.join(", ")}`);
  }

  const ordered = found.filter((s) => SECTIONS.includes(s));
  const expected = SECTIONS.filter((s) => ordered.includes(s));
  if (ordered.join(",") !== expected.join(",")) {
    fail(label, "index.html sections are out of order — see shared/COMPONENTS.md");
  }

  // --- no hard-coded colour outside the theme block
  const themeEnd = html.indexOf("</style>");
  const body = themeEnd === -1 ? html : html.slice(themeEnd);
  const hex = body.match(/(?:class|style)="[^"]*#[0-9a-fA-F]{3,8}\b/g);
  if (hex) {
    fail(label, `index.html hard-codes ${hex.length} hex colour(s) outside the theme block — everything must route through a token`);
  }
  const palette = body.match(
    /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g
  );
  if (palette) {
    const unique = [...new Set(palette)];
    fail(label, `index.html uses Tailwind palette class(es) instead of tokens: ${unique.slice(0, 5).join(", ")}${unique.length > 5 ? ` (+${unique.length - 5} more)` : ""}`);
  }

  // --- subresources: the vendored compiler and nothing else
  checkSubresources(label, html);

  // --- the dark-mode toggle must persist to its own key
  //
  // Designs are made by copying a folder, and the storage key is the one string
  // that has to change but produces no visible error if it does not. `learn`
  // read `learn-theme` and wrote `playful-theme`, so its toggle never survived a
  // refresh; `material-design` read and wrote `slate-theme`, so toggling it
  // silently flipped `slate` as well, now that every design is served from one
  // origin. Both were invisible until someone reloaded the page.
  const expectedKey = `${name.replace(/^_/, "")}-theme`;
  const readKey = html.match(/getItem\(\s*["']([^"']+)["']\s*\)/)?.[1];
  const writeKey = html.match(/setItem\(\s*["']([^"']+)["']/)?.[1];
  if (!readKey || !writeKey) {
    fail(label, "index.html has no localStorage read/write pair — the dark-mode choice must persist");
  } else if (readKey !== writeKey) {
    fail(label, `index.html reads "${readKey}" but writes "${writeKey}" — the toggle cannot survive a refresh`);
  } else if (readKey !== expectedKey) {
    fail(label, `index.html stores its theme under "${readKey}", not "${expectedKey}" — designs served from one origin would share the setting`);
  }

  // --- scaffold left behind
  if (md.includes("<!-- Copy this folder") || /^\s*<One-line description/m.test(md)) {
    fail(label, "DESIGN.md still contains scaffold placeholders");
  }
  if (/\bTODO\b/.test(html)) {
    warn(label, "index.html still contains TODO markers");
  }
  if (!/##\s*Never/i.test(md)) {
    warn(label, "DESIGN.md has no `## Never` section — the prohibitions are the most useful part");
  }
  // Layouts have always been required to document this; designs own the other
  // half of it — focus ring, target size, non-colour encoding. See
  // shared/ACCESSIBILITY.md for the split.
  if (!/^##\s*.*Accessibility/im.test(md)) {
    fail(label, 'DESIGN.md has no "## Accessibility" section — see shared/ACCESSIBILITY.md');
  }
  if (/lorem ipsum/i.test(html)) {
    warn(label, "index.html contains lorem ipsum — use plausible product copy so density is legible");
  }
}

// ---------------------------------------------------------------- layouts ---

const layouts = folders("layouts");

for (const name of layouts) {
  const label = `layouts/${name}`;

  for (const file of ["LAYOUT.md", "index.html"]) {
    if (!existsSync(join(ROOT, "layouts", name, file))) {
      fail(label, `missing ${file}`);
    }
  }
  if (problems.some((p) => p.folder === label && p.level === "error")) continue;

  const html = read("layouts", name, "index.html");
  const md = read("layouts", name, "LAYOUT.md");

  // --- subresources: the vendored compiler and nothing else
  checkSubresources(label, html);

  // --- wireframes carry placeholders
  const slots = html.match(/&lt;[a-z][^&]*&gt;/g) || [];
  if (slots.length < 4) {
    fail(label, `index.html has only ${slots.length} <placeholder> label(s) — every region needs one naming what goes there`);
  }

  // --- wireframes are greyscale
  const themeEnd = html.indexOf("</style>");
  const body = themeEnd === -1 ? html : html.slice(themeEnd);
  const colour = body.match(
    /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g
  );
  if (colour) {
    fail(label, `index.html uses colour: ${[...new Set(colour)].join(", ")} — wireframes are greyscale so they combine with any design`);
  }
  const hex = body.match(/(?:class|style)="[^"]*#[0-9a-fA-F]{3,8}\b/g);
  if (hex) {
    fail(label, `index.html hard-codes ${hex.length} hex colour(s)`);
  }

  // --- required LAYOUT.md sections
  for (const [heading, why] of [
    ["Region map", "the regions and their sizes"],
    ["Structure", "the container markup an implementer copies"],
    ["Scroll", "which regions scroll — invisible in a screenshot, so it must be written down"],
    ["Responsive", "what happens at each breakpoint"],
    ["Slots", "the join between this layout and a design"],
    ["Accessibility", "landmarks and focus order"],
    ["Never", "the prohibitions that keep this layout itself"],
  ]) {
    if (!new RegExp(`^##\\s*.*${heading}`, "im").test(md)) {
      fail(label, `LAYOUT.md has no "## ${heading}" section — ${why}`);
    }
  }

  // --- breakpoint strip in the wireframe
  if (!/breakpoint/i.test(html)) {
    fail(label, "index.html has no breakpoint strip — required by CREATE-LAYOUT.md");
  }

  // --- scaffold left behind
  if (md.includes("<!-- Copy this folder")) {
    fail(label, "LAYOUT.md still contains scaffold placeholders");
  }
  if (/\bTODO\b/.test(html)) {
    warn(label, "index.html still contains TODO markers");
  }
}

// ----------------------------------------------------------------- voices ---

const voices = folders("voices");

for (const name of voices) {
  const label = `voices/${name}`;

  for (const file of ["VOICE.md", "index.html"]) {
    if (!existsSync(join(ROOT, "voices", name, file))) {
      fail(label, `missing ${file}`);
    }
  }
  if (problems.some((p) => p.folder === label && p.level === "error")) continue;

  const html = read("voices", name, "index.html");
  const md = read("voices", name, "VOICE.md");

  // --- string sink slots, present and in order
  const found = [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  const missing = SLOTS.filter((slot) => !found.includes(slot));
  if (missing.length) {
    fail(label, `index.html is missing slot(s): ${missing.join(", ")}`);
  }
  const ordered = found.filter((slot) => SLOTS.includes(slot));
  const expected = SLOTS.filter((slot) => ordered.includes(slot));
  if (ordered.join(",") !== expected.join(",")) {
    fail(label, "index.html slots are out of order — see shared/COPY.md");
  }

  // --- required VOICE.md sections
  for (const [heading, why] of [
    ["Attributes", "the load-bearing part — an agent reading only this must still write in voice"],
    ["Mechanics", "the decidable rules: case, tense, person, punctuation"],
    ["Vocabulary", "preferred terms and the strike-on-sight list"],
    ["Patterns", "one rule per element, from page title to list item"],
    ["Antipatterns", "the constructions this voice never uses"],
    ["Never", "the prohibitions that keep this voice itself"],
    ["Length budgets", "the one place a voice touches layout — a design sizes regions around these"],
  ]) {
    if (!new RegExp(`^##\\s*.*${heading}`, "im").test(md)) {
      fail(label, `VOICE.md has no "## ${heading}" section — ${why}`);
    }
  }

  // --- a string sink is greyscale, like a layout wireframe: a voice must combine
  //     with any design, so it cannot carry one of its own
  const themeEnd = html.indexOf("</style>");
  const body = themeEnd === -1 ? html : html.slice(themeEnd);
  const colour = body.match(
    /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g
  );
  if (colour) {
    fail(label, `index.html uses colour: ${[...new Set(colour)].join(", ")} — string sinks are greyscale so they combine with any design`);
  }
  const hex = body.match(/(?:class|style)="[^"]*#[0-9a-fA-F]{3,8}\b/g);
  if (hex) {
    fail(label, `index.html hard-codes ${hex.length} hex colour(s) outside the style block`);
  }

  // --- self-contained: no local subresources (file:// cannot fetch them)
  checkSubresources(label, html, { tailwind: false });

  // --- declared length budgets, checked against the voice's own specimens
  const budgets = parseBudgets(md);
  if (budgets) {
    const seen = new Set();
    for (const { key, text } of budgetSpecimens(html)) {
      seen.add(key);
      const max = budgets[key];
      if (max === undefined) {
        fail(label, `index.html tags a data-budget="${key}" specimen, but VOICE.md declares no budget for it`);
        continue;
      }
      if (text.length > max) {
        fail(
          label,
          `${key} specimen is ${text.length} characters, over the ${max} VOICE.md declares: "${text}"`
        );
      }
    }
    // Without this, a voice could pass by simply tagging nothing.
    for (const key of Object.keys(budgets)) {
      if (!seen.has(key)) {
        fail(label, `VOICE.md declares a ${key} budget, but index.html has no data-budget="${key}" specimen to check it against`);
      }
    }
  }

  // --- the shared example product keeps voices comparable
  if (!/Fieldnote/i.test(html)) {
    warn(label, "index.html does not mention Fieldnote — every voice writes for the same example product so string sinks differ by voice alone");
  }

  // --- scaffold left behind
  if (md.includes("<!-- Copy this folder") || /^\s*<One or two lines/m.test(md)) {
    fail(label, "VOICE.md still contains scaffold placeholders");
  }
  if (/\bTODO\b/.test(html)) {
    warn(label, "index.html still contains TODO markers");
  }
}

// ----------------------------------------------------------------- report ---

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", OFF = "\x1b[0m";

console.log(`\nChecked ${designs.length} design(s), ${layouts.length} layout(s) and ${voices.length} voice(s).\n`);

if (problems.length) {
  let current = null;
  for (const p of problems) {
    if (p.folder !== current) {
      current = p.folder;
      console.log(`${DIM}${current}${OFF}`);
    }
    const tag = p.level === "error" ? `${RED}error${OFF}` : `${YEL}warn ${OFF}`;
    console.log(`  ${tag}  ${p.msg}`);
  }
  console.log("");
}

if (errors) {
  console.log(`${RED}${errors} error(s)${OFF}${warnings ? `, ${YEL}${warnings} warning(s)${OFF}` : ""}\n`);
  process.exit(1);
}

console.log(`${GRN}All contracts satisfied${OFF}${warnings ? `, ${YEL}${warnings} warning(s)${OFF}` : ""}\n`);
