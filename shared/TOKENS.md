# The Token Contract

Every design in `designs/` defines the **same set of CSS custom properties**. Only
the *values* change between designs.

This is what makes designs swappable. An application built against these token names
can switch from `slate` to any other design by replacing one `theme.css` file.

The names and structure are taken verbatim from
[shadcn/ui's](https://ui.shadcn.com/docs/theming) default theme, so a `theme.css`
from this repo can be pasted directly into a real shadcn project's `globals.css`
and it will just work.

---

## The variables

```css
:root {
  --radius: 0.625rem;

  --background:            /* page background */
  --foreground:            /* default text on --background */

  --card:                  /* raised surface background */
  --card-foreground:       /* text on --card */

  --popover:               /* floating surface: menus, dialogs, tooltips */
  --popover-foreground:

  --primary:               /* brand action colour */
  --primary-foreground:    /* text on --primary */

  --secondary:             /* low-emphasis action surface */
  --secondary-foreground:

  --muted:                 /* subdued surface: table headers, disabled fills */
  --muted-foreground:      /* subdued text: captions, help text, placeholders */

  --accent:                /* hover/active surface for interactive rows and items */
  --accent-foreground:

  --destructive:           /* danger action and error state */
  --destructive-foreground:

  --border:                /* default border and divider */
  --input:                 /* form control border (often == --border) */
  --ring:                  /* focus ring */

  --chart-1: --chart-5:    /* categorical data series, in order of use */

  --sidebar:               /* sidebar background, may differ from --card */
  --sidebar-foreground:
  --sidebar-primary:
  --sidebar-primary-foreground:
  --sidebar-accent:
  --sidebar-accent-foreground:
  --sidebar-border:
  --sidebar-ring:
}
```

`.dark { ... }` redefines **all** of the above. A design is not finished until its
dark theme is defined; both must be shown by the dark-mode toggle in the kitchen
sink.

---

## Rules

**Use `oklch()` for colour values.** This is what shadcn/ui v4 uses. It makes
lightness adjustments perceptually even, which means a design's hover and active
states can be derived arithmetically rather than hand-picked. `oklch(L C H)` where
`L` is 0–1 lightness, `C` is chroma (0 is grey, ~0.03 is a tint, ~0.15+ is
saturated), `H` is hue in degrees.

**Never hard-code a colour outside this file.** If a design needs a colour, it
becomes a token. A design whose kitchen sink contains `#3b82f6` or `bg-blue-500` is
broken, because that colour will not follow the theme into dark mode or into a
consuming application.

**Contrast is a requirement, not a preference.** Every `--x` / `--x-foreground` pair
must clear WCAG AA (4.5:1 for body text, 3:1 for large text and UI boundaries) in
both light and dark. `DESIGN.md` records the measured ratios for the primary pairs.

**`--radius` is the only radius input.** Everything else derives from it, following
shadcn's convention:

```css
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

A design with sharp corners sets `--radius: 0`. A pill-heavy design sets it high.
Do not scatter individual radius overrides through the markup.

---

## Extending the contract

A design may add tokens **on top of** this set — a `--brand-gradient`, a
`--surface-raised`, a second font family. It may not remove or rename any of the
tokens above, because consuming applications rely on them existing.

Any additional token must be documented in that design's `DESIGN.md` under
"Extensions", with a note on what happens if a consumer ignores it.

---

## Typography tokens

Fonts are declared as three variables, all of which must be set even if two point
at the same stack:

```css
--font-sans:  /* UI and body */
--font-serif: /* editorial/display, if used */
--font-mono:  /* code, data, tabular numerals */
```

Every font must have a real fallback stack — `"Inter", ui-sans-serif, system-ui,
sans-serif` — so the design degrades gracefully when the webfont does not load.

Designs load webfonts from Google Fonts or use system stacks. Do not require a
local font file — the kitchen sink ships as an HTML file and its `theme.css`, and
nothing else is expected to travel with them.
