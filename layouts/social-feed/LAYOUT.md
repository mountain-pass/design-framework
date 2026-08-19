# Layout: `social-feed`

> Three-column viewport-locked social media layout. Fixed top nav, fixed sidebars,
> scrolling center feed with constrained max-width content.

**Suits:** social feeds, activity streams, news feeds, community platforms,
discussion boards, content discovery apps — anywhere users consume a stream of
posts or updates with persistent navigation and contextual content on the sides.

**Does not suit:** dashboards (use `app-shell`), document editors (use
`document-editor`), email/messaging (use `split-inbox`), marketing pages (not
viewport-locked), or admin interfaces.

---

## The defining decision

**Viewport-locked shell with three independent scroll regions.** The page never
scrolls as a whole. Instead:

- The **top navigation bar** is fixed to the viewport top and never scrolls away
- The **left sidebar** scrolls independently for its navigation items
- The **center feed** is the primary scroll region with constrained-width content
- The **right sidebar** scrolls independently for widgets and suggestions

**Crucially:** the center feed content has a **max-width constraint** (e.g.
`max-w-2xl mx-auto`) so posts/cards don't stretch uncomfortably wide on large
screens. This is what makes it a feed layout rather than a generic three-column
shell.

This layout is designed for continuous vertical scrolling through a stream of
content items (posts, stories, updates) while keeping navigation and contextual
information always visible.

---

## Region map

```
┌────────────────────────────────────────────────────────────────┐
│ Top Navigation Bar · h-14 · sticky top-0 · never scrolls       │
├────────────┬─────────────────────────────┬─────────────────────┤
│ Left       │ Center Feed                 │ Right Sidebar       │
│ Sidebar    │ flex-1 min-w-0              │ w-80 · fixed        │
│ w-64       │ overflow-y-auto             │ overflow-y-auto     │
│ fixed      │ PRIMARY SCROLL              │ own scroll          │
│ own scroll │                             │                     │
│            │ ┌─────────────────────────┐ │                     │
│            │ │ Feed Item (max-w-2xl)   │ │  ┌───────────────┐  │
│            │ │ centered with mx-auto   │ │  │ Widget        │  │
│            │ └─────────────────────────┘ │  └───────────────┘  │
│            │ ┌─────────────────────────┐ │  ┌───────────────┐  │
│            │ │ Feed Item               │ │  │ Suggestions   │  │
│            │ └─────────────────────────┘ │  └───────────────┘  │
│            │                             │                     │
└────────────┴─────────────────────────────┴─────────────────────┘
```

| Region | Element | Size | Scrolls |
|---|---|---|---|
| Top nav bar | `<header>` | `h-14` or `h-16` fixed, full width | No — sticky `top-0` |
| Left sidebar | `<aside>` | `w-64` fixed | Yes, independently |
| Center feed | `<main>` | `flex-1 min-w-0` | **Yes — primary scroll** |
| Feed content wrapper | `<div>` | `max-w-2xl mx-auto` constrained | With the feed |
| Right sidebar | `<aside>` | `w-80` fixed | Yes, independently |

---

## Structure

```html
<div class="flex h-screen flex-col overflow-hidden bg-background">

  <!-- Top Navigation Bar — sticky, never scrolls -->
  <header class="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
    <!-- brand/logo -->
    <div class="flex items-center gap-2">
      <!-- logo -->
    </div>
    
    <!-- primary navigation tabs -->
    <nav class="flex flex-1 items-center justify-center gap-6">
      <!-- Home, Chats, Events, etc. -->
    </nav>
    
    <!-- user controls -->
    <div class="flex items-center gap-3">
      <!-- notifications, settings, user avatar -->
    </div>
  </header>

  <!-- Three-column layout below the top bar -->
  <div class="flex min-h-0 flex-1 overflow-hidden">

    <!-- Left Sidebar — fixed width, own scroll -->
    <aside class="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <nav class="flex-1 overflow-y-auto p-4">
        <!-- navigation items, story list, channel switcher -->
      </nav>
    </aside>

    <!-- Center Feed — primary scroll region with constrained content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Content wrapper with max-width constraint -->
      <div class="mx-auto max-w-2xl px-4 py-6">
        <!-- Feed items: posts, stories, updates -->
        <div class="space-y-4">
          <!-- individual feed cards -->
        </div>
      </div>
    </main>

    <!-- Right Sidebar — fixed width, own scroll, hidden below lg -->
    <aside class="hidden w-80 shrink-0 flex-col border-l border-border bg-background lg:flex">
      <div class="flex-1 overflow-y-auto p-4">
        <!-- notifications, suggestions, trending, widgets -->
      </div>
    </aside>

  </div>
</div>
```

**Critical details:**

- `min-h-0` on the three-column flex container allows proper overflow handling
- `flex-1 min-w-0` on the center feed is load-bearing — without `min-w-0`, wide
  content breaks the layout
- The **max-width wrapper inside the feed** (`max-w-2xl mx-auto`) keeps posts
  readable — this is what distinguishes a feed from a generic content pane
- Each sidebar uses `overflow-y-auto` independently
- `sticky top-0` on the header keeps it visible during feed scroll

---

## Scroll & overflow

