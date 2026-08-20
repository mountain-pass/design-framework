# Layout: `<name>`

<!-- Copy this folder to layouts/<name>/ and replace every <placeholder>.
     Read CREATE-LAYOUT.md in the repo root first.
     Delete every one of these HTML comments before you finish. -->

**Read [`../README.md`](../README.md) first.** It explains how this layout's
`index.html` wireframe is meant to be used alongside this file.

> <One-line description of the structure. Not what it is for — what it *is*.>

**Suits:** <the page types this is right for>

**Does not suit:** <the page types this is wrong for, and which layout to use
instead>. <!-- A layout that fits every page fits none. -->

---

## The defining decision

<!-- What is the one structural choice that makes this layout what it is, rather
     than a variation on another one? Viewport-locked vs. document scroll? A fixed
     measure? A three-pane split? Panels that overlay rather than flank?

     State it, then state the consequences an implementer will otherwise discover
     the hard way — especially anything invisible in a screenshot. -->

---

## Region map

```
<ASCII diagram of the regions, with their size rules annotated.>
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| | | | |
| | | | |

---

## Structure

<!-- The actual container markup. An implementer copies this, so it must be
     correct enough to paste. Include the flex/grid declarations, the height
     rules, and the overflow rules. Comment the placeholders. -->

```html
<div class="...">
  <!-- ... -->
</div>
```

<Call out any class that is load-bearing and non-obvious — `min-w-0`, `min-h-0`,
`shrink-0` — and say what breaks without it.>

---

## Scroll & overflow

<State plainly whether the page scrolls as a whole or whether the shell is
viewport-locked with independent scroll panes. These are very different layouts
and the difference is invisible in a static screenshot.>

| Region | Behaviour |
|---|---|
| `html`, `body` | |
| | |

<What is sticky, and what offset does it use? How does wide content behave?>

---

## Responsive behaviour

| Breakpoint | <Region> | <Region> | <Region> |
|---|---|---|---|
| `< sm` | | | |
| `sm` – `md` | | | |
| `md` – `lg` | | | |
| `lg` – `xl` | | | |
| `≥ xl` | | | |

<Which regions collapse, which become overlays, which disappear entirely and what
replaces them. Give exact behaviour, not "adapts for mobile".>

---

## Navigation model

- **Primary navigation** lives <where>.
- **Secondary navigation** lives <where>.
- **Contextual actions** live <where>.
- The current location is indicated by <what>.

---

## Slots

| Placeholder in the wireframe | Fill with |
|---|---|
| `<...>` | <component from shared/COMPONENTS.md, with its section id> |
| `<...>` | |

<!-- This table is the join between the layout and whatever design is paired with
     it. Every placeholder in index.html should appear here. -->

---

## Accessibility

- Landmarks: <which element for each region>
- Heading hierarchy: <where the h1 lives>
- Skip link target: <which region — the one with the content, not the navigation>
- Focus order: <state it explicitly; DOM order and visual order diverge in most
  multi-pane layouts>
- <Any region needing specific ARIA — trees, modal overlays, expandable panels>

---

## Never

<!-- The prohibitions that keep this layout itself. What would make it stop being
     this layout, or introduce the bug everyone hits? -->

1.
2.
3.
4.
5.
