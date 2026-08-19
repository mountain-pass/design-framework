# Voice: `plain-spoken`

> Warm but direct. An expert peer explaining something clearly and then stopping.
> No jargon, no hype, no hedging — and no coldness either.

**Adjectives:** direct, warm, substantive, unhurried, non-prescriptive.

**Use this when** you are writing for people who know their job — professional
tools, developer products, B2B software, documentation, anything where the reader's
time is the scarce resource and being talked down to is the fastest way to lose
them. It is the default voice of this repository: when another voice is unsure, this
is the one that resolves it.

**Do not use this when** the product needs delight or ceremony. A children's app, a
game, a celebration moment, a consumer brand with a personality — `plain-spoken`
will read as flat in all of them. It is deliberately unshowy, which is a feature in
a research tool and a failure on a birthday card.

---

## Attributes

### Warm but direct
Care about the reader, but do not pad sentences to seem kind. Directness *is* the
warmth — it respects the reader's time and assumes their competence.

> **This:** This will delete 3 projects and everything in them.
> ~~Not this: We're really sorry, but we just wanted to make sure you know that this
> action might unfortunately remove some of your content!~~

### Substantive over stylish
Good sentences do not need rhetorical flourish. Say the thing, then stop. The second
sentence usually exists to make the writer feel better, not to inform the reader.

> **This:** Saved.
> ~~Not this: Success! Your changes have been saved successfully.~~

### Plain words for ordinary things
Use the word the reader would use. Reach for a longer or more technical word only
when it is genuinely more precise, never when it is merely more impressive.

> **This:** You can't undo this.
> ~~Not this: This operation is non-reversible.~~

### Never prescriptive without cause
Describe what a thing does and what will happen. Issue an instruction only when
there is exactly one correct next step. When there are several, name them and let
the reader choose.

> **This:** Two projects have the same name. Rename one, or merge them.
> ~~Not this: You should rename your project to avoid confusion.~~

### Honest about failure
When something breaks, say what broke, say whether it was the product's fault, and
say what happens next. Never disguise a failure as a neutral event, and never
apologise in place of explaining.

> **This:** We couldn't save your note. It's still here — try again in a moment.
> ~~Not this: Something went wrong.~~

---

## Mechanics

| Rule | Decision |
|---|---|
| Headings, buttons, labels, nav | **Sentence case.** Only proper nouns and acronyms take a capital. |
| Voice | **Active.** "We couldn't save your note", not "your note could not be saved". |
| Tense | **Present.** Describe what happens, not what will happen. |
| Person | **"You"** for the reader. **"We"** only when the product did something or failed at something. Never "I". |
| Contractions | **Yes** — can't, don't, we'll. This is speech, not a policy document. |
| Serial comma | **Always.** "Notes, projects, and collaborators." |
| Numbers | **Numerals everywhere**, including 1–9. UI is scanned, not read, and `3 projects` parses faster than `three projects`. This departs from prose convention on purpose. |
| Dashes | Em dash — unspaced — for asides. Never `--`, never a spaced hyphen. |
| Quotation marks | Curly. Commas and periods **inside** in US English. |
| Terminal punctuation | Full sentences take a period. Fragments, labels, buttons, and list items do not. |
| Exclamation marks | **None.** Not one. If a sentence needs an exclamation mark to carry its feeling, the sentence is wrong. |
| Emoji | **None** in product UI. |
| Ellipses | Only for a genuinely truncated string, never for trailing-off tone. |

---

## Vocabulary

| Use | Not |
|---|---|
| delete | remove, trash, discard, destroy |
| sign in / sign out | log in, login, logout |
| settings | preferences, options, configuration |
| note, project, collaborator | item, entity, resource, asset |
| workspace | organisation, tenant, account |
| can't | cannot, is unable to |
| try again | retry, re-attempt |
| choose | select (when the user is picking, not multi-selecting) |
| turn on / turn off | enable, disable, activate |
| more | additional |
| now | currently, at this time |
| about | approximately |
| use | utilise, leverage |

### Strike on sight

Delete these on sight and say the thing plainly. There is no context in which they
earn their place in this voice.

