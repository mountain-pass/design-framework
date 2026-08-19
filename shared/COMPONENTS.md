# The Kitchen Sink Contract

Every design in `designs/` MUST render **this exact set of components, in this exact
order, using these exact section IDs**.

This is what makes the framework work. Because every design shows the same
components in the same order, a human (or an AI) can open two designs side by side
and diff them visually. It also means an AI agent asked to "build a settings page
using the `slate` design" can look up any component it needs and find it in a
predictable place.

Deviating from this list is the single most damaging thing you can do to a design
folder. Add extra sections at the end if a design genuinely needs them, but never
remove, rename, or reorder the ones below.

---

## How to read this document

Each section lists the **variants** that must appear. A "variant" is a distinct
visual state, not a distinct copy of the same thing. If the contract says
`Button: default, secondary, destructive, outline, ghost, link`, then all six must
be visible on the page.

`id` is the `id` attribute on the `<section>` element. `scripts/check.mjs` verifies
these are present, so they are not optional.

Component names match [shadcn/ui](https://ui.shadcn.com) where a shadcn component
exists, so that "the `Alert` in the kitchen sink" and "the `Alert` in your React app"
are the same thing.

**The markup is part of the contract, not just the styling.** `shared/ACCESSIBILITY.md`
holds the keyboard behaviour and ARIA semantics every component must have, and it
applies to the kitchen sink itself — not only to applications built from it. Agents
copy these class lists and this markup verbatim, so an unlabelled icon button in the
demo becomes an unlabelled icon button in every application downstream. Where a
component's accessible markup is easy to get wrong, it is called out inline below.

---

## 1. Foundations

### `id="tokens"` — Colour tokens
A swatch grid showing every semantic colour token, labelled with its variable name
and its resolved value. One swatch per token pair (`background`/`foreground`).

Required: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`,
`muted`, `accent`, `destructive`, `border`, `input`, `ring`, plus the five
`chart-1` … `chart-5` values.

### `id="typography"` — Type scale
`h1` through `h4`, lead paragraph, body paragraph, small, muted, blockquote,
inline `code`, unordered list, ordered list, and a link in body copy.

Each heading must be labelled with its size and weight so the scale is legible.

### `id="elevation"` — Surface & elevation
The shadow ramp (`shadow-xs` → `shadow-lg` or the design's equivalent), the border
radius ramp (`sm`, `md`, `lg`, `xl`, `full`), and a demonstration of how a card
sits on the page background.

---

## 2. Primitives

### `id="buttons"` — Button
- Variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`
- Sizes: `sm`, `default`, `lg`, `icon`
- States: default, hover (annotate it — you can't show hover statically, so include
  a manually-hovered-looking example labelled "hover"), disabled, loading (with
  spinner), with leading icon, with trailing icon
- A button group / split button

**Accessibility:** every icon-only button needs an `aria-label`. Disabled buttons use
the `disabled` attribute, not only `opacity-50`. The loading example sets `aria-busy`.

### `id="inputs"` — Form controls
- `Input` — default, with placeholder, disabled, with leading icon, error state
- `Textarea`
- `Select` (closed)
- `Checkbox` — unchecked, checked, indeterminate, disabled, with label
- `RadioGroup` — a group of three, one selected
- `Switch` — off, on, disabled
- `Slider` — single value
- `Label` + help text + error message

**Accessibility:** every control is wired to a real `<label for>` — a placeholder is
not a label. The error example must show the full wiring an implementer will copy:
`aria-invalid="true"` on the control and `aria-describedby` pointing at the message.
The indeterminate checkbox needs `aria-checked="mixed"`. The radio group is a
`<fieldset>` with a `<legend>`.

### `id="form"` — Composed form
A realistic form: two-column layout, a fieldset with legend, required-field
markers, inline validation error on one field, help text on another, and a
footer row with cancel + submit actions. This shows spacing and rhythm, which
individual controls do not.

**Accessibility:** the required-field marker is decorative — the control carries the
`required` attribute as well. The fieldset's `<legend>` is real, not a styled `div`.

---

## 3. Data display

### `id="card"` — Card
- Basic card (header, content, footer)
- Card with an action in the header
- Stat / metric card with a delta indicator (up and down)
- Media card with an image placeholder

### `id="table"` — Table
A data table with: a header row, at least five body rows, a sortable column
(showing the sort indicator), a status `Badge` in one column, an avatar in another,
a right-aligned numeric column, a row-actions button, a selected row, and a
footer with pagination.

**Accessibility:** a real `<table>` with `<th scope>` and a `<caption>`. The sortable
column's header is a `<button>` inside the `<th>`, and the `<th>` carries `aria-sort`.
Row-action buttons must not be hover-only — a `display:none` button is not focusable,
so reveal with `opacity` and include `:focus-within`. Selection checkboxes need
per-row accessible names, not five copies of "Select".

### `id="list"` — List & feed
- A settings-style list (label, description, control on the right, dividers)
- An activity feed with avatars and relative timestamps
- A description list (term / definition pairs)

### `id="badges"` — Badge & status
- `Badge` variants: `default`, `secondary`, `destructive`, `outline`
- Status pills with a leading dot: success, warning, error, info, neutral
- A counter badge on an icon

**Accessibility:** the status word is in the text. A bare coloured dot or fill carries
no meaning for a screen reader, and none for a colour-blind reader either (WCAG 1.4.1).

### `id="avatar"` — Avatar
Single avatar with image, avatar with initials fallback, avatar with a status dot,
and an overlapping avatar group with a `+3` overflow chip.

### `id="dataviz"` — Data visualisation
A bar chart, a line/area chart, and a sparkline, built with plain HTML/CSS or
inline SVG using the `chart-1` … `chart-5` tokens. These do not need to be real
charts — they need to show what the design's chart colours look like next to
each other, plus axis, gridline, and legend styling.

**Accessibility:** five chart colours are not distinguishable to roughly 1 in 12 men,
so the legend must vary shape or dash as well as hue, or label series directly. Each
chart needs a text alternative describing what it shows.

---

## 4. Navigation

### `id="nav"` — Navigation
- Top navigation bar: brand, primary links (one active), search, actions, avatar
- Sidebar navigation: grouped sections, icons, one active item, a collapsible
  group, and a nested child item
- A mobile/collapsed representation of the sidebar

**Accessibility:** each `<nav>` gets a distinguishing `aria-label`. The active item
carries `aria-current="page"` — a colour or fill change alone is not announced. The
collapsible group's trigger is a `<button>` with `aria-expanded`.

### `id="tabs"` — Tabs & segmented control
- `Tabs` with three tabs, one active, showing the panel below
- A segmented control / toggle group
- A vertical tab variant

**Accessibility:** `role="tablist"` / `tab` / `tabpanel` with `aria-selected` and
`aria-controls`. Tabs use a roving `tabindex` — `Tab` reaches the active tab only,
and `← →` move between tabs.

### `id="breadcrumb"` — Breadcrumb & pagination
- `Breadcrumb` with three levels and an overflow ellipsis
- `Pagination` with previous/next, numbered pages, and an ellipsis

### `id="menu"` — Menus
A `DropdownMenu` **rendered in its open state** (statically — do not require a
click), including a label, several items with icons, a keyboard shortcut hint,
a separator, a submenu indicator, a checkbox item, and a destructive item.

Also include a `CommandMenu` / search palette in its open state.

**Accessibility:** the trigger carries `aria-haspopup` and `aria-expanded`. Because
these are rendered statically open for readability, their focus behaviour cannot be
demonstrated here — `DESIGN.md` documents it instead. The command palette follows the
APG combobox pattern, tracking the active option with `aria-activedescendant`.

---

## 5. Feedback & overlays

### `id="alerts"` — Alert & callout
`Alert` in four intents — info, success, warning, destructive — each with an icon,
title, and description. Include one with an action link.

### `id="dialog"` — Dialog, sheet & popover
Rendered statically, **inline on the page, not as real overlays** (an AI reading
this file needs to see them without running JavaScript):
- `Dialog` — title, description, body, cancel + confirm footer
- `AlertDialog` — destructive confirmation
- `Sheet` / drawer — a side panel
- `Popover` and `Tooltip`

**Accessibility:** each dialog is labelled by its title (`aria-labelledby`) and marked
`aria-modal="true"`. Tooltips are `role="tooltip"` and referenced by `aria-describedby`
— never put interactive or essential content inside one, since it is unreachable for
touch and keyboard users.

### `id="progress"` — Progress & loading
`Progress` bar, an indeterminate spinner, a circular progress ring, and three
`Skeleton` shapes (line, block, avatar).

**Accessibility:** determinate bars use `role="progressbar"` with `aria-valuenow`.
Indeterminate spinners need an accessible label. Skeletons are decorative — mark the
region `aria-busy="true"` and hide the shapes with `aria-hidden`.

### `id="toast"` — Toast & notification
A stack of two or three toasts: neutral, success, and destructive, each with a
title, description, dismiss control, and one with an undo action.

**Accessibility:** `role="status"` for neutral and success, `role="alert"` for
destructive. A toast never steals focus, and its dismiss control is a labelled button.
Anything with an action must not auto-dismiss faster than the user can reach it.

### `id="empty"` — Empty, error & loading states
An empty state (icon, heading, description, primary action), a "no search results"
state, and an error state with a retry action.

---

## 6. Composed sections

These prove the design works at page scale rather than component scale. Each one is
a full-bleed band.

### `id="page-header"` — Application page header
Breadcrumb, page title, description, a row of secondary actions, a primary action,
and a tab bar beneath.

### `id="hero"` — Marketing hero
Eyebrow, headline, subheadline, two calls to action, and a visual placeholder.

### `id="features"` — Feature grid
Three or six feature cards with icon, title, and body.

### `id="pricing"` — Pricing table
Three tiers, one marked as recommended, each with price, description, feature
list with check icons, and a call to action.

### `id="testimonial"` — Testimonial / quote
A quote with attribution, avatar, and company.

### `id="cta"` — Call to action band
A full-width band with headline and action, in an inverted or accented treatment.

### `id="footer"` — Footer
Multi-column link groups, brand mark, legal line, and social icons.

---

## 7. Utility

### `id="icons"` — Icon set
A grid of 12–20 icons at the design's standard size, demonstrating stroke weight
and corner treatment. Use inline SVG. [Lucide](https://lucide.dev) is the default
icon set (it is what shadcn/ui ships with); if a design uses a different one,
`DESIGN.md` must say so and say why.

**Accessibility:** decorative icons get `aria-hidden="true"` and `focusable="false"`.
An icon carrying meaning on its own needs a `<title>` or an adjacent visually hidden
label.

### `id="motion"` — Motion & interaction
A written table (not animated) documenting: default transition duration and easing,
hover treatment, focus ring treatment, active/pressed treatment, and disabled
treatment. Include a live focus-ring example that shows when tabbed to.

---

## Order on the page

Sections appear in the order listed above. The page must open with a header
containing the design's name, a one-line description, a dark-mode toggle, and a
sticky in-page table of contents linking to each section ID.
