# Design: `learn`

**Read [`../README.md`](../README.md) first.** It explains how this design's
`theme.css` and `index.html` are meant to be used alongside this file.

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

The palette is the reference product's own, unmodified in both themes: `#58CC02`
green, `#1CB0F6` blue, `#FFC800` gold, `#FF4B4B` red and `#CE82FF` purple, over
`#131F24` with `#202F36` surfaces in dark, and over white with `#E5E5E5` borders
in light.

Brightness is the point. These are saturated, high-lightness fills that carry
white labels, and they are what make the interface read as a game rather than a
form. Holding them exactly is a deliberate choice with a real cost in light mode
— see Measured contrast below, and read it before shipping this to anyone.

| Token | Light | Dark | Note |
|---|---|---|---|
| `--background` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Page surface |
| `--foreground` | `oklch(0.4128 0 89.88)` | `oklch(0.9728 0.0083 236.56)` | Body text |
| `--card` | `oklch(1 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Raised surface |
| `--popover` | `oklch(1 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Floating surface |
| `--primary` | `oklch(0.7478 0.2289 137.63)` | `oklch(0.7478 0.2289 137.63)` | Brand action — the green |
| `--primary-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on primary |
| `--secondary` | `oklch(0.7181 0.1513 237.07)` | `oklch(0.7181 0.1513 237.07)` | Secondary action — the blue |
| `--secondary-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on secondary |
| `--muted` | `oklch(0.9761 0 89.88)` | `oklch(0.2949 0.0237 228.44)` | Soft fill |
| `--muted-foreground` | `oklch(0.5693 0 89.88)` | `oklch(0.7032 0.0269 229.31)` | Secondary text |
| `--accent` | `oklch(0.8575 0.1752 88.49)` | `oklch(0.8575 0.1752 88.49)` | Reward gold |
| `--accent-foreground` | `oklch(0.4128 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on accent |
| `--destructive` | `oklch(0.6708 0.2165 25.19)` | `oklch(0.6708 0.2165 25.19)` | Danger |
| `--destructive-foreground` | `oklch(1 0 89.88)` | `oklch(0.2304 0.0195 225.76)` | Text on destructive |
| `--border` | `oklch(0.9219 0 89.88)` | `oklch(0.3847 0.0246 234.61)` | Container edges (2px) and dividers |
| `--input` | `oklch(0.9219 0 89.88)` | `oklch(0.526 0.0246 234.61)` | Control boundaries |
| `--ring` | `oklch(0.7478 0.2289 137.63)` | `oklch(0.7478 0.2289 137.63)` | Focus ring |

### Why this primary

The green is chosen to mirror the Duolingo reference: saturated enough to feel rewarding and obviously actionable, but not neon. It sits in the mean green band with moderate chroma, making it feel like a success colour rather than a decorative one. In dark mode it lightens and remains slightly less saturated so it stays readable without turning the UI harsh.

### Measured contrast

| Pair | Light | Dark | Minimum |
|---|---|---|---|
| `foreground` on `background` | 8.73:1 | 15.56:1 | 4.5:1 |
| `muted-foreground` on `background` | 4.48:1 | 6.41:1 | 4.5:1 |
| `primary-foreground` on `primary` | 2.09:1 | 8.05:1 | 4.5:1 |
| `primary` on `background` | 2.09:1 | 8.05:1 | 4.5:1 |
| `secondary-foreground` on `secondary` | 2.45:1 | 6.88:1 | 4.5:1 |
| `destructive-foreground` on `destructive` | 3.30:1 | 5.09:1 | 4.5:1 |
| `destructive` on `background` | 3.30:1 | 5.09:1 | 4.5:1 |
| `ring` on `background` | 2.09:1 | 8.05:1 | 3:1 |
| `input` on `background` | 1.26:1 | 3.15:1 | 3:1 |
| `sidebar-primary-foreground` on `sidebar-primary` | 2.45:1 | 6.88:1 | 4.5:1 |
| `sidebar-accent-foreground` on `sidebar-accent` | 2.15:1 | 5.65:1 | 4.5:1 |

<!-- check:contrast=waived -->

**This design does not meet WCAG 2.2 AA in light mode, deliberately.** The pairs
marked below are shortfalls, and they are the price of using the reference
palette unmodified: `#58CC02` on white is 2.09:1, and no amount of arranging gets
a colour that bright past 4.5:1 on a white ground. Reaching AA means darkening
the green until it is no longer the brand colour, which was tried and rejected —
the whole point of this design is that green.

The gate is therefore waived for `learn` via the marker above, which `check.mjs`
reads. Waiving suppresses the build failure, not the finding: every shortfall is
still measured and still printed on each run, so nobody inherits this by
accident.

**What this costs.** Users with low vision, colour vision deficiency, or a
low-quality display will struggle to read white-on-green button labels and
green-on-white text in the light theme. Dark mode clears every pair and is the
accessible option here. If you are building something where AA is a requirement
rather than a preference — anything public sector, regulated, or contractual —
either ship dark mode as the default or pick a different design. Do not assume
this waiver travels with the tokens into your project.

### Rules

- One clear accent colour per screen: green is used for primary completion and success states, not for decoration across the layout.
- Status colours are subordinate to the primary success tone; the interface should still read as calm when the green is absent.
- Chart and badge colours should remain lower-saturation than the primary so the app never feels overloaded.

---

## Typography

**Sans:** `"Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif`
**Display:** same stack as sans — the rounded face carries headings and every button label
**Mono:** `ui-monospace, SFMono-Regular, Menlo, monospace`
**Serif:** not used

The face is rounded, not neutral. That roundness is doing as much work as the
green: it is what stops a dense grid of controls from reading as a dashboard.
Buttons, headings and navigation are all set in it at weight 800, uppercase, with
`0.04em` tracking.

### Why Baloo 2, and not the reference product's own face

The face this design is drawn from is Duolingo Sans, which is proprietary. So was
the fallback the stack used to lean on: Arial Rounded MT Bold is Monotype's and
ships with macOS, Trebuchet MS is Microsoft's and ships with Windows and macOS.
Naming them was not a licence problem — a font stack may name anything — but it
made the design's identity conditional on the reader's operating system. Nothing
was ever downloaded, because `local()` only ever resolves against fonts already
installed, so the roundness this section calls load-bearing was present on a Mac
and simply absent on iOS, Android and most Linux.

Baloo 2 replaces it: openly licensed (SIL OFL 1.1), rounded in the same way, and
— the reason it wins over Nunito or Fredoka — it carries weight 800, which this
design needs for buttons and navigation. Fredoka stops at 700. It is vendored
into `theme.css` as base64 woff2 like every other design here, so the type is now
a property of the commit rather than of the device.

Arial Rounded MT Bold and Trebuchet MS stay in the stack behind it. They are no
longer load-bearing — they cover the moment before the face is decoded, and the
case where a consumer strips the `@font-face` block out.

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

The slab is a `box-shadow` and the travel is `top` on a relatively positioned
button, not a border that changes width and not a transform:

- A border carries one colour, so pushing the face down by growing a *top*
  border would draw a visible line across the top of any outlined button.
  Padding avoids the line but collides with whatever `py-*` the markup sets.
- The travel must be painted on the same thread as the slab. A transform is
  handed to the compositor while `box-shadow` repaints on the main thread, and
  the two tick from different clocks: when the main thread is busy — rapid
  clicking is the easy way to provoke it — the face keeps gliding while the slab
  waits a frame or two to be repainted, and the bottom edge visibly jumps.
  `top` and `box-shadow` are both main-thread paint properties, resolved in one
  style pass and committed in one frame, so they cannot drift apart. A relative
  offset moves nothing but the button itself, so no sibling reflows.
- The slab genuinely sits outside the button box, which is what the metaphor
  describes.

Both halves share one duration, for the same reason. `--button-press-duration`
(160ms) drives them together; set it to `0ms` for an instant press.

The consequence is that `box-shadow` belongs to the design on a button: a
`shadow-*` utility there is overridden. That is deliberate. These buttons carry a
hard slab, never a soft drop shadow. Ghost and link buttons have no face to drop,
so they stay flat and do not travel. See prohibition 7.

---

## Component notes

**Button** — The primary button is the most important part of the design. It is a round, compact green fill with dark text, a low shadow, and generous horizontal padding. Secondary buttons use a muted dark grey fill. Text buttons are minimal and rely on weight and colour.

This design's slab shadow, uppercase label typography, and focus outline (see
Accessibility below) are keyed to `[data-slot="button"]` in `theme.css`, alongside
the `button`/`[type="button"]` tag selectors — not to the tag alone. An
implementation that renders a button-styled control as something other than
`<button>` (e.g. shadcn's `Button asChild` onto `<a href>`, required by
`shared/ACCESSIBILITY.md` for anything that navigates) must carry
`data-slot="button"` for the slab, typography, and outline to apply. Verify this
before shipping — the kitchen sink's `#buttons` section has a button-styled `<a>`
next to the `<button>` variants for exactly this comparison.

