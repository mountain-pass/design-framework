# Voices

A **voice** owns the words: attributes, mechanics, vocabulary, and the actual
strings a product says. It owns nothing about how those words look — that is
`designs/` — and nothing about where they sit on the page — that is `layouts/`.

Any voice combines with any design and any layout.

## What is here

| Folder | Description |
|---|---|
| [`plain-spoken/`](plain-spoken/) | Warm but direct. An expert peer explaining something clearly and then stopping. The default voice of this repository. |
| [`upbeat/`](upbeat/) | Warm and encouraging. Notices when something goes well, softens it when something doesn't. The natural companion to the `playful` design. |
| `_template/` | Scaffold. Copy this to start a new voice. |

## Each folder contains

| File | Purpose |
|---|---|
| `VOICE.md` | Instructions for an AI writing in this voice. Attributes, mechanics, vocabulary, patterns, prohibitions, and per-slot character budgets. |
| `index.html` | The string sink. Every string in `shared/COPY.md`, in order, with fixed IDs, written for the shared example product, Fieldnote. Greyscale and structureless, no build step, opens straight from disk. |

## Using one

> "Write it in the `plain-spoken` voice."

An agent reads `VOICE.md` for the rules, then writes copy in that voice — checking
`index.html` whenever it needs to see a rule applied to a real string rather than
just stated. `index.html` is a reference to compare against, not a file to copy
into a project: unlike a design's `theme.css`, nothing here is a drop-in asset.

## Adding one

Follow [`../CREATE-VOICE.md`](../CREATE-VOICE.md). In short: copy `_template/`,
fill it in against [`../shared/COPY.md`](../shared/COPY.md), then run
`node ../scripts/check.mjs`.

## The rule that makes this work

Every voice writes for the same example product, Fieldnote, and renders **the same
strings in the same order with the same IDs**, defined by
[`../shared/COPY.md`](../shared/COPY.md). That is what lets you compare two voices
line for line. Add sections at the end if you must; never remove, rename, or
reorder the ones in the contract.

## Where a voice conflicts with a design or layout

A voice conflicts with the other two at exactly one point: **string length**. Each
`VOICE.md` carries character budgets per slot, and each design sizes its regions
around them. If a voice's budgets exceed what a design's components can hold, say
so — do not quietly truncate the copy or let the buttons wrap.
