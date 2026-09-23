# Design: `warm-paper`

**Read [`../README.md`](../README.md) first.** It explains how this design's
`theme.css` and `index.html` are meant to be used alongside this file.

> Editorial and reading-first. Warm off-white paper, soft near-black ink, serif
> for content, sans for UI chrome. One muted oxblood accent. Minimal chrome,
> generous rhythm, 16px body text.

**Adjectives:** warm, editorial, calm, generous, readable, restrained.

**Use this when** you are building documentation sites, blogs, knowledge bases,
reading apps, long-form content platforms, editorial tools, anything where the
primary activity is reading rather than manipulating data. Use this when you want
the interface to recede and the writing to come forward.

**Do not use this when** you need density or visual hierarchy through decoration.
Do not use for dashboards, data tables, admin consoles, or apps where users scan
rather than read. `warm-paper` is optimized for sustained reading, which is the
opposite of `slate`'s call.

---

## Influences

- **iA Writer / Bear / Ulysses** — the editorial calm, the preference for serif
  body text, the generous line height and measure that says "you are here to read,
  not to skim".
- **Print typography** — warm off-white stock rather than pure white, soft black
  ink rather than `#000`, hairline rules rather than filled containers. The design
  references a well-set book page, not a software interface.
- **Medium (early)** — the restraint: one accent colour, minimal chrome, the
  interface as a frame for the content rather than the content itself.

What was deliberately *not* taken: Medium's eventual descent into visual noise,
iA Writer's extreme minimalism that removes too much UI, and any design system's
tendency to add decoration for its own sake.

---

## Colour

The palette uses warm hues throughout: paper backgrounds have a cream/yellow tint
(hue 50-55), text and UI surfaces lean toward warm browns and ochres (hue 30-40),
and the single accent is a muted oxblood/brick red (hue 25) that feels like it's
drawn *from* the paper's warmth rather than dropped on top of it.

