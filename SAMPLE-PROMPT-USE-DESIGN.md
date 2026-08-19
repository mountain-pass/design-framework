# Sample prompt: use a design and a layout in another project

A worked example of a **Mode 1** prompt — consuming this repo from somewhere
else. Run it in a Claude Code session in your *own* project, not in this one.

The session has no local copy of this repository, so the prompt has to say how
to get one. Cloning is the reliable route: it lets the agent open the kitchen
sink HTML directly instead of reading a description of it.

> This example uses `warm-paper`, which is created by
> [`SAMPLE-PROMPT-CREATE-DESIGN.md`](SAMPLE-PROMPT-CREATE-DESIGN.md). Substitute
> any design in `designs/` — `slate` works if you have not made another yet.

---

```
I want you to build this using a shared design system that lives in a public
repo: https://github.com/mountain-pass/design-framework

First, fetch it so you can read it properly:

  git clone --depth 1 https://github.com/mountain-pass/design-framework /tmp/design-framework

(If you can't clone, read the files over HTTPS instead — raw file URLs look like
https://raw.githubusercontent.com/mountain-pass/design-framework/main/<path>,
e.g. .../main/designs/warm-paper/DESIGN.md)

Then, before writing any code, read these five files in full:

  /tmp/design-framework/CLAUDE.md                    (how to use the repo)
  /tmp/design-framework/shared/TOKENS.md             (the token contract)
  /tmp/design-framework/shared/COMPONENTS.md         (the component contract)
  /tmp/design-framework/designs/warm-paper/DESIGN.md (the design I want)
  /tmp/design-framework/layouts/app-shell/LAYOUT.md  (the layout I want)

Also open /tmp/design-framework/designs/warm-paper/index.html — that is the
rendered answer to "what does this component look like in this design". When
you're unsure how to style something, find it there and copy the class list
rather than inventing a treatment.

Now build a reading-list app with Next.js, Tailwind v4 and shadcn/ui, using the
`warm-paper` design and the `app-shell` layout:

- Copy designs/warm-paper/theme.css into app/globals.css verbatim.
- Build the app-shell exactly as LAYOUT.md specifies it — including the
  viewport-locked scroll model and the min-w-0 rules. Don't let the page scroll
  as a whole.
- Sidebar: All / Unread / Archived / Tags. Top bar: search + account menu.
- Main page: a table of saved articles (title, author, source, added date,
  status badge, row actions) with a page header above it.
- One detail page for a single article, and a settings page with a real form.
- Light and dark both working, via the class strategy.

Rules I care about, because they're the whole point of the repo:
- Semantic tokens only — bg-background, text-muted-foreground, border-border.
  No hex, no bg-blue-500. If you type a raw colour, you've broken it.
- Honour the "Never" list in DESIGN.md. Tell me if you had to violate one.

Two notes. `warm-paper` is an editorial, reading-first design and `app-shell` is
a dense application shell, so this pairing is a deliberate stress test: the
layout wins on structure and the design wins on appearance. If they genuinely
conflict on something else, stop and tell me rather than silently picking one.

When you're done, tell me which parts of DESIGN.md and LAYOUT.md were specific
enough to act on directly, and where you had to make a judgement call because
the instructions were vague. That feedback is what I'm actually testing.
```

---

## Why the prompt is built this way

**It names the files to read, in order.** An agent that skims `DESIGN.md` will
produce something that looks approximately right and violates three rules in the
"Never" list. Listing the paths explicitly, and saying *in full*, is what gets
the specifics applied.

**It points at the kitchen sink as a rendered artefact.** This is the part most
people leave out. `DESIGN.md` describes a button; `index.html` *is* one. Telling
the agent to copy the class list from the demo rather than invent a treatment
removes most of the drift.

**It restates the token rule in the user's own voice.** The rule is already in
`CLAUDE.md` and `DESIGN.md`, but hard-coding a colour is the single failure mode
the whole repo exists to prevent, so it is worth the redundancy.

**It pairs a design and layout that pull in different directions.** An editorial
design in a dense application shell is a real test of the composition rule —
layout wins on structure, design wins on appearance. If the agent silently
resolves a genuine conflict instead of raising it, that is a finding about
`CLAUDE.md`, not about the app.

## The last paragraph is the actual experiment

Asking where the instructions were vague turns each test run into a diff against
the framework. Build output tells you whether one session went well; the
vagueness report tells you what to edit.

Run the same prompt in two or three fresh sessions. Where they diverge is where
the source files are underspecified, and where several sessions all report the
same gap, you have a concrete edit to make to `DESIGN.md`, `LAYOUT.md`, or the
shared contracts. That is worth more than the app you get out of it.
