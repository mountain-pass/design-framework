# Sample prompt: create a design

A worked example of a **Mode 2** prompt — adding a new design to this repo.
Run it in a Claude Code session with this repository as the working directory.

Copy everything inside the block. Swap the name and the brief for your own; the
shape of the brief is the part worth copying.

---

```
Follow CREATE-DESIGN.md to add a new design called `warm-paper`.

The brief:

Editorial and reading-first — it should feel like a well-set book page rather
than a piece of software. Warm off-white paper backgrounds, never pure white.
Ink that is soft near-black, never #000. A serif for headings and long-form
body copy; a sans reserved for UI chrome (buttons, labels, table headers,
form controls) so the interface recedes and the writing comes forward.

Minimal chrome: hairline rules instead of filled containers, very little
shadow, restrained radius. One muted accent — something in the ink/oxblood or
deep-ochre family, drawn from the paper's warmth rather than dropped on top of
it. Generous vertical rhythm. Body text at 16px, not 14px — this design is for
reading, which is the opposite of slate's call.

Dark mode should read as warm low light, not as a cool grey inversion: think
lamplight on a page, so keep a little warmth in the hue and drop the chroma
rather than just flipping lightness.

Use this when: documentation sites, blogs, knowledge bases, reading apps,
anything long-form. Not for dense dashboards.

Push the choices far enough that it is unmistakably a different design from
`slate` when the two kitchen sinks are opened side by side. Run
`node scripts/check.mjs` and `node scripts/build-gallery.mjs` before you
finish, and paste me the contrast table it computes.
```

---

## Why this brief is shaped the way it is

`CREATE-DESIGN.md` does the heavy lifting — it already tells the agent what
files to produce, what the contracts are, and how to check its own work. Your
brief only has to supply the things the prompt file cannot know. In practice
that means four things:

**A feeling, plus a concrete consequence of it.** "Editorial and reading-first"
is a mood; "body text at 16px, not 14px" is what that mood costs you. Moods
alone get interpreted as decoration. Pair each one with something an
implementer can act on.

**An explicit contrast with an existing design.** The line about being
unmistakably different from `slate` matters more than it looks. Without it, an
agent tends to converge on the safe neutral middle, and you end up with two
designs that differ only in hue — which adds nothing to a library whose whole
value is comparison.

**A rule for dark mode.** This is the single most commonly botched part of a
theme. Saying "warm low light, not a cool grey inversion" heads off the default
failure, which is flipping lightness values and calling it done.

**What it is not for.** `DESIGN.md` requires a "do not use this when" line, and
supplying it yourself means you get the boundary you had in mind rather than
one the agent invented.

## What to check when it finishes

`node scripts/check.mjs` verifies the mechanical parts — every token defined in
both light and dark, all thirty kitchen-sink sections present and in order, no
hard-coded colour, an `## Accessibility` section in `DESIGN.md`, and that
`index.html` renders from `theme.css` rather than carrying its own copy of the
tokens. It also converts
every `oklch()` value to sRGB and **computes the real WCAG contrast ratios** in
both themes, failing the build on any pair below its minimum — so the ratios
recorded in `DESIGN.md` are measured rather than estimated. Estimated ratios in
this repo were historically optimistic by up to 4×.

What it cannot tell you is whether the design is any good. So also open
`designs/warm-paper/index.html` next to `designs/slate/index.html` and ask:

- Do they look like two designs, or one design with the hue rotated?
- Does the dark theme look chosen, or merely survivable?
- Is anything illegible? Thin type on a tinted background is the usual offender.
- Tab through it. Is the focus ring visible on every control?
- Take a greyscale screenshot. Is every status still distinguishable?
- Does the `Never` list in `DESIGN.md` contain rules that are actually specific
  to this design, or generic advice that would apply to anything?
