# Voice: `upbeat`

> Warm and encouraging. Notices when something goes well, softens it when something
> doesn't, and assumes the reader might be new here rather than expert at this.

**Adjectives:** warm, encouraging, buoyant, generous, unhurried.

**Use this when** you are building consumer apps, education and learning products,
onboarding-heavy tools, community platforms, or anything where the reader is here by
choice and could leave. It is the natural companion to the `playful` design, and it
is what makes a bright interface sound like it means it.

**Do not use this when** the reader is under time pressure or working in a
high-stakes context — clinical software, incident tooling, finance, anything an
expert uses for six hours a day. Enthusiasm costs the reader a moment each time, and
in a dense professional tool those moments add up to irritation. Use `plain-spoken`
there.

> `upbeat` deliberately breaks several of `plain-spoken`'s prohibitions —
> exclamation marks, reassurance, celebrating routine success. That is not one voice
> being wrong. A `Never` list belongs to the voice that wrote it, and the two voices
> disagree because they are for different readers.

---

## Attributes

### Warmth carries the message
`plain-spoken` leads with directness and lets that be the kindness. `upbeat` leads
with warmth and lets the information ride along. The reader should finish a sentence
feeling like someone is on their side.

> **This:** Nice — your project's ready.
> ~~Not this: Project created.~~

### Celebrate real progress, not routine
Enthusiasm spent on nothing is worth nothing. A first project, a finished import, a
milestone — those earn a celebration. Autosaving does not. A voice that cheers for
everything is a voice the reader stops hearing.

> **This:** That's your first project set up. Nice start.
> ~~Not this: Great job! Your text has been autosaved successfully!~~

### Failure is never the reader's fault
When something breaks, take the weight off them first, then explain. The reader
should never finish an error message feeling stupid.

> **This:** That didn't save, but your note is safe. Give it another go.
> ~~Not this: Your request could not be completed. Please check your input.~~

### Encouraging, never condescending
Warmth and condescension come from the same place and are easy to confuse. The test:
would you say this out loud to a competent adult? "You've got this!" fails.
"Two steps left" passes.

> **This:** Two steps to go.
> ~~Not this: Almost there — you're doing great!~~

### Say the whole thing anyway
Warmth is not a licence to be vague. Every string still names what happened and what
to do next; it just says it more gently. A friendly message that leaves the reader
stuck has failed at the only job that mattered.

> **This:** That's a lot of exporting! You get 10 an hour — you're back in at 3:40.
> ~~Not this: Oops, slow down there! Try again later.~~

---

## Mechanics

| Rule | Decision |
|---|---|
| Headings, buttons, labels, nav | **Sentence case.** Same as every voice here. |
| Voice | **Active.** |
| Tense | **Present.** |
| Person | **"You"** for the reader, **"we"** for the product — and `upbeat` uses "we" more freely than `plain-spoken`, because a named actor is warmer than a passive one. |
| Contractions | **Yes, always.** Uncontracted forms read as stern in this voice. |
| Serial comma | **Always.** |
| Numbers | **Numerals for counts, data, and anything scanned.** Spell out one to nine inside a running sentence. `3 notes` in a list; "it only takes two steps" in a sentence. |
| Dashes | Em dash, unspaced. |
| Quotation marks | Curly. Commas and periods inside, US English. |
| Terminal punctuation | Sentences take a period. Fragments, labels, buttons and list items do not. |
| Exclamation marks | **Allowed — at most one per message, and never more than one visible on screen at a time.** Never in a destructive confirmation, a permission error, or a billing message. |
| Emoji | **Onboarding and celebration only**, at most one, never in a button, never carrying meaning on its own — a screen reader announces it, and it must not be the only thing conveying the point. See `shared/ACCESSIBILITY.md`. |
| Interjections | `Nice`, `Great`, `All set`, `Ready when you are`. Never `Oops`, `Uh oh`, `Whoops`, `Yikes`. |

---

## Vocabulary

| Use | Not |
|---|---|
| delete | remove, trash, destroy |
| sign in / sign out | log in, login, logout |
| settings | preferences, options, configuration |
| note, project, collaborator | item, entity, resource, asset |
| workspace | organisation, tenant, account |
| give it another go | retry, re-attempt |
| you're all set | setup complete |
| nice / great / lovely | awesome, amazing, incredible, epic |
| ready when you are | get started now |
| turn on / turn off | enable, disable |

### Strike on sight

The corporate hype list is banned here exactly as it is in `plain-spoken` — warmth
and marketing language are not the same thing, and this voice is the one most at risk
of confusing them:

`leverage` · `utilise` · `seamless` · `delightful` · `robust` · `powerful` ·
`intuitive` · `effortless` · `unlock` · `empower` · `streamline` · `optimise` ·
`elevate` · `journey` · `ecosystem` · `solution` · `game-changer` · `supercharge` ·
`magical` · `blazing-fast`

Plus a second list this voice needs and `plain-spoken` does not — the condescension
words, which sound warm and land badly:

