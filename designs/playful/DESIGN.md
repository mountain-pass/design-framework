# Design: `playful`

**Read [`../README.md`](../README.md) first.** It explains how this design's
`theme.css` and `index.html` are meant to be used alongside this file.

> Bright, cheerful, energetic. A vibrant purple and orange palette with generous rounded corners that brings joy to every interaction.

**Adjectives:** playful, energetic, friendly, vibrant, cheerful.

**Use this when** you are building consumer apps, educational products, children's software, social platforms, or anything where delight and approachability matter more than corporate restraint. Perfect for products that want users to smile.

**Do not use this when** you need to convey serious professionalism, financial trust, or enterprise credibility. A law firm's dashboard should not look playful. Neither should medical records software or banking interfaces. This design optimizes for joy, not gravitas.

---

## Influences

- **ClassDojo** — the vibrant purple gradients, bright accent colors (orange, green), generous rounded corners, and overall sense of fun and energy. The screenshot provided directly inspired this palette.
- **Duolingo** — the use of bright, saturated colors to make learning feel like play, and the friendly rounded button shapes.
- **Stripe's modern brand** — not the product UI, but the marketing site's use of soft shadows and card elevation to create depth without harshness.

What was deliberately *not* taken: overly cartoonish aesthetics or childish treatments. Playful does not mean unsophisticated. The typography remains clean and the hierarchy clear.

---

## Colour

