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

| Token | Light | Dark | Note |
|---|---|---|---|
| `--background` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Page surface |
| `--foreground` | `oklch(0.4128 0 89.88)` | `oklch(0.9728 0.0083 236.56)` | Body text |
| `--card` | `oklch(1 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Raised surface |
| `--popover` | `oklch(1 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Floating surface |
| `--primary` | `oklch(0.537 0.2289 137.63)` | `oklch(0.7478 0.2289 137.63)` | Brand action — the green |
| `--primary-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on primary |
| `--secondary` | `oklch(0.547 0.1513 237.07)` | `oklch(0.7181 0.1513 237.07)` | Secondary action — the blue |
| `--secondary-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on secondary |
| `--muted` | `oklch(0.9761 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Soft fill |
| `--muted-foreground` | `oklch(0.5602 0 89.88)` | `oklch(0.7032 0.0269 229.31)` | Secondary text |
| `--accent` | `oklch(0.8575 0.1752 88.49)` | `oklch(0.8575 0.1752 88.49)` | Reward gold |
| `--accent-foreground` | `oklch(0.4128 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on accent |
| `--destructive` | `oklch(0.5866 0.2165 25.19)` | `oklch(0.6708 0.2165 25.19)` | Danger |
| `--destructive-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on destructive |
| `--border` | `oklch(0.9219 0 89.88)` | `oklch(0.3847 0.0246 234.61)` | Container edges (2px) and dividers |
| `--input` | `oklch(0.6568 0 89.88)` | `oklch(0.526 0.0246 234.61)` | Control boundaries |
| `--ring` | `oklch(0.537 0.2289 137.63)` | `oklch(0.7478 0.2289 137.63)` | Focus ring |

### Why this primary

The green is chosen to mirror the Duolingo reference: saturated enough to feel rewarding and obviously actionable, but not neon. It sits in the mean green band with moderate chroma, making it feel like a success colour rather than a decorative one. In dark mode it lightens and remains slightly less saturated so it stays readable without turning the UI harsh.

### Measured contrast

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 8.73:1 | 15.56:1 | 4.5:1 |
| `muted-foreground` on `background` | 4.65:1 | 6.41:1 | 4.5:1 |
| `primary-foreground` on `primary` | 4.65:1 | 8.05:1 | 4.5:1 |
| `primary` on `background` | 4.65:1 | 8.05:1 | 4.5:1 |
| `secondary-foreground` on `secondary` | 4.65:1 | 6.88:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 4.65:1 | 5.09:1 | 4.5:1 |
| `destructive` on `background` | 4.65:1 | 5.09:1 | 4.5:1 |
| `ring` on `background` | 4.65:1 | 8.05:1 | 3:1 |
| `input` on `background` | 3.15:1 | 3.15:1 | 3:1 |

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

Depth here is structural, not atmospheric. Panels sit on the page background behind a **2px** border — the border is the edge, not a hairline, and it is what separates a card from the page rather than a shadow. Containers and form fields take `border-2`; dividers inside them stay 1px, because a divider separates content rather than enclosing it.

Buttons are the exception and the main tactile element: they sit on a solid 4px slab of their own colour, darkened, which is a hard `box-shadow` rather than a blur. See Motion for how the press works.

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
| Active | Button travels down `--button-lift` (4px) onto its slab, which collapses to nothing underneath it |
| Disabled | `opacity-50` with pointer-events removed |

This design animates mostly at the level of colour and shadow; there is no playful scale effect and no long looped motion. `prefers-reduced-motion` is handled in `theme.css`.

**The pressed button is the one exception.** Every button that reads as a key sits
on a solid slab `--button-lift` (4px) deep, in a darker shade of its own face.
On `:active` the button travels down onto the slab and the slab collapses to
nothing beneath it, so the bottom edge never moves and only the top edge does —
the button is pressed into the page rather than squashed.

The slab is a `box-shadow` and the travel is a `transform`, not a border that
changes width:

- A border carries one colour, so pushing the face down by growing a *top*
  border would draw a visible line across the top of any outlined button.
  Padding avoids the line but collides with whatever `py-*` the markup sets.
- `box-shadow` and `transform` cost no layout at all, so the press is composited
  rather than reflowed — at any button size, fixed-height or not.
- The slab genuinely sits outside the button box, which is what the metaphor
  describes.

The consequence is that `box-shadow` belongs to the design on a button: a
`shadow-*` utility there is overridden. That is deliberate. These buttons carry a
hard slab, never a soft drop shadow. Ghost and link buttons have no face to drop,
so they stay flat and do not travel. See prohibition 7.

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
transition. `--ring` is the green primary: 4.65:1 light and 8.05:1 dark against the
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
on two saturated hues that sit close in lightness (green L=0.75, gold L=0.86 in dark), a
greyscale check matters more here than in a neutral design — run one.

**Charts.** The chart ramp is green/blue/gold/purple/red at similar chroma, which is close to
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

2. **Never use more than two accent colours on a single screen.** Green and one of blue or gold — that is the palette. The chart ramp (green, blue, gold, purple, red) exists for data visualisation; UI chrome stays green plus a single supporting hue. A third accent in the chrome just creates noise.

3. **Never reduce card padding below 24px (`p-6`).** This design is roomy. Cramming content into tight cards undoes the friendly breathing room that makes it work. If something doesn't fit comfortably at `p-8`, rethink the content, don't shrink the padding.

4. **Never use hard black or pure white for text.** Foreground in dark mode is `#F1F7FB` and in light mode `#4B4B4B` — never `#000` or `#FFF` for body copy. Pure white appears only as a foreground on the light theme's saturated fills. Absolute black on a near-black ground reads as a hole rather than as text.

5. **Never use drop shadows on flat surfaces.** Shadows are for elevation — cards, buttons, dialogs. Page backgrounds, section dividers, and inline elements stay flat. A shadow on a `<p>` tag is a mistake.

6. **Never stack headings without content between them.** If an h2 is immediately followed by an h3, one of them is wrong. Headings introduce content; they aren't decoration. This matters more in playful designs because the display font (Fredoka) is visually distinctive — stacked headings look like a type specimen, not a hierarchy.

7. **Never animate anything that causes reflow.** Colour, opacity, shadow, and transform can transition. Height, width, padding, margin, and border width cannot — animating those relays out the page around them. Buttons don't scale on hover and panels don't slide open. The exceptions are purpose-built animation components (carousels, drawers) where movement is the point, and the button press described under Motion, which moves a `transform` and a `box-shadow` and so touches no other pixel on the page.

8. **Never let gold or blue outrank the green.** Green is the action colour: the primary button, the progress fill, the completed state. Gold belongs to rewards and streaks, blue to navigation and secondary actions. A screen whose main call to action is gold has inverted the hierarchy — the learner should always be able to find "the green one".

9. **Never use thin font weights (300 or lighter).** DM Sans starts at 400 Regular and goes up. Thin weights on colored backgrounds become illegible, and they undermine the friendly, approachable tone. Headings are bold (700); UI text is regular (400) or semibold (600). That's the range.

10. **Never use this design for high-density data dashboards.** The roomy padding, large radii, and tall components make it terrible for applications that need to show 50 rows of data above the fold. Playful optimizes for delight, not information density. If the product is a data table with occasional UI around it, use slate.

---

## Extensions

No custom tokens beyond the standard set. Everything this design needs exists in `shared/TOKENS.md`. The only addition is a CSS custom property for the display font:

```css
--font-display: "Fredoka", "DM Sans", ui-sans-serif, system-ui, sans-serif;
```

Used in the theme block as `font-family: var(--font-display)` for h1–h4. If a consumer ignores `--font-display`, headings fall back to `--font-sans` and the design still works — it just loses some personality.