**Input** — Fields are dark-filled with a visible stroke and a large radius. They stay compact and easy to scan, with clear focus rings.

**Card** — Cards are dark surfaces with a soft border and almost no shadow, keeping the interface clean and dashboard-like.

**Table** — Stock shadcn tables are retained, but rows and headers stay low-contrast to preserve the app-shell feel.

**Dialog / Sheet / Popover** — Stock treatment, but with a slightly darker panel and the same green focus ring to match the app shell.

---

## Accessibility

Baseline is `shared/ACCESSIBILITY.md` — WCAG 2.2 AA. This section covers only what
`learn` decides for itself.

**Focus ring.** `outline: 2px solid var(--ring)` with `outline-offset: 2px` on
`:focus-visible`, instant, no transition — an outline, deliberately, not a ring.
Tailwind draws `ring-*` with `box-shadow`, which on these buttons is the slab, and
the slab wins; a button whose markup said `focus-visible:ring-2` rendered no
indicator at all while `focus-visible:outline-none` in the same class list had
already removed the native one. `outline` is a separate property that the slab
cannot overwrite. Do not convert it back to a ring — it fails silently.

This design draws the outline as unlayered plain CSS in `theme.css`, not as a
Tailwind `outline-*` utility in the markup, precisely so it cannot be silently
defeated the same way the ring was. If you ever do reach for the utility form
elsewhere (a custom component this design's selectors don't reach, say), never
pair it with `outline-none` in the same class list — see
`shared/ACCESSIBILITY.md` §2's `Never` rule for why: `outline-none` sets the
variable the `outline-*` utility reads from, permanently, and the utility never
resets it, so it renders nothing in every state with no visual signal at all.

