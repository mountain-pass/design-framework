# Sample prompt: use a design and a layout in another project

A complete example showing how to use this design framework in your own project.
Copy the prompt below into a Claude Code session in your project (not this repo).

The prompt fetches files directly from GitHub using raw URLs, which return plain
file content that AI agents can read easily.

> This example uses `warm-paper` and `app-shell`. You can substitute any design
> and layout from the repo — try `slate` with `document-editor`, for instance.

---

```
I want you to build this using a shared design system that lives in a public
repo: https://github.com/mountain-pass/design-framework

Before writing any code, fetch and read these five files in full from the repo:

  https://raw.githubusercontent.com/mountain-pass/design-framework/main/CLAUDE.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/TOKENS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/COMPONENTS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/warm-paper/DESIGN.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/layouts/app-shell/LAYOUT.md

Also fetch and open this HTML file:
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/warm-paper/index.html

That kitchen sink demo is the rendered answer to "what does this component look 
like in this design". When you're unsure how to style something, find it there 
and copy the class list rather than inventing a treatment.

Now build a reading-list app with Next.js, Tailwind v4 and shadcn/ui, using the
`warm-paper` design and the `app-shell` layout:

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

Important rules:
- Use semantic tokens only — bg-background, text-muted-foreground, border-border.
  Never use hex colours or Tailwind colour classes like bg-blue-500.
- Follow the "Never" list in DESIGN.md. If you need to violate a rule, tell me why.
- The layout controls structure; the design controls appearance. If they conflict
  on something else, ask rather than making assumptions.
```

---

## Why the prompt is built this way

**It uses raw GitHub URLs for direct file access.** Raw URLs (from 
`raw.githubusercontent.com`) return plain file content without GitHub's HTML 
wrapper, making them ideal for AI agents to fetch and read programmatically.

**It names the files to read, in order.** An agent that skims `DESIGN.md` will
produce something that looks approximately right and violates three rules in the
"Never" list. Listing the URLs explicitly, and saying *in full*, is what gets
the specifics applied.

**It points at the kitchen sink as a rendered artefact.** This is the part most
people leave out. `DESIGN.md` describes a button; `index.html` *is* one. Telling
the agent to copy the class list from the demo rather than invent a treatment
removes most of the drift.

**It restates the token rule explicitly.** While this rule is in `CLAUDE.md` and
`DESIGN.md`, hard-coding colours is the most common mistake, so the redundancy
helps ensure the agent follows it.

**It clarifies how designs and layouts compose.** The layout determines structure
(regions, sizes, scroll behaviour). The design determines appearance (colours,
type, components). Stating this prevents the agent from making incorrect
assumptions when combining them.
