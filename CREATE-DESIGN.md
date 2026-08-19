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

Read these four files completely. They are contracts, not suggestions, and most of
the work below is defined by them:

- `shared/TOKENS.md` — the CSS variables you must define
- `shared/COMPONENTS.md` — the components you must render, in order, with fixed IDs
- `shared/ACCESSIBILITY.md` — the WCAG 2.2 AA baseline, the keyboard and ARIA
  contract per component, and the contrast minimums your tokens must clear
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
3:1 for large text and UI boundaries. **Do not estimate these — run
`node scripts/check.mjs`, which computes the real ratios from your `oklch()` values
in both light and dark**, and record what it reports in `DESIGN.md`. Estimated
ratios in this repo have historically been optimistic by 2–4×.

If a pair fails, fix the token — do not note it as a known issue.

Two pairs are missed almost every time, so check them deliberately:

- **`--input` must clear 3:1 against the surface behind it.** If an outlined field's
  border is the only thing identifying it as a field, that border is a UI boundary
  under WCAG 1.4.11, not a decorative hairline. `--border` and `--input` are
  separate tokens so they can hold different values — use that.
- **`--destructive` in dark mode.** A fill that carries white text at AA in light
  mode usually fails once it is lightened for dark, because the foreground stays
  white while the fill moves. This is the single most common failure in this repo.

### 2. `index.html`

The kitchen sink. Every section in `shared/COMPONENTS.md`, in order, with the exact
`id` attributes specified there.

Technical requirements:

- The theme is **not** written into `index.html`. Copy the loader block from
  `designs/_template/index.html` verbatim: it fetches `theme.css`, prepends
  `@import "tailwindcss";`, injects the result as a
  `<style type="text/tailwindcss">`, and only then loads the Tailwind browser
  build. `theme.css` is therefore the single copy of the theme, and the demo
  renders from the exact bytes a consumer pastes into their project.
  - Do not substitute a `<link rel="stylesheet">`. The browser build only reads
    `style[type="text/tailwindcss"]` elements, so the page would come out with no
    utilities at all.
  - Do not move the `@import "tailwindcss";` into `theme.css`. That file is
    written to be pasted *below* an existing import. And do not rely on the
    compiler adding it for you — it skips its own auto-prepend whenever the
    stylesheet text contains "@import" anywhere, including inside a comment.
- The only CSS left inline is the demo page's own chrome: the `.ks-*` helpers and
  the `html { scroll-behavior }` rule. Anything that belongs to the design itself
  belongs in `theme.css`, even when it is a rule rather than a token.
- Kitchen sinks are served over http(s), not opened from `file://`.
- Tailwind v4 browser build, loaded by that block:
  `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`
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
- **The markup is part of the deliverable, not just the styling.** Agents copy the
  kitchen sink's markup verbatim, so a missing `<label for>` or an unlabelled
  icon-only button here becomes the same bug in every application built from this
  design. Follow the per-component semantics table in `shared/ACCESSIBILITY.md`:
  real `<label>`s, `aria-label` on icon-only buttons, `aria-hidden="true"` on
  decorative SVGs, `<th scope>` and `aria-sort` in tables, `aria-current` on the
  active nav item, and `aria-invalid` + `aria-describedby` on the error field.
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

**Accessibility** — Required, and checked by `check.mjs`. What *this design*
decides: the focus ring treatment and its measured contrast, the target sizes for
every control class (plus the 44×44 touch floor), how state is encoded in something
other than colour, how charts stay readable without hue, and anything the design
animates that reduced motion must remove. Do not restate `shared/ACCESSIBILITY.md`
— it applies regardless. End with a "Known gaps" subsection listing anything that
fails the baseline, each with its fix; write "None." if `check.mjs` is clean.

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
- The focus ring is visible on every control when tabbing, and never hidden behind
  a sticky header.
- **Tab through the entire page.** Every control reachable, nothing trapped, order
  matching visual order. This is the check that catches the most real bugs.
- **Take a greyscale screenshot.** Every status, every chart series, and every
  active state must still be distinguishable with hue removed.
- **Zoom to 200% and narrow to 320px.** Nothing clipped, nothing overlapping.
- It looks meaningfully different from the other designs in `designs/`. If it does
  not, the repository has not gained anything and you should push the choices
  further.
