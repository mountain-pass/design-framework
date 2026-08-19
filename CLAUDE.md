# Instructions for AI agents

This repository is a design system library. You will encounter it in two modes.

---

## Mode 1: A user has named a design or layout

The trigger looks like:

> "Use the styling and components from the `slate` design."
> "Build this with the `app-shell` layout and the `slate` design."
> "Make it look like `warm-paper`."

### What to do

1. **Read the whole instruction file.** `designs/<name>/DESIGN.md` or
   `layouts/<name>/LAYOUT.md`. Not a skim — these files contain specific numbers
   and specific prohibitions, and the value of the design is in those specifics.

2. **Read the shared contracts** if you have not already in this session:
   `shared/TOKENS.md`, `shared/COMPONENTS.md`, and `shared/ACCESSIBILITY.md`.

3. **Open the demo HTML.** `designs/<name>/index.html` is a rendered answer to
   "what does a button look like in this design". When you are unsure how to style
   something, find it in the kitchen sink and copy the class list. Do not invent a
   treatment that the kitchen sink already answers.

4. **Install the theme.** Copy `designs/<name>/theme.css` into the target project's
   global stylesheet (`app/globals.css` in a Next.js + shadcn project). It is
   written to be pasted verbatim.

5. **Build using tokens only.** Every colour comes from a semantic token —
   `bg-background`, `text-muted-foreground`, `border-border`. If you find yourself
   writing `bg-blue-600` or `#1a1a1a`, stop: you are hard-coding something that
   will break the moment the user switches designs or toggles dark mode. That is
   the entire failure mode this repo exists to prevent.

6. **Respect the design's prohibitions.** Each `DESIGN.md` has a "Never" section.
   Those are the rules that make one design distinguishable from another, and they
   are the first thing to erode when an agent is working quickly.

### Combining a design with a layout

They compose without negotiation, because they own disjoint things:

- The **layout** decides the regions, their nesting, their sizes, and how they
  reflow at each breakpoint.
- The **design** decides what everything inside those regions looks like.

Where a layout wireframe says `<navigation goes here>`, put the navigation
component from the design's kitchen sink. Where it says `<document controls go
here>`, put a toolbar built from the design's buttons and segmented controls.

If a layout and a design appear to conflict, the layout wins on structure and the
design wins on appearance. If they genuinely conflict on something else, say so to
the user rather than silently picking one.

---

## Mode 2: A user is adding a new design or layout to this repo

The trigger looks like:

> "Add a design called `warm-paper`."
> "Create a new layout for a three-pane email client."

Follow `CREATE-DESIGN.md` or `CREATE-LAYOUT.md` in the repo root. They are written
as complete prompts — read the relevant one and do what it says.

Before you report the work finished, run:

```sh
node scripts/check.mjs
node scripts/build-gallery.mjs
```

`check.mjs` will tell you about missing tokens and missing kitchen sink sections.
`build-gallery.mjs` regenerates the root `index.html` so the new folder appears in
the gallery. Both must be run — a new design that is not in the gallery is a design
nobody will find.

---

## Hard rules for this repository

**Designs never contain layout.** A design's kitchen sink is a single-column scroll
of component sections. It must not have a sidebar, a routing structure, or an
opinion about where a page's navigation lives.

**Layouts never contain design.** A layout's wireframe uses greys, dashed borders,
and literal `<placeholder text>`. If you catch yourself picking a brand colour for
a layout, you are in the wrong folder. The wireframe should look like a wireframe.

**The kitchen sink contract is not negotiable.** `shared/COMPONENTS.md` lists the
sections every design must render, in order, with fixed `id` attributes. The whole
framework depends on designs being comparable, and they are only comparable if they
show the same things in the same order. Add at the end if you must; never remove,
rename, or reorder.

**Demos must open with no build step.** Single HTML file, Tailwind browser CDN,
inline SVG icons, no imports of local JS or CSS files (a `file://` page cannot
fetch them). If a demo needs `npm install` to look at, it has failed at its only
job.

**Accessibility is a contract, not a polish pass.** `shared/ACCESSIBILITY.md` is
WCAG 2.2 AA, and it binds the demos in this repo as tightly as it binds the
applications built from them. The markup in a kitchen sink is copied verbatim by
agents downstream, so an unlabelled icon button or a placeholder used as a label
propagates into every consuming project. `check.mjs` computes real contrast ratios
from each `theme.css` — never record an estimated ratio in a `DESIGN.md`, and never
ship a contrast failure as a known issue when the fix is a token value.

**Every design ships light and dark.** Both are part of the deliverable. The
kitchen sink's dark-mode toggle must produce a dark theme that someone actually
chose, not one that happens to fall out of inverting the light theme.

**Token names are fixed.** They match shadcn/ui so that this repo's output drops
into real projects. Extend the set if a design needs more; never rename or drop
what is there.
