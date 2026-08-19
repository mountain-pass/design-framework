# The String Sink Contract

Every voice in `voices/` MUST write **this exact set of strings, in this exact
order, using these exact section IDs**.

It is the same idea as `COMPONENTS.md`, applied to words. Because every voice
answers the same prompts in the same order, you can open two voices side by side
and see the difference in a sentence rather than in an adjective. It also means an
agent asked to "write the delete confirmation in the `plain-spoken` voice" can look
the pattern up and find it in a predictable place.

A voice folder that invents its own slots is a voice nobody can compare, which
defeats the point. Add slots at the end if you must; never remove, rename, or
reorder.

---

## How to read this document

Each section lists the **situations** that must be answered. A situation is a
distinct writing problem, not a distinct copy of the same sentence. Where the
contract says three empty states, all three must appear.

`id` is the `id` attribute on the `<section>` element in `index.html`.
`scripts/check.mjs` verifies these are present, so they are not optional.

**Write the actual strings.** Not a description of the strings. "Be friendly but
concise" is not an answer; `Delete 3 projects?` is. A voice is only legible in
specimens, the same way a design is only legible in a rendered button.

**Use one running example product.** Every voice in this repo writes for the same
imaginary product, so the specimens differ by voice and nothing else. The product
is **Fieldnote**, a tool where people collect research notes into projects and
share them with a team. Keep the nouns consistent — projects, notes, collaborators,
workspace — so two voices side by side differ in *how* they speak, not in what they
are speaking about.

---

## 1. Foundations

### `id="attributes"` — Voice attributes
Three to five named attributes, each with a one-line definition and a **"this, not
that"** pair showing the same idea written well and badly.

These are the load-bearing part of the file. Everything below is downstream of them,
and an agent that reads only this section should still write recognisably in voice.

### `id="mechanics"` — Style rules
The decidable mechanics, stated as rules rather than preferences. At minimum:

- Capitalisation (sentence case vs title case, for headings, buttons, and labels)
- Person and tense ("you" / "we" / neither; present vs future)
- Contractions (yes or no)
- Serial comma
- Numbers (when spelled out, when numerals)
- Dashes and quotation marks
- Terminal punctuation in fragments, labels, and list items

Every rule must be decidable without judgement. "Be consistent" is not a rule.

---

## 2. Actions

### `id="buttons"` — Buttons and calls to action
- The primary action on a form (save, create, send)
- The same action in progress, and after it completes
- A cancel or dismiss
- A destructive action
- A navigational CTA that is not a form submit
- A disabled action, and the tooltip explaining why

### `id="menu"` — Menu items, nav labels, and page titles
Nav labels for five sections, three menu items including a destructive one, and the
page title for each of: a list, a detail view, and a settings page.

---

## 3. Forms

### `id="labels"` — Labels, help text, and placeholders
Three field labels with help text, one placeholder used correctly, and a required
field. Show what goes in the label versus what goes in the help text — that division
is a voice decision, and it is the one most often made by accident.

### `id="validation"` — Validation and error messages
- A required field left empty
- A malformed value (email, date)
- A value that is valid but rejected by the system (name already taken)
- A whole-form failure on submit
- A warning that is not an error

Each must say what happened **and** what to do next. A voice that only reports the
failure has answered half the prompt.

---

## 4. States

### `id="empty"` — Empty states
- First run: the user has never created anything
- Filtered to nothing: a search or filter with no matches
- Cleared: the user emptied it themselves, and that is a success

These three are different situations. A voice that writes the same sentence for all
three is not paying attention.

### `id="loading"` — Loading, saving, and progress
An initial load, a save in progress, a long operation with a time estimate, and a
background job the user can leave.

### `id="errors"` — Page-level failures
Not found, permission denied, server error, offline, and a rate or quota limit.

Each needs a heading, a sentence of explanation, and a recovery action.

---

## 5. Interruptions

### `id="confirm"` — Confirmation dialogs
- A destructive, irreversible action, with its two button labels
- A destructive but recoverable action
- A benign confirmation that could arguably be skipped — and a note on whether this
  voice would skip it

Title, body, and both buttons for each. Button labels restate the verb; a voice that
answers a delete confirmation with "OK" has failed the slot.

### `id="toast"` — Toasts and inline confirmations
Success, failure, an undoable action with its undo label, and a queued or deferred
result.

### `id="alerts"` — Callouts and inline notices
Informational, cautionary, and blocking, each with a heading and one sentence.

---

## 6. Longer form

### `id="onboarding"` — First-run and feature introduction
A welcome heading and subheading, a three-step setup with each step named, an
empty-workspace prompt, and a one-sentence introduction to a feature the user has
not used.

### `id="notifications"` — Transactional messages
The subject line and first sentence for: an invitation, a mention, a weekly digest,
and an expiry or billing warning.

Subject lines are their own discipline. A voice that writes good in-product copy and
bad subject lines is incomplete.

### `id="microcopy"` — Everything small
Timestamps and relative dates, counts including the zero and the one case, units and
file sizes, truncation and overflow ("+3 more"), and a legal or consent line.

The plural and zero cases are where voices quietly break. Write them.

---

## 7. Reference

### `id="vocabulary"` — Preferred and forbidden terms
A two-column table of terms this voice uses and their rejected alternatives —
`delete` vs `remove` vs `trash`, `sign in` vs `log in` vs `login`. Then a
**strike-on-sight list**: words to delete from any draft on sight, with no
exceptions clause.

Words earn a place on the strike list by being empty, not by being disliked.

### `id="antipatterns"` — Writing antipatterns
At least six specific constructions this voice never uses — named openings, hedges,
and filler moves, quoted so they are recognisable. "Avoid jargon" is not an
antipattern; "Opening with 'In today's fast-paced world'" is.

### `id="examples"` — Do and don't
At least six paired rewrites: the same string written in voice and out of voice,
side by side, with the out-of-voice version struck through.

This is the section people actually read. Make the pairs real strings from the
sections above, not invented ones.

---

## Order on the page

Sections appear in the order listed above. The page opens with a header containing
the voice's name, its one-line description, and a sticky in-page table of contents
linking to each section ID.

**The string sink is greyscale.** Like a layout wireframe, it uses no colour beyond
neutral greys and no design opinions — because a voice must combine with any design.
If it looks styled, design has leaked into a voice folder. `check.mjs` enforces this.
