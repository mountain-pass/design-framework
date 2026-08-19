# Design: `slate`

> A calm, neutral product UI. Cool greys, one blue accent, restrained depth.
> The design equivalent of getting out of the way.

**Adjectives:** neutral, precise, quiet, dense-ish, professional.

**Use this when** you are building an internal tool, a B2B SaaS product, an admin
console, a dashboard, or anything where the user is here to do a job and will look
at it for six hours a day.

**Do not use this when** the product needs personality or memorability — a
consumer app, a landing page for a brand with a point of view, anything editorial.
`slate` is deliberately forgettable. That is a feature in a CRM and a failure on a
homepage.

This is the reference implementation for the repository. When something is
ambiguous in another design, this is the design that resolves it.

---

## Influences

- **Linear** — the density, the single accent colour used sparingly, the refusal
  to decorate. Not its dark-first bias; `slate` is designed light-first.
- **Vercel / Geist** — the near-monochrome surface treatment and the preference
  for a hairline border over a drop shadow.
- **shadcn/ui defaults** — the component vocabulary and the token structure,
  tuned rather than replaced.

What was deliberately *not* taken: Linear's heavy use of gradient and glow, and
Vercel's very high contrast pure-black-on-pure-white, which is fatiguing over a
long session.

---

## Colour

The palette is a single cool-grey ramp at hue 264 plus one blue accent at the same
hue. Because the greys and the accent share a hue, the accent reads as "the
saturated version of the interface" rather than as a foreign colour dropped on top.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.181 0.014 264)` | Page |
| `--foreground` | `oklch(0.21 0.02 264)` | `oklch(0.961 0.005 264)` | Body text |
| `--card` | `oklch(1 0 0)` | `oklch(0.221 0.016 264)` | Raised surface |
| `--popover` | `oklch(1 0 0)` | `oklch(0.241 0.017 264)` | Floating surface |
| `--primary` | `oklch(0.51 0.16 264)` | `oklch(0.681 0.135 264)` | Brand action |
| `--secondary` / `--muted` | `oklch(0.968 0.007 264)` | `oklch(0.271 0.017 264)` | Subdued fill |
| `--muted-foreground` | `oklch(0.551 0.019 264)` | `oklch(0.682 0.016 264)` | Secondary text |
| `--accent` | `oklch(0.958 0.011 264)` | `oklch(0.301 0.019 264)` | Hover surface |
| `--destructive` | `oklch(0.577 0.212 27.3)` | `oklch(0.648 0.188 25.5)` | Danger |
| `--border` | `oklch(0.922 0.008 264)` | `oklch(0.301 0.018 264)` | Hairlines, dividers |
| `--input` | `oklch(0.660 0.008 264)` | `oklch(0.500 0.018 264)` | Control boundaries |

### Why this primary

`oklch(0.51 0.16 264)` is a blue dark enough to carry white text at AA without
being navy. At L=0.51 it sits below the "large text only" threshold against white,
so it works as both a fill (white text on it) and as a text colour (on white).
That dual use is what lets a design get away with one accent colour — the same
token serves buttons, links, active states, and focus rings.

In dark mode the primary lightens to `L=0.681` and **drops chroma** from 0.16 to
0.135. This is the correction most dark themes miss: holding chroma constant while
raising lightness produces a colour that reads as garish and slightly radioactive
against a dark surface.

### Measured contrast

Computed from `theme.css` by `scripts/check.mjs`, not estimated:

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 17.73:1 | 16.77:1 | 4.5:1 |
| `muted-foreground` on `background` | 4.83:1 | 6.57:1 | 4.5:1 |
| `primary-foreground` on `primary` | 5.66:1 | 6.35:1 | 4.5:1 |
| `primary` on `background` | 5.91:1 | 6.46:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 4.62:1 | 5.13:1 | 4.5:1 |
| `destructive` on `background` | 4.82:1 | 5.27:1 | 4.5:1 |
| `ring` on `background` | 5.91:1 | 6.46:1 | 3:1 |
| `input` on `background` | 3.11:1 | 3.13:1 | 3:1 |
| `border` on `background` | 1.26:1 | 1.38:1 | decorative |

Everything clears its minimum, and `check.mjs` fails the build if that stops being
true.

