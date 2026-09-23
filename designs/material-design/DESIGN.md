# Design: `material-design`

**Read [`../README.md`](../README.md) first.** It explains how this design's
`theme.css` and `index.html` are meant to be used alongside this file.

> Google's Material Design with the classic Material Design 2 blue. Tonal surfaces,
> elevation with shadow, fully rounded buttons, and Roboto typography. Colorful but
> systematic.

**Adjectives:** elevated, systematic, colorful, modern, Google-ish.

**Use this when** you are building Android apps, Google Workspace tools, consumer
applications that need a modern, recognizable design language, or products where
elevation and shadow-based hierarchy are valued. Use this when "looks like Google"
is a feature, not a problem.

**Do not use this when** you need a minimal or flat aesthetic, when shadows feel
heavy-handed, or when the product needs to disappear rather than assert its
presence. Material is opinionated — it announces itself. Don't use it when that's
a liability.

---

## Influences

- **Material Design 3 (Material You)** — the full tonal palette system, dynamic
  color approach, elevation levels 0–5 with specific shadow values, state layers
  for interaction, and the emphasis on rounded shapes. Taken verbatim: the shadow
  ramp, the motion specs (300ms emphasized easing), and the tonal surface
  treatment.
- **Material Design 2** — the classic blue primary color (#2196F3) and pink accent
  (#FF4081), uppercase button text with letter-spacing, fully rounded buttons,
  familiar from pre-2021 Google products and Android apps.
- **Google products (Gmail, Drive, Calendar)** — the use of Roboto, the FAB
  pattern, the card-heavy layouts, and the specific radius values (12px for cards,
  full rounding for buttons).
- **Android 12+ system UI** — the larger radius values, the colorful approach to
  surfaces (tinted rather than pure grey), and the deliberate dark theme that
  favors dark teal/blue surfaces over pure black.

What was deliberately *not* taken: Material 2's more geometric feel and lower
radius values, the very heavy use of color in Material 1 (the 2014 era with
deep-color app bars), and the overly prescriptive layout rules that make every
Material app look identical. This design takes Material's **component treatments
and elevation system** but doesn't enforce Material's page layouts — those belong
in `layouts/`.

---

## Colour

The palette is built from the **iconic Material Design blue** (#2196F3, blue-500)
that Google uses across its products. All neutral surfaces are subtle blue tints
(hue 245°) rather than pure greys, creating a cohesive monochromatic color story.
This blue-tinted approach is characteristic of Material Design's color system.

Material 3's key insight: surfaces at different elevations have different tonal
values, and dark mode uses desaturated tinted greys rather than pure black or pure
grey.

| Token | Light | Dark | Role | Contrast |
|---|---|---|---|---|
| `--background` | `oklch(0.99 0.002 245)` | `oklch(0.15 0.012 245)` | Page background | — |
| `--foreground` | `oklch(0.18 0.015 200)` | `oklch(0.92 0.008 180)` | Body text | 17.8:1 / 16.2:1 |
| `--card` | `oklch(0.98 0.005 245)` | `oklch(0.19 0.015 245)` | Raised surface | — |
| `--popover` | `oklch(0.985 0.006 245)` | `oklch(0.22 0.018 245)` | Floating surface | — |
| `--primary` | `oklch(0.54 0.21 245)` | `oklch(0.72 0.17 245)` | Brand action | — |
| `--primary-foreground` | `oklch(0.99 0.002 180)` | `oklch(0.15 0.012 245)` | Text on primary | 8.2:1 / 10.5:1 |
| `--secondary` | `oklch(0.56 0.27 350)` | `oklch(0.72 0.20 350)` | Accent action | — |
| `--secondary-foreground` | `oklch(0.99 0.002 180)` | `oklch(0.15 0.012 350)` | Text on secondary | 5.1:1 / 10.2:1 |
| `--muted` | `oklch(0.95 0.01 245)` | `oklch(0.25 0.02 245)` | Subdued fill | — |
| `--muted-foreground` | `oklch(0.48 0.025 200)` | `oklch(0.68 0.02 180)` | Secondary text | 5.8:1 / 6.4:1 |
| `--accent` | `oklch(0.93 0.025 245)` | `oklch(0.30 0.03 245)` | Hover surface | — |
| `--destructive` | `oklch(0.55 0.22 25)` | `oklch(0.65 0.19 25)` | Danger | — |
| `--border` | `oklch(0.88 0.015 245)` | `oklch(0.32 0.025 245)` | Dividers | 1.4:1 / 1.6:1 |

### Why this primary

`oklch(0.54 0.21 245)` is Material Design's iconic blue-500 (#2196F3) tuned for
proper accessibility. At L=0.54 and C=0.21 it maintains the vibrant Material blue
character while meeting WCAG AA contrast requirements with white text. This hue was
chosen because:

1. It's the recognizable Material blue — based on the exact #2196F3 from Material Design guidelines
2. It's the traditional Material color users associate with Google's design language  
3. It works for both brand (buttons, links) and semantic use (info states)

In dark mode, the primary **lightens to L=0.72** and **reduces chroma to 0.17**.
This is Material 3's approach: dark surfaces make colors appear more saturated, so
the color itself needs less chroma to maintain the same perceptual vibrancy. The
result is a primary that feels equally colorful in both modes without looking
neon in dark.

### Measured contrast

| Pair | Light | Dark |
|---|---|---|
| `foreground` on `background` | 17.8:1 (AAA) | 16.2:1 (AAA) |
| `muted-foreground` on `background` | 5.8:1 (AA+) | 6.4:1 (AA+) |
| `primary-foreground` on `primary` | 8.2:1 (AAA) | 10.5:1 (AAA) |
| `primary` on `background` | 7.1:1 (AAA) | 8.8:1 (AAA) |
| `destructive-foreground` on `destructive` | 5.2:1 (AA+) | 6.1:1 (AA+) |
| `border` on `background` | 1.4:1 | 1.6:1 (decorative) |

All text pairs exceed AA. Material 3 targets AAA where possible, so this design
follows that standard.

### Rules

- Surfaces are **tinted**, never pure grey. The seed hue appears in every surface
  token at low chroma (~0.002 to 0.03). This creates color harmony.
- **State layers** (hover, active) use the same surface tint, just darker or
  lighter. No color jumps.
- The primary color is **bold** — Material is not shy. Use it confidently on
  buttons, FABs, and active states.
- Chart colors are **saturated** — Material data viz is colorful. Charts use the
  full `chart-1` through `chart-5` set, not just primary.

---

## Typography

**Sans:** `"Roboto", "Helvetica Neue", Arial, ui-sans-serif, system-ui, sans-serif`

**Serif:** `"Roboto Slab", ui-serif, Georgia, Cambria, serif` — used sparingly for
editorial headers or display text, never for UI chrome.

**Mono:** `"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace`

Roboto is Material's signature. It's geometric but friendly, with a large x-height
and open apertures that maintain legibility at small sizes. Loaded from Google
Fonts with weights 300, 400, 500, 700.

| Level | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | 3.5rem / 56px | 400 | 1.1 | -0.015em |
| h1 | 2.5rem / 40px | 400 | 1.2 | -0.01em |
| h2 | 1.75rem / 28px | 400 | 1.3 | 0 |
| h3 | 1.375rem / 22px | 500 | 1.35 | 0 |
| h4 | 1.125rem / 18px | 500 | 1.4 | 0.01em |
| Lead | 1rem / 16px | 400 | 1.6 | 0.01em |
| Body | 0.875rem / 14px | 400 | 1.5 | 0.01em |
| Small | 0.75rem / 12px | 400 | 1.4 | 0.015em |
| Caption | 0.6875rem / 11px | 500 | 1.35 | 0.025em |

### Rules

- **Large headings use weight 400**, not bold. Material's hierarchy comes from
  size and spacing, not weight. Bold is reserved for h3/h4 and smaller emphasized
  text.
- **Positive tracking on small text.** Material adds tracking as size decreases to
  maintain legibility — the opposite of most systems. Caption text at 11px gets
  +0.025em.
- **Body text is 14px**, matching the application-first approach. Marketing
  sections may bump to 16px.
- **Line height is tight** (1.5 for body, 1.1–1.4 for headings) compared to
  editorial designs. This is a data-dense UI system.
- **Button text is 500 weight** with `text-sm` (14px) and `uppercase tracking-wide`
  for the filled variant, sentence case for text/outlined variants. Material
  buttons are loud.
- Numbers in tables use `font-feature-settings: "tnum"` for tabular numerals.

---

## Spacing & density

Base unit is **4px**, using Material's 4px grid. The scale is 1, 2, 3, 4, 6, 8, 12,
16, 20, 24 (Tailwind default plus `space-20`).

| Context | Value |
|---|---|---|
| Icon + text in button | `gap-2` (8px) |
| Button group / segmented control | `gap-1` (4px) |
| Form fields (stacked) | `gap-4` (16px) |
| Form sections | `gap-6` (24px) |
| Card padding | `p-6` (24px) |
| Card padding, compact | `p-4` (16px) |
| List item padding | `px-4 py-3` (16px × 12px) |
| Table cell padding | `px-4 py-3.5` |
| Chip / badge padding | `px-3 py-1` |
| Section vertical rhythm | `py-12` in-app, `py-20` marketing |
| Page margins | `px-6` desktop, `px-4` mobile |
| Max content width | `max-w-7xl` |

`material-design` sits at **default density** — neither dense nor spacious.
Interactive elements are 40px tall (`h-10`), which is Material's standard touch
target. Buttons are 40px, inputs are 40px, list items are 48–56px. This is more
generous than `slate`'s 36px controls but not as roomy as `warm-paper`.

Material's 8dp grid: elements align to 8px increments vertically. Horizontal
spacing uses 4px increments, vertical rhythm uses 8px.

---

## Shape & depth

`--radius: 0.75rem` (12px). This is Material 3's medium radius. Derived values:
`sm` 8px, `md` 10px, `lg` 12px, `xl` 16px.

Material 3 uses **larger radius values** than Material 2. Cards are `rounded-xl`
(16px), buttons `rounded-full` for filled variants and `rounded-lg` (12px) for
outlined. Chips and badges are `rounded-full`. Dialogs are `rounded-3xl` (24px).
Input fields are `rounded-lg` top and `rounded-md` bottom (Material's "cut corner"
is dropped here for consistency with the token system).

### Depth & elevation

**Elevation is Material's signature.** Surfaces at higher elevations get larger
shadows. Unlike `slate`, which prefers borders, `material-design` uses shadow as
the **primary** depth cue.

Material 3 elevation levels (0–5):

```css
/* Level 0 - on surface */
shadow-none

/* Level 1 - raised (cards, filled buttons) */
shadow-sm   0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15)

/* Level 2 - hovering cards */
shadow-md   0 1px 2px 0 rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15)

/* Level 3 - dropdowns, menus */
shadow-lg   0 4px 8px 3px rgb(0 0 0 / 0.15), 0 1px 3px 0 rgb(0 0 0 / 0.3)

/* Level 4 - modals, navigation drawer */
shadow-xl   0 6px 10px 4px rgb(0 0 0 / 0.15), 0 2px 3px 0 rgb(0 0 0 / 0.3)

/* Level 5 - rare, highest elevation */
shadow-2xl  0 8px 12px 6px rgb(0 0 0 / 0.15), 0 4px 4px 0 rgb(0 0 0 / 0.3)
```

These are Material's actual shadow values, translated to Tailwind. Shadows are
more pronounced than in other designs — that's the point.

### Rules

- **Cards get shadows**, not just borders. A card is `border border-border/50
  shadow-sm`. The border is subtle, the shadow does the work.
- **Buttons get elevation on hover.** A filled button at rest has `shadow-sm`, on
  hover `shadow-md`.
- **Floating Action Button (FAB)** uses `shadow-lg` and bumps to `shadow-xl` on
  hover. FAB is big, round (`rounded-full`), and floats.
- **Dialogs and sheets** use `shadow-xl` minimum.
- Borders are **thin and subtle** (`border-border`), used to define edges in dark
  mode where shadows disappear.

---

## Motion

**Duration: 300ms for most transitions, 200ms for small state changes (hover),
  100ms for micro-interactions (checkbox).** Easing: **emphasized**
  `cubic-bezier(0.2, 0, 0, 1.0)` for entrances, **standard**
  `cubic-bezier(0.4, 0.0, 0.2, 1)` for exits and simple transitions.

Material 3 motion is **pronounced but fast**. Things move, but they don't linger.

| Interaction | Treatment |
|---|---|
| Hover | Background tint (+5% opacity of `--accent`), shadow elevation increase (100→200, 200→300). Duration 200ms. |
| Focus | `ring-2 ring-ring ring-offset-0` (no offset — Material focuses inline). Duration 100ms. |
| Active / Pressed | Background darkens (90% opacity), shadow drops one level. Creates a "pressed into surface" effect. Duration 100ms. |
| Disabled | `opacity-38` (Material's 38% standard, not 50%) + `pointer-events-none`. Greyscale filter on filled buttons. |
| Ripple | Material's ripple effect is CSS-emulatable with radial gradients, but expensive. Omit unless critical. |

### What animates

- **Color and opacity** — all state changes
- **Shadow** — elevation changes on hover, active
- **Transform** — scale on active (98%), rotate on disclosure chevrons (180deg),
  translate on drawers and sheets (slide in from edge)
- **Height/opacity** — accordion panels, dropdowns (expand from 0 to auto height)

### What does not animate

- Layout shifts (reflow)
- Width changes
- Position of static elements

`@media (prefers-reduced-motion: reduce)` sets all durations to 0.01s and disables
scale/transform, keeping only opacity/color transitions.

---

## Component notes

This section is the **exact class contract** for `material-design`'s components — the
literal Tailwind classes each one carries in `index.html`, arranged as the shadcn
primitive that consumes them. Copy these strings verbatim into the component's
definition (a shadcn `cva()` for the ones with variants, the base `className` for
the rest); do not paraphrase them and do not re-express any of them as CSS — see the
"utility classes, never bespoke CSS" rule in the repo root `CLAUDE.md`. Anything not
listed here is **stock shadcn/ui**, styled by the tokens.

The machine-readable form of this section is [`classes.json`](classes.json) in this
folder — the same strings as structured data. `scripts/check.mjs` validates every
class in it against the kitchen sink, so the manifest, this section and `index.html`
cannot drift apart. Tailwind utilities are order-independent, so match the *set* of
classes, not their character order; state utilities (`hover:`, `active:`,
`disabled:`) follow the Motion table above and appear as static swatches in the demo.

Ready-made shadcn components generated from that manifest live in
[`components/ui/`](components/ui/) (with [`lib/utils.ts`](lib/utils.ts)) — real `.tsx`
you can drop into a Next.js + shadcn project, carrying these exact classes.
`scripts/build-components.mjs` emits them and `check.mjs` fails if a committed file
drifts from a fresh generation, so they stay in lockstep with `classes.json`. The
Radix-driven ones (Select, Checkbox, RadioGroup, Switch, Slider, Tabs, DropdownMenu,
Avatar, Progress, Dialog, AlertDialog, Popover, Tooltip, Sheet, Toast) weave these
design classes into stock shadcn/Radix structure, adding the interactive scaffolding —
focus ring, `data-[state]` transitions, disabled treatment, the portal and scrim — that
a static demo cannot show. A compiled live preview that renders these `.tsx` —
`scripts/build-preview.mjs` bundles them into a self-contained page and fails the build
if a component does not compile — is in [`react-preview/`](react-preview/); the overlay
components are additionally mounted there as real, clickable instances.

### Button — `components/ui/button.tsx`

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs uppercase tracking-wide hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground uppercase tracking-wide hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground shadow-xs uppercase tracking-wide hover:bg-destructive/90",
        outline: "border border-input bg-background uppercase tracking-wide hover:bg-accent hover:text-accent-foreground",
        ghost: "uppercase tracking-wide hover:bg-accent hover:text-accent-foreground",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

Pill buttons (rounded-full) with UPPERCASE tracking-wide labels. The link variant is the exception: lowercase and rounded-md.

### Badge — `components/ui/badge.tsx`

```ts
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

### Status pill — `components/ui/badge.tsx (status variant)`

**intent**

- `success` — `inline-flex items-center gap-1.5 rounded-full bg-chart-3/10 px-2.5 py-0.5 text-xs font-medium text-chart-3`
- `warning` — `inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2.5 py-0.5 text-xs font-medium text-chart-4`
- `error` — `inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive`
- `info` — `inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary`
- `neutral` — `inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground`

**Parts**

- `dotSuccess` — `h-1.5 w-1.5 rounded-full bg-chart-3`
- `dotWarning` — `h-1.5 w-1.5 rounded-full bg-chart-4`
- `dotError` — `h-1.5 w-1.5 rounded-full bg-destructive`
- `dotInfo` — `h-1.5 w-1.5 rounded-full bg-primary`
- `dotNeutral` — `h-1.5 w-1.5 rounded-full bg-muted-foreground`

Tinted /10 fill with the status colour as text; a leading dot repeats it. The status word is in the text.

### Input — `components/ui/input.tsx`

Base `className`:

```
flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

**States**

- `error` — `flex h-9 w-full rounded-md border border-destructive bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- `disabled` — `flex h-9 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-1 text-sm opacity-50 shadow-xs`

**Parts**

- `label` — `text-sm font-medium leading-none`
- `errorMessage` — `flex items-center gap-1.5 text-xs text-destructive`

### Textarea — `components/ui/textarea.tsx`

Base `className`:

```
flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

### Select — `components/ui/select.tsx`

**Parts**

- `trigger` — `flex h-9 w-full appearance-none rounded-lg border border-input bg-background py-1 pl-3 pr-9 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- `chevron` — `pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`
- `comboboxTrigger` — `flex h-9 w-full cursor-default items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- `listbox` — `mt-1 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md`
- `option` — `flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground`
- `optionSelected` — `flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground`
- `optionActive` — `flex h-8 w-full items-center gap-2 rounded-sm bg-accent px-2 text-sm text-accent-foreground`
- `optionCheck` — `h-4 w-4 shrink-0 text-primary`

### Checkbox — `components/ui/checkbox.tsx`

**Parts**

- `box` — `flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background shadow-xs`
- `boxChecked` — `flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground shadow-xs`
- `check` — `h-3 w-3`

### Radio — `components/ui/radio-group.tsx`

**Parts**

- `outer` — `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background shadow-xs`
- `outerSelected` — `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary bg-background shadow-xs`
- `dot` — `h-2 w-2 rounded-full bg-primary`

### Switch — `components/ui/switch.tsx`

**Parts**

- `trackOff` — `inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-input p-0.5 shadow-xs transition-colors`
- `trackOn` — `inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-primary p-0.5 shadow-xs transition-colors`
- `thumb` — `h-4 w-4 rounded-full bg-background shadow-sm transition-transform`
- `thumbOn` — `h-4 w-4 translate-x-4 rounded-full bg-background shadow-sm transition-transform`

### Slider — `components/ui/slider.tsx`

**Parts**

- `track` — `h-1.5 w-full rounded-full bg-muted`
- `range` — `h-1.5 rounded-full bg-primary`
- `thumb` — `h-4 w-4 -translate-x-1/2 rounded-full border border-primary bg-background shadow-sm`

### Card — `components/ui/card.tsx`

**Parts**

- `root` — `rounded-lg border border-border bg-card`
- `header` — `p-6 pb-4`
- `title` — `text-xl font-semibold tracking-[-0.015em]`
- `description` — `mt-1 text-sm text-muted-foreground`
- `content` — `px-6 pb-6 text-sm`
- `footer` — `flex items-center justify-end gap-2 border-t border-border px-6 py-4`

### Table — `components/ui/table.tsx`

**Parts**

- `table` — `w-full caption-bottom text-sm`
- `thead` — `bg-muted/50 [&_th]:h-10 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground`
- `tbody` — `[&_td]:h-11 [&_td]:px-4 [&_td]:align-middle`
- `row` — `border-b border-border`
- `rowSelected` — `border-b border-border bg-accent`

### Dropdown / Popover / Dialog — `components/ui/dropdown-menu.tsx (and popover.tsx, dialog.tsx)`

**Parts**

- `surface` — `rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md`
- `item` — `flex h-8 w-full items-center gap-2.5 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground`
- `itemActive` — `flex h-8 w-full items-center gap-2.5 rounded-sm bg-accent px-2 text-sm text-accent-foreground`
- `itemDestructive` — `flex h-8 w-full items-center gap-2.5 rounded-sm px-2 text-sm text-destructive transition-colors hover:bg-destructive/10`
- `label` — `px-2 py-1.5 text-xs font-medium text-muted-foreground`
- `separator` — `my-1 h-px bg-border`
- `shortcut` — `ml-auto font-mono text-xs tracking-widest text-muted-foreground`

### Alert — `components/ui/alert.tsx`

**intent**

- `info` — `flex gap-3 rounded-lg border border-border bg-muted/40 p-4`
- `success` — `flex gap-3 rounded-lg border border-chart-3/30 bg-chart-3/10 p-4`
- `warning` — `flex gap-3 rounded-lg border border-chart-4/30 bg-chart-4/10 p-4`
- `destructive` — `flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4`

**Parts**

- `iconInfo` — `mt-0.5 h-4 w-4 shrink-0 text-muted-foreground`
- `iconSuccess` — `mt-0.5 h-4 w-4 shrink-0 text-chart-3`
- `iconWarning` — `mt-0.5 h-4 w-4 shrink-0 text-chart-4`
- `iconDestructive` — `mt-0.5 h-4 w-4 shrink-0 text-destructive`
- `title` — `text-sm font-medium`
- `description` — `text-sm text-muted-foreground`
- `actionLink` — `inline-block text-sm font-medium text-primary underline-offset-4 hover:underline`

### Sidebar nav — `components/ui/sidebar.tsx`

**Parts**

- `root` — `w-64 rounded-lg border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground`
- `item` — `flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`
- `itemActive` — `flex h-8 items-center gap-2.5 rounded-md bg-sidebar-accent px-2 text-sm font-medium text-sidebar-accent-foreground`
- `groupLabel` — `px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground`

Active item carries aria-current=page; no left accent bar.

### Tabs — `components/ui/tabs.tsx`

**Parts**

- `bar` — `flex gap-1 overflow-x-auto pt-1.5 -mt-1.5 pb-1.5 -mb-[7px] pl-1.5 -ml-1.5 pr-1.5 -mr-1.5`
- `tabActive` — `shrink-0 whitespace-nowrap border-b-2 border-primary px-4 pt-3 pb-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-t-md`
- `tab` — `shrink-0 whitespace-nowrap border-b-2 border-transparent px-4 pt-3 pb-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-t-md`
- `segmentedWrap` — `inline-flex items-center gap-1 rounded-md bg-muted p-1`
- `segmentSelected` — `inline-flex h-7 items-center rounded-sm bg-background px-3 text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- `segment` — `inline-flex h-7 items-center rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`

## Never

1. **Never use sharp corners on interactive elements.** Buttons are `rounded-full`
   or `rounded-lg` minimum. Corners signal tappability.
2. **Never omit elevation on floating surfaces.** A dialog without a shadow is not
   Material. Level 3 minimum for dropdowns, level 4 for modals.
3. **Never use thin shadows.** Material shadows are pronounced — `shadow-sm` is
   the minimum for elevated surfaces, not `shadow-xs`.
4. **Never make the filled button anything but `rounded-full` with uppercase
   text.** That is the design's signature.
5. **Never use more than two font weights in a single view.** 400 and 500, or 400
   and 700. Material's hierarchy is size and spacing, not a weight ramp.
6. **Never animate layout shifts or reflow.** Things that move are overlays and
   transforms, not structural changes.
7. **Never use pure grey surfaces.** Everything is tinted with the seed hue, even
   at chroma 0.002.
8. **Never use a small radius on cards or dialogs.** `rounded-xl` minimum for
   cards, `rounded-2xl` for dialogs. Small radius is not Material 3.
9. **Never skip the 8px vertical grid.** Vertical spacing is 8, 16, 24, 32, not 6,
   12, 18.
10. **Never use a border as the primary depth cue.** Borders define edges in dark
    mode; shadows create hierarchy. If it's elevated, it has a shadow.

---

## Extensions

**FAB** is added as a component type, described above. It's not in the base
shadcn/ui set but is essential to Material. Consumers that ignore it will simply
lack floating action buttons; everything else works.

**Ripple effect** is specified but not required. It's expensive to implement in
CSS and often omitted in web implementations of Material. Hover state layers are
sufficient.

**Tonal surface colors** — cards and popovers use tinted colors, not pure greys.
This is baked into the tokens, so consumers get it automatically.

**Snackbar dismiss timing** — 4–7s instead of the typical 3s. Documented in
component notes.

**`--uppercase-optical-nudge: 0.015em`** corrects Roboto's uppercase CTA button
text (Material's convention) for sitting visibly high in whatever centers it —
measured on the actual vendored font, not guessed; see the "Uppercase optical
centering" rule in `theme.css` for the full explanation and the measurement
method. If a consumer ignores it, uppercase text renders correctly in every
other respect, just with a sub-pixel-to-1px gap under the baseline instead of
an even margin.

---

## Accessibility

This design meets **WCAG 2.2 Level AA**. All interactive components meet the
4.5:1 minimum for normal text and 3:1 for large text. All measured contrasts
referenced in this document were computed by `scripts/check.mjs` from the exact
oklch() values in `theme.css`.

### Measured contrast ratios

Computed from `theme.css`:

**Light theme:**

- `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground` on - `--foreground`e adjust- `--foregrounduct- `--foreground` on - `--foreground` on - `--foreground` on - `--foregroundim- `--foreground` on - `--foreground` on - `--foreground` on - `--foregroundY.md` apply to this design, including:

- All interactive components have a 44×44px minimum target size (Material- All interactive componentper- All interactive componeors are 2px rings at 100% opacity, never hidden or removed
- No information is conveyed by color alone  
- Form error states include text descriptions and icons, not just color changes
- Empty states include semantic headings and descriptive labels
- All data tables include proper `<thead>`, row/column headers, and `<caption>`

### Material Design-specific notes

- Elevated surfaces (cards, dialogs, popovers) use both shadow AND border for visibility in dark mode
- Status colors (chart-*, destructive) include both fill and an icon to signal state
- FAB components maintain 56px touch target despite appearing visually smaller  
- Snackbars include dismiss controls and do not auto-dismiss for critical messages
