#!/usr/bin/env node
// Generates real shadcn/ui-style React components for a design from its
// classes.json manifest, so the .tsx a consumer copies carries exactly the
// classes the kitchen sink renders — no hand-translation, no drift.
//
//   node scripts/build-components.mjs slate            # write the files
//   node scripts/build-components.mjs slate --check     # fail if committed files are stale
//
// The class strings come from designs/<name>/classes.json (which check.mjs
// already validates against index.html). The surrounding structure is stock
// shadcn/ui — data-slot attributes, cva for variant components, cn() for the
// rest — so the output drops into a real Next.js + shadcn project unchanged.
//
// No dependencies — Node 18+.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ------------------------------------------------------------- helpers ---

// Render a cva(...) call from a manifest component with { base, variants,
// defaultVariants }, indented to sit at column 0.
const cvaCall = (name, c) => {
  const L = [`const ${name} = cva(`, `  ${JSON.stringify(c.base ?? "")},`, "  {", "    variants: {"];
  for (const [group, opts] of Object.entries(c.variants ?? {})) {
    L.push(`      ${group}: {`);
    for (const [k, v] of Object.entries(opts)) L.push(`        ${k}: ${JSON.stringify(v)},`);
    L.push("      },");
  }
  L.push("    },");
  if (c.defaultVariants) {
    const dv = Object.entries(c.defaultVariants).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
    L.push(`    defaultVariants: { ${dv} },`);
  }
  L.push("  }", ")");
  return L.join("\n");
};

const HEADER = (design) =>
  `// Generated from designs/${design}/classes.json by scripts/build-components.mjs.\n` +
  `// Do not edit by hand — change classes.json and re-run the generator.\n`;

// ----------------------------------------------------------- emitters ---

const utils = () =>
  `import { clsx, type ClassValue } from "clsx"\n` +
  `import { twMerge } from "tailwind-merge"\n\n` +
  `export function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`;

const button = (design, c) =>
  HEADER(design) +
  `import * as React from "react"\n` +
  `import { Slot } from "@radix-ui/react-slot"\n` +
  `import { cva, type VariantProps } from "class-variance-authority"\n\n` +
  `import { cn } from "@/lib/utils"\n\n` +
  cvaCall("buttonVariants", c) + `\n\n` +
  `function Button({\n` +
  `  className,\n  variant,\n  size,\n  asChild = false,\n  ...props\n` +
  `}: React.ComponentProps<"button"> &\n` +
  `  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {\n` +
  `  const Comp = asChild ? Slot : "button"\n` +
  `  return (\n` +
  `    <Comp\n` +
  `      data-slot="button"\n` +
  `      className={cn(buttonVariants({ variant, size, className }))}\n` +
  `      {...props}\n` +
  `    />\n  )\n}\n\n` +
  `export { Button, buttonVariants }\n`;

const badge = (design, c) =>
  HEADER(design) +
  `import * as React from "react"\n` +
  `import { Slot } from "@radix-ui/react-slot"\n` +
  `import { cva, type VariantProps } from "class-variance-authority"\n\n` +
  `import { cn } from "@/lib/utils"\n\n` +
  cvaCall("badgeVariants", c) + `\n\n` +
  `function Badge({\n  className,\n  variant,\n  asChild = false,\n  ...props\n` +
  `}: React.ComponentProps<"span"> &\n` +
  `  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {\n` +
  `  const Comp = asChild ? Slot : "span"\n` +
  `  return (\n` +
  `    <Comp data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />\n` +
  `  )\n}\n\n` +
  `export { Badge, badgeVariants }\n`;

const input = (design, c) =>
  HEADER(design) +
  `import * as React from "react"\n\n` +
  `import { cn } from "@/lib/utils"\n\n` +
  `function Input({ className, type, ...props }: React.ComponentProps<"input">) {\n` +
  `  return (\n` +
  `    <input\n` +
  `      type={type}\n` +
  `      data-slot="input"\n` +
  `      className={cn(\n` +
  `        ${JSON.stringify(c.base)},\n` +
  `        "disabled:cursor-not-allowed disabled:opacity-50",\n` +
  `        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive",\n` +
  `        className\n` +
  `      )}\n` +
  `      {...props}\n` +
  `    />\n  )\n}\n\n` +
  `export { Input }\n`;

