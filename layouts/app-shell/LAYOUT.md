# Layout: `app-shell`

> Viewport-locked application shell. Fixed sidebar, fixed top bar, one scrolling
> content pane.

**Suits:** dashboards, admin consoles, CRUD tools, settings areas, anything with
persistent navigation and a page-per-route structure.

**Does not suit:** marketing pages (nothing is viewport-locked there), long-form
reading, or editors that need a full-bleed canvas. For a document surface with
side rails, use `document-editor`.

---

## The defining decision

**The page itself never scrolls.** The shell is pinned to the viewport at
`h-screen overflow-hidden`, and the content pane scrolls independently inside it.

This is the choice that separates an app shell from a normal page with a sticky
header, and it is invisible in a screenshot — which is why it gets implemented
wrong so often. The consequences are worth being explicit about:

- The sidebar never scrolls away, so navigation is always one click away.
- The sidebar gets its *own* scrollbar when its content is taller than the
  viewport. Nested navigation trees hit this quickly.
- `position: sticky` inside the content pane resolves against the **pane**, not
  the viewport. A sticky table header sticks to the top of the pane. This is what
  you want, but it means `top-0` is correct and `top-14` (offsetting for the top
  bar) is wrong.
- Anchor links and scroll restoration operate on the pane, not `window`.

---

## Region map

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar    │ Topbar                                     │
│ w-64       ├────────────────────────────────────────────┤
│ fixed      │ Content                                    │
│ own scroll │ flex-1 min-w-0                             │
│            │ overflow-y-auto  ← the only scroll region  │
│            │                                            │
│ ┌────────┐ │  ┌──────────────────────────────────────┐  │
│ │ Footer │ │  │ Page header (optional sticky)        │  │
│ └────────┘ │  ├──────────────────────────────────────┤  │
│            │  │ Page body       │ Right rail (opt.)  │  │
│            │  │ flex-1          │ w-72 · own scroll  │  │
└─────────────────────────────────────────────────────────┘
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| Sidebar | `<aside>` | `w-64` fixed, `w-14` collapsed | Yes, independently |
| Sidebar footer | `<div>` | Auto height, pinned bottom via `mt-auto` | No |
| Top bar | `<header>` | `h-14` fixed | No |
| Content pane | `<main>` | `flex-1 min-w-0` | **Yes — the primary scroll region** |
| Page header | `<div>` | Auto, optionally `sticky top-0` | With the pane |
| Page body | `<div>` | `flex-1 min-w-0`, `max-w-7xl mx-auto` | With the pane |
| Right rail | `<aside>` | `w-72` fixed | Yes, independently |

---

## Structure

```html
<div class="flex h-screen overflow-hidden bg-background">

  <!-- Sidebar — fixed width, own scroll -->
  <aside class="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
    <div class="flex h-14 shrink-0 items-center px-4">
      <!-- brand / workspace switcher -->
    </div>
    <nav class="flex-1 overflow-y-auto px-2 py-2">
      <!-- primary navigation -->
    </nav>
    <div class="mt-auto shrink-0 border-t border-sidebar-border p-2">
      <!-- user menu -->
    </div>
  </aside>

  <!-- Everything right of the sidebar -->
  <div class="flex min-w-0 flex-1 flex-col">

    <header class="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <!-- mobile menu trigger, breadcrumb, search, actions -->
    </header>

    <!-- THE scroll region -->
    <main class="flex-1 overflow-y-auto">
      <div class="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <div class="min-w-0 flex-1">
          <!-- page header + page body -->
        </div>
        <aside class="hidden w-72 shrink-0 xl:block">
          <!-- contextual rail -->
        </aside>
      </div>
    </main>

  </div>
</div>
```

`min-w-0` on the flex children is load-bearing. Without it, a wide table or a long
unbroken string blows the content pane past the viewport and produces a horizontal
scrollbar on the whole shell. This is the single most common bug in this layout.

---

## Scroll & overflow

| Region | Behaviour |
|---|---|
| `html`, `body` | Never scroll. The root is `h-screen overflow-hidden`. |
| Sidebar nav | `overflow-y-auto`. Brand and footer are `shrink-0` and stay put. |
| Top bar | Never scrolls, never moves. |
| Content pane | `overflow-y-auto`. The primary scroll region. |
| Right rail | `overflow-y-auto` independently when it exceeds the pane height. |

