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

#### Uppercase optical centering

If this design sets any text uppercase — buttons, captions, table headers,
badges, nav labels — check whether it needs an optical-centering correction
before shipping it. Uppercase text has no descenders, but the font's line box
still reserves space for them below the baseline; unless the font happens to
allocate that space evenly, the caps sit visibly high in whatever centers
them — a button label, a table header — leaving a gap underneath instead of an
even margin above and below.

**Measure it, don't guess.** Render `SETTINGS` in the design's actual vendored
sans font at a large size — 200px keeps integer-pixel rounding from hiding the
real number — with a Canvas 2D context, and compare the glyphs' actual ink to
the line box the font reports:

```js
const ctx = document.createElement('canvas').getContext('2d');
ctx.font = "<weight> 200px '<font family>'";
const m = ctx.measureText('SETTINGS');
const inkCenter = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
const boxCenter = (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
const shiftEm = (inkCenter - boxCenter) / 200; // positive = push the text down
```

Check it at the weights this design actually sets uppercase at — most fonts hold
this constant across weight, but don't assume it without checking (a font with
an `MVAR` table can vary it). If `shiftEm` is under roughly 0.005em, there's
nothing worth fixing — don't add a correction for a problem that doesn't exist;
`slate` and `warm-paper` (Inter) measured at ~0.0025em and ship with no
treatment for exactly this reason. If it's meaningfully non-zero, record it as
`--uppercase-optical-nudge` in `:root`, with a comment stating the measured
value and how you got it, and document it in DESIGN.md's Extensions section.
Never estimate this number — "roughly centered by eye" and "off by 0.03em" look
identical in isolation but compound across every button in the product.

**Fix it with the mechanism the text's own centering allows — not one rule for
everything.** `text-box-trim: trim-both; text-box-edge: cap alphabetic;` reads
the font's real metrics and needs no hand-measured number, but it does not work
everywhere. Verify empirically before relying on it: `CSS.supports()` only
confirms the property parses, not that it does anything — pixel-diff a
rendered element with and without it (screenshot before, apply the rule,
screenshot after, diff the two) the way `learn` and `material-design` did.

- **Plain block-flow text** — a caption or label with normal line-height, not
  inside a flex/grid container, not vertical-align-centered: text-box-trim
  works. Use it as the primary rule, with an `@supports not (text-box-trim:
  trim-both)` fallback to `transform: translateY(var(--uppercase-optical-
  nudge))` for browsers that don't support it yet.
- **Text centered by flexbox** — almost every icon+label button, since the
  icon is why it's `flex`/`inline-flex` in the first place: text-box-trim is a
  proven no-op. A flex container wraps its direct text in an anonymous block
  box that author CSS cannot select, so a rule on the flex container itself
  never reaches the text. Use `transform: translateY(var(--uppercase-optical-
  nudge))` unconditionally — there is nothing to fall back from.
- **Text centered by `vertical-align: middle`** (table `<th>`) — text-box-trim
  does not affect this centering either, even though the property applies
  without error. Same always-on transform as flex.
- **`<th>` needs its own selector regardless of the above.** If the table
  markup uses Tailwind's `[&_th]:uppercase` arbitrary-variant syntax on
  `<thead>` — the pattern every kitchen sink in this repo uses — the compiled
  rule never puts a literal `.uppercase` class on the `<th>` itself. A
  `.uppercase` selector will silently skip every table header.

A selector split that works for a `.uppercase`-utility-heavy kitchen sink:

```css
@layer base {
  th,
  .uppercase.flex,
  .uppercase.inline-flex {
    transform: translateY(var(--uppercase-optical-nudge));
  }

  .uppercase:not(.flex):not(.inline-flex) {
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
  }
}

@supports not (text-box-trim: trim-both) {
  @layer base {
    .uppercase:not(.flex):not(.inline-flex) {
      transform: translateY(var(--uppercase-optical-nudge));
    }
  }
}
```