The palette centers on a vibrant purple (hue 285°) as primary, with bright orange (hue 50°) as accent. These colors sit at opposite ends of the warm spectrum, creating energy through contrast. Supporting colors include mint green for success states and warm pinks for charts.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(0.99 0.005 280)` | `oklch(0.20 0.04 285)` | Page background |
| `--foreground` | `oklch(0.25 0.02 280)` | `oklch(0.95 0.01 285)` | Body text |
| `--card` | `oklch(1 0 0)` | `oklch(0.25 0.04 285)` | Card surface |
| `--primary` | `oklch(0.573 0.190 285)` | `oklch(0.72 0.15 285)` | Vibrant purple |
| `--primary-foreground` | `oklch(1 0 0)` | `oklch(0.20 0.04 285)` | Text on primary |
| `--secondary` | `oklch(0.92 0.04 285)` | `oklch(0.30 0.06 285)` | Soft lavender fill |
| `--accent` | `oklch(0.75 0.15 50)` | `oklch(0.65 0.12 50)` | Bright orange |
| `--accent-foreground` | `oklch(0.20 0.03 50)` | `oklch(0.200 0.030 50)` | Text on accent |
| `--muted` | `oklch(0.96 0.008 70)` | `oklch(0.28 0.04 285)` | Warm grey fill |
| `--destructive` | `oklch(0.585 0.220 25)` | `oklch(0.65 0.18 25)` | Warm red |
| `--border` | `oklch(0.90 0.01 280)` | `oklch(0.35 0.05 285)` | Dividers |
| `--input` | `oklch(0.655 0.015 280)` | `oklch(0.505 0.050 285)` | Control boundaries |

**Reasoning:** Purple at hue 285° hits the sweet spot between blue and magenta — energetic without being garish. At 19% chroma in light mode, it's vivid enough to feel playful but not so saturated it fatigues. The orange accent at hue 50° provides warm contrast without fighting for attention.

**Dark mode desaturation:** Dark surfaces reduce chroma by ~20% (primary drops from 0.19 to 0.15) to prevent the neon-glow effect that happens when you put saturated colors on dark backgrounds. The primary also lightens substantially (L 0.573 → 0.72) so it remains legible.

### Measured contrast

Computed from `theme.css` by `scripts/check.mjs`. The palette table above used to
carry a "Contrast" column of estimates; they were optimistic by up to 2× and have
been replaced by these measured values.

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 15.58:1 | 15.71:1 | 4.5:1 |
| `muted-foreground` on `background` | 5.85:1 | 5.60:1 | 4.5:1 |
| `primary-foreground` on `primary` | 4.73:1 | 7.06:1 | 4.5:1 |
| `primary` on `background` | 4.59:1 | 7.06:1 | 4.5:1 |
| `accent-foreground` on `accent` | 7.80:1 | 5.40:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 4.69:1 | 5.19:1 | 4.5:1 |
| `destructive` on `background` | 4.56:1 | 5.17:1 | 4.5:1 |
| `ring` on `background` | 4.59:1 | 7.06:1 | 3:1 |
| `input` on `background` | 3.09:1 | 3.06:1 | 3:1 |

Everything clears its minimum, and `check.mjs` fails the build if that stops being
true.

`playful` has the least headroom of the three designs, and that is a direct
consequence of its brief: high-chroma purple and orange at mid lightness is exactly
the region where contrast is hardest to hold. Four pairs sit within 0.25 of the
4.5:1 line, so **treat the palette as tight** — nudging `--primary` or
`--destructive` lighter by even 0.02 in `L` will fail the build.

### What moved, and why

- `--primary` `L 0.58 → 0.573`. Purple link text was at 4.46:1, missing AA by 0.04.
  `--ring` tracks it.
- `--destructive` `L 0.61 → 0.585`. Error text and destructive buttons were both
  under, at 4.11:1 and 4.23:1.
- `--accent-foreground` in dark mode flipped from near-white to
  `oklch(0.200 0.030 50)`. The orange fill lightens for dark mode, so dark text on
  it reads far better than white — 3.17:1 became 5.40:1. Light mode already did
  this; dark mode simply had not been updated to match.
- `--destructive-foreground` in dark mode likewise became dark text on the red fill.
- `--input` split away from `--border` and darkened to a mid grey. `border-2` made
  fields *thicker* but no more contrasting — WCAG 1.4.11 measures colour, not width.
- Light `--sidebar-primary` was `oklch(0.70 0.17 285)` in `theme.css` but
  `oklch(0.58 0.19 285)` in `index.html`. The two files had drifted; the lighter
  value could not carry its white foreground, so both now track `--primary`.

---

## Typography

**Headings:** [Fredoka](https://fonts.google.com/specimen/Fredoka) (weights: 600 Semibold, 700 Bold) — a friendly rounded sans with a playful personality that never tips into childish. The soft terminals and generous x-height make it approachable without sacrificing legibility.

**Body:** [DM Sans](https://fonts.google.com/specimen/DM+Sans) (weights: 400 Regular, 500 Medium, 600 Semibold, 700 Bold) — excellent readability at all sizes, slightly more geometric than typical humanist sans-serifs, which keeps the interface feeling modern. The low contrast strokes work well on both light and dark backgrounds.

**Code:** System mono stack (`ui-monospace, SFMono-Regular, Menlo, monospace`).

| Element | Size/Line | Weight | Tracking | Notes |
|---|---|---|---|---|
| h1 | 60px/56px (3.75rem/3.5rem) | Bold 700 | -0.02em | Page titles only. Fredoka. |
| h2 | 36px/40px (2.25rem/2.5rem) | Bold 700 | -0.01em | Section headings. Fredoka. |
| h3 | 24px/32px (1.5rem/2rem) | Bold 700 | -0.01em | Card titles, subsections. Fredoka. |
| h4 | 20px/28px (1.25rem/1.75rem) | Semibold 600 | 0 | List headings. Fredoka. |
| Lead | 18px/28px (1.125rem/1.75rem) | Regular 400 | 0 | Intro paragraphs. DM Sans. |
| Body | 16px/26px (1rem/1.625rem) | Regular 400 | 0 | Default text. DM Sans. |
| Small | 14px/20px (0.875rem/1.25rem) | Regular 400 | 0 | Captions, help text. DM Sans. |
| Button | 14px | Semibold 600 | 0 | All button labels. DM Sans. |
| Label | 14px | Semibold 600 | 0.02em | Form labels. DM Sans. |

**Measure:** Body text maxes at 70ch. Lead paragraphs at 65ch.

**Links:** Colored with `text-primary`, underlined with `underline-offset-4` and a semi-transparent decoration (`decoration-primary/30`) that becomes opaque on hover. This ensures links are accessible (color + underline) while keeping the treatment light.

---

## Spacing & density

**Base unit:** 4px (Tailwind's default).

**Standard gaps:**
- Related controls (button + input): `gap-3` (12px)
- Form field spacing: `space-y-6` (24px)
- Card padding: `p-8` (32px) for generous breathing room
- Section padding: `py-16` (64px) — much roomier than slate's `py-12`
- Card grids: `gap-6` or `gap-8` (24–32px)

**Density:** This design sits firmly on the *roomy* end of the spectrum. Cards have generous padding (32px vs slate's 24px), sections breathe (64px vs 48px), and form fields space at 24px intervals instead of the denser 20px. The extra whitespace reinforces the friendly, unhurried feel.

Buttons are taller (h-11 / 44px default vs slate's h-9 / 36px), and inputs match that height. The added height makes targets easier to hit on touch devices and contributes to the approachable aesthetic.

---

## Shape & depth

**Radius:** `--radius: 0.75rem` (12px) — the defining visual characteristic of this design. Generous rounded corners soften every surface and reinforce the playful personality.

**Derived radii:**
- `--radius-sm: 8px` — small badges, tight components
- `--radius-md: 10px` — most UI elements
- `--radius-lg: 12px` — cards, major containers (the base value)
- `--radius-xl: 16px` — buttons, inputs, dialogs
- `--radius-2xl: 20px` — hero cards, marketing sections

Cards and inputs consistently use `rounded-xl` (16px). Buttons match. Tiny components like badges use `rounded-lg` (12px). The formula is: if it's interactive or elevated, round it more.

**Shadows:** Soft and diffuse, avoiding the hard-edged shadows of flat design.

```css
shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)           /* Subtle lift */
shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)       /* Cards, dropdowns */
shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)     /* Dialogs, popovers */
shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)     /* Modals */
```

**Surface treatment:** Cards use borders *and* soft shadows. The border (1px solid `--border`) defines the edge; the shadow creates depth. Together they make cards feel like they're gently floating above the page rather than harshly cut out of it.

Buttons use shadows on the default and primary variants (`shadow-md`), and the shadow intensifies slightly on hover (`hover:shadow-lg`) to suggest the button is rising to meet the cursor.

---

## Motion

**Duration:** 200ms for everything interactive. Faster than slate (150ms) because playful interfaces can afford to feel slightly more animated without seeming sluggish.

**Easing:** `ease-out` (Tailwind default). Elements ease out of their starting state, creating a snappy feeling on interaction.

**What animates:**
- Background color (`transition-colors`)
- Border color (same)
- Opacity (loading states, disabled states)
- Shadow intensity (buttons on hover)

**What does not animate:**
- Transform — no scale, no translate. Buttons do not grow or shrink on hover. Targets stay put.
- Layout — no animated height changes, no sliding panels (unless explicitly a drawer/sheet component).

**Interaction states:**

| State | Treatment |
|---|---|
| Default | Base token colors, base shadow |
| Hover | `bg-primary/90` or shift to `bg-accent`. Shadow deepens slightly (`shadow-md` → `shadow-lg`). |
| Focus | `ring-2 ring-ring ring-offset-2` on `:focus-visible`. Instant, no transition. |
| Active | `bg-primary/80` — a further darkening. Still no transform. |
| Disabled | `opacity-50 cursor-not-allowed`. Background usually shifts to `bg-muted`. |

**Reduced motion:** The CSS includes a `@media (prefers-reduced-motion: reduce)` block that sets all animation durations to `0.01ms`. Respecting user preferences is non-negotiable.

---

## Component notes

This section is the **exact class contract** for `playful`'s components — the
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
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground shadow-md transition-all hover:bg-destructive/90 hover:shadow-lg",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-lg px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

Rounded-xl, font-semibold. default/destructive use transition-all so their shadow lifts on hover. sm tightens the radius to rounded-lg. link is padding/height-less (cn()/tailwind-merge drops the size padding).

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
h-11 w-full rounded-lg border-2 border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground hover:border-input/80 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10
```

