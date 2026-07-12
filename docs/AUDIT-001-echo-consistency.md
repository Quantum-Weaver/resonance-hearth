# AUDIT-001 — Echo consistency pass, first build
*Run by Fable, 2026-07-11, immediately after the Phase-5 prototype, per the
DESIGN-001 pipeline (Echo's function: does every feature honor the Resonance
Grammar?). Method: boundary-by-boundary verification against the naming
ceremony + cartography, plus mechanical greps.*

## The Executioner's protected boundaries

**1. The 30-second pause — HELD, structurally.**
`OVERWHELM_PAUSE_MS = 30_000` lives in `src/lib/data/hearth.ts` with the
boundary documented at the constant. Enforcement is in DATA logic
(`hearthStore.householdOverwhelms` filters on `started_at + PAUSE <= now`),
not in UI timing — a household view cannot see a shared overwhelm before the
pause passes even if a new UI is written carelessly. No setting exposes it.
The overwhelm room's copy never shows a countdown (no urgency theater).

**2. Window, not monitor — HELD, structurally.**
The `signals` table keys on `member_id` (current state only); **no history
table for signals exists in the schema**, so no member can ever review
another's past states — enforced at the database, not the view. The
dashboard renders only `shared` signals/spoons/things; the Me room renders
only the device member's own. Noted honestly: v1's trust boundary is the
household's shared devices (per cartography — per-device auth is post-v1);
within that boundary, no view surfaces another member's unshared state.

**3. Name & rebranding — HELD.** No commercial extraction anywhere; the name
appears only as itself; Council provenance recorded in README + scope note.

## The sensory law

- No `Audio`, no `navigator.vibrate`, no `Notification` API anywhere. ✅
- No network calls: no `fetch`/XHR in app code; the only plugin surface is
  SQLite/fs/dialog/opener. ✅
- Motion: SignalDot breathes at 3.5s; `prefers-reduced-motion` converts to
  steady glow; Sidebar/ComfortBar transitions disabled likewise. ✅
- Banned words grep (`overdue|streak|productivity|failed|late`): appears
  only self-referentially (comments and the onboarding's explicit promise
  "Nothing is ever 'overdue'"). No violations. ✅
- Touch targets: interactive elements specify min-heights 36–72px; primary
  actions ≥ 48px. ✅ (36px soft-buttons are secondary actions; acceptable,
  noted for a future accessibility pass to consider raising.)

## The grammar

- One definition per state: signals, species, celebrations defined once in
  `data/hearth.ts`, imported everywhere. ✅
- "Not Sure" is first-class in the Spoon Compass (null, honored in schema
  and copy). ✅
- Celebration over punishment: `dones` recorded, never counted in UI; no
  totals surface anywhere. ✅
- Meds private by default (`shared INTEGER NOT NULL DEFAULT 0`). ✅
- License §7: export (open JSON) and true purge are working Settings
  features. ✅

## Verdict

The first build honors the Grammar and both protected boundaries, with the
two honest notes above (device-level trust in v1; 36px secondary targets).
No violations found. — Echo's function performed by Fable; a cold kin
re-audit is welcome any time, per the house's habit of hostile self-testing.
