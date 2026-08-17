# Contributing to journal.

Thank you for looking. This document covers what the project accepts, how to set it up, and the conventions a pull request is measured against.

Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## The two rules

Most pull requests that get turned down fail one of these, so they come first.

**One question.** journal. answers *what was that day like?* A feature that does not serve that question is not added, however good it is. Evening reminders, mood averages and charts, writing prompts, question-of-the-day, streak notifications, tags, folders, rich text, photo attachments and automatic summaries have all been considered and refused on purpose. See "What it is not" in the [README](README.md).

Two refusals are not a matter of taste, and they are the ones most often proposed.

*The evening reminder.* An app that demands its entry turns a journal into homework. The day you write for the reminder rather than the wish, what you wrote is worth nothing, and the day you ignore it, the app has made you feel behind on your own life. journal. waits. It is the only correct behaviour for a program that holds what you tell it.

*Automatic analysis.* No summary, no sentiment score, no "insights", and nothing sent anywhere to produce them. What you write does not have to be read by a program. This is also why there is no server: there is nothing to send to.

**No new component without proof.** Before adding one to `src/components/`: show that three screens need it, show that no composition of the existing ones is enough, and document its anatomy, states, API and accessibility. Eight shared components cover the whole app today.

If you are unsure whether an idea fits, open an issue before writing code. A paragraph beats a rejected branch.

## Ways to contribute

- **Report a bug.** Use the bug template; it asks for the browser and the steps, which is usually all that is needed. Never paste the contents of an entry into an issue: describe the shape of the problem, not what you wrote.
- **Improve the translations.** `src/i18n/fr.ts` is the reference and `src/i18n/en.ts` its mirror. Wording fixes are welcome and easy to review.
- **Improve accessibility.** Keyboard traps, screen-reader wording, contrast and focus order are always in scope, and never refused for being small. The month grid is the part that needs the most care: a seven-pixel mark says nothing on its own, so every cell carries its whole meaning in its name.
- **Fix a bug.** No need to ask first.
- **Documentation.** Including this file.

## Setup

Node 20.19+ or 22.12+ is required.

```bash
npm install
npm run dev        # http://localhost:5173
```

`/app?demo=1` gives you a filled year without writing anything to the device, which is the fastest way to see a change in context. The example is computed from a fixed seed, so a screenshot stays valid between runs.

Before pushing:

```bash
npm run typecheck
npm test
npm run build
```

All three must pass. `npm run build` runs the typecheck again, so a green build is the single check that matters most.

## Conventions

### Layers

`src/lib/` is pure: no React, no DOM, no `window`, and no implicit clock. The day and the time are always passed in by the caller. Anything that can be expressed there belongs there, because that is the layer that gets tested without a browser. If you find yourself importing React into `lib/`, the logic is in the wrong place.

### Dates

Dates are stored as `YYYY-MM-DD` and built from local date parts. Never `toISOString()`: it switches to UTC and moves every entry written after 22:00 to the next day anywhere east of Greenwich. This is the defect that matters most here — people write in the evening.

Day arithmetic goes through date components, never through milliseconds, so a daylight-saving change neither skips nor repeats a day.

### Design system

Read the constraints in the [README](README.md#design-system) first. In practice, a pull request touching the interface is checked against:

- **Tokens only.** A hard-coded colour, size, duration or spacing in a component is a conformance defect. Add a token if a value is genuinely new.
- **Nothing moves.** No hover, focus or active state may change padding, margin, size or position. Invert colours, draw a rule, but the box keeps its geometry, or neighbouring elements jump under the pointer.
- **State reads, it does not colour.** Today carries a 2 px rule under its date, not a tint or a pill. Colour is reserved for the destructive action.
- **One mark per day.** The strongest one. Stacking three signs inside seven pixels does not read, and a mark is never the only carrier of its meaning.
- **44 × 44 touch targets**, a visible 2 px focus ring at 3 px offset, and no drop shadows anywhere.

### Internationalisation

Every user-visible string is a key. `fr.ts` is the reference; `en.ts` is typed against it, so a missing or extra key fails compilation. Tests additionally check that no translation is empty, that placeholders match on both sides, that every plural declares its `.one` and `.other` forms, and that no string contains an emoji.

Never concatenate translated fragments. Use a placeholder — `'{n} of {total}'` — so translators can reorder.

Month names, weekday initials and date formats come from `Intl`, never from a literal. A hard-coded `M` for Monday is wrong in French, where it means Tuesday.

### Tests

The pure layer carries the logic that can be wrong, so it carries most of the tests. Add one when you:

- change date handling, grid building, gaps, runs, counts, moods or file handling;
- fix a bug: the test should fail before your fix and pass after;
- change a user path end to end (writing, reading, editing, deleting, importing).

Test names describe behaviour, not implementation. Query by role and label rather than by class, so a refactor of the markup does not break the suite.

### Comments

The source is commented in French. Match the file you are editing; if you are not comfortable writing French, English is accepted and someone will translate it later. A correct explanation in the wrong language beats no explanation.

Comments say *why*, not *what*. The diff already says what.

## Commits

Subjects follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Keep the subject in the imperative and under about 70 characters.

The body is where the work is. Explain the reasoning, the alternative you rejected and why, and any consequence a reader would not guess from the diff. The existing history is written in French; match it if you can.

## Pull requests

- One concern per pull request. Two unrelated fixes are two pull requests.
- Fill in the template. It is short, and the checklist is the same one a reviewer would run by hand.
- Include before and after screenshots for any visible change, at phone width and at desktop width. Use `/app?demo=1` so no real entry ends up in a screenshot.
- Propose a one-line changelog entry in the description for anything a user would notice, in French and English if you can. `CHANGELOG.md` and the in-app changelog under `src/data/changelog/` are both written at release time, from those lines. Internal refactors do not need one.
- Expect review comments about the design system. They are not personal; the constraints are what keeps the interface coherent.

## Security

Do not open a public issue for a vulnerability. See [SECURITY.md](SECURITY.md).

## Licence

journal. is AGPL-3.0-or-later. By contributing you agree that your contribution is licensed under the same terms. There is no contributor licence agreement to sign.