`simply` · `just` · `easy` · `obviously` · `of course` · `don't worry` ·
`you've got this!` · `no problem at all` · `super quick` · `in a jiffy`

**`simply`, `just` and `easy`** are banned here for the same reason as everywhere
else: they tell readers that what they are struggling with is trivial. A warm voice
reaches for them more often, which makes the rule matter more, not less.

**`don't worry`** instructs the reader about their feelings. Remove the cause of the
worry instead — "your note is safe" does the work that "don't worry" only gestures at.

---

## Patterns

| Element | Rule |
|---|---|
| Page title | Sentence case, noun phrase, no period. No exclamation. |
| Section heading | Sentence case. May be a short friendly phrase rather than a label. |
| Button | Verb, or verb + object. Never `OK`, `Submit`, `Click here`. Warmth lives in the surrounding copy, not the button — a button is a control and should stay predictable. |
| Confirmation button | Restates the verb from the title. Never `Yes` / `No`. |
| Field label | Noun phrase, sentence case, no colon, no period. Plain — labels are scanned, not read. |
| Help text | One sentence. May add a note of reassurance where a field is genuinely worrying. |
| Placeholder | An example of a valid value. Never an instruction. |
| Error | Reassurance, then what happened, then what to do. Three beats, one or two sentences. |
| Empty state | An inviting heading, one sentence of what goes here, then the action. |
| Toast | Warm and short. One exclamation mark maximum, and only for something that was actually an achievement. |
| Tooltip | Fragment, no period, plain. |
| Body paragraph | Four sentences maximum. |
| List item | Leads with the verb. No terminal period on fragments. |
| Destructive copy | **Drops the warmth entirely.** See `Never` #1. |

---

## Antipatterns

1. **"Oops!" / "Uh oh!" / "Whoops!"** — cutesy framing of a failure the reader did
   not find cute. Warmth is not the same as whimsy.
2. **"You've got this!"** — cheerleading at someone who asked for information.
3. **"Don't worry!"** — instructs the reader about their feelings instead of fixing
   the cause.
4. **"Great job!" for something routine** — spends enthusiasm the voice will need
   later.
5. **Two exclamation marks in one message**, or several on one screen. One is warmth;
   three is a children's television presenter.
6. **"Let's get started!"** as a heading — the reader is already here, and "let's"
   pretends you are doing it together.
7. **Warmth in a destructive confirmation** — "Ready to say goodbye to these
   projects?" is a real sentence people have shipped, and it is a failure of nerve.
8. **Apologising decoratively** — "Sorry about that!" before an error that was not
   an error. Save the apology for when it was your fault.
9. **Exclamation marks in a billing or permission message** — the reader is dealing
   with money or access, and cheerfulness reads as a taunt.

---

## Never

1. **Never be warm in a destructive confirmation.** When a reader is about to delete
   something permanently, they need the consequence stated flatly. `upbeat` drops to
   `plain-spoken`'s register for this one situation, deliberately. Softening a
   deletion is how people lose work.
2. **Never use "simply", "just", or "easy"** about something the reader is doing.
3. **Never use more than one exclamation mark in a message**, or leave more than one
   visible on screen.
4. **Never celebrate something the product did automatically.**
5. **Never let warmth replace information.** Every error still names the next step.
6. **Never use "Oops", "Uh oh", or "Whoops".**
7. **Never tell the reader how to feel** — no "don't worry", no "exciting news".
8. **Never put an exclamation mark in a button label.**
9. **Never use title case.**
10. **Never write a subject line that oversells what's inside.** A digest is a
    digest, not "your week of amazing progress".

---

## Length budgets

`upbeat` runs roughly **1.5 to 2 times longer** than `plain-spoken`, because
reassurance and warmth take words. That is a real constraint on which designs it
fits, not a stylistic footnote.

| Slot | Budget | `plain-spoken` for comparison |
|---|---|---|
| Button label | ≤ 24 characters | ≤ 20 |
| Field label | ≤ 30 characters | ≤ 30 |
| Help text | ≤ 130 characters | ≤ 90 |
| Toast | ≤ 60 characters | ≤ 40 |
| Error message | ≤ 180 characters | ≤ 120 |
| Empty state heading | ≤ 45 characters | ≤ 40 |
| Empty state body | ≤ 200 characters | ≤ 140 |
| Page title | ≤ 40 characters | ≤ 40 |
| Notification subject | ≤ 70 characters | ≤ 60 |
| Tooltip | ≤ 80 characters | ≤ 60 |

**Which designs this fits.** `playful` sizes for it comfortably — `px-6` buttons,
`p-8` cards, 44px controls, generous empty states. `warm-paper` also has room.
**`slate` does not**: its `h-9` controls, `px-4 py-3` table cells and 14px body text
are built around short strings, and `upbeat`'s error and empty-state budgets will
wrap or clip. `slate` + `upbeat` is the one combination in this repo that needs a
conversation before you build it — say so rather than truncating the copy.

Buttons are the exception that proves the rule: the budget barely moves, because a
button is a control. `upbeat` puts its warmth in the copy around the button, not in
the label.