**States**

- `error` — `h-11 w-full rounded-lg border-2 border-destructive bg-background px-4 text-sm focus:outline-none focus:ring-4 focus:ring-destructive/10`
- `disabled` — `h-11 w-full rounded-lg border-2 border-input bg-muted px-4 text-sm text-muted-foreground cursor-not-allowed opacity-60`

**Parts**

- `label` — `text-sm font-semibold text-foreground`
- `errorMessage` — `text-sm text-destructive`

border-2 fields with a soft focus:ring-4 focus:ring-primary/10 halo. The demo prefixes each field with mt-2 for label spacing; that is layout, not part of the field.

### Textarea — `components/ui/textarea.tsx`

Base `className`:

```
w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none
```

### Select — `components/ui/select.tsx`

**Parts**

- `trigger` — `h-11 w-full appearance-none rounded-lg border-2 border-input bg-background pl-4 pr-12 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10`
- `chevron` — `pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground`
- `comboboxTrigger` — `flex h-11 w-full cursor-default items-center justify-between gap-2 rounded-lg border-2 border-input bg-background px-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10`
- `listbox` — `mt-1 w-full rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md`
- `option` — `flex h-9 w-full items-center gap-2 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground`
- `optionSelected` — `flex h-9 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground`
- `optionActive` — `flex h-9 w-full items-center gap-2 rounded-sm bg-accent px-2 text-sm text-accent-foreground`
- `optionCheck` — `h-4 w-4 shrink-0 text-primary`

