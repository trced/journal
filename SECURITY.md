# Security policy

## Reporting a vulnerability

Do not open a public issue.

Report privately through [GitHub's advisory form](https://github.com/trced/journal/security/advisories/new), or by email to <contact@journal.app>.

Please include what you found, how to reproduce it, and what an attacker would gain. A proof of concept helps; a video is rarely needed. Build the proof of concept from invented entries, not from your own.

You will get an acknowledgement within seven days and an assessment within thirty. If the report is valid you will be credited in the release notes, unless you would rather not be.

## What the attack surface actually is

journal. has no server, no account, no network request in use, and no third-party runtime dependency beyond React and its router. There is nothing to escalate into and no other user's data to reach. That rules out most of what a security policy usually covers, and leaves a short list of things that are genuinely worth reporting.

What raises the stakes here is not the surface but the content: an entry is the most private thing a local-first app can hold. A defect that exposes one is serious even if it exposes nothing else.

- **Imported files.** `journal.json` is parsed from a file the user chooses. Anything that turns a crafted file into script execution, prototype pollution, or corruption of an existing journal is in scope.
- **Stored content rendered back.** The whole app is user text — entries, notes, places — rendered in the day view, in the exports and in accessible names. Anything that gets it interpreted rather than displayed is in scope.
- **The service worker and its precache.** Cache poisoning, a stale asset that cannot be evicted, or a scope wider than the app is in scope. So is an entry surviving in a cache after the journal has been erased.
- **Data leaving the device.** The app is meant to make zero network requests after install. Any request it makes on its own is a bug, and a serious one: it would be carrying someone's diary.
- **Dependencies.** A known vulnerability in a shipped dependency is in scope even if journal. does not reach the affected code path.

## Not in scope

- Anything requiring physical access to an unlocked device. Local storage is readable by whoever holds the browser, by design: this is a local-first app with no lock of its own. If your device is shared, use a browser profile that is not.
- Clearing browser storage destroying data. That is documented behaviour; Settings → export exists for it.
- Reports from automated scanners with no demonstrated impact.
- The presentation site's lack of a login, rate limit or CSRF token. It has no server and no forms that submit anywhere.

## Supported versions

The project is pre-1.0. Only the latest release receives fixes; there are no maintenance branches.

| Version | Supported |
|---|---|
| 0.1.x | yes |
| < 0.1 | no |