Sticky elements inside the content pane use `top-0`, not an offset — they resolve
against the pane, which already begins below the top bar.

Wide content (tables, code blocks, diagrams) must scroll inside its own
`overflow-x-auto` container. The shell itself never scrolls horizontally.

---

## Responsive behaviour

| Breakpoint | Sidebar | Right rail | Content |
|---|---|---|---|
| `< md` (< 768px) | Hidden. Replaced by a hamburger in the top bar that opens it as a full-height overlay sheet with a scrim. | Hidden. Its content moves inline, below the page body. | Gutter drops to `px-4`, vertical to `py-6`. |
| `md` – `lg` | Collapsed to a `w-14` icon rail. Labels appear on hover as tooltips. | Hidden. | `px-6` |
| `lg` – `xl` | Full `w-64`. | Hidden. | `px-6`, `max-w-7xl` |
| `≥ xl` (≥ 1280px) | Full `w-64`. | Visible at `w-72`. | `px-6`, `max-w-7xl` |

Touch targets grow to 44px below `md`. Below `md` the shell may relax to normal
document scrolling if the mobile design calls for it — a viewport-locked shell on a
phone fights the browser's own URL-bar behaviour.

---

## Navigation model

- **Primary navigation** lives in the sidebar. One level of nesting, maximum.
- **Secondary navigation** — the sections of the current page — is a tab bar in the
  page header, not a second sidebar level.
- **Contextual actions** live in the page header, right-aligned, with exactly one
  primary button.
- **Global actions** — search, notifications, account — live in the top bar.
- The current location is shown twice: the active sidebar item, and the breadcrumb
  in the top bar. These must agree.

---

## Slots

| Placeholder in the wireframe | Fill with |
|---|---|
| `<brand / workspace switcher>` | Logo mark plus a `DropdownMenu` (`#menu`) |
| `<primary navigation>` | Sidebar nav from `#nav` |
| `<user menu>` | `Avatar` (`#avatar`) plus a `DropdownMenu` (`#menu`) |
| `<breadcrumb>` | `Breadcrumb` (`#breadcrumb`) |
| `<global search>` | Search `Input`, opening the command palette (`#menu`) |
| `<global actions>` | Icon `Button`s with counter `Badge` (`#badges`) |
| `<page header>` | Page header section (`#page-header`) |
| `<tabs for different sections>` | Underline `Tabs` (`#tabs`) |
| `<primary content>` | `Card`, `Table`, `List`, or `Form` (`#card`, `#table`, `#list`, `#form`) |
| `<contextual rail>` | Stat cards, activity feed, or a description list (`#card`, `#list`) |

---

## Accessibility

- Landmarks: `<aside>` sidebar, `<header>` top bar, `<main>` content pane,
  `<aside>` right rail. Give each `<aside>` an `aria-label`.
- The skip link targets `<main>` and must be the first focusable element.
- `<main>` needs `tabindex="-1"` so the skip link can move focus into it.
- Exactly one `<h1>` per page, in the page header.
- Focus order follows DOM order: sidebar → top bar → content → right rail. This
  matches visual order left-to-right, so no `tabindex` reordering is needed. Do not
  move the right rail earlier in the DOM for styling reasons.
- The mobile sidebar overlay is a modal dialog: trap focus, close on `Escape`,
  return focus to the trigger, and mark the background `inert`.

---

## Never

1. **Never let the page scroll as a whole.** If `body` scrolls, this is not an app
   shell.
2. **Never omit `min-w-0`** on the flex children between the shell and the content.
3. **Never offset a sticky element inside the content pane for the top bar.** The
   pane already starts below it.
4. **Never nest sidebar navigation more than one level deep.** Deeper hierarchies
   become a page, not a menu.
5. **Never put primary navigation in the right rail.** The right rail is contextual
   and disappears below `xl` — navigation cannot live somewhere that vanishes.
6. **Never place more than one primary button in the page header.**
7. **Never let the shell scroll horizontally.** Wide content gets its own
   `overflow-x-auto` container.