### Checkbox — `components/ui/checkbox.tsx`

**Parts**

- `box` — `peer h-5 w-5 shrink-0 rounded-md border-2 border-input bg-background transition-all checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer`
- `disabled` — `h-5 w-5 shrink-0 rounded-md border-2 border-input bg-muted cursor-not-allowed`
- `label` — `text-sm font-medium peer-checked:text-foreground`

A styled native <input type=checkbox> using the peer + checked: pattern.

### Radio — `components/ui/radio-group.tsx`

**Parts**

- `box` — `peer h-5 w-5 shrink-0 rounded-full border-2 border-input bg-background transition-all checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer`

### Switch — `components/ui/switch.tsx`

**Parts**

- `wrapper` — `relative inline-block h-6 w-11 shrink-0`
- `input` — `peer sr-only`
- `track` — `block h-full w-full rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2`
- `thumb` — `absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform shadow-sm peer-checked:translate-x-5`

### Slider — `components/ui/slider.tsx`

**Parts**

- `input` — `h-2 w-full appearance-none rounded-full bg-muted bg-[linear-gradient(to_right,var(--primary)_var(--slider-fill),transparent_var(--slider-fill))] outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md`

A native range input with a gradient-filled track and pseudo-element thumbs driven by the --slider-fill custom property.

### Card — `components/ui/card.tsx`

**Parts**

- `root` — `rounded-xl border border-border bg-card`
- `header` — `p-6 pb-4`
- `title` — `text-2xl font-bold tracking-tight`
- `description` — `mt-1 text-sm text-muted-foreground`
- `content` — `px-6 pb-6 text-sm`
- `footer` — `flex items-center justify-end gap-2 border-t border-border px-6 py-4`

### Table — `components/ui/table.tsx`

**Parts**

- `table` — `w-full caption-bottom text-sm`
- `thead` — `bg-muted/50 [&_th]:h-12 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground`
- `tbody` — `[&_td]:h-11 [&_td]:px-4 [&_td]:align-middle`
- `row` — `border-b border-border`
- `rowSelected` — `border-b border-border bg-accent`

### Dropdown / Popover / Dialog — `components/ui/dropdown-menu.tsx (and popover.tsx, dialog.tsx)`

**Parts**

