# Design: `<name>`

<!-- Copy this folder to designs/<name>/ and replace every <placeholder>.
     Read CREATE-DESIGN.md in the repo root before you start — it explains what
     each section below is for and what "concrete enough" means.

     Delete every one of these HTML comments before you finish. A DESIGN.md that
     still contains scaffold instructions will be read by an AI as if the
     instructions were part of the design. -->

> <One-line description. What it feels like, in a sentence someone could repeat.>

**Adjectives:** <three to five, comma separated>

**Use this when** <the product types this suits>.

**Do not use this when** <the product types this is wrong for>. <!-- Do not skip
this. A design that suits everything suits nothing, and this line is what stops an
agent reaching for the wrong one. -->

---

## Influences

- **<Reference>** — <specifically what was taken from it>
- **<Reference>** — <specifically what was taken from it>

Deliberately not taken: <what you rejected from those references, and why>.

---

## Colour

<Two or three sentences on the palette's logic. What is the relationship between
the greys and the accent? Why this hue?>

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch()` | `oklch()` | Page |
| `--foreground` | `oklch()` | `oklch()` | Body text |
| `--card` | | | Raised surface |
| `--popover` | | | Floating surface |
| `--primary` | | | Brand action |
| `--secondary` / `--muted` | | | Subdued fill |
| `--muted-foreground` | | | Secondary text |
| `--accent` | | | Hover surface |
| `--destructive` | | | Danger |
| `--border` / `--input` | | | Hairlines |

### Why this primary

<Why this specific value. Does it carry white text? Does it work as a text colour
too? What happens to it in dark mode, and why — remember that holding chroma
constant while raising lightness produces a garish dark-mode accent.>

### Measured contrast

| Pair | Light | Dark |
|---|---|---|
| `foreground` on `background` | :1 | :1 |
| `muted-foreground` on `background` | :1 | :1 |
| `primary-foreground` on `primary` | :1 | :1 |
| `primary` on `background` | :1 | :1 |
| `destructive-foreground` on `destructive` | :1 | :1 |

<!-- Measure these, do not estimate them. If a pair fails AA, change the token —
     do not record it as a known issue. -->

### Rules

- <Rule about how colour is applied>
- <Rule about status colours>
- <Rule about chart colour ordering>

---

## Typography

**Sans:** `<family with full fallback stack>`
**Serif:** `<family with full fallback stack, or "not used">`
**Mono:** `<family with full fallback stack>`

| Level | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display | | | | |
| h1 | | | | |
| h2 | | | | |
| h3 | | | | |
| h4 | | | | |
| Lead | | | | |
| Body | | | | |
| Small | | | | |
| Caption | | | | |

### Rules

- <Body size, and why — 14px for dense applications, 16px for reading-first>
- <Which weights are permitted. Fewer is better.>
- <The measure for body copy>
- <Anything about numerals, tracking, or font features>

---

## Spacing & density

Base unit is <n>px. The scale is <list the permitted steps>.

| Context | Value |
|---|---|
| Related controls | |
| Sibling form fields | |
| Field groups | |
| Card padding | |
| Table cell padding | |
| Section vertical rhythm | |
| Page gutter | |
| Max content width | |

<A sentence placing this design on the dense/roomy axis, with the control height
that follows from it.>

---

## Shape & depth

`--radius: <value>`. Derived: `sm`, `md`, `lg`, `xl`.

<Which components use which radius.>

### Depth rule

<When does a surface get a border, when a shadow, when both? State the rule, then
give the shadow ramp with actual values.>

```
shadow-xs
shadow-sm
shadow-md
shadow-lg
```

---

## Motion

**Duration <n>ms, easing `<value>`.**

| State | Treatment |
|---|---|
| Hover | |
| Focus | |
| Active | |
| Disabled | |

<What animates, and what deliberately does not.>

`prefers-reduced-motion: reduce` is handled in `theme.css`.

---

## Component notes

<!-- Only write about components that differ from stock shadcn/ui under this
     design. Where a component is unchanged, say "stock" and move on. Words spent
     restating shadcn defaults are words an implementer has to read past. -->

**Button** —
**Input** —
**Card** —
**Table** —
**Badge** —
**Dropdown / Popover / Dialog** —
**Alert** —
**Sidebar nav** —
**Tabs** —

---

## Accessibility

<!-- Baseline is shared/ACCESSIBILITY.md — WCAG 2.2 AA — and it applies whether or
     not you restate it. Write only what THIS design decides. Do not copy the
     shared contract back in here.

     `scripts/check.mjs` computes the real contrast ratios from theme.css; put its
     numbers in "Measured contrast" above, not estimates. If a pair fails, fix the
     token. If you genuinely cannot, record it under "Known gaps" below with the
     fix — never ship a silent failure. -->

**Focus ring.** <Treatment, and the measured contrast of `--ring` against what it
sits on. Must clear 3:1. `:focus-visible` only.>

**Target sizes.**

| Control | Size | Notes |
|---|---|---|
| Button, input, select | | |
| Icon button | | |
| Table row | | |
| Below `md`, and any touch target | **44×44** | Non-negotiable |

<Where this design sits relative to the 24px SC 2.5.8 floor, and what an
implementer must not shrink.>

**State is never colour alone.** <How status, errors, active nav, and sort state
are encoded in something other than hue — icon, label, weight, marker, `aria-current`.>

**Charts.** <How more than two series stay distinguishable without colour.>

**Reduced motion.** <Confirm it is handled in `theme.css`, and note anything this
design animates that reduced motion must remove.>

### Known gaps

<Anything failing the baseline, with the fix. Write "None." if `check.mjs` is
clean — and mean it.>

---

## Never

<!-- The most useful section in this file, and the one most likely to be skipped.
     Five to ten specific prohibitions. "Never use a drop shadow on a button" is
     useful; "never be inconsistent" is not. Ask yourself: what would make
     something stop looking like this design? -->

1. **Never use a colour outside the token set.**
2.
3.
4.
5.

---

## Extensions

<Any tokens added beyond shared/TOKENS.md, and what a consumer that ignores them
gets. Write "None." if the design defines exactly the standard set.>