`leverage` · `utilise` · `seamless` · `delightful` · `robust` · `powerful` ·
`intuitive` · `effortless` · `simply` · `just` · `easy` · `unlock` · `empower` ·
`streamline` · `optimise` · `elevate` · `journey` · `ecosystem` · `solution` ·
`best-in-class` · `world-class` · `cutting-edge` · `next-generation` · `game-changer`

Two of those deserve a note, because they look harmless:

- **`simply` and `just`** tell a reader that the thing they are struggling with is
  trivial. If it were trivial they would not be reading the sentence. Delete both
  words and the sentence always survives.
- **`easy`** makes a promise about the reader's experience that you cannot keep. Say
  what it takes instead — "two steps", "about a minute".

---

## Patterns

| Element | Rule |
|---|---|
| Page title | Sentence case, noun phrase, no period. `Project settings` |
| Section heading | Sentence case, short. Says what is below it, not what it is called. |
| Button | Verb, or verb + object. `Save`, `Create project`, `Delete 3 notes`. Never `OK`, `Submit`, `Click here`. |
| Confirmation button | Restates the verb from the title. Never `Yes` / `No`. |
| Field label | Noun phrase, sentence case, no colon, no period. |
| Help text | One sentence, no period if it is a fragment. Explains *why* or *what format*, never restates the label. |
| Placeholder | An example of a valid value, never an instruction, never the label repeated. |
| Error | What happened, then what to do. Two clauses, one sentence where possible. |
| Empty state | What goes here, then the action that puts something here. |
| Toast | Past tense, three words or fewer where possible. `Project deleted`. |
| Tooltip | Fragment, no period. Explains a control that has no visible label. |
| Body paragraph | Four sentences maximum. One idea. |
| List item | Leads with the noun or the verb. No terminal period on fragments. |

---

## Antipatterns

Constructions this voice never uses, quoted so they are recognisable in a draft:

1. **"Oops!"** or **"Uh oh!"** — cutesy framing of a failure the reader did not find
   cute. Say what broke.
2. **"Something went wrong."** — technically true and completely useless. Name the
   thing that went wrong, even roughly.
3. **"Please note that…"** — always deletable. So is "Please be aware that".
4. **"Simply click…"** / **"Just add…"** — see the strike list.
5. **"We're excited to announce…"** — the reader is not excited, and the sentence
   spends their attention on your feelings.
6. **"Are you sure?"** as a dialog title — it asks about the reader's state of mind
   instead of naming the consequence. Use `Delete 3 projects?`.
7. **"Success!"** as a standalone toast — say what succeeded.
8. **"Invalid input"** — names the verdict, not the problem or the fix.
9. **Hedging stacks** — "you may want to consider possibly". One hedge maximum, and
   usually zero.
10. **Rhetorical questions as headings** — "Ready to get started?" Just say
    `Create your first project`.

---

## Never

1. **Never use an exclamation mark.** Not in a toast, not in onboarding, not once.
2. **Never say "simply", "just", or "easy"** about something the reader is doing.
3. **Never report a failure without a next step.**
4. **Never write a button that does not contain a verb**, except `Cancel`.
5. **Never use a placeholder as a label** — that is an accessibility failure as well
   as a voice one. See `shared/ACCESSIBILITY.md`.
6. **Never apologise more than once** in a single message, and never apologise
   instead of explaining.
7. **Never use title case.** Anywhere.
8. **Never write "Are you sure?"** Name the consequence instead.
9. **Never pad a confirmation with reassurance** the action does not warrant.
10. **Never let a sentence survive that would not survive being read aloud** to the
    person it is about.

---

## Length budgets

Voice touches layout at exactly one point: how long the strings are. These are the
budgets a design can rely on when it sizes a region.

| Slot | Budget |
|---|---|
| Button label | ≤ 20 characters |
| Field label | ≤ 30 characters |
| Help text | ≤ 90 characters |
| Toast | ≤ 40 characters |
| Error message | ≤ 120 characters |
| Empty state heading | ≤ 40 characters |
| Empty state body | ≤ 140 characters |
| Page title | ≤ 40 characters |
| Notification subject | ≤ 60 characters |
| Tooltip | ≤ 60 characters |

`plain-spoken` runs short, which makes it safe in dense designs like `slate`. A
voice that runs long is not wrong, but it must say so here, because a design cannot
absorb an unannounced doubling of its button labels.
