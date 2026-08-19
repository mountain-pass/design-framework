# Layouts

A **layout** owns page structure: what regions exist, how they nest, what size
they are, how they behave at each breakpoint, and where navigation lives. It owns
nothing about colour or styling — that is `designs/`.

Any layout combines with any design.

## What is here

| Folder | Description |
|---|---|
| [`app-shell/`](app-shell/) | Viewport-locked application shell. Fixed sidebar, fixed top bar, one scrolling content pane. For dashboards, admin consoles, CRUD tools. |
| [`document-editor/`](document-editor/) | Centred writing surface with a collapsible document tree and a contextual inspector. For notes, wikis, CMS editors. |
| `_template/` | Scaffold. Copy this to start a new layout. |

## Each folder contains

| File | Purpose |
|---|---|
| `LAYOUT.md` | Instructions for an AI implementing this layout. Region map, container markup, scroll model, breakpoints, slots. |
| `index.html` | The wireframe. Greyscale, real proportions, `<placeholder>` labels, no build step. |

## Using one

> "Build this with the `app-shell` layout and the `slate` design."

An agent reads `LAYOUT.md` for the region structure and responsive rules, then
fills each `<placeholder>` with the corresponding component from the design's
kitchen sink. The `Slots` table in each `LAYOUT.md` maps placeholders to
components explicitly.

## Adding one

Follow [`../CREATE-LAYOUT.md`](../CREATE-LAYOUT.md). In short: copy `_template/`,
fill it in, then run `node ../scripts/check.mjs` and
`node ../scripts/build-gallery.mjs`.

## Why the wireframes are ugly

Deliberately. A wireframe uses greys, dashed borders, and literal `<placeholder>`
text so that it stays combinable with an arbitrary design. If a layout picks a
brand colour, it has stopped being a layout and become half a design.

The corollary: if you are editing a file in this folder and reaching for a colour,
you are in the wrong folder.