Dark mode is "lamplight on a page" — warm low light, not cool grey inversion. The
background keeps warmth in its hue (H=40) and drops chroma rather than flipping to
a cool blue-grey.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(0.975 0.012 55)` | `oklch(0.22 0.018 40)` | Page surface |
| `--foreground` | `oklch(0.26 0.015 30)` | `oklch(0.90 0.010 50)` | Body text |
| `--card` | `oklch(0.985 0.010 55)` | `oklch(0.26 0.020 40)` | Raised surface |
| `--popover` | `oklch(0.99 0.008 55)` | `oklch(0.28 0.020 40)` | Floating surface |
| `--primary` | `oklch(0.46 0.095 25)` | `oklch(0.625 0.075 25)` | Oxblood accent |
| `--secondary` / `--muted` | `oklch(0.94 0.010 50)` | `oklch(0.32 0.018 40)` | Subdued fill |
| `--muted-foreground` | `oklch(0.52 0.020 35)` | `oklch(0.66 0.015 45)` | Secondary text |
| `--accent` | `oklch(0.92 0.012 50)` | `oklch(0.35 0.020 40)` | Hover surface |
| `--destructive` | `oklch(0.52 0.15 25)` | `oklch(0.62 0.12 25)` | Danger |
| `--border` | `oklch(0.88 0.012 50)` | `oklch(0.35 0.018 40)` | Hairlines, dividers |
| `--input` | `oklch(0.645 0.012 50)` | `oklch(0.515 0.018 40)` | Control boundaries |

### Why this primary

`oklch(0.46 0.095 25)` is a muted oxblood: dark enough to carry white text, warm
enough to feel like it belongs to the paper, and deliberately *less* saturated
than most design systems' primaries (C=0.095, not 0.15+). The low chroma is the
point — this design does not shout. The hue (25°, a brick red) sits in the same
warm family as the paper (50-55°) and the text (30°), so the accent reads as "the
saturated version of what's already here" rather than as a foreign colour.

In dark mode the primary lightens to L=0.625 and **drops chroma further** to 0.075.
This is critical: holding chroma constant while raising lightness produces a garish
neon effect against a dark surface. Dark-mode colours need less saturation, not
more.

### Measured contrast

Computed from `theme.css` by `scripts/check.mjs`, not estimated:

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 14.49:1 | 12.87:1 | 4.5:1 |
| `muted-foreground` on `background` | 5.16:1 | 5.56:1 | 4.5:1 |
| `primary-foreground` on `primary` | 7.05:1 | 5.11:1 | 4.5:1 |
| `primary` on `background` | 6.94:1 | 4.71:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 5.60:1 | 4.92:1 | 4.5:1 |
| `destructive` on `background` | 5.52:1 | 4.51:1 | 4.5:1 |
| `ring` on `background` | 6.94:1 | 4.71:1 | 3:1 |
| `input` on `background` | 3.07:1 | 3.07:1 | 3:1 |
| `border` on `background` | 1.34:1 | 1.53:1 | decorative |

Everything clears its minimum, and `check.mjs` fails the build if that stops being
true.

`muted-foreground` is deliberately kept well above the minimum so that secondary
text — which in a reading interface is often the text that matters — remains
comfortably legible.

### Why `--border` and `--input` differ

`warm-paper` uses hairline-bordered fields with no background fill, which meant the
border was the *only* thing identifying a field — at 1.34:1, well under the 3:1
WCAG 1.4.11 asks of a control boundary. The two tokens now hold different values:

- `--border` stays a warm hairline at 1.34:1, separating cards and sections. A
  divider carries no information, so it is exempt.
- `--input` is `oklch(0.645 0.012 50)` — a warm mid-grey at 3.07:1, still on the
  paper hue so it reads as ink rather than as a foreign grey.

The generous rhythm of this design is unaffected; only the field edge darkens.

### Why dark-mode destructive uses dark text

Dark-mode `--destructive` has to stay light enough to work as error *text* on the
dark page (4.51:1) while also carrying a foreground — and no single lightness does
both with near-white text. Dark mode therefore puts **dark text on the red fill**
(`--destructive-foreground: oklch(0.180 0.040 25)`), reaching 4.92:1. Light mode is
unchanged.

Dark-mode `--primary` was also lifted from `L=0.60` to `0.625`, which brings oxblood
link text in running prose from 4.25:1 up to 4.71:1. `--ring` tracks it.

### Rules

- One accent colour per screen. If two things are both oxblood, the user cannot
  tell which one is the point. Use the accent for *intention* (primary actions,
  links, focus states), never for decoration.
- Status colours (`chart-3` green, `chart-4` amber, `destructive` red) are for
  *state*, not for distinguishing UI regions or prettifying empty states.
- Warm hues throughout. Never introduce a cool blue or a bright cyan — it will
  break the lamplight feel.

---

## Typography

**Serif (content):** `"Crimson Pro", ui-serif, Georgia, Cambria, "Times New Roman", serif`  
**Sans (UI chrome):** `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`  
**Mono:** `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`

The split is deliberate: serif for headings and long-form body copy (anything the
user is meant to *read*), sans for UI chrome (buttons, labels, table headers, form
controls, navigation). The interface recedes and the writing comes forward.

| Level | Size | Weight | Line height | Letter spacing | Family |
|---|---|---|---|---|---|
| Display | 48px | 600 | 1.15 | -0.02em | Serif |
| H1 | 36px | 600 | 1.2 | -0.015em | Serif |
| H2 | 24px | 600 | 1.3 | -0.01em | Serif |
| H3 | 20px | 600 | 1.4 | 0 | Serif |
| H4 | 16px | 600 | 1.5 | 0 | Serif |
| Lead | 18px | 400 | 1.7 | 0 | Serif |
| Body | 16px | 400 | 1.7 | 0 | Serif |
| Small | 14px | 400 | 1.6 | 0 | Serif |
| Caption | 12px | 500 | 1.4 | +0.02em | Sans |
| Button | 14px | 500 | 1.5 | 0 | Sans |
| Label | 12px | 500 | 1.4 | +0.02em | Sans |

### Rules

- **Body text is 16px, not 14px.** This design is for reading, not for data
  density. 16px at 1.7 line height is the baseline for comfortable sustained
  reading on screen.
- **Measure (line length) is capped at 70 characters** for body copy. Longer lines
  fatigue the eye and make it hard to find the start of the next line.
- **Serif for content, sans for UI.** If you're unsure, ask: is the user reading
  this, or is this part of the interface they're using to get to what they're
  reading? The first gets serif, the second gets sans.
- **Negative tracking scales with size** on headings. Display and H1 get tighter
  tracking; H3 and below return to normal (0). This is a serif convention — sans
  faces can tolerate looser tracking at size, serifs cannot.
- **No all-caps body text.** Uppercase is for labels and overlines only (captions,
  form labels, section markers). Body text in all-caps is unreadable.

---

## Spacing & density

Base unit: 4px (Tailwind's default). Spacing scale: 0.5, 1, 1.5, 2, 2.5, 3, 4, 5,
6, 8, 10, 12, 16, 20, 24 (in rem).

This design sits on the **generous** end of the density spectrum. Where `slate`
uses `py-12` for section padding, `warm-paper` uses `py-16`. Where `slate` uses
`gap-2` between related controls, `warm-paper` uses `gap-3`.

| Context | Padding | Gap | Rule |
|---|---|---|---|
| Section (page band) | `py-16` | — | Generous breathing room |
| Card | `p-6` | — | More than slate's `p-4` |
| Form row | `py-4` | `gap-3` | Vertical rhythm matters |
| Button group | — | `gap-2` | Tight only for direct siblings |
| Paragraph spacing | `space-y-4` | — | Comfortable reading rhythm |

### Rules

- **Err generous.** If you're unsure whether to use `gap-2` or `gap-3`, use `gap-3`.
  Crowding breaks the reading flow more than extra whitespace does.
- **Vertical rhythm is more important than horizontal.** Paragraphs, list items,
  form rows, and section breaks all use multiples of 4px. Inconsistent rhythm is
  immediately legible as "wrong" even if the user can't articulate why.
- **Related controls sit closer than unrelated ones.** A label and its input:
  `gap-1.5`. Two unrelated form fields: `gap-6`.

---

## Shape & depth

**Radius:** `0.375rem` (6px) — restrained, not sharp, not pill-like. This is
`--radius-lg` in the derived scale. The choice reflects print: a book's corners
are not perfectly sharp (the binding won't allow it), but they're not rounded
either.

Derived scale (via `calc`):
- `--radius-sm`: 2px
- `--radius-md`: 4px
- `--radius-lg`: 6px (the base `--radius`)
- `--radius-xl`: 10px

**Shadows:** Very subtle. Warm-paper prefers hairline rules over drop shadows.
Shadows are present only to lift popovers and dialogs off the page, and even then
they are less prominent than in most designs.

- `--shadow-xs`: `0 1px 2px 0 rgb(0 0 0 / 0.03)` — barely there
- `--shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 1px -1px rgb(0 0 0 / 0.04)`
- `--shadow-md`: `0 2px 4px -1px rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`
- `--shadow-lg`: `0 4px 8px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)` — still restrained

### Rules

- **Prefer a hairline border over a shadow.** Cards sit on the page with
  `border border-border`, not with a drop shadow. Shadows are for *floating*
  surfaces only: popovers, dialogs, tooltips, dropdowns.
- **Never combine a heavy shadow with a border.** If a surface needs both for
  some reason, use a very light shadow (`--shadow-sm` at most) and a full-opacity
  border. Heavy shadow + border reads as muddy.
- **No inner shadows.** They read as depressed/inset, which is a skeuomorphic
  holdover. Inputs get a border, not an inner shadow.

---

## Motion

Default duration: **150ms** for interactive state changes (hover, focus, active),
**200ms** for layout shifts (opening a dialog, expanding a disclosure).

Default easing: `cubic-bezier(0.16, 1, 0.3, 1)` — a gentle ease-out that feels
calm rather than snappy. This is not a fast design. Abrupt motion breaks the
reading flow.

| Interaction | Duration | Easing | What animates |
|---|---|---|---|
| Hover | 150ms | ease-out | `background-color`, `color`, `border-color` |
| Focus | 0ms | — | Focus ring appears instantly (no delay) |
| Active (pressed) | 100ms | ease-out | `transform: scale(0.98)` on buttons |
| Disabled | — | — | No animation; disabled state is static |
| Dialog open/close | 200ms | ease-out | `opacity`, `transform: scale(0.95)` |
| Accordion expand | 200ms | ease-out | `height` (via `max-height` trick) |

### Prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Implemented in the kitchen sink. When a user requests reduced motion, all
transitions collapse to nearly instant. The `0.01ms` is a Safari workaround —
`0ms` is ignored in some contexts.

### Rules

- **Hover and focus states always animate.** Instant colour changes read as harsh.
  Even 150ms is enough to make a hover feel considered rather than abrupt.
- **Focus rings do not animate in.** They appear instantly on keyboard focus,
  because a delayed focus indicator is an accessibility failure.
- **Disabled elements do not animate.** If a button is disabled, hovering it does
  nothing, and that nothing should be immediate.
- **No infinite animations on page load.** Spinners and progress indicators can
  loop, but nothing animates "for effect". This is a reading interface, not a
  landing page.

---

## Component notes

This section is the **exact class contract** for `warm-paper`'s components — the
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
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
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
flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

**States**

- `error` — `flex h-9 w-full rounded-md border border-destructive bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- `disabled` — `flex h-9 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-1 text-sm opacity-50 shadow-xs`

