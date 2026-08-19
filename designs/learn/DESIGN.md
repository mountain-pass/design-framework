# Design: `learn`

> A Duolingo-inspired learning interface: dark navy surfaces, green action buttons, rounded forms, and a friendly rhythm built around momentum and progress.

**Adjectives:** focused, encouraging, bright, tactile, motivating.

**Use this when** you are building educational apps, onboarding flows, habit trackers, language learning tools, or anything where progress, repetition, and encouragement are the product. This design works best when the UI wants to feel clear, optimistic, and action-forward.

**Do not use this when** the product needs to feel premium, corporate, or austere. Avoid this for financial systems, legal tools, or clinical dashboards where seriousness should dominate the interface.

---

## Influences

- **Duolingo** — the dark navy canvas, the green CTA buttons, the oversized rounded pills, and the emphasis on routine and progress over density.
- **Language-learning products** — the pattern of single-purpose actions, repeated modules, and low-friction task flows.
- **Modern app shells** — the focus on compact navigation, clear hierarchy, and strong affordances for large, touch-friendly actions.

What was deliberately *not* taken: photo-real illustration, noisy gradients, or a toy-like look. The design keeps the motivational energy of Duolingo without becoming cartoonish.

---

## Colour

The palette is anchored on a dark, almost black-blue background and a saturated green accent. This keeps the interface calm and immersive while making the primary action feel immediate and encouraging. The dark mode is intentional and dominant, since the reference product is a dark app shell with bright action surfaces.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(0.98 0.006 210)` | `oklch(0.18 0.024 214)` | Page surface |
| `--foreground` | `oklch(0.18 0.028 214)` | `oklch(0.97 0.006 214)` | Body text |
| `--card` | `oklch(1 0 0)` | `oklch(0.23 0.020 214)` | Raised surface |
| `--popover` | `oklch(1 0 0)` | `oklch(0.27 0.022 214)` | Floating surface |
| `--primary` | `oklch(0.68 0.150 142)` | `oklch(0.77 0.146 142)` | Brand action |
| `--primary-foreground` | `oklch(0.15 0.028 142)` | `oklch(0.15 0.028 142)` | Text on primary |
| `--secondary` | `oklch(0.93 0.012 210)` | `oklch(0.30 0.018 214)` | Subdued fill |
| `--secondary-foreground` | `oklch(0.25 0.020 214)` | `oklch(0.92 0.010 214)` | Secondary text |
| `--muted` | `oklch(0.96 0.010 210)` | `oklch(0.25 0.016 214)` | Soft fill |
| `--muted-foreground` | `oklch(0.52 0.018 214)` | `oklch(0.70 0.014 214)` | Secondary text |
| `--accent` | `oklch(0.72 0.140 142)` | `oklch(0.82 0.120 142)` | Hover / active surface |
| `--accent-foreground` | `oklch(0.15 0.030 142)` | `oklch(0.15 0.030 142)` | Text on accent |
| `--destructive` | `oklch(0.62 0.180 25)` | `oklch(0.68 0.170 25)` | Danger |
| `--destructive-foreground` | `oklch(0.15 0.030 25)` | `oklch(0.15 0.030 25)` | Text on destructive |
| `--border` | `oklch(0.88 0.010 210)` | `oklch(0.35 0.015 214)` | Hairlines and dividers |
| `--input` | `oklch(0.67 0.010 214)` | `oklch(0.44 0.015 214)` | Control boundaries |
| `--ring` | `oklch(0.68 0.150 142)` | `oklch(0.77 0.146 142)` | Focus ring |

### Why this primary

The green is chosen to mirror the Duolingo reference: saturated enough to feel rewarding and obviously actionable, but not neon. It sits in the mean green band with moderate chroma, making it feel like a success colour rather than a decorative one. In dark mode it lightens and remains slightly less saturated so it stays readable without turning the UI harsh.

### Measured contrast

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 12.69:1 | 17.05:1 | 4.5:1 |
| `muted-foreground` on `background` | 5.42:1 | 6.12:1 | 4.5:1 |
| `primary-foreground` on `primary` | 6.62:1 | 6.75:1 | 4.5:1 |
| `primary` on `background` | 5.45:1 | 6.39:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 5.54:1 | 5.80:1 | 4.5:1 |
| `destructive` on `background` | 4.95:1 | 5.47:1 | 4.5:1 |
| `ring` on `background` | 5.45:1 | 6.39:1 | 3:1 |
| `input` on `background` | 3.06:1 | 3.67:1 | 3:1 |

Everything clears the WCAG minimum, and `check.mjs` is part of the required validation.

### Rules

- One clear accent colour per screen: green is used for primary completion and success states, not for decoration across the layout.
- Status colours are subordinate to the primary success tone; the interface should still read as calm when the green is absent.
- Chart and badge colours should remain lower-saturation than the primary so the app never feels overloaded.

---

## Typography

**Sans:** `"Inter", "Segoe UI", system-ui, -apple-system, sans-serif`
**Mono:** `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
**Serif:** not used

