# Layout: `centered-doc`

**Read [`../README.md`](../README.md) first.** It explains how this layout's
`index.html` wireframe is meant to be used alongside this file.

> Single-column centered document. The page scrolls as a whole; no viewport-locking.

**Suits:** galleries, documentation indexes, settings pages, tab-organised landing
pages, any page where document-style reading is the primary mode and persistent
application chrome is not required.

**Does not suit:** app-like surfaces needing a persistent sidebar (use `app-shell`),
three-pane views (use `split-inbox`), or heavy editing surfaces (use
`document-editor`). If the page has complex navigation that must never scroll away,
reach for `app-shell` instead.

---

## The defining decision

**The page scrolls as a whole.** There is no viewport-locked shell, no independent
scroll panes. `html` and `body` scroll freely. This is the baseline "just a web
page" model that the other layouts deliberately diverge from.

The constraint that makes it a distinct layout (rather than "no layout") is the
**max-width column**: all content is wrapped in a container with `max-w-4xl` (or
similar) and `mx-auto`, so it reads like a document at any viewport width. Wide
viewports show symmetric gutters; narrow viewports show small padding only.

The optional **sticky site header** is the one piece of fixed chrome. Without it,
the page is entirely document-mode with no persistent UI at all.

Consequences an implementer discovers the hard way:

- Sticky elements inside the page resolve against `window`, not a scroll pane.
  Use `top-0` for a header-less page; use `top-14` (or `scroll-margin-top: 3.5rem`)
  if the site header is `h-14` and sticky.
- Anchor links and scroll restoration operate on `window`.
- Tab panels that conditionally show/hide content will resize the page height,
  which can cause scroll jumps. Use `min-h` on the panel container if the content
  varies dramatically in length.

---

## Region map

```
┌────────────────────────────────────────────────────────────┐  ← viewport edge
│ Site header · h-14 · sticky top-0 · full width            │
│ (optional — omit for fully self-contained pages)           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│         ┌──────────────────────────────────┐              │
│         │  max-w-4xl · mx-auto · w-full     │              │
│         │  px-4 sm:px-6                     │              │
│         │                                   │              │
│         │  ┌─────────────────────────────┐  │              │
│         │  │ Page header                 │  │              │
│         │  │ h1 + optional lede          │  │              │
│         │  └─────────────────────────────┘  │              │
│         │                                   │              │
│         │  ┌─────────────────────────────┐  │              │
│         │  │ Tab bar (optional)          │  │              │
│         │  │ underline tabs · full width  │  │              │
│         │  └─────────────────────────────┘  │              │
│         │                                   │              │
│         │  ┌─────────────────────────────┐  │              │
│         │  │ Primary content             │  │              │
│         │  │ (tab panel or direct body)  │  │              │
│         │  │                             │  │              │
│         │  │                             │  │              │
│         │  └─────────────────────────────┘  │              │
│         │                                   │              │
│         └──────────────────────────────────┘              │
│                                                            │
└────────────────────────────────────────────────────────────┘  ← page bottom
        ↑ page scrolls as a whole — no scroll panes
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| Site header | `<header>` | `h-14`, `sticky top-0` | No — sticky at viewport top |
| Page wrap | `<main>` | `max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12` | With the page |
| Page header | `<div>` | Auto height | With the page |
| Tab bar | `<nav>` | Auto height | With the page |
| Tab panel / content | `<section>` | Expands to content | With the page |

---

## Structure

```html
<body class="min-h-screen bg-background text-foreground">

  <!-- Skip link — must be first focusable element -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 ...">
    Skip to main content
  </a>

  <!-- Site header — sticky, optional. Omit for fully self-contained pages. -->
  <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-border bg-background px-4 sm:px-6">
    <!-- brand / logo -->
    <div class="mr-auto flex items-center gap-2">
      <!-- logo, app name -->
    </div>
    <!-- global nav links (hidden on mobile, shown sm+) -->
    <nav aria-label="Site navigation" class="hidden gap-6 sm:flex">
      <!-- text links -->
    </nav>
    <!-- global actions -->
    <div class="ml-auto flex items-center gap-2">
      <!-- icon buttons: notifications, account, etc. -->
    </div>
  </header>

  <!-- Single centred column — the whole layout -->
  <main id="main-content" tabindex="-1"
        class="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">

    <!-- Page header: h1 + optional lede -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">Page title</h1>
      <p class="mt-2 max-w-[60ch] text-muted-foreground">
        Optional subtitle or lede. Keep it short.
      </p>
    </div>

    <!-- Tab bar — omit entirely when the page has no sections -->
    <nav aria-label="Page sections">
      <div role="tablist"
           class="flex gap-0 border-b border-border -mb-px">
        <button role="tab" id="tab-a" aria-selected="true"
                aria-controls="panel-a"
                class="border-b-2 border-primary pb-2 pr-4 font-semibold text-foreground">
          Tab A
        </button>
        <button role="tab" id="tab-b" aria-selected="false"
                aria-controls="panel-b"
                class="border-b-2 border-transparent pb-2 px-4 text-muted-foreground">
          Tab B
        </button>
      </div>
    </nav>

    <!-- Tab panel / primary content -->
    <section id="panel-a" role="tabpanel" aria-labelledby="tab-a"
             class="pt-6 sm:pt-8">
      <!-- Cards, lists, tables, forms — whatever the section needs -->
    </section>

    <section id="panel-b" role="tabpanel" aria-labelledby="tab-b"
             class="pt-6 sm:pt-8 hidden">
      <!-- Second tab content -->
    </section>

  </main>

