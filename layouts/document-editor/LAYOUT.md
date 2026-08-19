# Layout: `document-editor`

> A centred writing surface with a collapsible document tree on the left and a
> contextual inspector on the right. The document is the interface.

**Suits:** note-taking apps, wikis, knowledge bases, CMS editors, spec and design
documents, anything where the primary object is a long piece of content the user
edits or reads at length.

**Does not suit:** dashboards or list-driven tools — use `app-shell`. Also wrong
for anything where the primary object is a canvas rather than a column of text; a
canvas wants the panels floating over it, not flanking it.

---

## The defining decision

**The document column has a fixed measure and stays centred no matter how wide the
window gets.** At `max-w-[46rem]`, that is roughly 75–80 characters at 16px — the
range where long-form reading stops being tiring.

This is the opposite instinct to `app-shell`, which fills available width with
content. Here, extra width goes to the margins, or to revealing a side panel. It
never goes to making lines longer. Widening the measure is the single change that
most reliably makes a writing app feel worse, and it is what an implementer does
by default if nobody says otherwise.

The second decision: **chrome recedes.** The toolbar is minimal and may hide on
scroll; both side panels collapse; there is a focus mode that hides everything but
the document. The layout's job is to make the content feel like the application.

---

## Region map

```
┌────────────────────────────────────────────────────────────────┐
│ Toolbar — h-12, sticky top-0, spans full width                 │
├──────────────┬─────────────────────────────────┬───────────────┤
│ Tree         │ Document                        │ Inspector     │
│ w-60         │ flex-1, own scroll              │ w-80          │
│ collapsible  │                                 │ collapsible   │
│ own scroll   │   ┌───────────────────────────┐ │ own scroll    │
│              │   │ max-w-[46rem] mx-auto     │ │               │
│              │   │ ← the measure, fixed      │ │               │
│              │   └───────────────────────────┘ │               │
└──────────────┴─────────────────────────────────┴───────────────┘
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| Toolbar | `<header>` | `h-12`, full width, `sticky top-0` | No |
| Tree | `<nav>` | `w-60`, collapses to 0 | Yes, independently |
| Document pane | `<main>` | `flex-1 min-w-0` | **Yes — primary** |
| Document column | `<article>` | `max-w-[46rem] mx-auto px-8` | With the pane |
| Inspector | `<aside>` | `w-80`, collapses to 0 | Yes, independently |

Unlike `app-shell`, the toolbar spans the **full width** above all three columns
rather than sitting inside the content column. Document controls apply to the
document regardless of which panels are open, so they belong above everything.

---

## Structure

```html
<div class="flex h-screen flex-col overflow-hidden bg-background">

  <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
    <!-- panel toggles, breadcrumb, document controls, share, overflow -->
  </header>

  <div class="flex min-h-0 flex-1">

    <nav class="hidden w-60 shrink-0 overflow-y-auto border-r border-border bg-sidebar lg:block">
      <!-- document tree -->
    </nav>

    <main class="min-w-0 flex-1 overflow-y-auto">
      <article class="mx-auto max-w-[46rem] px-8 py-12">
        <!-- title, metadata, body -->
      </article>
    </main>

    <aside class="hidden w-80 shrink-0 overflow-y-auto border-l border-border xl:block">
      <!-- inspector -->
    </aside>

  </div>