`muted-foreground` is deliberately kept above 4.5:1 rather than the 3:1 that
"secondary text" is often allowed, because in a dense tool the secondary text is
frequently the text that matters.

### Why `--border` and `--input` differ

They used to hold the same pale hairline, which meant an outlined text field was
identified by a 1.26:1 edge — well under the 3:1 WCAG 1.4.11 requires of a control
boundary. They are now two different values on purpose:

- `--border` stays a hairline at 1.26:1. It separates cards, table rows, and
  sections, and a divider carries no information, so it is exempt.
- `--input` is `oklch(0.660 0.008 264)` — a mid grey at 3.11:1. It is the only
  thing that says "this is a text field", so it is a UI boundary and is held to
  the standard.

This is the one place `slate` trades a little of its hairline character for
legibility, and it is confined to form controls. Everything else keeps the
Vercel-ish edge treatment described under Influences.

### Why dark-mode destructive uses dark text

In dark mode `--destructive` is a light red (`L=0.648`) so that error *text* clears
4.5:1 against the dark page. A fill that light cannot also carry white text — the
two constraints move in opposite directions, and there is no lightness that
satisfies both. So dark mode puts **dark text on the red fill**
(`--destructive-foreground: oklch(0.200 0.040 25.5)`), which reaches 5.13:1 while
leaving the fill light enough to work as text at 5.27:1. Light mode is unaffected
and still uses near-white on red.

### Rules

- One accent colour per screen. If two things are both blue, the user cannot tell
  which one is the point.
- Status colours (`chart-3` green, `chart-4` amber, `destructive` red) are for
  *state*, never for decoration or for distinguishing categories in navigation.
- Chart colours are ordered. A two-series chart uses `chart-1` and `chart-2`, not
  `chart-1` and `chart-4`.

---

## Typography

**Sans:** `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
**Mono:** `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
**Serif:** system serif stack — present in the token set for contract compliance,
but `slate` does not use a serif anywhere. If you find yourself reaching for it,
you are working against the design.

Inter is loaded with `font-feature-settings: "cv11", "ss01"` — this switches to the
single-storey `l` and the disambiguated `1`/`I`, which matters in a UI full of IDs
and numbers.

| Level | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | 3rem / 48px | 600 | 1.05 | -0.03em |
| h1 | 2.25rem / 36px | 600 | 1.15 | -0.025em |
| h2 | 1.5rem / 24px | 600 | 1.25 | -0.02em |
| h3 | 1.25rem / 20px | 600 | 1.35 | -0.015em |
| h4 | 1rem / 16px | 600 | 1.4 | -0.01em |
| Lead | 1.125rem / 18px | 400 | 1.6 | 0 |
| Body | 0.875rem / 14px | 400 | 1.6 | 0 |
| Small | 0.8125rem / 13px | 400 | 1.5 | 0 |
| Caption | 0.75rem / 12px | 500 | 1.4 | 0.01em |

### Rules

- **Body text is 14px, not 16px.** This is an application, not an article. 16px
  body in a data-dense tool wastes a third of the vertical space.
- Negative tracking scales with size. Large type at default tracking looks loose;
  small type at negative tracking looks cramped. The table above is the schedule —
  do not improvise.
- Only two weights: 400 and 600. No 500, no 700. Two weights is enough to build a
  hierarchy and removes an entire category of inconsistency.
- Body copy is capped at `max-w-[70ch]`. Long-form prose in an application is
  usually in a settings description or an empty state, and both get unreadable at
  full container width.
- Numbers in tables use `tabular-nums`. Always. Columns of figures that do not
  align are the fastest way to make a professional tool look amateur.

---

## Spacing & density

Base unit is **4px**. The scale is Tailwind's default: 1, 2, 3, 4, 6, 8, 12, 16, 24.
Skipping 5, 7, 9, 10, 11 is intentional — a smaller set of choices produces more
consistent output, especially from an AI.

