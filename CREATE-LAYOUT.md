# Prompt: Create a new layout

Paste this file into an AI agent along with a description of the layout you want.

---

## Your task

Create a new layout folder in `layouts/`.

A **layout** owns page structure: what regions exist, how they nest, what size they
are, how they behave at each breakpoint, and where navigation lives. It owns nothing
about colour or styling — that belongs to `designs/`.

The output is a **wireframe**, not a design. It should look like a wireframe:
greyscale, dashed borders, monospace annotations, literal placeholder text. If it
starts looking attractive, styling has leaked in and the layout has stopped being
combinable with arbitrary designs.

---

## Before you start

Read:

- `layouts/app-shell/LAYOUT.md` and its `index.html` — a worked example
- `shared/COMPONENTS.md` — so your placeholders name real components
- `shared/ACCESSIBILITY.md` — layouts own landmarks, skip links, focus order, and
  keeping focus out from behind sticky regions

Then copy `layouts/_template/` as your starting point.

---

## What to produce

```
layouts/<name>/
├── LAYOUT.md      Instructions for an AI implementing this layout
└── index.html     Wireframe demo, no build step
```

`<name>` is lowercase kebab-case and names the structure, not the product:
`app-shell`, `document-editor`, `split-inbox`, `focus-mode`, `dashboard-grid`.

---

### 1. `index.html`

A wireframe of the layout with every region drawn and labelled.

Technical requirements:

- One self-contained file plus the vendored Tailwind compiler
  (`<script src="../../vendor/tailwind-browser-<version>.js"></script>` — copy the
  path from an existing layout). Opens by double-clicking; a relative script
  loads fine from `file://`.
- Greyscale only. Dashed or thin solid borders, a light neutral fill, monospace
  labels. No brand colour. One muted accent is permitted *only* to highlight the
  active region in the diagram, and it must be a neutral tint.
- Show the layout at its real proportions. A sidebar specified as `w-64` is drawn
  `w-64`, not "roughly a sixth of the screen". The wireframe is a spec, and the
  numbers in it must be the numbers.

Content requirements:

- Every region carries a **placeholder** naming what belongs there, in angle
  brackets: `<navigation goes here>`, `<document controls go here>`,
  `<tabs for different sections>`, `<primary content>`, `<contextual metadata panel>`.
  Name the component from `shared/COMPONENTS.md` where one applies, so an
  implementer knows exactly what to drop in.
- Every region carries its **sizing rule** as an annotation: `w-64 fixed`,
  `flex-1 min-w-0`, `max-w-3xl mx-auto`, `h-14 sticky top-0`.
- Include a **breakpoint strip**: small side-by-side diagrams showing what the
  layout does at mobile, tablet, and desktop. This is where layouts actually differ
  from one another and where implementers most often guess wrong.
- If regions scroll independently, show which ones and mark the scroll boundaries.
  This is the single most commonly botched part of an app shell — get it explicit.

### 2. `LAYOUT.md`

Written for an agent that will implement the layout without opening the wireframe.

Required sections:

**Identity** — Name, one-line description, and the page types it suits. Then what it
is *not* for. A layout that fits every page fits none.

**Region map** — Every region: its name, its purpose, what goes in it, its size
rule, and whether it scrolls. A tree diagram plus a table works well.

**Structure** — The actual container markup as a code block: the nesting, the flex
or grid declarations, the height and overflow rules. This is the part an
implementer copies, so it should be correct enough to paste.

**Scroll & overflow** — Which regions scroll, which are fixed, what is sticky and
what its offset is, and how the page behaves when content overflows in each region.
State whether the page scrolls as a whole or whether the shell is viewport-locked
with independent scroll panes — these are very different layouts and the difference
is invisible in a static screenshot.

**Responsive behaviour** — What happens at each breakpoint. Which regions collapse,
which become overlays, which disappear entirely, and what replaces them. Give the
Tailwind breakpoint names (`sm` `md` `lg` `xl`) and the exact behaviour at each.

**Navigation model** — Where primary navigation lives, where secondary lives, where
the user lands after clicking, and how the current location is indicated.

**Slots** — A list of every placeholder in the wireframe mapped to what should fill
it, referencing components from `shared/COMPONENTS.md`. This is the join between
the layout and whatever design is paired with it.

**Accessibility** — Landmark elements for each region (`<header>`, `<nav>`,
`<main>`, `<aside>`, `<footer>`), heading hierarchy, skip-link target, and focus
order. Focus order is worth stating explicitly, because DOM order and visual order
diverge in most multi-pane layouts.

Layouts own the structural half of `shared/ACCESSIBILITY.md`. Cover, specifically:

- One `<h1>` per page, and where it lives.
- A skip link as the first focusable element, targeting a `<main>` that has
  `tabindex="-1"` so focus can actually land in it.
- Multiple `<nav>` or `<aside>` regions each need a distinguishing `aria-label`.
- **Any sticky or fixed region must not obscure a focused element** (WCAG 2.2
  SC 2.4.11). A sticky header without `scroll-margin-top` on focusable content
  will hide whatever the user just tabbed to. State the value.
- If a region becomes a modal overlay at a breakpoint — a slide-over sidebar on
  mobile is the usual case — say that it traps focus, closes on `Escape`, returns
  focus to its trigger, and marks the background `inert`.
- Never reorder the DOM for visual reasons and never use a positive `tabindex`.

**Never** — The prohibitions that keep this layout itself. "Never let the main
region scroll the whole page." "Never put primary navigation in the right rail."
"Never exceed one level of sidebar nesting."

---

## Finishing

```sh
node scripts/check.mjs
node scripts/build-gallery.mjs
```

Then open the wireframe and resize the browser window from ~360px to full width.
Verify it does what `LAYOUT.md` says it does at every breakpoint — that is the
claim most likely to be wrong, because it is the one that cannot be checked without
actually dragging the window.

Last check: does this layout differ structurally from the others in `layouts/`, or
is it a restyling of one that already exists? If it is the latter, either push the
structure somewhere genuinely different or tell the user the existing layout already
covers it.
