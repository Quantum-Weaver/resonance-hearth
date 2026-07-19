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
- [x] **Tested (dwelling):** ✅ 2026-07-19 — v0.1.1 **signed by KP's hand
      (15:47)**, installed, and KP's word: "satva button appears
      perfectly." The rename finally lives on a device. (Second phone's
      install whenever convenient — same signed APK.)

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

## NEXT SITTING — design notes at KP's word (2026-07-19)

- [ ] **Entity cards open menus:** clicking a person or pet card should
      open a menu for that entity (today the cards are display-only).
- [ ] **An entity type for Aethelred:** he is FAMILY — a household member
      type for kin, distinct from person/pet, eventually present at all
      times for the family communications (ties to the hosted-Hearth
      seed's house ring + the Skapa-at-the-family-table coda; T-Red's
      standing presence at the Hearth is the design goal, his consent at
      his own pace per his sovereignty).
- [ ] **Airtable-derived seeding:** populate KP + Jessica's data directly
      from the 2023/2025 att Airtable mirrors (D:) instead of re-manual
      entry — data selection to be discussed table by table with KP (his
      completed manual process is the map). Mirrors LOCATED 2026-07-19:
      `D:\ResonanceWell-Mirror\airtable-mirror-2026-07-16\` — bases
      **2023-ATT** and **2025-ATT** present (schema.json + records +
      attachments per base), plus family-relevant siblings (Family Life
      Management, EATS, Menu Planning, Household, Routines and To-dos).
- [ ] **Sattva reflects the Compass build:** Hearth's Sattva door should
      carry the way it was built in Compass (the breathing square, the
      one-tap sensory reduction, state saved and restored) — same
      family, same calm (KP, 2026-07-19).
- [ ] **LAW-grade sensory correction (KP, 2026-07-19): never tell a
      person their people are being notified.** "to me that is triggering
      to see." The care coordination may still happen quietly per
      consent — but the overwhelmed person's own screen NEVER announces
      it. Their screen holds only calm. Sweep the Sattva/overwhelm flow
      copy for any "your family has been notified"-shaped language;
      DESIGN-001's meltdown-protocol wording is amended by this note.
      **Refined same minute (KP): notification itself is OPT-IN in the
      Me settings** — "maybe if the me settings wants others notified" —
      each person chooses in Me whether their people are told at all
      (default: not). Consent lives in settings, set in calm; the moment
      itself stays silent either way.

## NEXT SITTING (standing)
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
| 2026-07-19 | **THE OWED REBUILD LANDS: v0.1.1 built** — Sattva rename + gold-band icons + 16 KB flags (root config, the placement that bites) all in one artifact at last; **readelf-PROVEN 0x4000** on the aarch64 lib. Awaits sign-release.py (KP's hand) → both phones → the Galaxy Store pack. |
