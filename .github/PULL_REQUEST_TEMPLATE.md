# What this changes

<!--
One or two sentences. The diff says what; say why.
-->

Closes #

## Reasoning

<!--
What alternative did you reject, and why? What would a reviewer not guess from reading the diff? Leave this out only for a one-line typo fix.
-->

## Screenshots

<!--
Required for any visible change. Before and after, at phone width and at desktop width — the layout breaks at 640 px. Use /app?demo=1 so no real entry ends up in a screenshot. Delete this section for changes with no visible effect.
-->

| | Before | After |
|---|---|---|
| Phone | | |
| Desktop | | |

## Checks

- [ ] `npm run build` passes (it runs the typecheck too)
- [ ] `npm test` passes
- [ ] Tests added or updated — a bug fix has a test that failed before it
- [ ] No hard-coded colour, size, spacing or duration; tokens only
- [ ] No hover, focus or active state changes the geometry of anything
- [ ] Touch targets stay at 44 × 44, focus stays visible
- [ ] Every day cell still carries its whole meaning in its accessible name
- [ ] No date built through UTC; day arithmetic goes through date components
- [ ] New strings exist in both `src/i18n/fr.ts` and `src/i18n/en.ts`
- [ ] Changelog entry proposed in the description, if a user would notice (`CHANGELOG.md` and `src/data/changelog/` are written at release time)
- [ ] Checked at phone, tablet and desktop widths, in light and dark
- [ ] No screenshot or fixture contains a real entry

<!--
By opening this pull request you agree that your contribution is licensed under AGPL-3.0-or-later, the same terms as the project.
-->
