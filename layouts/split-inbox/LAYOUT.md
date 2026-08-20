# Layout: `split-inbox`

**Read [`../README.md`](../README.md) first.** It explains how this layout's
`index.html` wireframe is meant to be used alongside this file.

> Three-pane list-detail layout with independent scroll regions. Left folder rail,
> middle item list, right detail pane. Viewport-locked shell with a navigation-stack
> transformation on mobile.

**Suits:** email clients, support ticket systems, message inboxes, log viewers,
notification centers, file browsers, any list-detail interface where items have
substantial preview content and full detail views.

**Does not suit:** dashboards (use `app-shell`), long-form document editing (use
`document-editor`), single-list interfaces without detail views, or anything that
doesn't have a natural left-to-right drill-down flow.

---

## The defining decision

**The page itself never scrolls, and all three panes scroll independently.** The
shell is viewport-locked at `h-screen overflow-hidden`. The left rail scrolls when
the folder list is long. The middle list scrolls through items. The right detail
pane scrolls through the selected item's content. Each scroll region is isolated.

**On mobile, the panes do not merely collapse or stack — they become a navigation
stack.** At widths below `md` (768px), the user sees the list as a full page. Tapping
an item transitions to the detail view as a new page with a back button. The list's
scroll position is preserved when navigating back. This is the behaviour an
implementer will otherwise get wrong: the layout requires actual view routing, not
just responsive CSS.

This is the critical structural distinction from `app-shell`: that layout has one
scrolling content area with optional side rails. This layout has three
*peer* scroll regions, none of which is subordinate to the others.

---

## Region map

```
┌──────────────────────────────────────────────────────────────────┐
│ Rail        │ List                  │ Detail                     │
│ w-56        │ w-80 – w-96          │ flex-1 min-w-0             │
│ folders/    │ item previews         │ selected item content      │
│ filters     │                       │                            │
│             │ ┌──────────────────┐  │ ┌────────────────────────┐ │
│ ┌─────────┐ │ │ Header (search)  │  │ │ Sticky header          │ │
│ │ scroll  │ │ └──────────────────┘  │ │ (item-level actions)   │ │
│ │         │ │ ┌──────────────────┐  │ └────────────────────────┘ │
│ │         │ │ │ Item (multi-line)│← selected                     │
│ │         │ │ │ sender·subject   │  │ ┌────────────────────────┐ │
│ │         │ │ │ preview·time     │  │ │                        │ │
│ │         │ │ ├──────────────────┤  │ │ Detail scroll region   │ │
│ │         │ │ │ Item             │  │ │                        │ │
│ └─────────┘ │ │                  │  │ │                        │ │
│             │ │                  │  │ └────────────────────────┘ │
│             │ └──────────────────┘  │                            │
│             │ scroll ↕              │ scroll ↕                   │
└──────────────────────────────────────────────────────────────────┘
  scroll ↕
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| Left rail | `<aside>` | `w-56` fixed | Yes, independently |
| List header | `<div>` | `h-14` sticky top-0 in list | No, stays at top of list |
| List pane | `<div>` | `w-80` sm, `w-96` lg | **Yes, independently** |
| List items | `<div>` repeating | Auto height, multi-line | With the list pane |
| Detail header | `<header>` | `h-14` sticky top-0 in detail | No, stays at top of detail |
| Detail pane | `<main>` | `flex-1 min-w-0` | **Yes, independently** |
| Detail body | `<div>` | Auto, `max-w-4xl mx-auto` | With the detail pane |

---

## Structure

```html
<div class="flex h-screen overflow-hidden bg-background">

  <!-- LEFT RAIL — folders, filters, tags -->
  <aside class="hidden w-56 shrink-0 flex-col border-r border-border bg-muted/30 md:flex">
    <div class="flex h-14 shrink-0 items-center border-b border-border px-4">
      <!-- workspace / account switcher -->
    </div>
    <nav class="flex-1 overflow-y-auto px-3 py-3">
      <!-- folder tree: Inbox, Sent, Drafts, Archive, labels, filters -->
    </nav>
    <div class="shrink-0 border-t border-border p-3">
      <!-- storage quota, settings link -->
    </div>
  </aside>

  <!-- MIDDLE — item list with header -->
  <div class="flex w-full flex-col border-r border-border md:w-80 lg:w-96">
    <!-- List header: sticky search, filter, sort -->
    <div class="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <!-- mobile: back-to-rail button -->
      <!-- search input -->
      <!-- view/sort controls -->
    </div>

    <!-- List scroll region -->
    <div class="flex-1 overflow-y-auto">
      <!-- Each item: multi-line row with sender, subject, preview, timestamp, selection state -->
      <div class="border-b border-border px-4 py-3 hover:bg-muted/50 cursor-pointer">
        <div class="flex items-start justify-between gap-2">
          <span class="font-medium text-sm">Sender name</span>
          <span class="text-xs text-muted-foreground">2m ago</span>
        </div>
        <div class="text-sm font-medium mt-0.5">Subject line</div>
        <div class="text-sm text-muted-foreground mt-1 line-clamp-2">Preview of the first couple lines of content...</div>
      </div>
      <!-- Item rows repeat. Selected item gets bg-accent/10 or a border-l-4. -->
    </div>
  </div>

  <!-- RIGHT — detail pane for selected item -->
  <main class="hidden flex-1 flex-col md:flex">
    <!-- Detail header: sticky actions for the current item -->
    <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-6">
      <div class="flex items-center gap-2">
        <!-- archive, delete, mark unread, move, label -->
      </div>
      <div class="flex items-center gap-2">
        <!-- reply, forward, more -->
      </div>
    </header>

    <!-- Detail scroll region -->
    <div class="flex-1 overflow-y-auto">
      <div class="mx-auto max-w-4xl px-6 py-6">
        <!-- Item metadata: from, to, subject, timestamp -->
        <!-- Item body -->
        <!-- Attachments, thread history, etc. -->
      </div>
    </div>
  </main>

