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

### Buttons
Generous padding (`px-6` vs slate's `px-4`), taller height (`h-11` vs `h-9`), and `rounded-xl` corners (16px vs slate's 6px). Primary buttons get `shadow-md` by default and `shadow-lg` on hover, making them feel tactile and inviting to press.

Ghost and link buttons omit the shadow. Outline buttons use a `border-2` (double weight) to compensate for not having a fill — the thicker border keeps the button feeling substantial.

Icon buttons are `h-11 w-11` squares, matching the height of text buttons so they align in toolbars.

### Inputs & forms
All form controls are `h-11` to match buttons. Borders are `border-2` instead of the standard 1px — this makes fields feel more defined and easier to target, and the slightly heavier border weight pairs well with the generous rounded corners.

Focus ring is `ring-4` with 10% opacity primary color (`focus:ring-primary/10`), creating a soft glow rather than a hard outline.

Error states change the border color to `--destructive` and add a `ring-4 ring-destructive/10` on focus. The error message appears below with an icon, colored `text-destructive`.

Switches and checkboxes have shadows (`shadow-sm`) to lift them slightly off the surface. This is unusual compared to flat designs, but it reinforces the tactile, friendly aesthetic.

### Cards
White background (`bg-card`) on the default background (`bg-background`), with `rounded-xl` corners, a 1px border (`border-border`), and `shadow-md`. Padding is `p-8` (32px) — generous enough to feel uncluttered even with substantial content.

Stat cards use smaller padding (`p-6` / 24px) to keep metrics tight and scannable, but they still get the same rounded corners and shadow treatment.

### Tables
Row height is `h-11` (44px) instead of slate's 36px, giving more breathing room and making rows easier to scan and select on touch devices. Header uses `bg-muted/50` with uppercase labels.

Selected row gets `bg-accent` — the bright orange — to clearly differentiate it. Hover rows use `bg-muted/50`.

### Navigation
Top nav bar is `h-16` (64px) vs slate's h-14 (56px). The extra height accommodates the more prominent logo typography (Fredoka at 18px bold) and makes touch targets more comfortable.

Sidebar items use `rounded-lg` and show a clear `bg-accent` highlight for the active item. Hover uses `bg-secondary/50` — the soft lavender.

### Tabs
Tab items have `rounded-t-lg` when selected (active), creating a continuous surface with the panel below. Segmented controls (toggle groups) use `rounded-xl` for the container and `bg-accent` for the selected segment.

### Alerts
Alerts use icon, title, description, and tinted backgrounds:
- Info: `bg-primary/10` with `text-primary` icon
- Success: `bg-chart-3/10` (mint green) with `text-chart-3` icon
- Warning: `bg-chart-4/10` (yellow) with `text-chart-4` icon
- Destructive: `bg-destructive/10` with `text-destructive` icon

The 10% opacity backgrounds provide color without overwhelming the content. Borders match the icon color.

### Dialogs & overlays
Dialogs have `rounded-2xl` corners (20px — the most rounded treatment in the system), `shadow-xl`, and a backdrop with `bg-background/80 backdrop-blur`. The large radius makes dialogs feel like friendly cards rather than stern system alerts.

Popovers and dropdowns use `rounded-xl` and `shadow-lg`.

Toasts appear in the bottom-right, `rounded-xl`, with the same tinted-background treatment as alerts.

### Progress & loading
Progress bars have a `rounded-full` track (full pill shape) filled with `bg-primary`. Circular spinners use a partial arc with `stroke-primary` at 2px weight.

Skeletons use `bg-muted animate-pulse`, with `rounded-lg` to match the shapes they're standing in for (avatar skeletons are `rounded-full`).

---

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