- `surface` — `rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md`
- `item` — `flex h-9 w-full items-center gap-2.5 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground`
- `itemActive` — `flex h-9 w-full items-center gap-2.5 rounded-sm bg-accent px-2 text-sm text-accent-foreground`
- `itemDestructive` — `flex h-9 w-full items-center gap-2.5 rounded-sm px-2 text-sm text-destructive transition-colors hover:bg-destructive/10`
- `label` — `px-2 py-1.5 text-xs font-medium text-muted-foreground`
- `separator` — `my-1 h-px bg-border`
- `shortcut` — `ml-auto font-mono text-xs tracking-widest text-muted-foreground`

### Alert — `components/ui/alert.tsx`

**intent**

- `info` — `flex gap-3 rounded-xl border border-border bg-muted/40 p-4`
- `success` — `flex gap-3 rounded-xl border border-chart-3/30 bg-chart-3/10 p-4`
- `warning` — `flex gap-3 rounded-xl border border-chart-4/30 bg-chart-4/10 p-4`
- `destructive` — `flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4`

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

- `root` — `w-64 rounded-xl border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground`
- `item` — `flex h-9 items-center gap-2.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`
- `itemActive` — `flex h-9 items-center gap-2.5 rounded-lg bg-sidebar-accent px-2 text-sm font-medium text-sidebar-accent-foreground`
- `groupLabel` — `px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground`

Active item carries aria-current=page; no left accent bar.

### Tabs — `components/ui/tabs.tsx`

**Parts**

- `bar` — `flex gap-1 overflow-x-auto pt-1.5 -mt-1.5 pb-1.5 -mb-[7px] pl-1.5 -ml-1.5 pr-1.5 -mr-1.5`
- `tabActive` — `shrink-0 whitespace-nowrap border-b-2 border-primary px-4 pt-3 pb-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-t-md`
- `tab` — `shrink-0 whitespace-nowrap border-b-2 border-transparent px-4 pt-3 pb-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-t-md`
- `segmentedWrap` — `inline-flex items-center gap-1 rounded-lg bg-muted p-1`
- `segmentSelected` — `inline-flex h-7 items-center rounded-sm bg-background px-3 text-sm font-medium shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- `segment` — `inline-flex h-7 items-center rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`

## Accessibility

Baseline is `shared/ACCESSIBILITY.md` — WCAG 2.2 AA. This section covers only what
`playful` decides for itself.

**Focus ring.** `ring-2 ring-ring ring-offset-2` on `:focus-visible`, instant, no
transition. `--ring` is the purple primary: 4.46:1 light and 7.06:1 dark against the
page, both well past the 3:1 WCAG 1.4.11 asks of an indicator. The offset matters
more here than in the other designs, because `rounded-xl` corners and `shadow-md`
already soften the button edge — without the offset the ring merges into the shadow.

**Target sizes are this design's biggest accessibility advantage.** Everything is
generous, and that is worth protecting:

| Control | Size | Notes |
|---|---|---|
| Button, input, select | 44px (`h-11`) | Meets the touch minimum everywhere, not just on mobile |
| Icon button | 44×44 (`h-11 w-11`) | Squares, aligned with text buttons in toolbars |
| Table row | 44px (`h-11`) | Rows are comfortably selectable by touch |
| Top nav bar | 64px (`h-16`) | — |

`playful` is the only design here that clears the 44px touch target by default. Do
not "tighten it up" for a desktop build — the size is part of the aesthetic *and*
the accessibility story, and shrinking it costs both.

**`border-2` on form controls is aesthetic, not an accessibility mitigation.**
It was previously doing duty for a low-contrast `--input`, which it could not
actually do — WCAG 1.4.11 measures colour, not stroke width. `--input` now carries
its own 3:1, and `border-2` stays because the design wants it.

**State is never colour alone.** Status pills carry text alongside the fill. Alerts
carry an icon and a title, not just a tinted background. Because this palette leans
on two saturated hues that sit close in lightness (purple L=0.58, orange L=0.75), a
greyscale check matters more here than in a neutral design — run one.

**Charts.** The chart ramp is green/cyan/pink at similar chroma, which is close to
worst-case for red-green colour blindness. Any chart with more than two series
needs direct labels, or shape and dash variation in the legend.

**Motion.** No transforms on hover — targets do not move — and
`prefers-reduced-motion` is handled in `theme.css`. The shadow-deepening hover is
a colour transition and is safe to keep under reduced motion.

### Known gaps

None. Every pair in `CONTRAST_PAIRS` clears its minimum in both themes, verified by
`node scripts/check.mjs`, which treats a shortfall as a build failure.

The margins here are the thinnest in the repo, though — see "What this design is
tight on" under Colour. Re-run the check after any palette change, however small.

---

## Never

1. **Never use sharp corners.** This design's personality lives in its rounded shapes. A 90° corner on a button or card breaks the aesthetic instantly. Minimum radius is `rounded-lg` (12px). For interactive elements, use `rounded-xl` (16px).

2. **Never use more than two accent colors on a single screen.** Purple primary and orange accent — that's the palette. You can bring in the chart colors (green, cyan, pink) for data visualization, but UI chrome should stay purple/orange. Adding a third accent for emphasis just creates noise.

3. **Never reduce card padding below 24px (`p-6`).** This design is roomy. Cramming content into tight cards undoes the friendly breathing room that makes it work. If something doesn't fit comfortably at `p-8`, rethink the content, don't shrink the padding.

4. **Never use hard black or pure white for text.** Foreground is `oklch(0.25 0.02 280)` (a very dark purple-grey), not `#000`. Primary foreground is `oklch(1 0 0)` (pure white) but only on colored backgrounds. Absolute black creates too much contrast and feels harsh.

