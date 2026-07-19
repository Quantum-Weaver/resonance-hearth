# RESONANCE HEARTH — MASTER CHECKLIST

## LEGEND
- ✅ Complete
- ⚠️ In Progress
- 🔴 Broken
- ⬜ Pending

---

## PHASE STATUS

### Phase 1: Cartography ✅ (2026-07-11)
- [x] Capture session with KP (bills/meds/pets/tasks + calm system)
- [x] DESIGN-002-cartography.md — flows, taxonomy, sensory law, data model
- [x] **Tested:** ✅ (reviewed against DESIGN-001 + naming boundaries)

### Phase 2–4: Indexing / Echo audit / Naming ✅
- [x] Naming: Council, 2026-07-07 (CAT-2026-0707-002)
- [x] Indexing: founding docs in repo root; scope note in docs/
- [x] Echo audit: see AUDIT-001 (2026-07-11)

### Phase 5: Prototype — the gentle core ✅ (2026-07-11)
- [x] Clone of Echoes v1.1.0 as base (Echoes unaltered)
- [x] Rebrand (package/tauri.conf/Cargo/main.rs; hearth.db)
- [x] Schema migration v1 (boundaries enforced structurally)
- [x] hearthStore (members/spoons/signals/things/meds/overwhelm/export/purge)
- [x] Components: SignalDot, SpoonPicker, CelebrationLine, ComfortBar
      (one-tap Overwhelm), Sidebar, icons
- [x] Rooms: Hearth (dashboard) · Me · Things · Care · Bills · Overwhelm ·
      Settings · Onboarding
- [x] svelte-check: 0 errors, 0 warnings (311 files)
- [x] Frontend production build: passing
- [ ] **Tested (dwelling):** ⬜ first desktop launch by KP's hand
- [ ] First data: household members added by the family itself

### Session 2026-07-12: The Sattva Door ✅
- [x] Overwhelm system renamed **Sattva** in all family-facing places
      (KP's decision; DESIGN-005): ComfortBar button "Sattva", route
      `/sattva`, dashboard "is seeking sattva", Me's "Sattva protocol",
      Settings copy, README grammar table
- [x] Code identifiers + `overwhelm_events` table KEEP legacy names
      (deliberate — installed device carries data; comments say so inline)
- [x] 30-second pause untouched (protected boundary)
- [ ] **Tested (dwelling):** ⬜ KP presses the Sattva door on his device

### Phase 6: Integration ⬜ (later, deliberately)
- [ ] Resonance Bridge sync (consent-based, per member, per data class) — see also chamber seed THE-VESSEL-GRAPHS-AND-THE-DEVICE-WEAVE (2026-07-18): the hosted-Hearth direction (house ring on the home host, phones visit; offline slices for store runs; floor = one phone, whole)
- [ ] Echoes reflections ↔ overwhelm recovery logs
- [ ] Compass energy predictions → spoon suggestions
- [x] ~~Android APK via sign-release.py~~ — v0.1.0 built + signed + shipped 2026-07-11 (`release/`); **still owed: the REBUILD carrying the Sattva rename + gold icons + 16 KB flags** ⬜

### Phase 7: Dwelling ⬜
- [ ] The family lives in it. The household breathes. (Bimodal testing law:
      experience validated by use.)

---

## KNOWN BUGS
| ID | Description | Status |
|----|-------------|--------|
| B1 | capabilities/default.json had a UTF-8 BOM (PS 5.1 Set-Content) → tauri build "expected value at line 1 column 1" | ✅ fixed 2026-07-11, first launch night |

## NEXT SITTING
- [ ] **Hearth icon** — KP wants to create a proper one (replaces inherited
      Echoes icons in src-tauri/icons/ + static/). His hands, his art.
- [ ] KP's dwelling test findings from first pass → triage here.

## SESSION LOG
| Date | What Was Done |
|------|---------------|
| 2026-07-11 | Cartography with KP; clone of Echoes; full gentle-core prototype; all eight rooms; check+build clean; standards docs; first commit 56e7c9e. Boundaries: 30s pause + window-not-monitor enforced in data. First launch by KP's hand same night; BOM bug found-and-fixed in thirty seconds (the dwelling is the test). v0.1.0 APK built + signed + shipped same night. |
| 2026-07-12 | The Sattva Door (rename, family-facing; DESIGN-005). The Table's constitution tied together. SPIKE-001 (the Weave Handshake) staged for its own sitting. |
| 2026-07-13/15 | Gold-band icons forged; cosmic distribution + managed constants mirror. Installed device still runs the pre-Sattva build — rebuild owed (see Phase 6 note). |
| 2026-07-18 | Checklist reconciled to the artifacts. New chamber seed carries KP's hosted-Hearth architecture thinking (house ring on home host; offline slices; floor = one phone, whole; "serve my families needs without excluding the populous"). |