If the design sets `text-transform: uppercase` directly on a role selector
rather than through the `.uppercase` utility — `learn`'s button rule does
this, keyed to `[data-slot="button"]` per this repo's "key CSS to role, not
tag" convention — give that selector the same always-on transform inline
rather than relying on the block above, since it won't carry the `.uppercase`
class either. See `designs/learn/theme.css` and `designs/material-design/
theme.css` for both cases worked through in full, including the comments
explaining why each selector landed where it did.

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
- Tailwind v4 browser build, loaded by that block from
  `../../vendor/tailwind-browser-<version>.js`. Copy the path from an existing
  design rather than typing it — every page in the repo must load the same
  vendored build, and `check.mjs` fails if one drifts.
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
  the page before you call it done — and see "Horizontal tabs and other
  overflow-x-auto strips" below before you tab through, because a clipped ring on
  the first or last item in a scrolling row won't show up unless you specifically
  focus that item.
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

#### Horizontal tabs and other overflow-x-auto strips

This exact bug shipped identically across five designs before anyone caught it,
because it is invisible unless you tab to the *first or last* item — so check for
it deliberately rather than trusting a casual tab-through.

The horizontal-tabs pattern needs `overflow-x-auto` on the tab `<nav>` so it
scrolls on narrow screens. Per the CSS overflow spec, setting `overflow-x` to
anything but `visible` forces `overflow-y` to compute to `auto` as well — there is
no way to scroll one axis and leave the other visible on the same box. A focus
ring drawn with `ring-*` (box-shadow, extending past the element's own border box)
gets clipped by that computed `overflow-y: auto` the moment the ring has nowhere
to render into: if the `nav`'s padding box is flush with a tab's own box — which
it is by default, since nothing reserves any extra space — the ring is clipped
top and bottom on *every* tab, and left/right on the first and last one, where the
nav's own edge is flush with the tab's edge. A tab in the middle of the row looks
fine because its neighbours' `gap` gives its ring room; only the outer edges show
the bug, which is exactly why it survives a quick tab-through.

**The fix is real padding on the scrolling container for the ring to render into,
cancelled with an equal negative margin so nothing shifts and no alignment trick
elsewhere breaks:**

```html
<nav class="flex gap-1 overflow-x-auto pt-1.5 -mt-1.5 pb-1.5 -mb-[7px] pl-1.5 -ml-1.5 pr-1.5 -mr-1.5">
```

The `-mb-[7px]` (rather than the more obvious `-mb-1.5`) is `pb-1.5` (6px) plus
the 1px that this repo's underline-tabs pattern already relies on to fuse the
active tab's own `border-b-2` with the container's separate `border-b` divider
line into a single line — recompute that constant if your design's tab bar
doesn't use the same border-merge trick, or if the container's border width
differs. Verify the fix, don't eyeball it: check that the tab's own
`getBoundingClientRect()` is unchanged before/after (confirms no visual shift)
and that the container's bottom edge still equals the active tab's bottom edge
(confirms the border-merge still holds), then screenshot the first and last tab
focused, in both themes.

While you're in this markup, also check that the label isn't sitting flush
against one edge of its own padding (e.g. `pb-3` with no matching `pt-3`) — that
reads as fine on its own but becomes visibly lopsided the moment a focus ring
frames it, and a `gap-6`-plus-`px-1` tab row reads as big gaps between tiny click
targets rather than a deliberately spaced row of controls.

None of this is specific to tabs — any horizontally-scrolling strip of focusable
controls (filter chips, a segmented breadcrumb, a toolbar) needs the same padding
treatment wherever `overflow-x-auto` is load-bearing for narrow screens.

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
- **In any horizontally-scrolling row (tabs, chips, a toolbar), specifically focus
  the first and last item, not just one in the middle.** See "Horizontal tabs and
  other overflow-x-auto strips" above — a clipped ring on the outer edges hides
  behind a normal-looking middle item.
- **Take a greyscale screenshot.** Every status, every chart series, and every
  active state must still be distinguishable with hue removed.
- **Zoom to 200% and narrow to 320px.** Nothing clipped, nothing overlapping.
- If anything is set uppercase, zoom into a button and a table header and look at
  the gap above and below the letters. If it isn't even, see "Uppercase optical
  centering" above — measure it, don't nudge it by eye.
- It looks meaningfully different from the other designs in `designs/`. If it does
  not, the repository has not gained anything and you should push the choices
  further.