</body>
```

**Load-bearing details:**

- `max-w-4xl` (56rem) is the default column width. Adjust to `max-w-3xl` (48rem) for
  dense reading text, or `max-w-5xl` (64rem) for grid-heavy pages.
- `tabindex="-1"` on `<main>` is required so the skip link can land focus there.
- `border-b -mb-px` on the tab list creates the standard underline-tab effect without
  a double border. The active tab uses `border-primary`; inactive tabs use
  `border-transparent`.
- If the site header is sticky at `h-14`, any in-page anchor targets need
  `scroll-margin-top: 3.5rem` to avoid being obscured.

---

## Scroll & overflow

**The page scrolls as a whole.** There are no independent scroll panes.

| Region | Behaviour |
|---|---|
| `html`, `body` | Scroll freely. No height or overflow constraints. |
| Site header | `sticky top-0`. Content below it scrolls under it. |
| Page wrap | Expands to content height. No overflow constraint. |
| Tab panel | Expands to content height. Switching tabs may resize the page. |

Wide content (tables, code blocks, images) must wrap in `overflow-x-auto` so they
scroll horizontally inside the column. The page itself never scrolls horizontally.

---

## Responsive behaviour

| Breakpoint | Site header | Column | Padding |
|---|---|---|---|
| `< sm` (< 640px) | Full width, `h-14`. Nav links collapse to a hamburger or are hidden. | `max-w-full` (viewport-wide until `max-w-4xl` applies). | `px-4 py-8` |
| `sm` – `lg` (640px – 1024px) | Full width, `h-14`. Nav links visible. | Centering becomes visible as viewport widens past 56rem. | `px-6 py-12` |
| `≥ lg` (≥ 1024px) | Full width, `h-14`. | `max-w-4xl` fully centred with symmetric gutters. | `px-6 py-12` |

The column never gains a horizontal scrollbar — it reflows. Touch targets are at
least 44px tall on all breakpoints.

---

## Navigation model

- **Primary navigation** lives in the site header (when present): brand, top-level
  links, global actions (search, account).
- **Section navigation** is the tab bar inside the page column. Tabs switch between
  logical sections of the same page; they do not navigate to different URLs by
  default (though they can use `#anchor` URLs for deep-linkability).
- There is no sidebar navigation. If persistent sidebar navigation is needed, use
  `app-shell`.
- The current tab is indicated with an underline plus `text-foreground`. Never use a
  background fill for the active tab — that reads as a button group, not a tab.

---

## Slots

| Placeholder in the wireframe | Fill with |
|---|---|
| `<brand / logo>` | Logo mark and/or app name |
| `<global nav links>` | Text links or icon buttons in the site header |
| `<global actions>` | Icon `Button`s — notifications, account, theme toggle |
| `<page title>` | One `<h1>` — exactly one per page |
| `<page subtitle / lede>` | `<p class="text-muted-foreground">`, `max-w-[60ch]` |
| `<tabs for different sections>` | Underline `Tabs` (`#tabs` in the design's kitchen sink) |
| `<primary content>` | `Card`, `List`, `Table`, `Form` — whatever the tab panel needs (`#card`, `#table`, `#list`, `#form`) |

---

## Accessibility

- One `<h1>` per page, in the page header. If a tab panel feels like it needs its
  own `<h1>`, it is a separate page.
- Skip link is the first focusable element, targeting `<main id="main-content">`
  with `tabindex="-1"`.
- `<header>` wraps the site header; `<main>` wraps the column. No other landmark
  elements are needed for this layout.
- Tab bar uses `role="tablist"` / `role="tab"` / `role="tabpanel"` with matching
  `aria-controls` / `aria-labelledby`. The active tab has `aria-selected="true"`;
  all others have `aria-selected="false"`.
- Arrow keys move focus between tabs; `Enter` / `Space` activates the focused tab.
  Tab panels are shown/hidden immediately on activation.
- If the site header is sticky at `h-14`, in-page anchor targets need
  `scroll-margin-top: 3.5rem` (56px) so focus is not hidden behind the header.
- Never use `tabindex` > 0. Never reorder the DOM for visual reasons.

---

## Never

1. **Never viewport-lock the page.** No `h-screen overflow-hidden` on `body`. If the
   page must not scroll, use `app-shell`.
2. **Never create horizontal scrolling on the page.** Wide content scrolls inside its
   own `overflow-x-auto` container.
3. **Never use more than one `<h1>` per page.** The `<h1>` lives in the page header,
   not inside a tab panel.
4. **Never add a sidebar.** This layout has no sidebar. If persistent sidebar
   navigation is needed, use `app-shell`.
5. **Never use a background fill to show the active tab.** The active state is
   underline + colour change only.