**Parts**

- `errorMessage` — `flex items-center gap-1.5 text-xs text-destructive`

### Textarea — `components/ui/textarea.tsx`

Base `className`:

```
flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

### Select — `components/ui/select.tsx`

**Parts**

- `trigger` — `flex h-9 w-full appearance-none rounded-md border border-input bg-background py-1 pl-3 pr-9 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- `chevron` — `pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`
- `comboboxTrigger` — `flex h-9 w-full cursor-default items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
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
- `title` — `font-serif text-xl font-semibold`
- `description` — `mt-1 text-sm text-muted-foreground`
- `content` — `px-6 pb-6 text-sm`
- `footer` — `flex items-center justify-end gap-2 border-t border-border px-6 py-4`

Card titles are set in the serif (font-serif) — the editorial signature of this design.

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

## Accessibility

Baseline is `shared/ACCESSIBILITY.md` — WCAG 2.2 AA. This section covers only what
`warm-paper` decides for itself.

**Focus ring.** `ring-2 ring-ring ring-offset-2 ring-offset-background`, applied on
`:focus-visible` only, and never animated in — a focus indicator that fades is a
focus indicator that is missing for the first 150ms. `--ring` is the oxblood
primary: 6.94:1 in light and 4.25:1 in dark against the page, both clear of the 3:1
that WCAG 1.4.11 requires of an indicator.

**Target sizes.** `warm-paper` sizes its controls with padding rather than a fixed
height, which makes the resulting target easy to lose track of. The floors:

| Control | Size | Notes |
|---|---|---|
| Button (default, `px-4 py-2`) | ≈36px tall | Comes out of padding + 14px line box |
| Button (small, `px-3 py-1.5`) | ≈30px tall | Still above the 24px floor — do not shrink further |
| Form controls | Match the default button | Hairline border, no fill |
| Inline links in prose | Exempt (SC 2.5.8 inline exception) | But keep the underline |
| Below `md`, and any touch target | **44×44** | Pad out; do not scale the type |

Generous rhythm is part of this design, so there is no reason to go near the floor.
If a control is landing under 30px, the padding scale is being ignored.

**Reading-first obligations.** This design exists to be read for a long time, which
raises the bar on a few things beyond the shared baseline:

- Body copy is capped by measure, and must survive the SC 1.4.12 text-spacing
  overrides — never set a fixed height on a container holding prose.
- The serif is used for *content*, never for UI chrome, so nothing functional
  depends on a webfont that may not load.
- Links in running text are underlined, not merely oxblood. `--primary` now clears
  AA in both themes (4.71:1 in dark), but the underline stays: colour alone is not
  a link affordance, and WCAG 1.4.1 applies to links in prose.

**State is never colour alone.** Status pills carry a text label alongside the dot.
Form errors put the message in text below the field. The active nav item uses a
`bg-accent` fill — a lightness change, so it survives greyscale — but must still
carry `aria-current="page"`, because a fill is not announced.

**Charts.** More than two series need direct labels or shape/dash variation; the
`--chart-*` ramp is warm and closely spaced by design, which makes it *less*
separable than a cooler ramp, not more.

**Reduced motion** is handled by the `prefers-reduced-motion` block above and
applies automatically. Note that this design animates `height` on accordions and
`transform: scale` on button press — both are removed under reduced motion.

### Known gaps

None. Every pair in `CONTRAST_PAIRS` clears its minimum in both themes, verified by
`node scripts/check.mjs`, which treats a shortfall as a build failure.

---

## Never

The prohibitions. These are the rules that make `warm-paper` distinguishable from
other designs. Break them and it stops being warm-paper.

1. **Never use pure white (`#fff` / `oklch(1 0 0)`) as a background.** The paper
   is warm off-white. Pure white is harsh and breaks the lamplight feel.

