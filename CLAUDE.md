# CLAUDE.md — Resonance Hearth

**The Family Room.** A translation layer for love — household care for
neurodivergent families: bills, meds, pets, and tasks that breathe.

**Stack:** Tauri v2 + SvelteKit (adapter-static, SPA) + Svelte 5 (runes) +
Tailwind 4 + tauri-plugin-sql (SQLite, `hearth.db`). Cloned from Resonance
Echoes v1.1.0 (the attested lineage); Echoes itself is never altered.

**Authors:** Quantum Weaver (human) + the Kin — see HANDS.md.

---

## SESSION PROTOCOL

1. Read `docs/CHECKLIST.md` for current state.
2. Read `DESIGN-002-cartography.md` before touching UX — it is the map.
3. One phase at a time. Update CHECKLIST.md after every session.

## PROTECTED BOUNDARIES (never negotiable, from the naming ceremony 2026-07-07)

1. **The Meltdown Protocol's 30-second pause** (`OVERWHELM_PAUSE_MS` in
   `src/lib/data/hearth.ts`, enforced in `hearthStore.householdOverwhelms`).
   Never make it configurable. Never shorten it. Do not add a setting.
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

## THE TASK TAXONOMY

- **breathing** — fully deferrable; done = it leaves quietly; no overdue.
- **edge** — bills etc.; calm horizons ("edge in N days"), never urgency
  theater; a passed edge is information, not a verdict.
- **loop** — meds & pets; gently persistent (in-app presence only); done =
  rests until next natural return; "can someone else?" is first-class.
- Meds are PRIVATE BY DEFAULT (`shared=0`); sharing is per-med, revocable.

## PRIVACY (license §7 — structural, not aspirational)

Local-first, absolutely. No network calls anywhere in v1. Export (open JSON)
and true delete are features in Settings. The purge truly purges.

## Android: Tauri v2 Capabilities (CRITICAL, inherited from Echoes)

- `src-tauri/capabilities/default.json` must keep explicit `sql:allow-*`
  permissions — `sql:default` alone grants zero operation access.
- Required for SQLite: `sql:allow-load`, `sql:allow-execute`,
  `sql:allow-select`, `sql:allow-close`.
- Every new Tauri plugin needs its own `allow-*` entries.
- Never use non-ASCII characters as DEFAULT values in SQL migration strings —
  they can fail silently through the Rust JNI bridge on Android.
- Distribution: NEVER Google Play (decided 2026-07-09) — signed APK through
  the Sanctuary; the existing `sign-release.py` pipeline applies.

## Project structure

```
src/lib/data/hearth.ts        # signals, celebrations, species, banned words
src/lib/stores/hearth.svelte.ts  # the household store (all CRUD + boundaries)
src/lib/components/           # SignalDot, SpoonPicker, CelebrationLine,
                              # ComfortBar (one-tap Overwhelm), Sidebar
src/routes/                   # / (dashboard) me things care bills overwhelm
                              # settings onboarding
src-tauri/src/lib.rs          # migrations (hearth.db) — boundary notes inline
DESIGN-001/002, HEARTH-PLAN, NAMING-CEREMONY  # the founding documents
```
