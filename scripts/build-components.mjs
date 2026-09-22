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

// --- token helpers, for the Radix components ------------------------------
// The manifest captures the *static* kitchen sink, which cannot show a control's
// interactive-only classes (its focus ring, its data-[state] transitions, its
// disabled treatment). A Radix component therefore weaves the manifest's
// design-specific classes (colour, radius, size, border) into the standard
// shadcn structure and adds that interactive scaffolding. The scaffolding is
// design-neutral — the focus ring is lifted from the design's own button so it
// matches — and state deltas are computed from the manifest's two static
// strings (e.g. box vs boxChecked) so a design change still flows through.

const tokens = (s) => (s ?? "").split(/\s+/).filter(Boolean);
const added = (base, full, prefix) => {
  const b = new Set(tokens(base));
  return tokens(full).filter((t) => !b.has(t)).map((t) => prefix + t).join(" ");
};
const drop = (s, re) => tokens(s).filter((t) => !re.test(t)).join(" ");
const focusRing = (c) => tokens(c.button.base).filter((t) => /^focus-visible:/.test(t)).join(" ");
const DISABLED = "disabled:cursor-not-allowed disabled:opacity-50";

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

// ---- Radix-driven components (design classes woven into shadcn structure) ---

const checkbox = (design, c) => {
  const p = c.checkbox.parts, FOCUS = focusRing(c);
  // Checked and indeterminate share the same filled box; the glyph differs — a
  // check when checked, a minus when indeterminate (aria-checked=mixed).
  const checked = added(p.box, p.boxChecked, "data-[state=checked]:");
  const indeterminate = added(p.box, p.boxChecked, "data-[state=indeterminate]:");
  return HEADER(design) +
`import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        ${JSON.stringify(p.box)},
        ${JSON.stringify(`${checked} ${indeterminate} ${FOCUS} ${DISABLED}`)},
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {props.checked === "indeterminate" ? (
          <Minus className=${JSON.stringify(p.check)} strokeWidth={3} />
        ) : (
          <Check className=${JSON.stringify(p.check)} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
`;
};

const radio = (design, c) => {
  const p = c.radio.parts, FOCUS = focusRing(c);
  const checked = added(p.outer, p.outerSelected, "data-[state=checked]:");
  return HEADER(design) +
`import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(${JSON.stringify(p.outer)}, ${JSON.stringify(`${checked} ${FOCUS} ${DISABLED}`)}, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="flex items-center justify-center">
        <span className=${JSON.stringify(p.dot)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
`;
};

const switchC = (design, c) => {
  const p = c.switch.parts, FOCUS = focusRing(c);
  const trackChecked = added(p.trackOff, p.trackOn, "data-[state=checked]:");
  const thumbChecked = added(p.thumb, p.thumbOn, "data-[state=checked]:");
  return HEADER(design) +
`import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(${JSON.stringify(p.trackOff)}, ${JSON.stringify(`${trackChecked} ${FOCUS} ${DISABLED}`)}, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(${JSON.stringify(p.thumb)}, ${JSON.stringify(thumbChecked)})}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
`;
};

