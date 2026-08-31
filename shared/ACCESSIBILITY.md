# The Accessibility Contract

Every design and every layout in this repository must meet **WCAG 2.2 Level AA**.

This is a contract, like `TOKENS.md` and `COMPONENTS.md`, and it exists for the same
reason: an agent building a page from this repo should not have to decide what
"accessible" means, and should not be able to produce something inaccessible by
following the instructions exactly.

Accessibility is not a section you add at the end. Almost all of it is decided by
choices this repo already makes for you — the token values, the focus ring, the
control heights, the markup in the kitchen sink. Getting those right once is what
makes every consuming application accessible by default.

---

## Who owns what

The design/layout split in this repo maps cleanly onto accessibility, so use the
same rule: **structure belongs to the layout, appearance belongs to the design**.

| Concern | Owner | Where it is written down |
|---|---|---|
| Colour contrast (text and non-text) | **Tokens** | `TOKENS.md`, verified by `check.mjs` |
| Focus ring visibility and contrast | **Design** | `DESIGN.md` → Motion, Accessibility |
| Target size, control heights | **Design** | `DESIGN.md` → Spacing & density |
| Non-colour encoding of state | **Design** | `DESIGN.md` → Accessibility |
| Reduced motion | **Design** | `DESIGN.md` → Motion, and `theme.css` |
| Landmarks, skip links, focus order | **Layout** | `LAYOUT.md` → Accessibility |
| Heading hierarchy on a page | **Layout** | `LAYOUT.md` → Accessibility |
| Keyboard behaviour of a component | **Both** — contract below | This file |
| Semantics / ARIA of a component | **Both** — contract below | This file |
| Alt text, page titles, language, real copy | **The consuming app** | Out of scope here |

That last row is deliberate. This repo ships components and structure, not content.
It cannot write the alt text for an image it has never seen. What it *can* do is
make sure every component has somewhere for that alt text to go, and that is the
standard the kitchen sink is held to.

---

## 1. Colour and contrast

The numbers live in `TOKENS.md`; the requirements live here.

| What | Minimum | WCAG |
|---|---|---|
| Body text on its background | **4.5:1** | 1.4.3 |
| Large text (≥24px, or ≥18.66px bold) | **3:1** | 1.4.3 |
| UI component boundaries and states | **3:1** | 1.4.11 |
| Focus indicator against adjacent colour | **3:1** | 1.4.11 |
| Graphical objects needed to understand content | **3:1** | 1.4.11 |

Every `--x` / `--x-foreground` pair must clear 4.5:1 in **both** light and dark.
`check.mjs` computes these from `theme.css` and fails the build on any pair that
does not.

### The two that are always missed

**`--input` is a UI boundary, not decoration.** If an outlined text field's border
is the only thing that identifies it as a text field, that border must clear **3:1**
against the surface behind it — not the 1.3:1 that a hairline divider typically
lands on. `--border` and `--input` are separate tokens precisely so they can hold
different values: `--border` may stay decorative and low-contrast, `--input` may
not. A design that sets them to the same pale grey has an accessibility bug, and it
is the most common one in this repo's own history.

The exemption: if a field is identified by something *other* than its border — a
filled `--muted` background clearly distinct from the page, for instance — then the
border is decorative and 3:1 does not apply to it. Say so explicitly in
`DESIGN.md`; do not leave it implied. Note that the *fill* then has to clear 3:1
instead, so this is a different way to pay the cost, not a way to avoid it.

Thickening the border does not help either: WCAG measures colour difference, not
stroke width. A 2px hairline is exactly as non-compliant as a 1px one.

**`--ring` has no foreground pair, so nothing constrains it by accident.** The focus
ring must clear 3:1 against *whatever it is drawn on top of*, which for a ring with
an offset means the page background, and for a ring without an offset means the
control's own fill. Check it against both. A focus ring that is only visible on
white is not a focus ring.

### Never encode meaning in colour alone

WCAG 1.4.1. If colour is carrying information, something else must carry it too:

- Status pills carry an **icon or a text label**, not just a red/green fill.
- Form errors carry **text**, not just a red border.
- Chart series carry **direct labels, a legend with shape, or pattern** — five
  `--chart-*` colours side by side are indistinguishable to roughly 1 in 12 men.
- A required field carries a marker *and* `required`, not just a red asterisk that
  screen readers skip.
- An active nav item carries weight, a marker, or `aria-current`, not only colour.

### Dark mode is not exempt

Contrast failures cluster in dark mode, because dark themes are usually derived
rather than designed. Two specific traps:

- **Light-on-colour pairs invert their difficulty.** A `--destructive` that carries
  white text comfortably at L=0.577 will often fail once it is lightened for dark
  mode, because the foreground stays white while the fill gets lighter.
- **Dropping chroma helps contrast; raising lightness may not.** Check, do not
  assume.

---

## 2. Focus

**Every interactive element has a visible focus indicator.** No exceptions, and
never `outline: none` without an equivalent replacement.

- **Never put `outline-none` in the same class list as a `focus-visible:outline-*`
  utility — the second does not override the first.** Tailwind's `outline-none`
  sets `--tw-outline-style: none` as a real, unconditional declaration.
  `focus-visible:outline-2` only *reads* that variable
  (`outline-style: var(--tw-outline-style)`); it never writes it back to
  `solid`. Once `outline-none` has run, the variable stays `none` in every
  state, so the "replacement" renders nothing — no matter how correct its
  width, colour, and offset classes look in the markup. This is the same
  silent-failure shape as the `outline: none` rule above, just one mechanism
  deeper: don't reach for `outline-none` as a reset before a custom focus
  style, since the initial value of `outline-style` is already `none`. Verify
  with computed `outline-style` (devtools or `getComputedStyle`), not the
  class list — `outline-style: none` with everything else set correctly is
  indistinguishable from a missing class at a glance.
- Use `:focus-visible`, not `:focus`, so pointer users do not get a ring on click
  while keyboard users still do.
- The ring uses `--ring` and clears 3:1 against its surroundings (above).
- The ring must be at least 2px, or 1px with an offset that makes it read as 2px.
- Focus must never be *obscured* by sticky headers, footers, or overlays
  (WCAG 2.2 SC 2.4.11). This is a layout concern — a sticky top bar with
  `scroll-margin-top` unset will hide the focused element behind itself. Layouts
  that have sticky regions must set `scroll-margin` on focusable content.
- Focus order follows DOM order. If the visual order and DOM order disagree, fix
  the DOM, not the `tabindex`. Positive `tabindex` values are banned.
- Opening an overlay moves focus into it; closing it returns focus to the trigger.

---

## 3. Target size

WCAG 2.2 SC 2.5.8 (AA) requires interactive targets to be at least **24×24 CSS
pixels**, unless an equivalent control elsewhere meets the size, or the target is
inline in a sentence.

This repo sets a higher floor, because 24px is a legal minimum rather than a usable
one:

| Context | Minimum |
|---|---|
| Any pointer target | 24×24 (hard floor, SC 2.5.8) |
| Standard controls — buttons, inputs, selects | 32×32, and normally the design's control height |
| Icon-only buttons | Match the design's control height, square |
| Touch, or below the `md` breakpoint | **44×44** |
| Spacing between adjacent targets | ≥ 8px, or use padding to reach the floor |

A dense design may use a 36px control height and a 16px icon — that is fine, as long
as the *hit area* is padded out to the floor. Visual size and target size are
different things; `p-2` around a 16px icon gives a 32px target.

---

## 4. Keyboard and semantics, per component

Every component in `COMPONENTS.md` must work from the keyboard alone. This table is
the contract. It follows the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/);
where the two ever disagree, the APG wins.

**Use the native element first.** `<button>`, `<a href>`, `<input>`, `<table>`,
`<dialog>`. A `div` with a click handler and `role="button"` is a reimplementation
of something the browser already gets right — and it will be missing at least one
of: focusability, `Enter`/`Space` activation, the disabled state, and form
submission.