</div>
```

Note `min-h-0` on the row wrapper. Without it, the flex child refuses to shrink
below its content height and the inner `overflow-y-auto` never engages — the whole
shell grows instead. Same class of bug as `min-w-0` in `app-shell`, on the other
axis.

---

## Scroll & overflow

| Region | Behaviour |
|---|---|
| `html`, `body` | Never scroll. Root is `h-screen overflow-hidden`. |
| Toolbar | Fixed. May translate out of view on scroll-down and return on scroll-up; it must always return, and must never be permanently dismissible. |
| Tree | `overflow-y-auto`, independent. |
| Document pane | `overflow-y-auto`. The primary scroll region. |
| Inspector | `overflow-y-auto`, independent. |

Anchor links, a table-of-contents jump, and scroll restoration all operate on the
document pane, not on `window`.

Wide content inside the document — tables, code blocks, images — is allowed to
break the measure and extend into the margins, up to `max-w-[60rem]`. This is a
deliberate exception: a code block wrapped to 75 characters is unreadable. Text
never breaks the measure.

---

## Responsive behaviour

| Breakpoint | Tree | Inspector | Document |
|---|---|---|---|
| `< lg` (< 1024px) | Hidden. Opens as a full-height overlay sheet from the left, with a scrim. | Hidden. Opens as an overlay sheet from the right, or moves inline below the document. | `px-4`, measure fills the available width. |
| `lg` – `xl` | Visible at `w-60`. | Hidden, available as an overlay. | `px-8`, `max-w-[46rem]` |
| `≥ xl` (≥ 1280px) | Visible at `w-60`. | Visible at `w-80`. | `px-8`, `max-w-[46rem]` |

Both panels are collapsible at every breakpoint, independently, and the state
persists across sessions. Collapsing both is **focus mode**: toolbar plus document
only. Focus mode is a first-class state of this layout, not an afterthought — it
is why the panels collapse rather than merely resize.

Below `lg`, the document column may fill the viewport width; the measure is a
maximum, not a target.

---

## Navigation model

- **The tree is the navigation.** There is no separate primary nav. The tree
  shows the document hierarchy and supports nesting to three levels — deeper than
  `app-shell` allows, because a document tree genuinely is hierarchical.
- **Within-document navigation** is a table of contents in the inspector, not a
  second tree.
- **Document controls** — save state, history, share, export, mode switches —
  live in the toolbar, right-aligned.
- The current document is indicated in the tree and echoed in the toolbar
  breadcrumb.
- The inspector is contextual: it shows properties of the current selection, or
  of the document when nothing is selected. It is never used for navigation
  between documents.

---

## Slots

| Placeholder in the wireframe | Fill with |
|---|---|
| `<panel toggles>` | Icon `Button`s, ghost variant (`#buttons`) |
| `<breadcrumb>` | `Breadcrumb` (`#breadcrumb`) |
| `<document controls go here>` | Button group and segmented control (`#buttons`, `#tabs`) |
| `<save state>` | Status pill or muted text (`#badges`) |
| `<share / collaborators>` | Avatar group plus a `Button` (`#avatar`, `#buttons`) |
| `<document tree>` | Sidebar nav, three levels (`#nav`) |
| `<tree search>` | Search `Input` (`#inputs`) |
| `<document title>` | h1 from the type scale (`#typography`) |
| `<document metadata>` | Avatar, timestamps, `Badge` (`#avatar`, `#badges`) |
| `<document body>` | Full prose scale — headings, paragraphs, lists, blockquote, code (`#typography`) |
| `<inspector tabs>` | `Tabs` (`#tabs`) |
| `<properties panel>` | Description list and form controls (`#list`, `#inputs`) |
| `<comments / activity>` | Activity feed (`#list`) |

---

## Accessibility

- Landmarks: `<header>` toolbar, `<nav>` tree, `<main>` document pane, `<aside>`
  inspector. Label both `<nav>` and `<aside>`.
- The document body is an `<article>` inside `<main>`, with exactly one `<h1>` —
  the document title. Body headings start at `<h2>`.
- The skip link targets the document pane, not the tree. Readers want the content;
  the tree is the thing to skip.
- Focus order: toolbar → tree → document → inspector.
- The tree is a `role="tree"` with `treeitem` children, `aria-expanded` on
  branches, and roving `tabindex` so arrow keys move within it and `Tab` leaves it.
  A tree that traps `Tab` on every node is unusable with a keyboard.
- Panel toggles are `aria-expanded` buttons controlling the panel by `aria-controls`.
- Overlay panels below `lg` are modal dialogs: trap focus, close on `Escape`,
  restore focus to the trigger.

---

## Never

1. **Never widen the text measure past ~80 characters.** Extra width goes to the
   margins or to a panel, never to longer lines.
2. **Never let the page scroll as a whole.** The document pane scrolls; the shell
   does not.
3. **Never omit `min-h-0` on the row wrapper**, or the inner scroll panes will not
   engage.
4. **Never put the toolbar inside the document column.** It spans all three
   regions, because its controls apply to the document regardless of panel state.
5. **Never make the inspector non-collapsible.** Focus mode depends on both panels
   collapsing to nothing.
6. **Never use the inspector for navigation between documents.** That is the
   tree's job, and splitting navigation across two panels means the user has to
   learn which lives where.
7. **Never nest the document tree more than three levels deep** in the visible
   default state. Deeper branches collapse.
8. **Never let the toolbar be permanently dismissed.** It may hide on scroll-down,
   but it always returns on scroll-up.
