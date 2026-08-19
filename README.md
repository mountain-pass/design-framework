# Design Framework

A library of web page **designs** and **layouts**, written to be consumed by AI
coding agents.

The point is to make this instruction work:

> "Build me a settings page. Use the styling and components from the `slate`
> design, and the `app-shell` layout."

An agent reads the named folders, follows the instructions in them, and produces
something that looks deliberate instead of improvised.

---

## The two axes

Designs and layouts are kept separate so they can be mixed freely.

| | `designs/` | `layouts/` |
|---|---|---|
| Answers | *What does it look like?* | *Where does everything go?* |
| Owns | Colour, type, spacing, radius, shadow, component styling | Page structure, regions, responsive behaviour, navigation model |
| Demo file | A **kitchen sink** — every component, fully styled | A **wireframe** — grey boxes with `<navigation goes here>` placeholders |
| Contains no | Page structure opinions | Colour or styling opinions |

Any design combines with any layout. `slate` + `app-shell` and `slate` +
`document-editor` are both valid; so is a different design with either layout.

The separation is enforced by the demo files themselves. A layout wireframe is
deliberately unstyled — if it looks pretty, styling has leaked into it. A design
kitchen sink is deliberately a flat scroll of components — if it has a sidebar and
a routing structure, layout has leaked into it.

---

## Repository structure

```
.
├── index.html               Gallery — open this first
│
├── CREATE-DESIGN.md         Prompt: paste into an AI to generate a new design
├── CREATE-LAYOUT.md         Prompt: paste into an AI to generate a new layout
├── DESIGN.md.template       Copy into a third-party project's root as DESIGN.md
│                            to point its agent at this repo
│
├── SAMPLE-PROMPT-CREATE-DESIGN.md   Worked example: adding a design
├── SAMPLE-PROMPT-CREATE-LAYOUT.md   Worked example: adding a layout
├── SAMPLE-PROMPT-USE-DESIGN.md      Worked example: consuming this repo
│
├── shared/
│   ├── COMPONENTS.md        The kitchen sink contract — the component list
│   │                        every design must render, in order
│   └── TOKENS.md            The token contract — the CSS variables every
│                            design must define
│
├── designs/
│   ├── _template/           Scaffold to copy
│   └── slate/               Reference implementation
│       ├── DESIGN.md        Instructions for an AI implementing this design
│       ├── theme.css        Paste-ready tokens for a real project
│       └── index.html       Kitchen sink, opens with no build step
│
├── layouts/
│   ├── _template/           Scaffold to copy
│   ├── app-shell/           Reference implementation
│   └── document-editor/     Reference implementation
│       ├── LAYOUT.md        Instructions for an AI implementing this layout
│       └── index.html       Wireframe, opens with no build step
│
└── scripts/
    ├── check.mjs            Validates every folder against the contracts
    └── build-gallery.mjs    Regenerates index.html from the folders
```

---

## The stack

Opinionated on purpose. An agent that has to choose a stack will choose a
different one every time.

- **[Tailwind CSS v4](https://tailwindcss.com)** for styling, with theme values as
  CSS custom properties.
- **[shadcn/ui](https://ui.shadcn.com)** as the component vocabulary. Component
  names, variant names, and token names in this repo match shadcn exactly, so a
  `theme.css` here drops straight into a real shadcn project.
- **[Lucide](https://lucide.dev)** for icons, inlined as SVG.
- **No build step for the demos.** Every `index.html` is a single self-contained
  file using the Tailwind browser CDN. Double-click it and it works.

The demos are static HTML rather than React because a demo you have to `npm
install` to look at is a demo nobody looks at — including an AI agent, which can
read the HTML directly and see exactly which classes produce which result. The
markup mirrors what shadcn's React components render, so translating back to JSX
is mechanical.

**On [DTCG tokens](https://www.designtokens.org/):** considered and skipped.
DTCG defines a JSON `{value, type, description}` schema for cross-tool token
interop (Figma, Style Dictionary, etc.). This repo's tokens are CSS custom
properties matched to Tailwind/shadcn utility classes — the format a
Next.js/shadcn project actually consumes directly. Maintaining a parallel DTCG
representation would mean keeping two token formats in sync for a tool-interop
benefit none of this repo's consumers currently need. Worth revisiting if a
design tool in the pipeline starts consuming DTCG directly.

---

## Using it

### As a human

Open `index.html` for the gallery. Browse the designs, browse the layouts, then
tell your agent which ones you want:

> Use the `slate` design and the `app-shell` layout.

### As an AI agent

When a user names a design or layout:

1. Read `designs/<name>/DESIGN.md` and/or `layouts/<name>/LAYOUT.md` in full.
2. Read `shared/TOKENS.md` and `shared/COMPONENTS.md` for the shared contracts.
3. Copy `designs/<name>/theme.css` into the target project's global stylesheet.
4. Use `designs/<name>/index.html` as the reference for how any given component
   should look. It is a rendered answer, not a description of one.
5. Follow the region structure and responsive rules in `LAYOUT.md`.

`CLAUDE.md` in the repo root contains the full agent instructions.

### Creating a new design or layout

Copy `CREATE-DESIGN.md` or `CREATE-LAYOUT.md` into your agent along with what you
want:

> Follow CREATE-DESIGN.md. I want a design called `warm-paper` — an editorial,
> reading-first look, cream backgrounds, a serif for headings, minimal chrome.

The prompt file tells the agent what to produce, what the constraints are, and how
to check its own work.

### Sample prompts

If you would rather start from a filled-in example than write a brief from
scratch, three are included — each is a copy-pasteable prompt plus notes on why
it is shaped that way and what to check when it finishes:

| File | Use it to |
|---|---|
| [`SAMPLE-PROMPT-CREATE-DESIGN.md`](SAMPLE-PROMPT-CREATE-DESIGN.md) | Add a design (`warm-paper`, an editorial reading-first look) |
| [`SAMPLE-PROMPT-CREATE-LAYOUT.md`](SAMPLE-PROMPT-CREATE-LAYOUT.md) | Add a layout (`split-inbox`, a three-pane list-detail shell) |
| [`SAMPLE-PROMPT-USE-DESIGN.md`](SAMPLE-PROMPT-USE-DESIGN.md) | Build an app in another project using a design + layout from here |

### Pointing a third-party project at this repo

[`DESIGN.md.template`](DESIGN.md.template) is a copy-paste starting point for a
consuming project's own root `DESIGN.md`. `DESIGN.md` is an emerging convention
([google-labs-code/design.md](https://github.com/google-labs-code/design.md))
that AI coding agents look for by default, the same way they look for
`CLAUDE.md` or `AGENTS.md`. Dropping a filled-in copy in a project's root means
an agent working in that project discovers this design system on its own,
without the design/layout names having to be spelled out in every prompt.

Copy the template to the target project as `DESIGN.md`, fill in `{{DESIGN}}`,
`{{LAYOUT}}`, and `{{REF}}`, and delete the leading comment.

---

## Checking your work

```sh
node scripts/check.mjs        # validate all folders against the contracts
node scripts/build-gallery.mjs # regenerate index.html
```

`check.mjs` verifies that every design has the required files, defines every
required token in both light and dark, and renders every required kitchen sink
section. It has no dependencies — Node 18+ is all you need.

---

## Naming

Folder names are lowercase kebab-case and become the label a user says out loud.
Pick names that describe the feel or the reference, not the implementation:
`slate`, `warm-paper`, `brutalist`, `app-shell`, `document-editor`, `split-inbox`.