| Region | Behaviour |
|---|---|
| `html`, `body` | Never scroll. Root is `h-screen overflow-hidden`. |
| Top nav bar | Never scrolls. Fixed at `sticky top-0`. |
| Left sidebar | `overflow-y-auto` independently when content exceeds viewport. |
| Center feed (`<main>`) | **Primary scroll region** — `overflow-y-auto`. This is where users scroll through content. |
| Feed content wrapper | Scrolls with the feed, constrained to `max-w-2xl`. |
| Right sidebar | `overflow-y-auto` independently. |

**Feed items** are centered within the feed's scroll container via `max-w-2xl
mx-auto` on the wrapper. On ultra-wide screens, the feed content stays readable
rather than stretching to fill the entire center column.

Wide embedded content (images, videos) should respect the max-width. If an item
needs to break out (like a full-width banner), it must do so explicitly.

---

## Responsive behaviour

| Breakpoint | Top nav | Left sidebar | Center feed | Right sidebar |
|---|---|---|---|---|
| `< md` (< 768px) | Full-height, hamburger menu reveals left sidebar as overlay | Hidden. Opens as full-screen overlay via hamburger trigger in top nav. | Full width, padding reduced to `px-4`, feed max-width may reduce to `max-w-full` or `max-w-lg`. | Hidden completely. Content omitted or moved inline at bottom of feed. |
| `md` – `lg` (768–1024px) | Same | Appears as collapsed icon-only rail at `w-14` OR remains hidden with hamburger access. | Main column, `px-4` or `px-6`. | Still hidden. |
| `≥ lg` (≥ 1024px) | Same | Full `w-64` with labels. | Center column at `flex-1`, content constrained to `max-w-2xl`. | Visible at `w-80`. |
| `≥ xl` (≥ 1280px) | Same | Same | Feed max-width may expand to `max-w-3xl` for more breathing room. | Same |

**Mobile strategy:** On small screens, only the top nav and center feed are
visible. The hamburger menu in the top nav opens the left sidebar as a modal
overlay with a scrim. The right sidebar content is either omitted or appears
inline at the top or bottom of the feed.

Touch targets grow to 44px minimum on mobile. Feed item spacing increases
slightly for thumb-friendly interaction.

---

## Navigation model

- **Primary navigation** lives in the top nav bar as tabs (Home, Chats, Events,
  etc.)
- **Secondary navigation** lives in the left sidebar (child selection, story
  switching, channel list, filters)
- **Tertiary actions** — notifications, settings, search — live in the top nav
  right section
- **Contextual content** — suggestions, widgets, trending topics — lives in the
  right sidebar
- The current primary section is indicated by the active tab in the top nav
- The current secondary selection (if applicable) is indicated by highlighting in
  the left sidebar

---

## Slots

| Placeholder in wireframe | Fill with |
|---|---|
| `<brand / logo>` | Logo mark, optionally with app name |
| `<primary navigation tabs>` | Tab buttons or nav links (`#tabs` or `#nav`) |
| `<notifications>` | Icon `Button` with counter `Badge` (`#badges`) |
| `<user avatar>` | `Avatar` with `DropdownMenu` (`#avatar`, `#menu`) |
| `<left sidebar navigation>` | Navigation list, story selector, or filter menu (`#nav`, `#list`) |
| `<feed item>` | `Card` with avatar, content, image, actions (`#card`, `#avatar`, `#buttons`) |
| `<post actions>` | Like, comment, share buttons (`#buttons`, `#badges`) |
| `<right sidebar widget>` | `Card` with list or stats (`#card`, `#list`) |
| `<suggestions>` | User list with follow buttons (`#list`, `#avatar`, `#buttons`) |

---

## Accessibility

- Landmarks: `<header>` top nav, `<aside>` left sidebar, `<main>` center feed,
  `<aside>` right sidebar. Give each `<aside>` a descriptive `aria-label` ("Main
  navigation", "Suggestions and notifications").
- Skip link targets `<main>` and must be the first focusable element in the top
  nav.
- `<main>` needs `tabindex="-1"` so the skip link can move focus into it.
- Heading hierarchy: Single `<h1>` in the top nav (app name) or first feed item.
  Feed items use `<h2>` or `<h3>` for post titles/authors.
- Focus order: top nav → left sidebar → center feed → right sidebar. This matches
  visual reading order.
- Mobile overlay sidebar is modal: trap focus, close on `Escape`, return focus to
  hamburger trigger, mark background `inert`.
- Infinite scroll feeds must announce new items to screen readers and provide
  keyboard access to "load more" functionality.

---

## Never

1. **Never let the page scroll as a whole.** The shell is `h-screen
   overflow-hidden` — if `body` scrolls, this layout has failed.
2. **Never let feed content stretch full-width.** The `max-w-2xl` (or similar)
   constraint on feed items is what makes this readable as a feed.
3. **Never omit `min-w-0`** on the flex children between the shell and the scroll
   regions. Wide content will break horizontal containment without it.
4. **Never put primary navigation in the sidebars.** Primary nav (Home, Chats,
   Events) lives in the top bar. Sidebars are secondary/contextual.
5. **Never make the sidebars collapsible via a resize drag.** They are fixed-width
   at each breakpoint. If a user wants more feed space, that's what the breakpoint
   thresholds handle.
6. **Never hide critical functionality in the right sidebar.** It disappears below
   `lg` — anything essential must be accessible from the top nav or left sidebar.
7. **Never nest scroll containers inside feed items without careful overflow
   management.** Nested scrolling (like a carousel inside a feed card) creates
   scroll traps.
8. **Never use `position: fixed` for the top nav.** Use `sticky top-0` so it
   participates in the layout flow but stays visible during feed scroll.