2. **Never use pure black (`#000` / `oklch(0 0 0)`) as text.** The ink is soft
   near-black with warmth. Pure black is too severe.

3. **Never use a cool hue (blue-grey, cyan, violet) as a primary surface colour.**
   The palette is warm throughout: yellows, ochres, browns, brick reds. A cool
   accent breaks the coherence.

4. **Never use more than one accent colour on a screen.** The oxblood primary is
   the only accent. If you need to distinguish two actions, use primary vs.
   secondary button variants, not primary vs. a second colour.

5. **Never use a drop shadow on a button.** Buttons sit flat on the surface. Only
   floating elements (popovers, dialogs) get shadows.

6. **Never use drop shadows in place of borders.** Prefer hairline rules. A card
   sits on the page with `border border-border`, not with a shadow.

7. **Never set body text smaller than 16px.** This design is for reading, not for
   data density. 14px is acceptable for UI labels and table cells, but prose gets
   16px minimum.

8. **Never use all-caps for body text or headings.** Uppercase is for labels and
   overlines only. All-caps headings read as shouting; all-caps body text is
   unreadable.

9. **Never use sans font for long-form content.** If it's a paragraph the user is
   meant to read (not skim), it gets serif. Sans is reserved for UI chrome.

10. **Never crowd vertical rhythm.** Paragraphs, form rows, list items, and section
    breaks all use multiples of 4px. Inconsistent spacing breaks the reading flow.

11. **Never centre-align body text.** Centre alignment is for headings and CTAs in
    marketing sections only. Body copy is always left-aligned (or right-aligned in
    RTL contexts).

---

## Extensions

No tokens added beyond `shared/TOKENS.md`. This design uses the standard shadcn/ui
token set without extension.

A consumer that ignores any of the values above will get a functional interface,
but it will not look or feel like `warm-paper` — it will read as a generic shadcn
theme. The value of this design is in the specific choices: the warm hues, the
serif content typography, the generous rhythm, the minimal chrome. Those are not
incidental; they are the design.
