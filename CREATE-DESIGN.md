# Prompt: Create a new design

Paste this file into an AI agent along with a description of the design you want.

---

## Your task

Create a new design folder in `designs/`.

A **design** owns colour, typography, spacing, radius, shadow, and the styling of
every component. It owns nothing about page structure — that belongs to `layouts/`.

The user will give you a brief. It might be a reference ("like Notion"), a mood
("warm, editorial, calm"), a constraint ("high contrast, accessible, dense"), or a
brand. If the brief is thin, make strong choices and write down what you chose and
why. A design that hedges is worse than a design that commits to something the user
then asks you to change.

---

## Before you start

Read these three files completely. They are contracts, not suggestions, and most of
the work below is defined by them:

- `shared/TOKENS.md` — the CSS variables you must define
- `shared/COMPONENTS.md` — the components you must render, in order, with fixed IDs
- `designs/slate/DESIGN.md` — a worked example of the output quality expected

Then open `designs/slate/index.html` in a browser so you know what you are aiming
at, and copy `designs/_template/` as your starting point.

---

## What to produce

```
designs/<name>/
├── DESIGN.md      Instructions for an AI implementing this design
├── theme.css      Paste-ready CSS custom properties
└── index.html     Kitchen sink demo, no build step
```

`<name>` is lowercase kebab-case, and it is the label a user will say out loud:
"use the `warm-paper` design". Name it for the feel, not the implementation.

---

### 1. `theme.css`

The full token set from `shared/TOKENS.md`, in `:root` and `.dark`, using `oklch()`
values, in shadcn/ui's `globals.css` format so it can be pasted into a real project
verbatim.

Design the dark theme deliberately. Do not derive it by flipping lightness values —
that produces muddy, over-saturated dark modes. Dark surfaces usually want slightly
*less* chroma than their light counterparts, and dark-mode `--primary` usually wants
to be lighter and less saturated than light-mode `--primary`, not the same hue at a
different lightness.

Check contrast on every foreground/background pair. AA minimum: 4.5:1 for body text,
3:1 for large text and UI boundaries. Record the ratios you measured for the
primary pairs in `DESIGN.md`. If a pair fails, fix the token — do not note it as a
known issue.

### 2. `index.html`

The kitchen sink. Every section in `shared/COMPONENTS.md`, in order, with the exact
`id` attributes specified there.

Technical requirements:

- One self-contained file. No local `<link>` or `<script src>` to files in the
  folder — a `file://` page cannot fetch them, and the demo must work by
  double-clicking.
- Tailwind v4 browser build:
  `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- Theme goes in `<style type="text/tailwindcss">`, containing the same tokens as
  `theme.css` plus the `@theme inline` mapping block. Keep the two in sync; put a
  comment in both saying so.
- Icons are inline SVG from [Lucide](https://lucide.dev). Do not fetch an icon
  font or sprite.
- Webfonts come from Google Fonts or a system stack, and always with a real
  fallback stack.
- The dark-mode toggle is a few lines of inline vanilla JS that toggles `.dark` on
  `<html>`. Persist the choice in `localStorage`.
- A sticky in-page table of contents linking to every section ID.
- Overlay components (`Dialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`,
  command palette) are rendered **inline and open**, not behind a click. An agent
  reading this file must be able to see them without executing anything.

Markup requirements:

- Mirror what shadcn/ui's React components actually render, so translating to JSX
  is mechanical. Where shadcn puts a `div` with `flex items-center gap-2`, put a
  `div` with `flex items-center gap-2`.
- Semantic colours only. Never a raw hex value, never a Tailwind palette class like
  `bg-blue-500`, never an `oklch()` outside the theme block. Everything routes
  through a token. A design that hard-codes colour cannot be swapped, which defeats
  the purpose of the repository.
- Every interactive element gets a visible focus ring using `--ring`. Tab through
  the page before you call it done.
- Real content, not lorem ipsum. Plausible product copy makes design decisions
  legible in a way that placeholder Latin does not — you cannot judge a table's
  density with fake words in it.

### 3. `DESIGN.md`

This is the file an AI reads when a user says "use this design", so write it for an
agent that will not open the HTML. Be concrete. "Generous whitespace" is not
actionable; "section padding is `py-16`, card padding is `p-6`, related controls sit
`gap-2` apart" is.

Required sections:

**Identity** — Name, a one-line description, and three to five adjectives. Then
"use this when…" and "do not use this when…". The second one matters: a design that
suits everything suits nothing.

**Influences** — What this is drawn from, and specifically what was taken. "Linear's
density and its use of a single accent colour, but not its dark-first bias."

**Colour** — The palette with token names and values, the reasoning behind the
primary hue, and how accent, muted, and destructive relate to it. Include the
measured contrast ratios.

**Typography** — Font families with fallback stacks, the full scale (size, weight,
line height, letter spacing) for each level, and the rules: what gets which weight,
when letter spacing is adjusted, what the measure (max line length) is for body
copy.

**Spacing & density** — The base unit, the spacing scale, standard paddings for
cards, sections, and form rows, and a statement of where this design sits on the
dense/roomy axis.

**Shape & depth** — The `--radius` value and why, the shadow ramp with actual
values, and the rule for when a surface uses a border versus a shadow versus both.

**Motion** — Duration and easing, what animates and what does not, hover, focus,
active, and disabled treatments. Include a `prefers-reduced-motion` rule.

**Component notes** — For each component group in `shared/COMPONENTS.md`, anything
an implementer would otherwise get wrong. Where a component behaves the same as
stock shadcn, say "stock" and move on; only spend words where this design differs.

**Never** — The prohibitions. This is the most useful section in the file and the
one most likely to be skipped. What would make something stop looking like this
design? Write five to ten of them, specifically. "Never use a drop shadow on a
button." "Never use more than one accent colour on a screen." "Never centre body
text."

**Extensions** — Any tokens added beyond `shared/TOKENS.md`, and what a consumer
that ignores them will get.

---

## Finishing

```sh
node scripts/check.mjs
node scripts/build-gallery.mjs
```

`check.mjs` verifies files, tokens, and section IDs. Fix everything it reports.
`build-gallery.mjs` adds the design to the root gallery.

Then open `designs/<name>/index.html` and look at it. Automated checks confirm the
sections exist; they cannot tell you the design is good. Specifically check that:

- Light and dark both look chosen, not merely functional.
- The page still looks like one design at the bottom as at the top.
- Nothing is illegible — thin type on tinted backgrounds is the usual offender.
- The focus ring is visible on every control when tabbing.
- It looks meaningfully different from the other designs in `designs/`. If it does
  not, the repository has not gained anything and you should push the choices
  further.