`--ring` is the green primary, which measures 2.09:1 light and 8.05:1
dark against the page. Dark mode is comfortably past the 3:1 WCAG 1.4.11 asks of
an indicator; light mode is not, and is one of the shortfalls the waiver above
covers — the ring is the same green as the primary, so it cannot clear 3:1 on
white while the primary stays the brand colour. In light mode the offset and the
2px width are doing the work the contrast cannot. The offset matters
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

`learn` is the only design here that clears the 44px touch target by default. Do
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

Light mode does not meet AA. Ten pairs fall short, every one of them a consequence
of holding the reference palette unmodified — see the waiver under Colour, which
sets out what it costs and who should not ship it. `node scripts/check.mjs` still
measures and prints all ten on every run; the marker suppresses the build
failure, not the finding.

Dark mode clears every pair. It is the accessible theme in this design, and that
is a deliberate asymmetry rather than an oversight.

---

## Never

1. **Never use sharp corners.** This design's personality lives in its rounded shapes. A 90° corner on a button or card breaks the aesthetic instantly. Minimum radius is `rounded-lg` (12px). For interactive elements, use `rounded-xl` (16px).

2. **Never use more than two accent colours on a single screen.** Green and one of blue or gold — that is the palette. The chart ramp (green, blue, gold, purple, red) exists for data visualisation; UI chrome stays green plus a single supporting hue. A third accent in the chrome just creates noise.

3. **Never reduce card padding below 24px (`p-6`).** This design is roomy. Cramming content into tight cards undoes the friendly breathing room that makes it work. If something doesn't fit comfortably at `p-8`, rethink the content, don't shrink the padding.

4. **Never use hard black or pure white for text.** Foreground in dark mode is `#F1F7FB` and in light mode `#4B4B4B` — never `#000` or `#FFF` for body copy. Pure white appears only as a foreground on the light theme's saturated fills. Absolute black on a near-black ground reads as a hole rather than as text.

5. **Never use drop shadows on flat surfaces.** Shadows are for elevation — cards, buttons, dialogs. Page backgrounds, section dividers, and inline elements stay flat. A shadow on a `<p>` tag is a mistake.

6. **Never stack headings without content between them.** If an h2 is immediately followed by an h3, one of them is wrong. Headings introduce content; they aren't decoration. This matters more here because the rounded display face is visually distinctive — stacked headings look like a type specimen, not a hierarchy.

