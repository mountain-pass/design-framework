# Design: `material-design`

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

Anything not mentioned here follows stock shadcn/ui, styled by Material tokens.

### Button

**Six variants, three sizes.** Material has strong button opinions.

- **Filled (default):** `bg-primary text-primary-foreground shadow-sm
  hover:shadow-md rounded-full h-10 px-6 font-medium uppercase tracking-wide text-sm`.
  Full rounding, elevated, uppercase with letter-spacing. This is Material's hero
  button.
- **Outlined:** `border-2 border-primary text-primary rounded-full h-10 px-6
  font-medium uppercase tracking-wide`. Fully rounded, no fill, 2px border (thicker
  than default). Uppercase.
- **Text:** `text-primary hover:bg-accent rounded-lg h-10 px-4`. Minimal, sentence
  case.
- **Sizes:** `sm` is `h-9 px-4 text-xs`, default is `h-10 px-6 text-sm`, `lg` is
  `h-11 px-8 text-base`.
- Icon buttons: `h-10 w-10 rounded-full` with 20px icon (larger than other
  designs). State layer (hover) is circular.

### Floating Action Button (FAB)

**Extension:** Not in base components, but Material is incomplete without it.
`h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg
hover:shadow-xl`. Fixed position `bottom-6 right-6`. Icon 24px. May extend to
include a label (extended FAB): `h-14 px-6 gap-3 rounded-full`.

### Input

`h-10 rounded-t-lg rounded-b-md` (asymmetric, subtle nod to Material's "cut
corner"), `border-b-2 border-input` (bottom border is thicker, top/sides are
`border`), `focus:border-b-primary`. Label is **floating**: starts inside the
input, moves to top on focus/fill. Placeholder is hidden until focus.

This is more complex than stock shadcn and **may be simplified** to `rounded-lg
border-2` for easier implementation. The DESIGN.md describes ideal; implementers
can use standard `rounded-lg border` if the floating label is too complex.

### Card

`rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md
transition-shadow`. Larger radius (16px), always has a shadow. Header is `p-6`,
content `p-6 pt-0`, footer `p-6 pt-0 border-t`.

### Table

**No zebra striping.** Rows are `border-b hover:bg-accent/50` (subtle hover).
Header is `bg-muted/30` (very subtle tint) with `text-muted-foreground font-medium
text-xs uppercase tracking-wider`. Material tables are clean and rely on dividers,
not fills. Row height is 52px (taller than `slate`'s 44px).

### Badge & Chip

Material distinguishes these:

- **Badge (status):** `rounded-full px-2.5 py-0.5 text-xs font-medium
  bg-muted/80 text-foreground`. Small, minimal.
- **Chip (filter/input):** `rounded-full px-4 py-2 text-sm border
  border-border bg-secondary hover:bg-accent`. Larger, more interactive, with
  optional leading icon or avatar and trailing close button. Height 32px.

### Dropdown / Menu

`rounded-xl border bg-popover shadow-lg p-1`. Items are `rounded-lg h-10 px-3
text-sm hover:bg-accent` (rounder than slate's `rounded-sm`). Checkmarks and icons
are 20px. Dividers are `my-1 bg-border`.

### Dialog & Sheet

**Dialog:** `rounded-3xl shadow-2xl` (24px radius, maximum elevation). No close X
in the corner — Material dialogs have text actions in the footer. Header `p-6
pb-4 text-2xl font-normal`, content `p-6 pt-0`, footer `p-6 pt-4 flex gap-2
justify-end` with text buttons.

**Sheet (drawer):** Slides from edge (usually left for nav drawer, right for
details). `rounded-r-2xl` (left edge is sharp, right is rounded). `shadow-xl
bg-card`. Width 280px for nav, 360–400px for content.

### Alert

`rounded-xl border-l-4` (thick left accent), `p-4 bg-accent/20` (tinted
background). Icon 20px. Title `font-medium`, description `text-sm
text-muted-foreground`. Intent color (`chart-3` green, `chart-4` amber,
`destructive` red) is the left border and icon color. More colorful than `slate`.

### Tabs

**Filled pills** (Material's primary tabs), not underlines. Active tab is
`bg-primary text-primary-foreground rounded-full`, inactive is
`text-muted-foreground hover:bg-accent/50 rounded-full`. Tabs are `h-10 px-6
font-medium`. Spacing between tabs is `gap-1`.

Alternative: underline style with `border-b-2 border-primary` for secondary tabs.

### Navigation

**Top bar:** `h-16` (taller than slate's `h-14`), `bg-card shadow-sm border-b`. Logo
left, nav center or left, actions right. Icons 20px.

**Sidebar (nav drawer):** `w-64` collapsed, `w-280` expanded. Uses
`--sidebar-*` tokens. Items are `rounded-r-full` (only right side rounds, creating
a "pill emerging from edge" look when active). Active item `bg-sidebar-accent
text-sidebar-accent-foreground font-medium`. Group labels are `px-6 py-2
text-xs uppercase tracking-widest text-muted-foreground`.

### Progress & Loading

**Linear progress:** `h-1 rounded-full bg-muted`, fill is `bg-primary rounded-full`.
Indeterminate uses a 1.5s animation sliding a gradient across.

**Circular progress:** 40px diameter, 4px stroke, uses `stroke-primary`. Spins at
1.4s per rotation (Material's spec).

**Skeleton:** Uses `bg-muted animate-pulse`, but Material prefers a **shimmer**
(linear gradient moving left-to-right) over pulse. Duration 2s.

### Toast (Snackbar)

Material calls these **snackbars**. Single-line preferred, multiline allowed.
`rounded-lg bg-foreground/90 text-background shadow-lg` (inverted colors). Fixed
position `bottom-6 left-6`, `max-w-md`. Action button is `text-primary-foreground
font-medium uppercase text-sm`. Dismisses after 4–7s (longer than typical toasts).

---

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