const textarea = (design, c) =>
  HEADER(design) +
  `import * as React from "react"\n\n` +
  `import { cn } from "@/lib/utils"\n\n` +
  `function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {\n` +
  `  return (\n` +
  `    <textarea\n` +
  `      data-slot="textarea"\n` +
  `      className={cn(\n        ${JSON.stringify(c.base)},\n` +
  `        "disabled:cursor-not-allowed disabled:opacity-50",\n        className\n      )}\n` +
  `      {...props}\n    />\n  )\n}\n\n` +
  `export { Textarea }\n`;

const cardPart = (name, slot, tag, cls) =>
  `function ${name}({ className, ...props }: React.ComponentProps<"${tag}">) {\n` +
  `  return <${tag} data-slot="${slot}" className={cn(${JSON.stringify(cls)}, className)} {...props} />\n}\n`;

const card = (design, c) => {
  const p = c.parts;
  return HEADER(design) +
    `import * as React from "react"\n\n` +
    `import { cn } from "@/lib/utils"\n\n` +
    cardPart("Card", "card", "div", p.root) + `\n` +
    cardPart("CardHeader", "card-header", "div", p.header) + `\n` +
    cardPart("CardTitle", "card-title", "h3", p.title) + `\n` +
    cardPart("CardDescription", "card-description", "p", p.description) + `\n` +
    cardPart("CardContent", "card-content", "div", p.content) + `\n` +
    cardPart("CardFooter", "card-footer", "div", p.footer) + `\n` +
    `export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }\n`;
};

const alert = (design, c) => {
  const p = c.parts;
  return HEADER(design) +
    `import * as React from "react"\n` +
    `import { cva, type VariantProps } from "class-variance-authority"\n\n` +
    `import { cn } from "@/lib/utils"\n\n` +
    cvaCall("alertVariants", { base: "", variants: c.variants, defaultVariants: { intent: "info" } }) + `\n\n` +
    `function Alert({\n  className,\n  intent,\n  ...props\n` +
    `}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {\n` +
    `  return (\n` +
    `    <div role="alert" data-slot="alert" className={cn(alertVariants({ intent, className }))} {...props} />\n` +
    `  )\n}\n\n` +
    cardPart("AlertTitle", "alert-title", "div", p.title) + `\n` +
    cardPart("AlertDescription", "alert-description", "div", p.description) + `\n` +
    `export { Alert, AlertTitle, AlertDescription, alertVariants }\n`;
};

// The set this generator covers: the components stock shadcn expresses purely
// as cva + cn (no Radix state machine). The Radix-driven ones (Select,
// Checkbox, Switch, Slider, Tabs, DropdownMenu, Table, Sidebar) carry the same
// class strings in classes.json but need their Radix wiring added — a later
// batch.
const EMITTERS = {
  "lib/utils.ts": () => utils(),
  "components/ui/button.tsx": (d, c) => button(d, c.button),
  "components/ui/badge.tsx": (d, c) => badge(d, c.badge),
  "components/ui/input.tsx": (d, c) => input(d, c.input),
  "components/ui/textarea.tsx": (d, c) => textarea(d, c.textarea),
  "components/ui/card.tsx": (d, c) => card(d, c.card),
  "components/ui/alert.tsx": (d, c) => alert(d, c.alert),
};

export function buildComponents(design) {
  const manifest = JSON.parse(readFileSync(join(ROOT, "designs", design, "classes.json"), "utf8"));
  const out = {};
  for (const [rel, emit] of Object.entries(EMITTERS)) out[rel] = emit(design, manifest.components);
  return out;
}

// --------------------------------------------------------------- CLI ---

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const design = process.argv[2];
  const check = process.argv.includes("--check");
  if (!design) { console.error("usage: build-components.mjs <design> [--check]"); process.exit(2); }
  const files = buildComponents(design);
  let drift = 0;
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(ROOT, "designs", design, rel);
    if (check) {
      const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
      if (current !== content) { console.error(`drift: designs/${design}/${rel}`); drift++; }
    } else {
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, content);
      console.log(`wrote designs/${design}/${rel}`);
    }
  }
  if (check && drift) { console.error(`\n${drift} file(s) out of date — run: node scripts/build-components.mjs ${design}`); process.exit(1); }
  if (check) console.log(`designs/${design}: components in sync with classes.json`);
}