7. **Never animate anything that causes reflow.** Colour, opacity, shadow, and transform can transition. Height, width, padding, margin, and border width cannot — animating those relays out the page around them. Buttons don't scale on hover and panels don't slide open. The exceptions are purpose-built animation components (carousels, drawers) where movement is the point, and the button press described under Motion, which moves a relative `top` and a `box-shadow` and so touches no other pixel on the page.

8. **Never let gold or blue outrank the green.** Green is the action colour: the primary button, the progress fill, the completed state. Gold belongs to rewards and streaks, blue to navigation and secondary actions. A screen whose main call to action is gold has inverted the hierarchy — the learner should always be able to find "the green one".

9. **Never use thin font weights (300 or lighter).** The stack starts at 400 Regular and goes up. Thin weights on colored backgrounds become illegible, and they undermine the friendly, approachable tone. Headings are bold (700); UI text is regular (400) or semibold (600). That's the range.

10. **Never use this design for high-density data dashboards.** The roomy padding, large radii, and tall components make it terrible for applications that need to show 50 rows of data above the fold. This design optimizes for momentum and repetition, not information density. If the product is a data table with occasional UI around it, use slate.

---

## Extensions

Four additions beyond the standard set in `shared/TOKENS.md`:

```css
--font-display: "Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif;
--button-lift: 4px;
--uppercase-optical-nudge: 0.025em;
--progress-track: oklch(0.928 0.006 264.531); /* redeclared under .dark, see below */
```

`--font-display` is used in the theme block as `font-family: var(--font-display)`
for h1–h4. If a consumer ignores it, headings fall back to `--font-sans` — the
same stack — and the design still works.

`--button-lift` is how far a button's bottom edge protrudes, and therefore how far
it travels when pressed. Every button collapses by exactly this much; see Motion.

`--uppercase-optical-nudge` corrects Baloo 2's uppercase text (buttons, table
headers, captions) for sitting visibly high in whatever centers it — measured on
the actual vendored font, not guessed; see the "Uppercase optical centering" rule
in `theme.css` for the full explanation and the measurement method. If a consumer
ignores it, uppercase text renders correctly in every other respect, just with a
sub-pixel-to-1px gap under the baseline instead of an even margin.

`--progress-track` is the quest bar's track colour — Tailwind's own default
`gray-200` in light mode, redeclared under `.dark` to this theme's own dark
`--muted` (already the right dark navy there). It's a token, not a
`bg-gray-200` utility class in markup, specifically so a consumer who only
copies the `:root`/`.dark` blocks still gets the right colour in both themes;
`check.mjs` also flags a raw Tailwind palette class in the markup as a
tokens-only violation, which a literal `bg-gray-200 dark:bg-muted` in markup
was. See Progress & loading, including a known contrast shortfall this
colour choice reopens for un-stroked, low-fill bars in light mode.

Progress bars also read two per-instance custom properties, `--progress-value`
and `--progress-height`, but those are set inline per bar in markup (not a
Tailwind arbitrary-property class — see Progress & loading for why), not part
of the token set above a consumer pastes once.

### Navigation
Top nav bar is `h-16` (64px) vs slate's h-14 (56px). The extra height accommodates the more prominent logo typography (the rounded face at 18px bold) and makes touch targets more comfortable.

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
Progress bars are `h-3.5` pills, sized tight to the label they carry rather
than to a generic touch target — this is the one control in the design
that's deliberately *not* `h-11`, because it isn't interactive. The track
has no inset shadow — this is game chrome, not a recessed page surface —
and its colour comes from `--progress-track` (see Extensions), not this
theme's own `--muted`: `--muted` is nearly white in light mode, the wrong
role for a track that needs to read as a visible grey chip, so this token
borrows Tailwind's own default `gray-200` for light mode instead, and falls
back to this theme's dark `--muted` — already the right navy — under
`.dark`. The fill (`[data-slot="progress-indicator"]`) is a flat, solid
token colour — no gradient — full width and slid into view with
`transform: translateX()`, clipped by the track's own `overflow-hidden` +
`rounded-full` rather than resized with `width` — see prohibition 7, and
the rationale comment above `[data-slot="progress-indicator"]` in
`theme.css`.