| Context | Value |
|---|---|
| Related controls (icon + label, button group) | `gap-2` (8px) |
| Sibling form fields | `gap-4` (16px) |
| Form field groups / fieldsets | `gap-6` (24px) |
| Card padding | `p-6` (24px) |
| Card padding, compact variants | `p-4` (16px) |
| Table cell padding | `px-4 py-3` |
| Page section vertical rhythm | `py-8` in-app, `py-16` marketing |
| Page gutter | `px-6` desktop, `px-4` mobile |
| Max content width | `max-w-7xl` app, `max-w-6xl` marketing |

`slate` sits on the **dense side of neutral**. Controls are 36px tall (`h-9`), not
40px or 44px. Rows in a table are 44px. This is a design for people using a mouse
on a large screen for a long time; touch targets get bumped to 44px only below the
`md` breakpoint.

---

## Shape & depth

`--radius: 0.5rem` (8px). Derived: `sm` 4px, `md` 6px, `lg` 8px, `xl` 12px.

Buttons and inputs use `rounded-md` (6px). Cards and popovers use `rounded-lg`
(8px). Badges and avatars use `rounded-full`. Nothing is square, nothing is a pill
except badges and avatars.

### Depth rule

**Borders separate; shadows float.**

- A surface that sits *in* the page flow — a card, a table, a panel — gets a
  `border` and no shadow.
- A surface that sits *above* the page — a dropdown, a dialog, a popover, a toast
  — gets a shadow and a border. The border is what keeps it legible in dark mode,
  where a shadow against a dark background is nearly invisible.
- Buttons get `shadow-xs` and nothing more. A button with a real drop shadow reads
  as a 2013 interface.

Shadow ramp:

```
shadow-xs   0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow-sm   0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)
shadow-md   0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)
shadow-lg   0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)
```

Opacities are lower than Tailwind's defaults. Against a near-white background, the
stock values read as grey smudges.

---

## Motion

