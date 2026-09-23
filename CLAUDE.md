# Instructions for AI agents (working in this repository)

This repository is a design system library — a catalogue of designs, layouts and
voices that *other* projects consume. This file is for an agent working **inside
this repo**: adding or editing a design, layout or voice, and keeping the demos and
tooling honest.

Using one of these designs in another project is a different job with a different
entrypoint. The gallery at the repo root (`index.html`) generates a ready-to-paste
instruction file for a consuming agent, filled in from `DESIGN.md.template`. Every
rule a consumer needs — which files to fetch, tokens-only, the exact-classes rule,
the `/kitchensink` verification, how the three axes compose — lives in that template,
not here. So don't point a consuming agent at this file; point them at the gallery
or the generated `DESIGN.md` it produces. When you change how a design should be
*consumed*, edit `DESIGN.md.template` (and re-run `build-gallery.mjs`); this file
governs only how the repo itself is built and maintained.

---

## Adding or editing a design, layout, or voice

The trigger looks like:

> "Add a design called `warm-paper`."
> "Create a new layout for a three-pane email client."

Follow `CREATE-DESIGN.md`, `CREATE-LAYOUT.md`, or `CREATE-VOICE.md` in the repo
root. They are written
as complete prompts — read the relevant one and do what it says.

Before you report the work finished, run:

```sh
node scripts/check.mjs
node scripts/build-gallery.mjs
```

`check.mjs` will tell you about missing tokens and missing kitchen sink sections.
`build-gallery.mjs` regenerates the root `index.html` so the new folder appears in
the gallery. Both must be run — a new design that is not in the gallery is a design
nobody will find.

---

## Hard rules for this repository

**Designs never contain layout.** A design's kitchen sink is a single-column scroll
of component sections. It must not have a sidebar, a routing structure, or an
opinion about where a page's navigation lives.

**Voices never contain design or layout.** A voice's string sink is greyscale and
structureless, for the same reason a wireframe is: a voice has to combine with any
design. It ships words, and the specimens exist to be compared line for line against
another voice — which is why every voice writes for the same example product,
Fieldnote.

**Layouts never contain design.** A layout's wireframe uses greys, dashed borders,
and literal `<placeholder text>`. If you catch yourself picking a brand colour for
a layout, you are in the wrong folder. The wireframe should look like a wireframe.

**The kitchen sink contract is not negotiable.** `shared/COMPONENTS.md` lists the
sections every design must render, in order, with fixed `id` attributes. The whole
framework depends on designs being comparable, and they are only comparable if they
show the same things in the same order. Add at the end if you must; never remove,
rename, or reorder.

**The static demos must open with no build step.** The kitchen sink, the layout
wireframe and the voice string sink use the vendored Tailwind browser compiler
(`vendor/tailwind-browser-<version>.js`), inline SVG icons, no bundler, no `npm
install`. If one of *these* needs a build to look at, it has failed at its only job —
they are the grounding truth an agent reads directly, and `classes.json` is validated
against the kitchen sink's static markup.

**The React component previews are the deliberate exception, and they are compiled.**
A design's generated `components/ui/*.tsx` are real React, so `designs/<name>/react-
preview/` renders them through an actual build: `scripts/build-preview.mjs` bundles the
components (with React + Radix) into a self-contained `app.bundle.js` the page loads.
This is on purpose — we want to know at *build time* whether a component compiles, not
discover it in a consumer's project. So the previews trade the no-build guarantee for a
real compile: after changing a component, run `npm run build:preview` (or `npm run
verify` to compile without writing, as a CI gate). `check.mjs` stays dependency-free and
does not run this; it is a separate step for the previews only. The static demos are
untouched by it.

The compiler is committed rather than loaded from a CDN: a floating version means
the same commit renders differently depending on when it is opened, which is not
something a reference library can afford. Every page must load the same vendored
build — `check.mjs` fails a partial upgrade — and `vendor/README.md` has the
update procedure. It is the only local file a demo may load besides a design's
own `theme.css`.

A design's kitchen sink is the one place that loads a local file: it fetches its
own `theme.css` and hands the text to the Tailwind browser compiler. That is what
stops the theme from existing twice. It also means kitchen sinks must be **served
over http(s)** — opened from `file://` the fetch is blocked and the page shows a
banner saying so. Layout wireframes and voice string sinks have no companion CSS,
so they stay single-file and open straight from disk.

Do not "fix" this by adding a `<link rel="stylesheet">`: the Tailwind browser
build only ever reads `style[type="text/tailwindcss"]` elements, so a linked
theme yields a page with no utility classes at all. `@import` is worse — the
browser build rejects local imports, and `@import "./theme.css"` silently
resolves to Tailwind's *own* theme rather than the design's.

**Accessibility is a contract, not a polish pass.** `shared/ACCESSIBILITY.md` is
WCAG 2.2 AA, and it binds the demos in this repo as tightly as it binds the
applications built from them. The markup in a kitchen sink is copied verbatim by
agents downstream, so an unlabelled icon button or a placeholder used as a label
propagates into every consuming project. `check.mjs` computes real contrast ratios
from each `theme.css` — never record an estimated ratio in a `DESIGN.md`, and never
ship a contrast failure as a known issue when the fix is a token value.

A design whose identity genuinely depends on colours that cannot reach AA may
waive the contrast gate, and only by declaring it in its own `DESIGN.md`:

```
<!-- check:contrast=waived -->
```

`check.mjs` then reports each shortfall as a warning instead of failing. It
suppresses the build failure, not the finding — the ratios are still measured and
still printed on every run. A waiver is not a way to defer the work: take it only
when the palette *is* the design and darkening it would produce a different
design, and write down in the same section what the shortfall costs a user and
what someone who needs AA should do instead. `designs/learn` is the worked
example. Never add the marker to silence a design you have not finished tuning.

**Every design ships light and dark.** Both are part of the deliverable. The
kitchen sink's dark-mode toggle must produce a dark theme that someone actually
chose, not one that happens to fall out of inverting the light theme.

**Token names are fixed.** They match shadcn/ui so that this repo's output drops
into real projects. Extend the set if a design needs more; never rename or drop
what is there.

**Key CSS to role, not to tag.** When a design's CSS applies a purely visual effect
(shadow, colour, typography) to "buttons," "headings," or any other role-based term,
key the selector to something that identifies the role unambiguously — a
`data-slot` attribute, a dedicated class — not to the HTML tag. `shared/
ACCESSIBILITY.md` requires some role-correct elements to render as a *different* tag
than you'd expect (an `<a href>` for anything that navigates, even if it's styled as
a button), so a tag-keyed selector (`button.bg-primary`, `h1, h2, h3, h4`) will
always miss some of them — silently, since the element still carries every class the
working version has. Verify every such rule against at least one element that
deliberately violates the "expected" tag, and put it in the kitchen sink so
`check.mjs` and a visual diff keep catching a regression. `designs/learn` is the
worked example: its slab shadow and focus outline are keyed to
`[data-slot="button"]` alongside the `button`/`[type="button"]` tag, and `#buttons`
in its kitchen sink includes a button-styled `<a>` to prove it.