const slider = (design, c) => {
  const p = c.slider.parts, FOCUS = focusRing(c);
  const rangeColor = tokens(p.range).filter((t) => /^bg-/.test(t)).join(" ") || "bg-primary";
  const thumb = drop(p.thumb, /^(-translate-x-1\/2|absolute|left-\[)/);
  return HEADER(design) +
`import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className=${JSON.stringify(`relative grow overflow-hidden ${p.track}`)}>
        <SliderPrimitive.Range data-slot="slider-range" className=${JSON.stringify(`absolute h-full ${rangeColor}`)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb data-slot="slider-thumb" className=${JSON.stringify(`block ${thumb} ${FOCUS} disabled:pointer-events-none`)} />
    </SliderPrimitive.Root>
  )
}

export { Slider }
`;
};

const select = (design, c) => {
  const p = c.select.parts;
  const content = drop(p.listbox, /^(mt-1|w-full|p-1)$/);
  const itemActive = added(p.option, p.optionActive, "focus:");
  return HEADER(design) +
`import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger data-slot="select-trigger" className={cn(${JSON.stringify(p.comboboxTrigger)}, className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(${JSON.stringify(`${content} relative z-50 max-h-96 min-w-[8rem] overflow-hidden`)}, className)}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]")}>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(${JSON.stringify(p.option)}, ${JSON.stringify(`relative pl-8 outline-none ${itemActive} data-[disabled]:pointer-events-none data-[disabled]:opacity-50`)}, className)}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className=${JSON.stringify(p.optionCheck)} strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
`;
};

const tabs = (design, c) => {
  const p = c.tabs.parts;
  const active = added(p.tab, p.tabActive, "data-[state=active]:");
  return HEADER(design) +
`import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("border-b border-border", ${JSON.stringify(p.bar)}, className)} {...props} />
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(${JSON.stringify(p.tab)}, ${JSON.stringify(active)}, className)} {...props} />
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("pt-5 text-sm outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
`;
};

const dropdownMenu = (design, c) => {
  const p = c.menu.parts;
  const content = drop(p.surface, /^w-60$/);
  const itemActive = added(p.item, p.itemActive, "focus:");
  return HEADER(design) +
`import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group

function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(${JSON.stringify(`${content} z-50 min-w-[8rem] overflow-hidden`)}, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(${JSON.stringify(p.item)}, ${JSON.stringify(`cursor-default outline-none ${itemActive} data-[disabled]:pointer-events-none data-[disabled]:opacity-50`)}, className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn(${JSON.stringify(p.label)}, className)} {...props} />
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn(${JSON.stringify(p.separator)}, className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn(${JSON.stringify(p.shortcut)}, className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
`;
};

const table = (design, c) => {
  const p = c.table.parts;
  const selected = added(p.row, p.rowSelected, "data-[state=selected]:");
  return HEADER(design) +
`import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn(${JSON.stringify(p.table)}, className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(${JSON.stringify(p.thead)}, className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(${JSON.stringify(p.tbody)}, className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(${JSON.stringify(p.row)}, ${JSON.stringify(selected)}, className)} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={cn(className)} {...props} />
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn(className)} {...props} />
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption }
`;
};

const sidebarNav = (design, c) => {
  const p = c.sidebarNav.parts;
  return HEADER(design) +
`import * as React from "react"

import { cn } from "@/lib/utils"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="sidebar-nav" className={cn(${JSON.stringify(p.root)}, className)} {...props} />
}

function SidebarNavItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="sidebar-nav-item"
      aria-current={active ? "page" : undefined}
      className={cn(active ? ${JSON.stringify(p.itemActive)} : ${JSON.stringify(p.item)}, className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-group-label" className={cn(${JSON.stringify(p.groupLabel)}, className)} {...props} />
}

export { SidebarNav, SidebarNavItem, SidebarGroupLabel }
`;
};

// The full set. cva/cn primitives carry the manifest classes verbatim; the
// Radix components weave those design classes into stock shadcn structure and
// add the interactive scaffolding the static kitchen sink cannot show.
const EMITTERS = {
  "lib/utils.ts": () => utils(),
  "components/ui/button.tsx": (d, c) => button(d, c.button),
  "components/ui/badge.tsx": (d, c) => badge(d, c.badge),
  "components/ui/input.tsx": (d, c) => input(d, c.input),
  "components/ui/textarea.tsx": (d, c) => textarea(d, c.textarea),
  "components/ui/card.tsx": (d, c) => card(d, c.card),
  "components/ui/alert.tsx": (d, c) => alert(d, c.alert),
  "components/ui/checkbox.tsx": (d, c) => checkbox(d, c),
  "components/ui/radio-group.tsx": (d, c) => radio(d, c),
  "components/ui/switch.tsx": (d, c) => switchC(d, c),
  "components/ui/slider.tsx": (d, c) => slider(d, c),
  "components/ui/select.tsx": (d, c) => select(d, c),
  "components/ui/tabs.tsx": (d, c) => tabs(d, c),
  "components/ui/dropdown-menu.tsx": (d, c) => dropdownMenu(d, c),
  "components/ui/table.tsx": (d, c) => table(d, c),
  "components/ui/sidebar-nav.tsx": (d, c) => sidebarNav(d, c),
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