**Duration 150ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`.** One duration for
everything interactive. Overlay entrances may use 200ms.

| State | Treatment |
|---|---|
| Hover | Background shifts one step (`bg-accent`), or fill drops to `/90`. No transform, no scale. |
| Focus | `ring-2 ring-ring ring-offset-2 ring-offset-background`, on `:focus-visible` only. |
| Active | Fill drops to `/80`. No transform. |
| Disabled | `opacity-50 pointer-events-none`. Never a colour change — the shape must stay recognisable. |

What animates: colour, opacity, and the transform of things that genuinely move
(an accordion chevron, a switch thumb). What does not animate: layout, width,
height, or the position of anything the user is trying to click.

`prefers-reduced-motion: reduce` collapses all durations to ~0. This is in
`theme.css`, so it applies automatically.

---

## Component notes

Anything not mentioned here is **stock shadcn/ui**, styled by the tokens.

**Button** — Six variants, four sizes, as stock. The `default` size is `h-9`.
Icon-only buttons are `h-9 w-9` with the icon at 16px. Icons inside labelled
buttons are 16px with `gap-2`.

**Input** — `h-9`, `border-input`, `rounded-md`, `text-sm`. `border-input` is a
visibly darker grey than `border` — that is deliberate (see Colour), so do not
"fix" it by swapping in `border`. Placeholder is
`text-muted-foreground`. The error state adds `border-destructive` and
`focus-visible:ring-destructive`; the message below is `text-destructive text-xs`.
The border does not thicken on error — thickening shifts layout by a pixel and the
colour change is sufficient.

**Card** — `border rounded-lg bg-card`, no shadow. Header is `p-6 pb-4`, content
`p-6 pt-0`, footer `p-6 pt-0 border-t`. Card titles are h3 scale.

**Table** — Header row is `bg-muted/50` with `text-muted-foreground text-xs
font-medium uppercase tracking-wide`. Body rows are 44px with `border-b`. Hover is
`bg-muted/50`. Selected is `bg-accent`. Numeric columns are right-aligned with
`tabular-nums`. Row actions live in a ghost icon button at the row's right edge.

**Badge** — `rounded-full px-2.5 py-0.5 text-xs font-medium`. Status pills use a
6px leading dot in the status colour with a `/10` tinted background and the status
colour as text.

**Dropdown / Popover / Dialog** — `bg-popover border rounded-lg shadow-md` (dialogs
`shadow-lg`). Menu items are `h-8 px-2 rounded-sm text-sm`, hover `bg-accent`.
Keyboard shortcut hints are `text-xs text-muted-foreground ml-auto tracking-widest`.

**Alert** — `border rounded-lg p-4`, icon at 16px in the top-left, title
`font-medium text-sm`, description `text-sm text-muted-foreground`. Intent is
carried by the icon and a `/10` tinted background, not by a heavy coloured left
bar.

**Sidebar nav** — Uses the `--sidebar-*` tokens, which are one step off the page
background rather than matching it. Items are `h-8 px-2 rounded-md text-sm`, active
is `bg-sidebar-accent font-medium` with no left accent bar. Group labels are
caption scale in `muted-foreground`.

**Tabs** — Underline style, not the filled-pill style shadcn ships by default. A
2px `border-primary` underline on the active tab, `text-muted-foreground` on the
rest. The filled style competes with buttons for attention.

---

## Accessibility

Baseline is `shared/ACCESSIBILITY.md` — WCAG 2.2 AA. This section covers only what
`slate` decides for itself.

**Focus ring.** `ring-2 ring-ring ring-offset-2 ring-offset-background`, on
`:focus-visible` only. `--ring` is the primary blue, which measures 5.91:1 light and
6.46:1 dark against the page — comfortably past the 3:1 that WCAG 1.4.11 wants of a
focus indicator. The offset is what keeps it legible on filled buttons, where the
ring would otherwise sit directly on a similar blue.

**Target sizes.** `slate` is a dense design, so this needs stating precisely:

| Control | Height | Notes |
|---|---|---|
| Button, input, select | 36px (`h-9`) | Above the 24px floor, below the 44px touch size |
| Icon button | 36×36 (`h-9 w-9`) | 16px icon, padding makes up the target |
| Menu item | 32px (`h-8`) | Fine for pointer; full-width, so the row is the target |
| Table row | 44px | Row actions are a 32px ghost button inside it |
| Below `md` | **44×44** | Every interactive target, no exceptions |

The 36px default is a deliberate trade for density and is legal at AA. If you are
building something used on a touch screen, use 44px throughout and accept the
lower density — do not split the difference.

**State is never colour alone.** Status pills pair the dot with a text label. Table
sort state uses a chevron, not a coloured header. The active sidebar item uses
`font-medium` plus `bg-sidebar-accent` plus `aria-current="page"`, not colour by
itself — this is why `slate` has no left accent bar and still reads unambiguously.
Form errors put the message in text below the field; the `border-destructive` is a
secondary cue, which is also why the border colour changes but its width does not.

**Disabled** is `opacity-50 pointer-events-none` plus the real `disabled` attribute.
Opacity alone leaves the control operable by keyboard.

**Charts.** Five `--chart-*` tokens are not distinguishable to a colour-blind
reader. Any chart with more than two series needs direct labels or a legend that
also varies shape or dash pattern.

**Reduced motion** is handled in `theme.css` and applies automatically.

### Known gaps

None. Every pair in `CONTRAST_PAIRS` clears its minimum in both themes, verified by
`node scripts/check.mjs`, which treats a shortfall as a build failure.

---

## Never

1. **Never use a colour outside the token set.** No hex, no `bg-blue-500`, no
   inline `oklch()`. This is the rule that keeps designs swappable.
2. **Never put a drop shadow on a button, input, badge, or table.** `shadow-xs` on
   buttons is the ceiling.
3. **Never use a font weight other than 400 or 600.**
4. **Never use more than one accent colour on a screen.** If two elements are both
   primary-blue, at least one of them is wrong.
5. **Never use a gradient.** Not on buttons, not on hero sections, not on a card.
6. **Never centre body text.** Headings and empty states may be centred; paragraphs
   are left-aligned.
7. **Never animate size or position of an interactive target.** Things the user is
   aiming at do not move.
8. **Never use an emoji as an icon.** Lucide, inline SVG, 16px, 1.5 stroke.
9. **Never let a table's numeric column go un-right-aligned** or drop
   `tabular-nums`.
10. **Never exceed 20px of border radius**, and never mix radii within one
    component group.

---

## Extensions

None. `slate` defines exactly the token set in `shared/TOKENS.md` and nothing more.
A consuming application needs no `slate`-specific handling.
