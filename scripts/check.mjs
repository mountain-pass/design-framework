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

  // --- self-contained: no local subresources (file:// cannot fetch them)
  const localLink = body.match(/<(?:link|script|img)[^>]*(?:href|src)="(?!https?:|data:|#|mailto:)[^"]+\.(?:css|js|png|jpe?g|svg|webp)"/g);
  if (localLink) {
    fail(label, `index.html references ${localLink.length} local file(s) — a file:// page cannot fetch them; inline instead`);
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

// ----------------------------------------------------------------- report ---

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", OFF = "\x1b[0m";

console.log(`\nChecked ${designs.length} design(s) and ${layouts.length} layout(s).\n`);

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
