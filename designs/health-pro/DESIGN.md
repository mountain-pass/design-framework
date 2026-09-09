# Design: `health-pro`

**Read [`../README.md`](../README.md) first.** It explains how this design's
`theme.css` and `index.html` are meant to be used alongside this file.

> A formal, red-and-charcoal institutional design for professional health and
> medical bodies — colleges, associations, and credentialing/accreditation
> organisations.

**Adjectives:** authoritative, formal, institutional, trustworthy, structured.

**Use this when** you are building a site or portal for a professional
association, medical/health college, credentialing or accreditation body, or
membership-driven governance organisation — anywhere the product's job is to be
believed, not liked.

**Do not use this when** the product is a consumer health/wellness app, a
patient-facing product that needs warmth or playfulness, or anything that needs
to feel approachable rather than authoritative. `health-pro` is deliberately
formal and a little bureaucratic; that stiffness is the point in its target
context and a liability everywhere else.

---

## Influences

Australian/UK-style professional-body and medical-college websites, generically:
a red-and-charcoal institutional palette used decisively but sparingly, a
persistent dark (near-black) navigation chrome across the top utility bar and
primary nav, boxy/minimally-rounded rectangular buttons and cards, an
audience-segmented card grid where each card ends in a full-bleed coloured
button strip flush with the card's own edges, and a dark full-bleed CTA/footer
band.

What was deliberately **not** taken: any specific crest, logo, or named
accreditation programme — this design is a generic template and names no real
organisation — and gradients or decorative background patterns baked into the
markup. A subtle texture on a hero is permitted only as an optional,
token-driven CSS treatment, never required and never shipped by default here.

---

## Colour

