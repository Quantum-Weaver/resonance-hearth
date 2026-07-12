# DESIGN-005 — The Sattva Door
*2026-07-12 · decided by KP ("we currently have a overwhelmed button and
system, that should be a 'Sattva' system"), implemented by Fable the same
day. Extends DESIGN-001 (the one-tap door) and DESIGN-003 (personal
protocols, the Dim); alters no protected boundary.*

## The decision

The system formerly labeled **Overwhelm** is now, in every family-facing
place, the **Sattva system**: the ComfortBar button says **Sattva**, the
room lives at **/sattva**, the dashboard says a member **"is seeking
sattva,"** and the personal protocol in Me is the **Sattva protocol**.

## Why the word (in plain engineering terms)

*Sattva* is borrowed vocabulary, not belief — the same way this house uses
"kernel" and "vessel." Its precise meaning: the quality of clarity,
balance, and lucidity. The rename moves the button from **deficit-naming to
destination-naming**: "I'm overwhelmed" names the storm; "Sattva" names
where the door leads. A person mid-storm presses a word that is already
pointing home. (KP, same conversation, for the record: he is "not much of a
spiritual or religious person" — he reads energies, "which sound
spiritual"; the referents are perceptual and practical. This document
follows that register, per the house's rule that mystic-sounding words must
have measurable referents.)

## Scope (KP's choices, 2026-07-12)

1. **Button text: "Sattva"** — one word, the family's own; the room
   explains itself inside ("A door back to balance"). The aria-label
   carries the plain meaning for any reader: "Sattva — a door back to
   balance."
2. **Rename depth: UI + route + docs.** Code identifiers
   (`startOverwhelm`, `OverwhelmEvent`, `OVERWHELM_PAUSE_MS`,
   `householdOverwhelms`) and the SQLite table `overwhelm_events` keep
   their legacy names **deliberately**: KP's installed device already
   carries data under them, and identifiers are not UI. Comments at each
   site say so. Do not "clean up" the identifiers to match — that would
   trade a working install for cosmetics.

## What did not change (and never does)

- The **30-second pause** (`OVERWHELM_PAUSE_MS`) — protected boundary,
  naming ceremony 2026-07-07. Renaming the door does not touch the hinge.
- The Dim, the audience snapshot, window-not-monitor, the sensory law.
- The example card text in Me keeps plain words ("I'm overwhelmed.
  Please don't ask questions…") — a vessel's message to their people is
  authored in whatever words their people best hear.

## Files touched

`ComfortBar.svelte` (button, class, comment) · `routes/sattva/+page.svelte`
(moved from `routes/overwhelm/`, heading + button + comment) ·
`routes/+page.svelte` (dashboard line) · `routes/me/+page.svelte` (protocol
heading + comment) · `routes/settings/+page.svelte` (Weave copy ×2) ·
`routes/+layout.svelte` (Dim comment) · `lib/data/hearth.ts` (pause
comment) · `lib/stores/hearth.svelte.ts` (section comment) · `CLAUDE.md` ·
`README.md` · this document · `docs/CHECKLIST.md`.

— Fable 🎻, for the household
