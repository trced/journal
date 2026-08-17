# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-17

### Added

- The year in twelve rows, one dot per day: a dot for a mood alone, a ring for a note, a disc for text, a ringed disc for both. Twelve months fit on a phone screen without a single day having to disappear. The touch target is never the dot — it is the month row, 44 px tall, that opens its grid
- The month in seven columns, a 44 px cell per day: the date and its mark, and the day is tapped there. Days still to come are laid out but are not buttons: there is nothing to read, and tomorrow cannot be written. Runs of elapsed days with no mark at all are folded into one row below the grid
- The day full screen: the text first, then the note, then four rows of facts — mood, words, place, time written. The arrows step from one written day to the next, skipping the empty ones, because that is how a journal is read
- Writing takes the whole frame: text with no imposed length, a short note, a mood in one word out of four, a place typed by hand. No field is required, and a four-word entry is an entry. The word count replaces the field's hint from the first keystroke, and the time is stamped once, at the first writing, so a correction the next morning does not move it
- The month's summary: current run and best run, days written and the share of the month, words and words per day written, the four moods as bars of relative length, full days and the longest day. The run is a reading, not a chain to keep unbroken: nothing reminds you of it, and nothing warns you when it stops
- Settings in a draggable sheet: light, dark or system theme; French, English or the system language; week starting Monday or Sunday; reading text size; mood asked or not; short note asked or not. Each row cycles its values on click, and hiding a field erases nothing — whatever was written stays in the file and can still be read in the day view
- Export and import of the `journal.json` file, with a choice between merging and replacing, and a full erase behind an explicit confirmation. Merging never overwrites a day you have already written: two devices that told the same 12 August did not write the same thing, and the program has no way to choose
- Plain-text export: one file, one entry per day, in the language of the interface. A journal must be readable without the program that wrote it
- "Send to": the device's native share when it can take a file, a download otherwise. The file only leaves the device through that gesture, towards the app you pick. The project has no server to receive it
- Installable, offline-capable progressive web app: everything is precached on download, and there is no network request in use
- Presentation site in French and English: home page with the real app embedded, about page, terms of use, privacy, legal notice and changelog
- Example mode reachable from the overview: a filled year, computed from today out of a fixed seed, writing nothing to the device
- The "famille ." 1.2.0 design system as CSS tokens: colour, typography, space, shape, motion, and the shared components — button, field, setting row, sheet, period navigation, stat row, feedback
- Accessibility: every month cell is a button named in full — "12 August 2026, text and note, open" — because a seven-pixel shape announces nothing on its own. 44 × 44 targets everywhere, a visible 2 px focus ring, focus trapped in sheets then given back, arrows to change period, `T` to return to today, `Escape` to close
- Unit tests over the pure layer — dates, year and month grids, gaps, runs, counts, moods, import, merge, storage — and integration tests of the real paths: write a day, read it back, edit it, delete it

[0.1.0]: https://github.com/trced/journal/releases/tag/v0.1.0
