# Prompt: Create a new voice

Paste this file into an AI agent along with a description of the voice you want.

---

## Your task

Create a new voice folder in `voices/`.

A **voice** owns the words: attributes, mechanics, vocabulary, and the actual
strings a product says. It owns nothing about how those words look — that belongs to
`designs/` — and nothing about where they sit on the page — that belongs to
`layouts/`.

The user will give you a brief. It might be a register ("terse and technical"), a
reference ("like Stripe's docs"), an audience ("clinicians, under time pressure"), or
a brand. If the brief is thin, make strong choices and write down what you chose.
A voice that hedges is worse than a voice that commits to something the user then
asks you to change.

---

## Before you start

Read these completely. They are contracts, not suggestions:

- `shared/COPY.md` — the strings you must write, in order, with fixed IDs
- `shared/ACCESSIBILITY.md` §5 — error identification and labelling, which constrain
  what a voice is allowed to do with form copy
- `voices/plain-spoken/VOICE.md` — a worked example of the output quality expected

Then open `voices/plain-spoken/index.html` so you know what you are aiming at, and
copy `voices/_template/` as your starting point.

---

## What to produce

```
voices/<name>/
├── VOICE.md       Instructions for an AI writing in this voice
└── index.html     String sink, opens with no build step
```

`<name>` is lowercase kebab-case, and it is the label a user will say out loud: "use
the `plain-spoken` voice". Name it for the feel, not the implementation.

---

### 1. `VOICE.md`

This is the file an agent reads when a user says "use this voice", so write it for
an agent that will not open the HTML. Be concrete. "Friendly but professional" is
not actionable; "contractions yes, exclamation marks never, errors always name the
next step" is.

Required sections — `check.mjs` verifies each one:

**Identity** — Name, a one-line description written as a description of *speech*,
three to five adjectives, then "use this when" and "do not use this when".

**Attributes** — Three to five named attributes, each with a definition and a
"this, not that" pair using a real string. These are load-bearing: an agent that
reads only this section must still write recognisably in voice.

**Mechanics** — The decidable rules. Case, voice, tense, person, contractions,
serial comma, numbers, dashes, quotation marks, terminal punctuation, exclamation
marks, emoji. Every row must be decidable without judgement.

**Vocabulary** — Preferred terms against their rejected alternatives, then a
strike-on-sight list. Words earn a place on that list by being empty, not by being
disliked. Call out the two or three that look harmless but are not.

**Patterns** — One rule per element: page title, heading, button, confirmation
button, field label, help text, placeholder, error, empty state, toast, tooltip,
body paragraph, list item.

**Antipatterns** — At least six specific constructions, quoted so they are
recognisable in a draft.

**Never** — Five to ten prohibitions. The most useful section and the one most
likely to be skipped.

**Length budgets** — Character budgets per slot. This is the one place a voice
touches layout: a design sizes its regions around these numbers, and a voice that
runs long must say so rather than letting a consuming project discover it when the
buttons wrap.

### 2. `index.html`

The string sink. Every section in `shared/COPY.md`, in order, with the exact `id`
attributes specified there.

- **Write the actual strings.** Not descriptions of them. A voice is only legible in
  specimens, the same way a design is only legible in a rendered button.
- **Use the shared example product, Fieldnote** — a tool for collecting research
  notes into projects and sharing them with a team. Every voice writes for the same
  product so that two string sinks differ by voice and nothing else. Keep the nouns
  consistent: notes, projects, collaborators, workspace.
- **Greyscale only.** No brand colour, no design opinions. A string sink is to a
  voice what a wireframe is to a layout: if it looks styled, design has leaked in.
  `check.mjs` enforces this.
- One self-contained file, no local `<link>` or `<script src>`, opens from `file://`.
- A sticky in-page table of contents linking to every section ID.

Plain CSS is fine and preferred here — this page has no design to demonstrate, and
it should stay readable with no network.

---

## Finishing

```sh
node scripts/check.mjs
node scripts/build-gallery.mjs
```

Then read the string sink end to end, out loud. Automated checks confirm the
sections exist; they cannot tell you the voice is good. Specifically check that:

- The three empty states are genuinely three different sentences.
- Every error says what to do next, not just what failed.
- The zero and one count cases are written, not implied.
- No confirmation button says `Yes`, `No`, or `OK`.
- It reads as one person talking, from the first section to the last.
- It sounds meaningfully different from the other voices in `voices/`. Open two
  string sinks side by side — if the strings could be swapped without anyone
  noticing, the repository has not gained anything and you should push harder.