| Level | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | 3rem / 48px | 700 | 1.1 | -0.02em |
| h1 | 2.25rem / 36px | 700 | 1.15 | -0.02em |
| h2 | 1.5rem / 24px | 700 | 1.25 | -0.01em |
| h3 | 1.25rem / 20px | 700 | 1.35 | 0 |
| h4 | 1rem / 16px | 700 | 1.4 | 0 |
| Lead | 1.125rem / 18px | 500 | 1.6 | 0 |
| Body | 0.875rem / 14px | 400 | 1.6 | 0 |
| Small | 0.8125rem / 13px | 400 | 1.5 | 0 |
| Caption | 0.75rem / 12px | 600 | 1.4 | 0.02em |

### Rules

- Body text is compact and app-focused at 14px, which keeps learning interfaces information-dense while still staying comfortable.
- Headings and navigation use heavier weight and tighter tracking to create momentum without becoming loud.
- Long copy stays under 70ch. The layout uses a more compact reading rhythm than editorial designs.

---

## Spacing & density

Base unit is 4px. The scale is the standard Tailwind rhythm: 4, 8, 12, 16, 20, 24, 32.

| Context | Value |
|---|---|
| Related controls | `gap-2` |
| Sibling form fields | `gap-4` |
| Form field groups | `gap-6` |
| Card padding | `p-6` |
| Section vertical rhythm | `py-12` |
| Page gutter | `px-6` |
| Max content width | `max-w-7xl` |

This design sits in the middle of the density range: it is not as compact as `slate`, but it avoids the generous spacing of editorial styles. Buttons and navigation are intentionally tactile and touch-friendly.

---

## Shape & depth

`--radius: 0.75rem`. Buttons and inputs lean hard into big pill-like rounding. Cards and panels also round out, but with slightly more subdued radius than the main CTA shapes.

### Depth rule

The design uses subtle surface separation rather than heavy shadows. Panels sit on a dark background with a thin border and low-contrast shadow. Buttons are the main tactile element; they carry a stronger roundness and a crisp fill.

```
shadow-xs  0 1px 2px 0 rgb(0 0 0 / 0.06)
shadow-sm  0 2px 4px 0 rgb(0 0 0 / 0.10)
shadow-md  0 8px 20px -12px rgb(0 0 0 / 0.28)
shadow-lg  0 16px 28px -18px rgb(0 0 0 / 0.38)
```

---

## Motion

**Duration:** 160ms with `cubic-bezier(0.2, 0, 0.2, 1)`.

| State | Treatment |
|---|---|
| Hover | Slight background shift with no large transform |
| Focus | Visible ring on `:focus-visible` |
| Active | Button darkens one step, and its bottom edge collapses by `--button-lift` (4px) — the key presses flat |
| Disabled | `opacity-50` with pointer-events removed |

This design animates mostly at the level of colour and shadow; there is no playful scale effect and no long looped motion. `prefers-reduced-motion` is handled in `theme.css`.

