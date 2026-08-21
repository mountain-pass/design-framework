# DESIGN.md

This project's design system lives in a separate repo:
[mountain-pass/design-framework](https://github.com/mountain-pass/design-framework).

Use the `slate` design, the `centered-doc` layout, and the `plain-spoken` voice.
Before writing any UI or any user-facing copy, fetch and read these in full:

```
Shared contracts
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/CLAUDE.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/TOKENS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/COMPONENTS.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/ACCESSIBILITY.md
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/shared/COPY.md

Theme and design
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/slate/DESIGN.md

Page layout
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/layouts/centered-doc/LAYOUT.md

Voice and tone
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/voices/plain-spoken/VOICE.md
```

Then open the following two demos. They are rendered answers, not descriptions of answers —
when you are unsure how something should look or how a string should read, find it
here and copy it rather than inventing a treatment:

```
Kitchen sink — what every component looks like in this design
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/slate/index.html

String sink — how this voice writes every kind of UI string
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/voices/plain-spoken/index.html
```

Copy the theme verbatim into this project's global stylesheet
(`app/globals.css` in a Next.js + shadcn project):

```
  https://raw.githubusercontent.com/mountain-pass/design-framework/main/designs/slate/theme.css
```

## Rules

- **Tokens only.** Every colour comes from a semantic token — `bg-background`,
  `text-muted-foreground`, `border-border`. Never a hex value, never a Tailwind
  palette class like `bg-blue-500`. This is the rule that keeps the design
  swappable, and it is the one most often broken when working quickly.
- **The three axes own different things.** The layout decides structure — regions,
  sizes, responsive behaviour, scroll model. The design decides appearance — colour,
  type, spacing, component styling. The voice decides words. If two of them appear
  to conflict on anything else, ask rather than guessing.
- **Follow the "Never" list** in each of the three files. If a rule genuinely can't
  be followed, say why instead of silently breaking it.
- **Accessibility is a contract, not a polish pass.** WCAG 2.2 AA, per
  `shared/ACCESSIBILITY.md`. Real `<label>`s, `aria-label` on icon-only buttons, a
  visible focus ring on everything, and state never carried by colour alone.
- **Both light and dark** are part of the deliverable, not an afterthought.
- **Copy is part of the deliverable too.** Buttons, empty states, errors and
  confirmations all get written in the named voice — not filled with placeholder
  text to be cleaned up later.
