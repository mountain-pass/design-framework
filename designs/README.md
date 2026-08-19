# Designs

A **design** owns colour, typography, spacing, radius, shadow, and the styling of
every component. It owns nothing about page structure — that is `layouts/`.

Any design combines with any layout.

## What is here

| Folder | Description |
|---|---|
| [`slate/`](slate/) | Calm, neutral product UI. Cool greys, one blue accent, restrained depth. The reference implementation. |
| `_template/` | Scaffold. Copy this to start a new design. |

## Each folder contains

| File | Purpose |
|---|---|
| `DESIGN.md` | Instructions for an AI implementing this design. The specifics — actual numbers, actual prohibitions. |
| `theme.css` | Paste-ready CSS custom properties, in shadcn/ui's `globals.css` format. Drops straight into a real project, and is also what the kitchen sink renders from. |
| `index.html` | The kitchen sink. Every component in the design, no build step. Fetches `theme.css`, so serve the folder rather than opening the file. |

## Using one

> "Use the styling and components from the `slate` design."

An agent reads `DESIGN.md`, copies `theme.css` into the project's global
stylesheet, and uses `index.html` as the reference for how any given component
should look.

## Adding one

Follow [`../CREATE-DESIGN.md`](../CREATE-DESIGN.md). In short: copy `_template/`,
fill it in against [`../shared/TOKENS.md`](../shared/TOKENS.md) and
[`../shared/COMPONENTS.md`](../shared/COMPONENTS.md), then run
`node ../scripts/check.mjs` and `node ../scripts/build-gallery.mjs`.

## The rule that makes this work

Every design renders **the same components in the same order with the same section
IDs**, defined by [`../shared/COMPONENTS.md`](../shared/COMPONENTS.md). That is what
lets you open two designs side by side and compare them, and what lets an agent
find any component in a predictable place. Add sections at the end if you must;
never remove, rename, or reorder the ones in the contract.