| Component | Keyboard | Semantics |
|---|---|---|
| **Button** | `Enter` and `Space` activate | `<button type>`; icon-only needs `aria-label`; loading sets `aria-busy`; disabled uses the `disabled` attribute, not just `opacity-50` |
| **Link** | `Enter` activates | `<a href>`; never a button styled as a link if it navigates, and never a link if it acts |
| **Input / Textarea** | Native | `<label for>` — always; placeholder is never the label. Errors use `aria-invalid` + `aria-describedby` |
| **Checkbox** | `Space` toggles | Native input; indeterminate is set via the DOM property plus `aria-checked="mixed"` |
| **Radio group** | `Tab` enters the group once; `↑ ↓ ← →` move **and select**; `Home`/`End` jump | `<fieldset>` + `<legend>`, or `role="radiogroup"` with `aria-labelledby` |
| **Switch** | `Space` toggles | `role="switch"` + `aria-checked`, or a checkbox input styled as a switch |
| **Slider** | `← →` step; `↑ ↓` step; `Home`/`End` min/max; `PageUp`/`PageDown` large step | `<input type="range">`, or `role="slider"` with `aria-valuenow`/`min`/`max`/`valuetext` |
| **Select** | `Space`/`↓` opens; `↑ ↓` move; type-ahead jumps; `Enter` commits; `Esc` cancels | Native `<select>` unless the design requires custom rendering; custom needs the APG combobox pattern |
| **Tabs** | `Tab` reaches the active tab only; `← →` move between tabs; `Home`/`End` jump | `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`; roving `tabindex`; panel is labelled by its tab |
| **Dropdown menu** | `Enter`/`Space`/`↓` opens; `↑ ↓` move; type-ahead; `→`/`←` enter and leave submenus; `Esc` closes and returns focus | `role="menu"`/`menuitem`; trigger has `aria-haspopup` and `aria-expanded` |
| **Command palette** | Typing filters; `↑ ↓` move; `Enter` runs; `Esc` closes | APG combobox: `role="combobox"` + `aria-expanded` + `aria-controls`, active option tracked with `aria-activedescendant` |
| **Dialog / AlertDialog** | Focus moves in on open and is **trapped**; `Esc` closes; focus returns to the trigger | `role="dialog"` + `aria-modal="true"`, labelled by its title; background marked `inert` |
| **Sheet / Drawer** | Same as Dialog when it is modal | Same as Dialog; if non-modal, do not trap focus |
| **Popover** | `Esc` closes and returns focus | Trigger has `aria-expanded`; content labelled by the trigger |
| **Tooltip** | Shows on **focus** as well as hover; `Esc` dismisses; stays visible while hovered (SC 1.4.13) | `role="tooltip"` + `aria-describedby`. Never put essential or interactive content in a tooltip |
| **Accordion** | `Enter`/`Space` toggles | Header is a `<button>` inside a heading, with `aria-expanded` + `aria-controls` |
| **Table** | Sortable headers and row actions are reachable by `Tab` | Real `<table>`/`<th scope>`/`<caption>`; sortable header is a `<button>` in the `<th>` with `aria-sort`; selection checkboxes have per-row accessible names ("Select row: Acme Corp") |
| **Row actions** | Must not be hover-only — a hover-revealed button that is `display:none` is not focusable | Keep it in the DOM and reveal with `opacity`, or reveal on `:focus-within` too |
| **Pagination** | Native links/buttons | `<nav aria-label="Pagination">`; current page has `aria-current="page"` |
| **Breadcrumb** | Native links | `<nav aria-label="Breadcrumb">` + `<ol>`; last item `aria-current="page"` |
| **Toast** | Reachable and dismissible by keyboard; must not steal focus | `role="status"` (`aria-live="polite"`) — or `role="alert"` for destructive. Auto-dismiss must be pausable, or long enough to satisfy SC 2.2.1 |
| **Alert / callout** | — | `role="alert"` only for things that appear dynamically; a static callout on the page is just a region with an icon and a heading |
| **Progress** | — | `role="progressbar"` with `aria-valuenow`, or `aria-busy` on the region; indeterminate spinners need an accessible label |
| **Skeleton** | — | Mark the region `aria-busy="true"` and hide the shapes with `aria-hidden`; do not announce placeholder boxes |
| **Avatar** | — | Image needs `alt` (the person's name) or `aria-hidden` when the name is already adjacent text |
| **Badge / status pill** | — | The status word must be in the text, not conveyed by the fill alone |
| **Icons** | — | Decorative: `aria-hidden="true"` + `focusable="false"`. Meaningful: `role="img"` + `<title>`, or a visually hidden label |
| **Charts** | — | Not an image of data — provide a caption, a table alternative, or `aria-label` describing the trend |

---

## 5. Forms

- Every control has a programmatically associated `<label>`. A placeholder is not a
  label; it disappears on input and usually fails contrast.
- Group related controls in a `<fieldset>` with a `<legend>`.
- Errors are identified in **text** (SC 3.3.1) and, where the fix is knowable,
  suggest the correction (SC 3.3.3). "Invalid" is not an error message.
- Link the message to the field with `aria-describedby`, and set `aria-invalid`.
- On submit failure, move focus to the first invalid field or to a summary that
  links to each one.
- Required fields use the `required` attribute. A red asterisk alone is invisible to
  a screen reader and to anyone who cannot see red.
- Never validate destructively on every keystroke — announce on blur or on submit,
  or the live region chatters.

---

## 6. Motion

- Respect `prefers-reduced-motion: reduce`. This belongs in `theme.css`, so that it
  applies to every consuming application without the consumer doing anything.
- Under reduced motion, remove movement — durations to ~0.01ms — but keep
  *opacity* transitions if they carry meaning. The user asked for less motion, not
  for no feedback.
- Nothing animates for more than 5 seconds, and nothing loops indefinitely, unless
  the user can pause it (SC 2.2.2). Indeterminate spinners are the accepted
  exception, and they should not be on screen for minutes.
- Never animate the position or size of something the user is aiming at.
- Avoid large-area parallax, zoom, and spin — these are vestibular triggers, and
  they are the reason SC 2.3.3 exists.

---

## 7. Text and zoom

- Never disable zoom. No `user-scalable=no`, no `maximum-scale=1`.
- The page works at **200% zoom** (SC 1.4.4) and reflows to a **320px** viewport
  without horizontal scrolling (SC 1.4.10).
- Use relative units for anything type-related, so browser font-size settings work.
- Nothing breaks under the SC 1.4.12 text-spacing overrides — line height 1.5×,
  paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em. Fixed-height
  containers holding text are the usual thing that fails here.
- Body text is never below 12px, and 12px only for genuine captions.
- Do not justify body text, and do not centre paragraphs of more than two lines.

---

## 8. What the kitchen sink must demonstrate

`COMPONENTS.md` requires an `id="motion"` section documenting interaction states.
Accessibility is held to the same standard — it must be *visible in the demo*, not
merely asserted in prose:

- Every interactive element in the demo has a real, visible focus ring. Tab through
  the whole page before calling a design finished.
- The demo's status pills, alerts, and charts show their non-colour encoding.
- Form examples show a real `<label>`, a real error message, and the wiring
  (`aria-invalid`, `aria-describedby`) in the markup an agent will copy.
- Overlays are rendered inline and open for readability, which means their focus
  behaviour cannot be demonstrated statically. Document it in `DESIGN.md` instead.

Because agents copy the kitchen sink's class lists and markup verbatim, a missing
`aria-label` in the demo becomes a missing `aria-label` in every application built
from it. The markup in the demo is the deliverable, not just the styling.

---

## 9. Checking your work

```sh
node scripts/check.mjs        # tokens, sections, and computed contrast ratios
```

`check.mjs` parses each `theme.css`, converts every `oklch()` value to sRGB, and
computes real WCAG contrast ratios for the standard pairs in both light and dark.
A shortfall fails the build, unless that design declares
`<!-- check:contrast=waived -->` in its `DESIGN.md` — see the rules in
`CLAUDE.md`. A waiver downgrades the failure to a warning and never hides it: the
ratios are printed on every run, and the design has to state in the same section
what the shortfall costs and what to do instead if AA is required. The demo and the paste-ready file can no longer
disagree — the kitchen sink renders by fetching `theme.css` — so the ratios
`check.mjs` measures are the ratios a consumer gets. `check.mjs` enforces that
wiring too, failing any `index.html` that declares its own theme tokens.

What it cannot do is tell you whether the design is usable. That still needs a
person, which is what the list below is for.

What a script cannot check, and you must do by hand:

1. **Tab through the kitchen sink.** Every control reachable, ring always visible,
   order matching visual order, nothing trapped except an intentional modal.
2. **Zoom to 200%** and narrow to 320px. Nothing clipped, nothing overlapping.
3. **Turn colour off** — a greyscale screenshot. Every status still distinguishable.
4. **Read the markup as a screen reader would.** Does each control have a name? Is
   each icon-only button labelled? Would the table's row actions make sense read
   aloud one row at a time?
5. **Toggle `prefers-reduced-motion`** and confirm the design still communicates.

---

## Never

1. **Never remove a focus indicator** without replacing it with a more visible one.
2. **Never use a positive `tabindex`.**
3. **Never convey status with colour alone.**
4. **Never use a placeholder as a label.**
5. **Never put an interactive control inside a tooltip**, or behind hover only.
6. **Never disable zoom**, and never fix a container's height around text.
7. **Never `aria-hidden` a focusable element** — it produces a control that is
   reachable but unannounceable, which is worse than either alone.
8. **Never add a `role` to a native element that already has it.**
   `<button role="button">` is noise; `<div role="button">` is a bug.
9. **Never auto-focus** anything except the first field of a dedicated form page or
   the initial control of a modal the user just opened.
10. **Never ship a contrast failure as a known issue.** Fix the token. The whole
    point of a token is that fixing it once fixes every consumer.
