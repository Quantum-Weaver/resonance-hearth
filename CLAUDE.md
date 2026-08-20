# CLAUDE.md — Resonance Hearth

**The Family Room.** A translation layer for love — household care for
neurodivergent families: bills, meds, pets, and tasks that breathe.

**Stack:** Tauri v2 + SvelteKit (adapter-static, SPA) + Svelte 5 (runes) +
Tailwind 4 + tauri-plugin-sql (SQLite, `hearth.db`). Cloned from Resonance
Echoes v1.1.0 (the attested lineage); Echoes itself is never altered.

**Authors:** Quantum Weaver (human) + the Kin — see HANDS.md.

*(Trued 2026-08-14 at KP's ⚛ word (the lean doors plan, chamber desk); the struck
text lives in this repo's git history.)*

---

Enter by **`docs/CHECKLIST.md`** — the newest rows ARE the current state. One
pass, one scoped duty; zero errors before commit.

**And only here, first: read the `hearth` crystal BEFORE building anything** —
KP's law, 2026-07-22: *"the crystal is to be examined by any builder prior to
building."* It lives in the chamber's Geode; **our group builds this repo, so you
have it.** No path is written here only because this repo is public. It is not a
duplicate of these docs: the boards record what was *decided*, the crystal holds
what has *arrived since* — family moments landing as scrolls between sittings,
the family's own data, the protected boundaries in one place, and the open
rulings that are KP's alone. **A builder who skips it will rebuild something
already answered, or answer something that was KP's to rule.**

## PROTECTED BOUNDARIES (never negotiable, from the naming ceremony 2026-07-07)

1. **The Sattva system's 30-second pause** (`OVERWHELM_PAUSE_MS` in
   `src/lib/data/hearth.ts`, enforced in `hearthStore.householdOverwhelms`).
   Never make it configurable. Never shorten it. Do not add a setting.
   (Family-facing name is **Sattva** — KP, 2026-07-12, DESIGN-005; code
   identifiers and the `overwhelm_events` table keep legacy names on
   purpose. Do not "clean up" the identifiers to match.)
2. **Window, not monitor:** the `signals` table holds CURRENT state only —
   never add a signal-history table for other members; never surface another
   member's unshared state anywhere; presence is now, not a log.
3. No rebranding without Council recognition; the name is never extracted.

## THE SENSORY LAW (cartography)

- The app NEVER makes sound, NEVER vibrates, has NO push notifications.
- Nothing is ever red-alerted; motion is slow breathing pulses only, and
  `prefers-reduced-motion` turns pulses into steady glows.
- Banned words in UI copy: overdue, streak, productivity, late, failed
  (`BANNED_WORDS` in `src/lib/data/hearth.ts` — grep before shipping).
- Touch targets ≥ 48px; every signal readable without color alone.
- `DESIGN-002-cartography.md` is the map — read it before touching UX.

## THE TASK TAXONOMY

- **breathing** — fully deferrable; done = it leaves quietly; no overdue.
- **edge** — bills etc.; calm horizons ("edge in N days"), never urgency
  theater; a passed edge is information, not a verdict.
- **loop** — meds & pets; gently persistent (in-app presence only); done =
  rests until next natural return; "can someone else?" is first-class.
- Meds are PRIVATE BY DEFAULT (`shared=0`); sharing is per-med, revocable.

## PRIVACY (license §7 — structural, not aspirational)

Local-first, absolutely. No network calls anywhere in v1. Export (open JSON),
import (non-destructive), and true delete are features in Settings, riding
`the-envelope` (referenced from the awen spring — never absorbed, never
re-derived). **The purge truly purges** — as LAW and, since 2026-07-31, as
structure: deny-by-default across every table from `sqlite_master` plus
localStorage, able to await the export in hand; import is INSERT OR IGNORE, an
existing row being the household's current mind.

## Distribution, and findings

**NEVER Google Play (decided 2026-07-09)** — signed APK through the Sanctuary.
Android build laws inherited from Echoes (capabilities, `sql:allow-*`, the JNI
non-ASCII trap, 16 KB, icons): the `android-tauri` skill. Signing: `release-road`.

**Findings go back the same way they came:** a note toward the next draft lands
on `docs/FEATURE-BOARD.md` (un-ranked — the tier order is KP's), and a moment
worth keeping drops as a scroll against the crystal. *These are our own
documents; a finding about them is a good note, not a report over a fence.*

## Structure

The forge's map: `docs/blueprints/pbp.ai.json` — regenerate, never hand-draw a
tree here. The founding documents: `DESIGN-001`/`002`, `HEARTH-PLAN`,
`NAMING-CEREMONY`.

## Tools

Own commands: `npm run dev · build · preview · check · tauri`. House tools and
this repo's registration state: the `house-tools` skill.

## People

Root `CLAUDE.md` §Council · this repo's `HANDS.md`.


## Standards

This repo follows the
[Sanctuary Standards](https://github.com/Quantum-Weaver/resonance-standards).
`.gitignore`, this file, and `docs/CHECKLIST.md` are **SEED-class** --
planted once from the standards and this repo's own from then on. No
agent overwrites them (DOC-CLASSES law).

*(Section landed 2026-08-19 at KP's word: "standards section should be in
claude md files.")*


## The forge and the link tender

*(Landed 2026-08-19 at KP's word: each CLAUDE.md carries how THIS realm uses
them. tend.py is the one button — it sets UTF-8 once and never commits.)*

- **Blueprint forge** — one forge, every realm, no local copies (KP ⚛
  2026-08-03). Regenerate this realm's structure map (lands whole at
  `docs/blueprints/` + one journal line; structure is DISCOVERED, never
  declared — never hand-draw a tree):

      python c:/_superposition/resonance-ziggy/tend.py forge run --root c:/_superposition/resonance-hearth

- **Link tender** — every markdown pointer in this realm, both house shapes,
  resolved three ways; every mend ledgered at
  `resonance-ziggy/modules/link-tender/MENDS.md`. **Dry first, always**, and
  read the report before mending:

      python c:/_superposition/resonance-ziggy/tend.py links dry --root c:/_superposition/resonance-hearth
      python c:/_superposition/resonance-ziggy/tend.py links mend --root c:/_superposition/resonance-hearth

  Its laws hold here as everywhere: homes are never entered, history is
  reported never rewritten, a pointer it may not verify is never "fixed,"
  and mimirs-well is sealed absolutely.