5. **Never use drop shadows on flat surfaces.** Shadows are for elevation — cards, buttons, dialogs. Page backgrounds, section dividers, and inline elements stay flat. A shadow on a `<p>` tag is a mistake.

6. **Never stack headings without content between them.** If an h2 is immediately followed by an h3, one of them is wrong. Headings introduce content; they aren't decoration. This matters more in playful designs because the display font (Fredoka) is visually distinctive — stacked headings look like a type specimen, not a hierarchy.

7. **Never animate layout properties.** Color, opacity, and shadow can transition. Height, width, transform — no. Buttons don't scale on hover, panels don't slide open. This keeps interactions feeling snappy and predictable. The exception is purpose-built animation components (carousels, drawers) where movement is the point.

8. **Never let the orange accent dominate the purple primary.** Orange is a garnish, not the main course. It appears on hover states, selected tabs, and occasional CTAs, but the primary action color is always purple. If you find yourself with an orange header and orange buttons, you've inverted the hierarchy.

9. **Never use thin font weights (300 or lighter).** DM Sans starts at 400 Regular and goes up. Thin weights on colored backgrounds become illegible, and they undermine the friendly, approachable tone. Headings are bold (700); UI text is regular (400) or semibold (600). That's the range.

10. **Never use this design for high-density data dashboards.** The roomy padding, large radii, and tall components make it terrible for applications that need to show 50 rows of data above the fold. Playful optimizes for delight, not information density. If the product is a data table with occasional UI around it, use slate.

---

## Extensions

Two additions beyond the standard set in `shared/TOKENS.md`:

```css
--font-display: "Fredoka", "DM Sans", ui-sans-serif, system-ui, sans-serif;
--uppercase-optical-nudge: 0.0125em;
```

`--font-display` is used in the theme block as `font-family: var(--font-display)`
for h1–h4. If a consumer ignores it, headings fall back to `--font-sans` and the
design still works — it just loses some personality.

`--uppercase-optical-nudge` corrects DM Sans's uppercase text (the sortable
table-header button, table headers, captions) for sitting visibly high in
whatever centers it — measured on the actual vendored font, not guessed; see
the "Uppercase optical centering" rule in `theme.css` for the full explanation
and the measurement method. If a consumer ignores it, uppercase text renders
correctly in every other respect, just with a sub-pixel gap under the baseline
instead of an even margin.