**The pressed button is the one exception.** Every button carries a bottom border
`--button-lift` thicker than the rest of its frame, in a darker shade of its own
face, so it reads as a physical key. On `:active` that lift collapses — a solid
button's 4px bottom edge goes to 0, an outline button's 6px goes back to the 2px
of its frame — and both transition over the standard 160ms. Because buttons are
fixed-height (`h-11`) and `border-box`, the face grows into the space the border
vacates: the press costs no reflow. See the note on prohibition 7.

---

## Component notes

**Button** — The primary button is the most important part of the design. It is a round, compact green fill with dark text, a low shadow, and generous horizontal padding. Secondary buttons use a muted dark grey fill. Text buttons are minimal and rely on weight and colour.

**Input** — Fields are dark-filled with a visible stroke and a large radius. They stay compact and easy to scan, with clear focus rings.

**Card** — Cards are dark surfaces with a soft border and almost no shadow, keeping the interface clean and dashboard-like.

**Table** — Stock shadcn tables are retained, but rows and headers stay low-contrast to preserve the app-shell feel.

**Dialog / Sheet / Popover** — Stock treatment, but with a slightly darker panel and the same green focus ring to match the app shell.

---

## Accessibility

**Focus ring.** The focus ring uses `--ring` and is offset from the element so it remains visible against the dark app shell. The measured contrast is above AA for the ring against the page background.

**Target sizes.** Buttons and inputs sit at 44px or above for touch use, matching the app's strong preference for easy taps. This is above the SC 2.5.8 minimum and is intentional in a learning product.

**State is never colour alone.** Progress, success, and errors carry text labels, weight changes, and iconography. The green button is supported by an instant feedback treatment instead of colour alone.

**Charts.** Multi-series charts are kept to low saturation plus shape variation to preserve legibility without relying on hue alone.

**Reduced motion.** The `prefers-reduced-motion` rule is in `theme.css`; any transition should drop to near-instant for a user who prefers less movement.

### Known gaps

None.

---

## Never

1. **Never use a pale or cool-blue primary on a dark background.**
2. **Never make the primary button feel decorative; it must read as the action.**
3. **Never allow the app shell to become overly glossy or metallic.**
4. **Never introduce a second dominant accent colour.**
5. **Never shrink touch targets below 44px in learning flows.**
6. **Never rely on pure shadow for hierarchy; use borders and structure first.**

---

## Extensions

None.

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

7. **Never animate layout properties.** Color, opacity, and shadow can transition. Height, width, transform — no. Buttons don't scale on hover, panels don't slide open. This keeps interactions feeling snappy and predictable. The exception is purpose-built animation components (carousels, drawers) where movement is the point, and the pressed button described under Motion — its bottom border animates, but on a fixed-height `border-box` element, so it moves no other pixel on the page. The rule is really about reflow; an animation that cannot cause one does not break it.

8. **Never let the orange accent dominate the purple primary.** Orange is a garnish, not the main course. It appears on hover states, selected tabs, and occasional CTAs, but the primary action color is always purple. If you find yourself with an orange header and orange buttons, you've inverted the hierarchy.

9. **Never use thin font weights (300 or lighter).** DM Sans starts at 400 Regular and goes up. Thin weights on colored backgrounds become illegible, and they undermine the friendly, approachable tone. Headings are bold (700); UI text is regular (400) or semibold (600). That's the range.

10. **Never use this design for high-density data dashboards.** The roomy padding, large radii, and tall components make it terrible for applications that need to show 50 rows of data above the fold. Playful optimizes for delight, not information density. If the product is a data table with occasional UI around it, use slate.

---

## Extensions

No custom tokens beyond the standard set. Everything this design needs exists in `shared/TOKENS.md`. The only addition is a CSS custom property for the display font:

```css
--font-display: "Fredoka", "DM Sans", ui-sans-serif, system-ui, sans-serif;
```

Used in the theme block as `font-family: var(--font-display)` for h1–h4. If a consumer ignores `--font-display`, headings fall back to `--font-sans` and the design still works — it just loses some personality.
