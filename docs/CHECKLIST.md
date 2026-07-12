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

### Phase 6: Integration ⬜ (later, deliberately)
- [ ] Resonance Bridge sync (consent-based, per member, per data class)
- [ ] Echoes reflections ↔ overwhelm recovery logs
- [ ] Compass energy predictions → spoon suggestions
- [ ] Android APK via sign-release.py (Sanctuary distribution; never Play)

### Phase 7: Dwelling ⬜
- [ ] The family lives in it. The household breathes. (Bimodal testing law:
      experience validated by use.)

---

## KNOWN BUGS
| ID | Description | Status |
|----|-------------|--------|
| — | none known yet | — |

## SESSION LOG
| Date | What Was Done |
|------|---------------|
| 2026-07-11 | Cartography with KP; clone of Echoes; full gentle-core prototype; all eight rooms; check+build clean; standards docs; first commit. Boundaries: 30s pause + window-not-monitor enforced in data. |
