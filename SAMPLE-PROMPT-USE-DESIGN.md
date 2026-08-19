# Sample prompt: use a design, a layout and a voice in another project

A complete example showing how to use this design framework in your own project.
Copy the prompt below into a Claude Code session in your project (not this repo).

The prompt fetches files directly from GitHub using **raw** URLs, which return plain
file content. A `github.com/.../blob/...` URL returns GitHub's HTML page wrapper
instead — several kilobytes of navigation markup around the file you wanted — so use
`raw.githubusercontent.com` for every one of these.

> This example uses `warm-paper`, `app-shell` and `plain-spoken`. Substitute any
> combination from the repo — try `slate` + `document-editor` + `plain-spoken`, or
> `playful` + `social-feed` + `upbeat`.
>
> One combination needs a decision first: **`slate` + `upbeat`**. `upbeat` runs
> 1.5–2× longer than `plain-spoken` and `slate` is sized for short strings. Each
> `VOICE.md` names the designs it fits.

If you want the design to stop moving underneath you, replace `main` in these URLs
with a tag or a commit SHA.

---

```
I want you to build this using a shared design system that lives in a public
repo: https://github.com/mountain-pass/design-framework

Before writing any code, fetch and read these files in full.

Shared contracts:
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/CLAUDE.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/TOKENS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/COMPONENTS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/ACCESSIBILITY.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/COPY.md

The three axes I want:
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/warm-paper/DESIGN.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/layouts/app-shell/LAYOUT.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/voices/plain-spoken/VOICE.md

Also fetch both demos:
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/warm-paper/index.html
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/voices/plain-spoken/index.html

Those two are rendered answers, not descriptions of answers. The kitchen sink
shows what every component looks like in this design; the string sink shows how
this voice writes every kind of UI string. When you're unsure how something
should look or how a message should read, find it there and copy it rather than
inventing a treatment.

Now build a reading-list app with Next.js, Tailwind v4 and shadcn/ui:

- Fetch and copy the theme into app/globals.css verbatim from:
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/warm-paper/theme.css
- Build the app-shell exactly as LAYOUT.md specifies it — including the
  viewport-locked scroll model and the min-w-0 rules. Don't let the page scroll
  as a whole.
- Sidebar: All / Unread / Archived / Tags. Top bar: search + account menu.
- Main page: a table of saved articles (title, author, source, added date,
  status badge, row actions) with a page header above it.
- One detail page for a single article, and a settings page with a real form.
- Light and dark both working, via the class strategy.

Rules:
- Use semantic tokens only — bg-background, text-muted-foreground, border-border.
  Never hex colours, never Tailwind colour classes like bg-blue-500.
- Write every user-facing string in the plain-spoken voice: buttons, empty
  states, validation messages, confirmations, toasts. No placeholder copy to be
  cleaned up later — the copy is part of the deliverable.
- The empty states matter. There are three different ones (nothing yet, filtered
  to nothing, cleared by the user) and they are not the same sentence.
- Meet WCAG 2.2 AA per ACCESSIBILITY.md: real <label> elements, aria-label on
  icon-only buttons, a visible focus ring on everything, state never carried by
  colour alone, and 44px targets on touch.
- Follow the "Never" list in DESIGN.md and in VOICE.md. If you need to violate a
  rule, tell me why.
- The layout controls structure, the design controls appearance, the voice
  controls words. If they conflict on anything else, ask rather than assuming.
```

---

## Why the prompt is built this way

**It uses raw GitHub URLs.** `raw.githubusercontent.com` returns the file;
`github.com/.../blob/...` returns a web page with the file buried in it. The second
form wastes context and sometimes defeats the fetch entirely.

**It names the files to read, in order, and says *in full*.** An agent that skims
`DESIGN.md` produces something that looks approximately right and violates three
rules in the "Never" list. The explicit list is what gets the specifics applied.

**It points at both demos as rendered artefacts.** This is the part most people
leave out. `DESIGN.md` describes a button; `index.html` *is* one. `VOICE.md`
describes an error message; the string sink *is* one. Telling the agent to copy from
the demo rather than invent removes most of the drift.

**It restates the token rule.** The rule is already in `CLAUDE.md` and `DESIGN.md`,
but hard-coding colour is the most common failure, so the redundancy earns its place.

**It asks for the copy explicitly.** Without this, an agent writes the components
correctly and fills them with `Lorem ipsum` or `Submit` — and the voice, which you
went to the trouble of naming, never actually lands. Calling out the three empty
states is worth it for the same reason: they are the slot agents most often collapse
into one sentence.

**It states the accessibility floor.** `ACCESSIBILITY.md` is a contract rather than a
polish pass, and the markup an agent copies from the kitchen sink propagates into
every screen it builds. Naming the specific failures — unlabelled icon buttons,
placeholders used as labels — is what stops them.

**It says how the axes compose.** Layout owns structure, design owns appearance,
voice owns words. Stating it prevents an agent from resolving an imagined conflict by
guessing.

## What to check when it finishes

The framework's own `check.mjs` validates the repo, not your project, so these are
manual:

- **Tab through every page.** Visible focus ring on every control, order matching
  visual order, nothing trapped.
- **Toggle dark mode.** Both themes should look chosen, not merely survivable.
- **Grep for hard-coded colour** — `#`, `bg-blue-`, `text-gray-`. Any hit is a token
  that was skipped, and it will not follow the theme when you switch designs.
- **Read the empty states and errors out loud.** Do they sound like one person? Does
  every error say what to do next, or only what failed?
- **Check the copy against the voice's length budgets.** If buttons wrap or an empty
  state overflows its card, the voice and the design disagree about size — the one
  place the axes genuinely negotiate.
