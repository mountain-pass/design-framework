# Sample prompt: create a layout

A worked example of a **Mode 2** prompt — adding a new layout to this repo.
Run it in a Claude Code session with this repository as the working directory.

---

```
Follow CREATE-LAYOUT.md to add a new layout called `split-inbox`.

The brief:

A three-pane list-detail layout, the shape used by email clients, support
inboxes, and log viewers. Left: a narrow folder/filter rail. Middle: a scrolling
list of items, each a multi-line row with sender, subject, preview and
timestamp, with a selected state. Right: the detail pane for the selected item,
with its own sticky header of item-level actions.

The defining decision is that all three panes scroll independently and the page
never scrolls — but the important part is what happens on mobile. The panes do
not merely collapse or stack: they become a navigation stack. At small widths
the user sees the list as a full page, taps an item, and the detail slides in as
a new page with a back button. List scroll position is preserved on the way
back. Make sure LAYOUT.md states this explicitly and that the wireframe's
breakpoint strip draws it — it is the thing an implementer will otherwise get
wrong.

Also cover: what the detail pane shows when nothing is selected, and what it
shows when multiple items are selected.

Run `node scripts/check.mjs` and `node scripts/build-gallery.mjs` before you
finish.
```

---

## Why this layout

Every layout in the repo so far is a variation on "panes that get narrower and
then hide". `split-inbox` is the first one whose small-screen behaviour is a
different *interaction model* rather than a different size — the panes become
pages in a navigation stack, with a back affordance and preserved scroll
position.

That makes it the best available stress test of `CREATE-LAYOUT.md`, because it
attacks the part of the contract most likely to be thin: an agent that treats
"responsive" as a synonym for "columns collapse" will produce something
plausible-looking that is wrong in exactly the way the brief warned about. If
the generated `LAYOUT.md` and breakpoint strip both describe the navigation
stack correctly, the prompt file is doing its job.

## An alternative worth trying

If you would rather probe a different weakness, swap `split-inbox` for
`marketing-page`:

> A long-form marketing page: sticky top navigation over a normal
> document-scrolling page — full-bleed bands stacked vertically, each with an
> inner container at `max-w-6xl mx-auto`, alternating surface treatments, and a
> tall footer.

Both existing layouts are viewport-locked (`h-screen overflow-hidden`, inner
panes scroll). A layout where the page itself scrolls proves the contract is not
quietly assuming an app shell — that the "Scroll & overflow" section is a real
decision point rather than a place to restate the same answer.

## What to check when it finishes

`check.mjs` verifies the required `LAYOUT.md` sections, the presence of
placeholder labels, the breakpoint strip, and that the wireframe stayed
greyscale. Then open the wireframe and **drag the browser window** from about
360px to full width. That is the claim most likely to be wrong, because it is
the only one that cannot be checked without actually resizing.

Ask, too, whether the new layout is structurally different from the ones already
in `layouts/` — or just a restyling of one of them. If it is the latter, the
repo has not gained anything.