Markup drives all of this from two custom properties set once per bar, as
plain inline `style` (not a Tailwind arbitrary-property class — the
vendored Tailwind browser build doesn't reliably apply those for this
case, which is worth knowing before reaching for that shorthand elsewhere
in a kitchen sink): `--progress-value` (a bare number, 0-100) and
`--progress-height` (the bar's own height as a length). The translateX
percentage and the `::before` highlight's geometry are both computed from
these in CSS — nothing else in `theme.css` needs to change per bar.

The glossy read comes from that `::before` highlight, not a gradient: a
thin, very transparent (17.5%) white capsule, `calc(var(--progress-height)
* 0.2)` tall, sitting the same distance down from the top — a reflection
sitting on a solid surface, not a shaded bevel across the whole fill. Both
lengths are computed from `--progress-height` rather than written as plain
percentages, because percentage `height` on an absolutely-positioned box
needs its containing block's height to be treated as definite, which held
up inconsistently between the two indicator variants in practice, and are
wrapped in `round(…, 1px)`: the raw calc is sub-pixel (2.8px on the h-3.5
bars), and painting a box that thin at a sub-pixel position measurably
shrank it in testing — computed style reported the correct 2.8px, but the
actual pixels showed a visibly shorter band, closer to a seventh of the bar
than the intended fifth. Snapping to a whole pixel first removes that
ambiguity; it also means the ratio is never exactly 20% (2.8px rounds to
3px, which is 21% of a 14px bar) — a whole-pixel constraint a bar height
that isn't a multiple of five can't avoid. The highlight's ends are inset
by half the bar's own height so it clears the
track's rounded caps on both sides. The right inset is the easy half —
measured from the indicator's own right edge, which always coincides with
the fill's visible right edge regardless of value. The left inset is not: a
naive mirror-image `left: <inset>` measures from the indicator's own left
edge, and since the indicator is full width and translated, that edge sits
off in the hidden, translated-away region for anything under 100% fill — an
earlier pass shipped exactly that bug (cleared the right cap, ran straight
over the left one). The fix reads the inset off `--progress-value` too:
expressed in the indicator's own pre-transform coordinate space, the
track's left edge is `100% - value%` in from the indicator's left edge, so
that's where the highlight's `left` is anchored, inset by the same
half-height. Set the track's `data-tone` (`primary`, `secondary`, …) to
match whichever colour the indicator fills with; it feeds `--progress-tone`
on the label below.

A centred label crosses both the track and the fill, in white — legal on
the fill under prohibition 4's own exception ("pure white as a foreground
on a saturated fill"). Digits, "%" and "/" have no descenders, so the label
sits visibly high in a flex-centred box for the same reason uppercase text
does elsewhere in this design (see "Uppercase optical centering" in
`theme.css`) — it gets the same always-on
`translateY(var(--uppercase-optical-nudge))` correction.

A `-webkit-text-stroke` in the bar's own tone (`--progress-tone`, the same
token the indicator is filled with, not a darkened mix of it) is reserved
for bars markup marks `data-stroke` — by convention, ones at 60% or past
it. Over the indicator the stroke all but disappears into the fill it
matches; it only becomes visible where a labelled-but-unstroked low bar
would otherwise look identical, which is the point — it reads as "nearly
there" rather than "half done."

**Known shortfall, not yet a waiver:** in dark mode the track (`--muted`) is
dark enough that a plain white label reads fine anywhere on the bar, stroke
or not. In light mode the track is `bg-gray-200` — light enough that an
*unstroked* white label sitting on bare track (a low-fill bar under the 60%
`data-stroke` threshold, like `#progress`'s `6 / 60` example) does not clear
AA. This wasn't true of the previous dark-track-in-both-themes version, and
reappeared when the track's light-mode colour changed back to a literal
grey; it isn't yet resolved, and isn't declared via `check:contrast=waived`
because that marker covers this file's *token pairs*, not a component-level,
value-dependent case like this — a bar's contrast here depends on both its
theme and how full it is. Options for actually fixing it: stroke every
label regardless of `data-stroke` (loses the "nearly there" signal the
stroke is otherwise for), swap the label to a dark, theme-aware colour
below the threshold instead of white, or accept it and document the
threshold as the reason low, light-mode bars need a caption underneath
rather than relying on the in-bar label alone. Pick one before shipping
this component with real (as opposed to demo) low-progress data in light
mode. A compact `h-2` variant with no inner label and no stroke remains for
tight inline contexts — a quota meter inside a stat card, a mini bar inside
a table row — where there isn't room for a label anyway.

Circular spinners use a partial arc with `stroke-primary` at 2px weight.

Skeletons use `bg-muted animate-pulse`, with `rounded-lg` to match the shapes they're standing in for (avatar skeletons are `rounded-full`).