</div>
```

**Load-bearing classes:**

- `min-w-0` on the detail pane: prevents a wide table or long unbroken string from
  blowing the flex layout past the viewport.
- `overflow-hidden` on the root: the page itself never scrolls.
- `flex-1` + `overflow-y-auto` on each of the three scroll regions: establishes
  independent scroll contexts.
- `shrink-0` on the rail and list: they are fixed-width; only the detail pane flexes.

---

## Scroll & overflow

**The page itself never scrolls.** The root is `h-screen overflow-hidden`.

| Region | Behaviour |
|---|---|
| `html`, `body` | Never scroll |
| Left rail nav | `overflow-y-auto` — scrolls when folder tree is taller than viewport |
| List pane | `overflow-y-auto` — **primary list scroll region** |
| Detail pane | `overflow-y-auto` — **primary detail scroll region** |

**Sticky elements:**

- List header (search/filter): `sticky top-0` within the list pane, not the viewport.
  Uses `top-0` because it resolves against its scroll container.
- Detail header (item actions): `sticky top-0` within the detail pane. Also `top-0`.

**Wide content:**

- In the detail pane, wide tables or code blocks must use their own `overflow-x-auto`
  wrapper. The panes never scroll horizontally.
- List items are fixed width and must truncate or wrap.

**Scroll preservation on mobile:**

When navigating from the list to the detail view on mobile, the list's scroll
position must be preserved (either via CSS `content-visibility`, view transitions,
or routing state). This is not automatic and must be implemented explicitly.

---

## Responsive behaviour

| Breakpoint | Left rail | List | Detail | Navigation model |
|---|---|---|---|---|
| `< md` (< 768px) | Hidden. Access via a slide-out overlay triggered by a ☰ in the list header. | Full width. **This is the landing view.** | Hidden until an item is tapped, then slides in as a new view with a back button in its header. | **Navigation stack.** List → Detail (forward), Detail → List (back). List scroll preserved. |
| `md` – `lg` (768–1024px) | Hidden (or collapsed to icon-only `w-14`). | Visible at `w-80`. Selected item highlighted. | Visible, takes remaining width. When nothing is selected, shows an empty state ("Select a message"). | Standard three-pane. Clicking an item in the list updates the detail pane in place. |
| `≥ lg` (1024px+) | Visible at `w-56`. | Visible at `w-96` (wider for better preview). | Visible, `flex-1`. | Standard three-pane. |

**Multi-select state (all widths):**

When multiple items are selected (via checkboxes or shift-click), the detail pane
shows a multi-item actions toolbar: "3 items selected · Archive · Delete · Mark
read · Move to…". On mobile, this appears as a sticky footer bar instead of
replacing the detail view.

**Empty state (no selection, md and up):**

The detail pane shows a centered placeholder:
- Icon (envelope or inbox illustration)
- "Select a message to read"
- Optional: keyboard shortcut hints

**Empty state (no items in list):**

The list pane shows:
- "No messages in [folder name]"
- Optional: illustration, CTA to compose

---

## Navigation model

- **Folder navigation** (left rail): clicking a folder updates the list pane to show
  that folder's items. The detail pane clears (shows empty state) unless the
  implementation preserves selected-item state across folders.
- **Item selection** (middle → right): clicking an item in the list shows its detail
  in the right pane. On mobile, this is a forward navigation.
- **Back navigation** (mobile only): the detail view's back button returns to the
  list with scroll position preserved.
- **Multi-select**: checkboxes in the list allow batch actions. The detail pane is
  replaced by a bulk-actions toolbar.

At `md` and up, the URL should encode the folder and selected item so that
refreshing or sharing the URL restores the full three-pane state. On mobile, the
URL encodes whether the user is viewing the list or the detail.

---

## Slots

| Placeholder | Fill with |
|---|---|
| `<workspace / account switcher>` | Avatar button (#avatar) or a Popover (#popover) with account list |
| `<folder tree>` | Navigation links (#navigation-links), optionally in a Collapsible (#collapsible) tree structure |
| `<storage quota>` | Progress bar (#progress) + small text |
| `<search input>` | Input with search icon (#inputs) |
| `<view/sort controls>` | Button group or Segmented control (not in shared spec, but Button group works) |
| `<sender, subject, preview>` | Text primitives. Preview uses `line-clamp-2` utility. |
| `<timestamp>` | Small muted text |
| `<archive, delete, mark unread, move, label>` | Button (#buttons) with icons, ghost or outline variant |
| `<reply, forward, more>` | Button, default or outline, with icons |
| `<item metadata>` | Text primitives, Avatar (#avatar), Badge (#badge) for labels |
| `<item body>` | Prose: Typography (#typography) styles, potential for Alert (#alert), Separator (#separator) |
| `<attachments>` | Card (#card) or custom attachment-pill component |
| `<empty state>` | Icon + heading + muted paragraph |

---

## Accessibility

- **Landmarks:**
  - Left rail: `<aside aria-label="Folders">`
  - List: `<div role="region" aria-label="Message list">` (or a `<nav>` if the items are navigation targets)
  - Detail: `<main aria-label="Message detail">`
- **Heading hierarchy:**
  - Each pane starts its own heading subtree. The list header might have an `h2`
    for the folder name. The detail pane's subject is an `h1`.
- **Skip link target:** The detail pane (`<main>`), since that is where the primary
  content lives.
- **Focus order:**
  - At `md` and up: left rail → list → detail, top to bottom in each.
  - On mobile list view: search → list items.
  - On mobile detail view: back button → detail actions → detail body.
- **Keyboard navigation:**
  - Arrow keys to navigate the list (up/down).
  - Enter to open the selected item's detail.
  - Escape to deselect or return to the list (mobile).
  - `j`/`k` for next/previous (optional, but common in mail clients).
- **Screen reader:**
  - List items announce "selected" or "unselected" state.
  - Detail pane announces the subject and sender when a new item loads.
  - Empty state in the detail pane is not hidden; it has real text and is read aloud.

---

## Never

1. **Never let the whole page scroll.** The shell is viewport-locked. Each pane
   scrolls independently. If `html` or `body` has a scrollbar, the layout is broken.

2. **Never make the list or detail pane a fixed pixel height at small widths.** They
   must be `flex-1` so they fill the viewport minus the headers. A `h-96` list on a
   phone wastes the screen.

3. **Never hide the mobile navigation model behind responsive CSS alone.** The list
   and detail views are distinct routes (or at least distinct view states with proper
   back-button handling). Trying to achieve this with `hidden md:block` and z-index
   will produce a layout that looks right but doesn't navigate right.

4. **Never let selected state in the list and visible state in the detail pane
   desync.** If item 5 is highlighted in the list, item 5 is what the detail pane
   shows. If nothing is selected, the detail pane shows the empty state, not a
   stale previous item.

5. **Never make the list items single-line.** The preview must be visible — sender,
   subject, and a two-line preview is the minimum. This is what distinguishes an
   inbox from a plain file tree.

6. **Never forget to preserve scroll position on mobile.** When the user taps an
   item, views the detail, and navigates back, the list must return to the same
   scroll offset. This is not automatic and must be implemented explicitly (via
   CSS `content-visibility`, view transitions, or routing state).