Three hue families, used consistently: brand red at **H=25**, a warm-neutral
grey at **H=20** for every neutral (text, borders, surfaces — tinted very
slightly warm so the whole palette feels of-a-piece with the brand red, the
same technique `slate` uses to tie its greys to its blue), and a distinct
**H=10** for `--destructive` — more orange than the brand red, so the two are
never confusable at a glance — plus five standalone chart hues.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.15 0.01 20)` | Page |
| `--foreground` | `oklch(0.18 0.012 20)` | `oklch(0.96 0.006 20)` | Body text |
| `--card` | `oklch(1 0 0)` | `oklch(0.19 0.012 20)` | Raised surface |
| `--popover` | `oklch(1 0 0)` | `oklch(0.21 0.013 20)` | Floating surface |
| `--primary` | `oklch(0.46 0.19 25)` | `oklch(0.66 0.17 25)` | Brand action |
| `--secondary` / `--muted` | `oklch(0.95 0.008 20)` / `oklch(0.96 0.006 20)` | `oklch(0.26 0.014 20)` / `oklch(0.24 0.013 20)` | Subdued fill |
| `--muted-foreground` | `oklch(0.40 0.014 20)` | `oklch(0.74 0.012 20)` | Secondary text |
| `--accent` | `oklch(0.94 0.02 25)` | `oklch(0.28 0.03 25)` | Hover surface |
| `--destructive` | `oklch(0.50 0.20 10)` | `oklch(0.62 0.19 10)` | Danger (H=10, not H=25) |
| `--border` | `oklch(0.88 0.008 20)` | `oklch(0.30 0.014 20)` | Hairlines, dividers |
| `--input` | `oklch(0.60 0.02 20)` | `oklch(0.52 0.016 20)` | Control boundaries |
| `--sidebar` | `oklch(0.16 0.01 20)` | `oklch(0.13 0.01 20)` | Persistent dark chrome |

### Why this primary

`oklch(0.46 0.19 25)` is a deep, saturated red — dark enough to carry white
text at AA (7.57:1 light) while reading as decisive rather than pastel. It is
tuned separately from `--destructive` (H=10) precisely so a red action button
and a red error state are never the same red: an implementer who confuses them
produces a bug that reads as "why is Submit coloured like an error," not a
subtle token slip.

In dark mode the primary lightens to `L=0.66` and **drops chroma** from 0.19 to
0.17 — holding chroma constant while raising lightness is the mistake that
makes a dark-mode accent look radioactive against a dark surface.

### The persistent dark `--sidebar` chrome

`--sidebar` is deliberately **not** derived from `--background` — it stays a
near-black surface (`L=0.16` light, `L=0.13` dark) regardless of which theme is
active. This is a deliberate design decision, not a bug: the reference
institutional sites this design draws from keep their top utility bar and
primary navigation permanently dark, the way a masthead does not change colour
with the rest of the page. `--sidebar` is used for exactly four things — the
top utility bar, the primary nav (desktop, collapsed-icon and mobile-bottom
variants), the sidebar nav variant, and the footer/CTA full-bleed bands. It
must never appear on an ordinary content card; see Never #9.

### Measured contrast

Computed from `theme.css` by `scripts/check.mjs`, not estimated:

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 18.85:1 | 17.50:1 | 4.5:1 |
| `muted-foreground` on `background` | 9.27:1 | 8.50:1 | 4.5:1 |
| `card-foreground` on `card` | 18.85:1 | 16.45:1 | 4.5:1 |
| `popover-foreground` on `popover` | 18.85:1 | 15.79:1 | 4.5:1 |
| `primary-foreground` on `primary` | 7.57:1 | 5.79:1 | 4.5:1 |
| `secondary-foreground` on `secondary` | 16.25:1 | 13.87:1 | 4.5:1 |
| `accent-foreground` on `accent` | 11.84:1 | 11.57:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 6.52:1 | 4.86:1 | 4.5:1 |
| `primary` on `background` | 7.79:1 | 5.85:1 | 4.5:1 |
| `destructive` on `background` | 6.71:1 | 4.90:1 | 4.5:1 |
| `sidebar-foreground` on `sidebar` | 17.27:1 | 17.89:1 | 4.5:1 |
| `sidebar-primary-foreground` on `sidebar-primary` | 5.23:1 | 5.79:1 | 4.5:1 |
| `sidebar-accent-foreground` on `sidebar-accent` | 14.67:1 | 15.43:1 | 4.5:1 |
| `input` on `background` | 3.98:1 | 3.55:1 | 3:1 |
| `ring` on `background` | 7.79:1 | 5.85:1 | 3:1 |
| `sidebar-ring` on `sidebar` (not in `CONTRAST_PAIRS`, checked by hand per the brief) | 5.52:1 | 6.50:1 | 3:1 |

Everything clears its minimum in both themes, and `check.mjs` fails the build
if that stops being true. This design does not need the contrast-waiver
mechanism `CLAUDE.md` describes for a palette that cannot reach AA.

`--input` is a UI boundary (3.98:1 light, 3.55:1 dark), not the decorative
1.3:1 hairline `--border` is allowed to be — the two tokens hold different
values for exactly the reason `shared/ACCESSIBILITY.md` describes.

### Why dark-mode `--destructive` uses white text, and how it was kept there

Unlike some designs in this repo, `health-pro`'s dark-mode `--destructive`
(`L=0.62`) still clears 4.5:1 with **white** text (`primary-foreground`-style
near-white at `oklch(0.99 0 0)`) at 4.86:1 — it does not need `slate`'s
dark-text-on-red workaround. The margin is thin by design: `--destructive`
sits at H=10 with enough chroma (0.19) to read as clearly "not the brand red"
while `L=0.62` is the lowest lightness that still keeps the fill legible as a
danger colour against the dark background (4.90:1) without pushing white text
below AA. If a future edit needs to lighten `--destructive` further for
another reason, re-run `scripts/check.mjs` before shipping — this pair has
less headroom than the others in the table above.

### Rules

- One accent — the brand red — per screen. If two things are both red, the
  user cannot tell which one is the point.
- Brand red is reserved for exactly four uses: button fills, dividers, the
  active nav indicator, and the action-card CTA strip. It is never a
  decorative block, a section background, or a way to distinguish categories.
- Status colours (`chart-3` amber, `chart-4` teal, `destructive`) are for
  *state*, never decoration.
- Chart colours are ordered. A two-series chart uses `chart-1` and `chart-2`,
  not `chart-1` and `chart-4`.

---

## Typography

**Sans:** `"Public Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
**Mono:** `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
**Serif:** system serif stack — present in the token set for contract
compliance only. `health-pro` does not use a serif anywhere; reaching for it
means you are working against the design.

Public Sans is the typeface behind several government and institutional design
systems, which is exactly the register `health-pro` wants: legible, a little
plain, unmistakably official.

| Level | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | 3rem / 48px | 800 | 1.05 | -0.02em |
| h1 | 2.25rem / 36px | 800 | 1.1 | -0.015em |
| h2 | 1.75rem / 28px | 700 | 1.2 | -0.01em |
| h3 | 1.25rem / 20px | 700 | 1.3 | 0 |
| h4 / section eyebrow | 1rem / 16px | 700 | 1.4 | uppercase, 0.03em |
| Lead | 1.125rem / 18px | 400 | 1.6 | 0 |
| Body | 1rem / 16px | 400 | 1.65 | 0 |
| Small | 0.875rem / 14px | 400 | 1.5 | 0 |
| Caption / eyebrow label | 0.75rem / 12px | 700 | 1.4 | uppercase, 0.08em |

### Rules

- **Body text is 16px, not 14px.** This is a 16px-body marketing+app hybrid
  design — a membership site as much as a portal — unlike `slate`'s dense 14px
  application density.
- Only three weights anywhere: 400, 700, 800. Never 500 or 600.
- **Buttons and nav labels are uppercase, weight 700, tracking 0.05em.** This
  is a defining trait of the design, carried over from the reference's bold
  blocky uppercase red CTAs. It also applies to tab labels and vertical-nav
  items — anything that functions as a nav control.
- Body copy is capped at `max-w-[65ch]`.
- Numbers in tables and stat cards use `tabular-nums`, always.
- Never centre a body paragraph longer than two lines (headings and empty
  states may be centred).

---

## Spacing & density

Base unit **4px**, Tailwind's default scale (1, 2, 3, 4, 6, 8, 12, 16, 24) —
5, 7, 9, 10, 11 are skipped on purpose, same as `slate`, so an implementer has
fewer choices to get wrong.

| Context | Value |
|---|---|
| Related controls (icon + label) | `gap-2` (8px) |
| Sibling form fields | `gap-4` (16px) |
| Form field groups / fieldsets | `gap-6` (24px) |
| Card padding | `p-6` (24px) |
| Table cell padding | `px-4 py-3`, row height `h-11` (44px) |
| Section vertical rhythm | `py-16` marketing, `py-10` in-app |
| Page gutter | `px-4` mobile, `px-6` desktop |
| Max content width | `max-w-6xl` |
| Default control height | `h-10` (40px) — buttons, inputs, selects |

`health-pro` sits on the **roomy** side of the spacing axis, not `slate`'s
dense side — it is a membership/marketing site as much as an application, and
its audience skews toward occasional rather than all-day use. Small/compact
button and menu-item variants still exist (`h-9`, `h-8`) for genuinely dense
contexts like table toolbars, but the default is 40px.

---

## Shape & depth

`--radius: 0.25rem` (4px). Derived: `sm` 0px, `md` 2px, `lg` 4px, `xl` 8px, via
the standard formula in `shared/TOKENS.md`. This is the **boxiest design in the
repository** — every other `designs/*/theme.css` sits at 6–12px `--radius`;
`health-pro` reads as visibly squarer than all of them.

- **Buttons, inputs, cards and tables use `rounded-none`** — literally square
  corners. This is the single most identity-defining shape choice in the
  design, matching the reference's blocky rectangular CTAs.
- **Badges and avatars are the one deliberate exception** and stay fully round
  (`rounded-full`). Do not "fix" this into a square — it is intentional, and
  it is the one place roundness signals "this is a small status/identity
  chip," distinct from every rectangular surface around it.
- **Depth is borders only.** No shadow on cards, buttons, inputs, or tables —
  flat surfaces with a `border`, full stop. Floating overlays (dropdown,
  popover, dialog, sheet, toast, tooltip) use a shadow *and* a border — the
  only surfaces in this design that carry a shadow at all — kept at low
  opacity so it reads as a modest lift, not a glow.

Shadow ramp (used only by overlays):

```
shadow-xs   0 1px 2px 0 rgb(0 0 0 / 0.04)
shadow-sm   0 1px 2px 0 rgb(0 0 0 / 0.06)
shadow-md   0 4px 8px -2px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.06)
shadow-lg   0 12px 20px -4px rgb(0 0 0 / 0.14), 0 4px 8px -4px rgb(0 0 0 / 0.08)
```

### The action-card pattern

The `#features` section builds the design's signature composed pattern: a
bordered, square-cornered card (icon + heading + short description) capped by
a **full-bleed CTA strip flush with the card's own left/right/bottom edges** —
`bg-sidebar-primary text-sidebar-primary-foreground`, `h-11`, centred uppercase
bold label, no rounding, spanning the card's full width edge-to-edge rather
than sitting as an inset button. It uses a real `<a href>` (it navigates, per
`shared/ACCESSIBILITY.md`'s Link row), carrying `data-slot="button"` — the
`#buttons` section proves this renders identically to a `<button>` with the
same classes, since no visual effect in this design is keyed to the `<button>`
tag. Use this pattern for any audience-segmented "quick links" grid; do not
inset the button inside the card's padding, and do not round it — either
change would break the flush edge the pattern depends on.

---

## Motion

**Duration 150ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`.** One duration for
everything interactive, same single-duration approach as `slate`. Overlay
entrances may use 200ms.

| State | Treatment |
|---|---|
| Hover | Fill drops to `/90`, or surface shifts to `bg-accent`. No transform. |
| Focus | `ring-2 ring-ring ring-offset-2 ring-offset-background`, `:focus-visible` only. |
| Active | Fill drops to `/80`. No transform. |
| Disabled | `opacity-50 pointer-events-none`, plus the real `disabled` attribute. |

What animates: colour, opacity, and the transform of things that genuinely
move (a chevron, a switch thumb). What does not: layout, width, height, or the
position of anything the user is aiming at.

**Focus ring inside the dark `--sidebar` chrome.** `--ring` is tuned for
legibility against `--background`, not against the near-black `--sidebar`
surface, so every focusable control inside the top bar, primary nav, sidebar
nav and footer/CTA bands uses `focus-visible:ring-sidebar-ring` with
`focus-visible:ring-offset-sidebar` instead. `--sidebar-ring` measures 5.52:1
(light) and 6.50:1 (dark) against `--sidebar` — comfortably past the 3:1
`shared/ACCESSIBILITY.md` requires of a focus indicator, and well clear of
`check.mjs`'s automatic pairs, which is why this is checked and recorded here
by hand instead.

`prefers-reduced-motion: reduce` collapses all durations to ~0.01ms in
`theme.css`, applied automatically to every consumer.

---

## Component notes

Anything not mentioned here is **stock shadcn/ui**, styled by the tokens.

**Button** — Six variants, four sizes. `default` is `h-10`; `sm` is `h-9`;
`lg` is `h-11`; `icon` is `h-10 w-10`. Every variant, including `link`, is
uppercase/bold/tracked — this design has no lowercase button anywhere. No
`shadow-*` on any variant.

**Input** — `h-10`, `border-input`, `rounded-none`, `text-sm`. Error state adds
`border-destructive` and `focus-visible:ring-destructive`; the border does not
thicken.

**Card** — `border rounded-none bg-card`, no shadow. Header `p-6 pb-4`,
content `p-6 pt-0`, footer `p-6 pt-0 border-t`. Titles use the h3 scale.

**Table** — Header row is `bg-muted` with `text-muted-foreground text-xs
font-bold uppercase tracking-[0.08em]`. Rows are `h-11` with `border-b`.
Numeric columns are right-aligned with `tabular-nums`.

**Badge** — `rounded-full px-2.5 py-0.5 text-xs font-bold uppercase
tracking-[0.05em]`. Status pills add a 6px leading dot with a `/10` tinted
background and the status colour as text — the badge/avatar radius exception
does not extend to anything else.

**Dropdown / Popover / Dialog / Sheet / Toast** — `bg-popover border
rounded-none shadow-md` (dialogs and sheets `shadow-lg`). These are the only
surfaces in the design carrying a shadow.

**Sidebar nav / top bar / footer / CTA** — Use the `--sidebar-*` tokens
regardless of light/dark theme (see Colour, above). The active item uses
`bg-sidebar-primary text-sidebar-primary-foreground` — a solid red fill, not
an underline — which is one of the four sanctioned uses of brand red and is
already covered by a checked contrast pair. Hover on non-active items is
`bg-sidebar-accent`.

**Tabs** — Underline style: a 2px `border-primary` underline on the active
tab, uppercase/bold/tracked labels throughout (tabs are a nav control, so
Never #6 applies to them too), `text-muted-foreground` on the rest.

**Action card** — See "The action-card pattern" under Shape & depth.

---

## Accessibility

Baseline is `shared/ACCESSIBILITY.md` — WCAG 2.2 AA. This section covers only
what `health-pro` decides for itself.

**Focus ring.** `ring-2 ring-ring ring-offset-2 ring-offset-background` on
`:focus-visible`, everywhere except inside the dark `--sidebar` chrome, which
uses `ring-sidebar-ring`/`ring-offset-sidebar` instead — see Motion, above, for
the measured ratios.

**Target sizes.**

| Control | Height | Notes |
|---|---|---|
| Button, input, select (default) | 40px (`h-10`) | Above the 24px floor and the 32px recommended minimum |
| Button, small | 36px (`h-9`) | Table toolbars and dense contexts only |
| Button, large / icon | 44px (`h-11`) / 40×40 (`h-10 w-10`) | |
| Table row | 44px | Row actions are a 32px ghost button inside it |
| Below `md` | **44×44** | Every interactive target, no exceptions |

**State is never colour alone.** Status pills pair a leading dot with a text
label. The sortable table column uses a chevron and `aria-sort`, not a
coloured header. The active nav item uses a solid `bg-sidebar-primary` fill
*and* `aria-current="page"` — the red fill is a bonus cue, not the only one. A
required form field carries a marker plus the `required` attribute. Form
errors are text below the field; the `border-destructive` colour change is a
secondary cue only, so its width never changes.

**Disabled** is `opacity-50 pointer-events-none` plus the real `disabled`
attribute — never opacity alone.

**Charts.** The five `--chart-*` tokens are not distinguishable to a
colour-blind reader on their own. Every chart in the kitchen sink labels its
series directly in a legend rather than relying on a swatch key alone, and
each carries a text `aria-label` describing what it shows.

**Reduced motion** is handled in `theme.css` and applies automatically.

### Known gaps

None. Every pair in `CONTRAST_PAIRS` clears its minimum in both themes,
verified by `node scripts/check.mjs`. This design carries no contrast waiver.

---

## Never

1. **Never use a colour outside the token set** — no hex, no `bg-red-600`, no
   inline `oklch()` outside `theme.css`.
2. **Never round a card, button, input, table, or table cell.** Badges and
   avatars are the one deliberate exception and stay fully round — do not
   "fix" them into squares.
3. **Never put a drop shadow on a card, button, input, or table** — flat
   bordered surfaces only; shadows are reserved for floating overlays.
4. **Never use the brand red for more than button fills, dividers, the active
   nav indicator, and the action-card CTA strip.** A large decorative block of
   red reads as noise, not authority.
5. **Never pair the brand red with another saturated hue in the same
   control** (e.g. a red-and-blue button group) — one authority colour at a
   time.
6. **Never set a button, nav label, or tab in lowercase or sentence case** —
   they are uppercase, tracked 0.05em, weight 700.
7. **Never centre a body paragraph longer than two lines.**
8. **Never name, depict, or allude to any specific real professional or
   medical organisation** — no real initials, names, crests, or named
   accreditation programmes anywhere in this design's copy or assets. It must
   read as a generic, reusable template.
9. **Never let the dark `--sidebar` chrome appear on an ordinary content
   card** — it is reserved for the top utility bar, primary nav (all
   variants), sidebar nav, and the footer/CTA bands.
10. **Never use more than three font weights (400/700/800) on one screen.**
11. **Never exceed the 4px `--radius`** on a rectangular surface, and never mix
    radii within one component group.

---

## Extensions

**Uppercase optical centering — measured, no treatment shipped.** Following
`CREATE-DESIGN.md`'s recipe, `SETTINGS` was rendered in the vendored Public
Sans at 200px/700 (the weight this design sets uppercase text at) via Canvas
2D: `actualBoundingBoxAscent` 148, `actualBoundingBoxDescent` 2,
`fontBoundingBoxAscent` 190, `fontBoundingBoxDescent` 45 → `inkCenter` 73.0 vs
`boxCenter` 72.5, giving `shiftEm ≈ 0.0025em`. That is under the ~0.005em
noise floor `CREATE-DESIGN.md` sets for "nothing worth fixing" — in the same
range `slate` and `warm-paper` measured for Inter — so **no
`--uppercase-optical-nudge` token and no correction CSS are shipped**. A
consumer who ignores this note loses nothing, because there is nothing to
apply.

No other tokens are added beyond `shared/TOKENS.md`. A consuming application
needs no `health-pro`-specific handling beyond the two notes above.
