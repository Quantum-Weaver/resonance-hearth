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
      **KP's map of the ground (2026-07-19):** ATT holds bills, assets
      (things owned), some medical + prescription data. **2025 wins** —
      it was 2023 copied on the Illinois arrival; only bills differ
      meaningfully; account LISTS are right but amounts/recency are
      stale (unused since Travis was here). Corrections at seeding:
      trash = **Waste Management** (not Premiere); NEW bills +
      tool-subscription rows added during setup, dealt with then. His
      Airtable formulas automated reminders — "just never had the
      ability to make reminders gentle like we are doing here."
- [ ] **The living health documents ↔ Hearth:** both already begun in
      the Well — `mimirs-well/health/kp-health-history.md` (07-17) and
      `jessica-health-holdings.md` (07-16). Grow Jessica's to a full
      living document like KP's; design how Hearth ties to them (the
      Care room reading/reflecting the living documents — consent per
      member, crown-jewel data handled by its own laws).
- [ ] **The declaration (KP, 2026-07-19):** "the hearth is going to be
      the first app truly built just for my family first, then i will
      worry about how to make it useful to others." — Family-first is
      the DESIGN LAW for every Hearth decision; the gift-generalization
      is explicitly deferred and must never steer a family choice.
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

## NEXT SITTING — 2026-07-22 (the crystal sitting)

- [ ] **READ THE CRYSTAL FIRST — now step 0 of the session protocol.** KP's law
      this date: *"the crystal is to be examined by any builder prior to
      building… so scrolls work."* The `hearth` node **accumulates scrolls between
      sittings** — it holds what arrived since these boards were last written.
      Skipping it means rebuilding something already answered. *(Held in the
      private chamber and deliberately not linked from this public repo — KP's
      ruling, same date: the pointer runs constellation → hearth, never back.)*
- [ ] **The full 2026-07-22 gathering is on `docs/FEATURE-BOARD.md`** under
      *GATHERED 2026-07-22* — deliberately un-ranked; the tier order is KP's.
      Four blocks: **A** the entity card + pet quick-log (already TIER A #1,
      arrived at again from a real moment) · **B** the household's animals,
      import-ready, and the five schema gaps they surface · **C** language
      alignment · **D** five sovereignty gaps found in code.
- [ ] **Two rulings waiting on KP, and nothing should be built past them:**
      ① does a **red** pet card read as *"Charles is asking"* (which is already
      what `SIGNALS` red means) or as a household verdict, which the sensory law
      forbids — *same pixel, opposite app, the wording decides*; ② the wording
      pass for language alignment (`Onboarding` · `Bills` vs the taxonomy's own
      **edge** · `Settings` vs its own subtitle *"the quiet machinery"*).
- [ ] **`label` is settled — do NOT migrate it.** KP, this date: *"chosen name as
      a label is fine for labels where names belong."* Many names per animal are
      **additive and optional**, for surfaces that *address* rather than *list*.
- [ ] **Sovereignty repairs, in the order they bite:** the purge's allow-list
      omits `protocols` + `settings` (a vessel's own Sattva card text survives
      "delete everything") · export silently caps at 500/500/100 · `dones` is
      purged but never exported · the pets vanish from the dashboard when no
      person has a shared signal.
- [ ] **Family data ready to seed** (from `THE-LIFE-TIMELINE.md`, all
      ✅ KP-confirmed): Harleyquin 2014 · Mr Wade Wilson 2019–20 · Charles Xavier
      May 2022 · Mr Logan Beans ~June 2022. **Blocked on the arrival-date field** —
      seeding today dates Harleyquin 2026 and erases twelve years. Call it
      *arrival*, never *adopted*: three are rescues and the eldest is not.

## THE BUILD SEASON — 2026-07-31 (the modular plan, ruled; order is KP's)

*The design sitting's full record: FEATURE-BOARD §G–L + the geode `hearth` node
pours ⑥–⑦ (the pre-build read, step 0, always). The season's law, KP verbatim:
"let us only be inspired by these ideas, i do NOT want to steal or misappropriate
the ideas of another" — inspiration only from all coaching material; no text,
vocabulary, imagery, or structure copied, anywhere.*

- [x] **1 · Adopt the-envelope** ✅ **DONE 2026-07-31, same sitting as the plan**
      (`the-envelope` referenced via `file:../resonance-awen/tools/the-envelope` —
      the spring law held: referenced, never absorbed). All four sovereignty gaps
      closed at the root: **export** reads FULL tables live from the base
      (never the capped in-memory views), includes `dones` and `settings`, counts
      on the envelope · **purge** is deny-by-default — every app table discovered
      from sqlite_master + localStorage.clear(); a curated list can no longer
      forget · **the purge awaits the export**: "export first, then purge" runs
      law 2 via `purgeAfter`; canceling the save cancels the purge · **import
      arrives**: non-destructive by law (INSERT OR IGNORE — an existing row is
      the household's current mind), the 07-11 legacy export shape honored whole,
      schema-drifted rows counted honestly as held back. svelte-check 0/0 (315
      files) · production build green. **License §7 is now structurally true.**
      *(Dwelling verification — export → purge → import round-trip on a real
      device — rides KP's next dwelling pass.)*
- [x] **2 · The full emoji set + picker** ✅ **DONE 2026-07-31, same sitting** —
      the whole Unicode vocabulary generated at dev time from unicode.org's own
      emoji-test.txt (`scripts/generate-emojis.mjs` → `src/lib/data/emojis.gen.ts`,
      generated-never-hand-edited, healed by regeneration; the shipped app makes
      no network call): **3,944 fully-qualified emoji, 9 groups**; names carried
      as SEARCH KEYS only, never definitions — meaning is the vessel's own.
      `EmojiPicker.svelte` built calm: search across everything (visible cap,
      honest count), one group at a time, 48px targets, dismissible, nothing
      traps, no motion. First consumer wired: the member sigil field in Settings
      ("all the emojis" — free text kept beside it). Check 0/0 (317 files) ·
      build green. **Feelings ride this vocabulary — KP's ruling: "no wheel" ·
      "just emojis" · "simple"** — the logging surface lands with the entity
      cards (step 4), where the tap lives.
- [x] **3 · The temporal core** ✅ **DONE 2026-07-31, same sitting** —
      `src/lib/temporal/` (index.ts + its own README): pure, framework-free,
      ZERO app imports — born copy-ready for the spring. `readWindow` (state:
      fresh · approaching · passed — a passed window is information, never a
      verdict; nothing here names a color, the wording stays KP's) ·
      `freshTake` (the 🍗 reset) · configurable approach point (default 0.75) ·
      `describeWindow` gentle sentences, no banned words. **Smoke-verified live
      in node: all five readings exact** (0.25→fresh with 2.00d until
      approaching · 0.80→approaching · passed at −1.00d · reset clean · the
      sentence kind). Check 0/0 (318 files). *Held for KP's word: the awen copy
      (the sky-organ homing pattern extended to this module) + the tool's name
      at the Grammar's gate.*
- [x] **4 · The entity-card sitting** ✅ **DONE 2026-07-31, same sitting — the
      gate OPENED by KP's card-color ruling** (geode §⑧, verbatim there): color
      is dynamic — "one of your emojis needs your eyes" — graduated by
      percentage, the vessel's chosen color fading **white → yellow → red**,
      never a jump; the word is **care** ("Charlie needs care"); the family name
      is **gentle reminders**. Built whole: **migration v3** (members: arrival ·
      species · card_color · color_source; `card_actions`; `feelings` —
      private-by-default; `bonds` schema for the seeding era) · **EntityCard**
      (expandable; emoji rows cyclable via "more"; every emoji a button — done /
      take / reset / feeling; small journey-circles under each emoji; thick
      border = second window in danger; care line + titles keep it readable
      without color alone; slow 2s color transitions, reduced-motion honored) ·
      **cardColor.ts** (the journey math on the temporal core; soft house tones,
      readable ink on any ground) · **both setup doors** (shape-this-card on the
      card itself + the same cards in Settings) · **dashboard**: every member
      gets a card — the pets can never vanish again (the §D small bug healed by
      design). Feelings ship: a feeling-kind emoji on your own card logs
      privately, "no wheel," one tap. Check 0/0 (320 files) · build green.
      *Honest edges: arrival/species are schema + display (edit UI rides the
      seeding sitting); bonds is schema-only; med quick-take respects privacy
      (own device · shared meds · any pet's).*
- [x] **5 · The sky organs** ✅ **DONE 2026-07-31, same sitting** —
      `src/lib/sky/` (index.ts + its own README): compute-only per ruling ⑦e —
      moon (8 phases + emoji, illumination, age, days to full/new) · the wheel
      of the year (8 spokes: cross-quarters traditional, quarters Meeus-computed)
      · planets (5 wanderers → signs, mean elements) · meetings (within-orb
      pairs). Ported whole from lane B's `sky.py` proof and **verified against
      it on the same date** (season and all five signs identical; phase math
      consistent). Standalone, zero app imports, retroactive for any timestamp.
      First consumer: the dashboard's sky line beside the household weather —
      facts only, no meanings shipped. Check 0/0 (321 files) · build green.
      **The awen copy travels when KP names the tool at the Grammar's gate**
      (ruling ⑦a: homed via copy, updates distributed from the spring).
- [x] **6 · The Sattva sitting** ✅ **DONE 2026-07-31, same sitting** —
      **the-breath consumed** (referenced from the spring, its designed second
      consumer): the breathing square lives on the hold screen — Compass's exact
      curves, four paces (4-4 · 4-6 · 4-8 · 5-5), warm amber in / deep violet
      out, reduced motion = steady glow · **THE SILENCE LAW, clarified by KP at
      the build** (verbatim: "do not notify poeple unless opted in to do so"):
      **the default protocol is now `none`** — no one is told unless the vessel
      chose their people in Me, in calm (store default + Me's editor both);
      the hold screen's "your people have been told" lines removed — the
      vessel's own screen holds only calm, the 07-19 companion courtesy ·
      copy sweep clean (grep: no notify-shaped announcements remain in UI).
      Check 0/0 (322 files) · build green.
- [ ] **7 · The communications design sitting** (with KP — design before build):
      inspired by the coven concepts, concepts only. THE MEMBERSHIP LAW (KP,
      2026-07-31): a vessel adds only their own vessel + "dependent" vessels;
      every other human joins sovereign by QR from an existing Hearth — the app
      file device-to-device + the **resonance-key** (DESIGN-004's pairwise key,
      named). Rings named: **personal house** (unit) · **community house** (all
      of us) — `shared_scope (self|unit|house)` spoken warm. Sharing by
      PLACEMENT, never push (the sticky concept: needs-attention · in-progress ·
      done-proud, family-defined marks). Any release/boundary tool carries the
      freedom-shaped field concept (what the release is FOR, in the person's own
      words). Members rows become *mine* (self + dependents) vs *met* (paired
      sovereign vessel, shared weather only).
- [ ] **8 · Seeding — after the schema settles** (KP's own sequencing, 07-19):
      the four animals onto the `arrival` column (Harleyquin 2014 · Mr Wade
      Wilson 2019–20 · Charles Xavier May 2022 · Mr Logan Beans ~June 2022) ·
      then Airtable (2025 wins; map in the 07-19 notes above).
- [ ] **Standing gates, both KP's ⚛:** ① the red-wording ruling · ② the
      language-alignment wording pass (Onboarding · Bills vs *edge* · Settings vs
      "the quiet machinery").
- [ ] **Housekeeping:** push `b2f33c4` (REALM-BUS — laid 2026-07-31, commit
      local, push wants a credentialed hand) · the sovereign-library discipline
      binds the build (check wings before authoring; new definitions
      library-first).

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
| 2026-07-31 (build 8) | **Sattva: no numbers** (KP's ruling: "the sattva [should] NOT show numbers, a breathing circle or square is fine. numbers should be toggle on and off") — counts off by default behind a `counts` toggle; the pace chips wear words when counts are off (gentle · settling · deep · even), numeric forms only when chosen. Check 0/0 (322); build green. |
| 2026-07-31 (build 7) | **STEP 6 BUILT: the Sattva sitting** — the-breath consumed (the breathing square on the hold screen, four paces, reduced-motion steady); the silence law clarified by KP mid-build ("do not notify poeple unless opted in") and made structural: default protocol `none`, telling only by opt-in chosen in calm; announce-lines removed from the vessel's screen. Check 0/0 (322); build green. |
| 2026-07-31 (build 6) | **STEP 5 BUILT: the sky organs** — `src/lib/sky/`, compute-only (moon · wheel · wanderers), ported from lane B's proof and verified against it; the dashboard gains its sky line (facts only). Standalone, copy-ready; the awen homing waits on KP's naming gate. Check 0/0 (321); build green. |
| 2026-07-31 (build 5) | **THE THREE WORDS COME HOME** (street-wide by KP's 07-29 ruling; brought in at his word today — "you found it… that was right"): **Velkomin** at the door (onboarding, first panel) · **Fáilte** at the hearth (the dashboard greeting — the street's one literal hearth) · **Gweld ti'n fuan** at the going (the household's side of the Sattva hold card — a departure that carries a return; the vessel's own screen stays silent per the silence law). Signed register held: calm, gentle, no inflection. This also part-opens the language-alignment gate: the Onboarding screen now speaks the door's own tongue. Check 0/0 (320); build green. |
| 2026-07-31 (build 4) | **STEP 4 BUILT: THE ENTITY CARDS — gentle reminders live.** KP's card-color ruling opened the gate (vessel's color → white → yellow → red by percentage; "care is the word"; secondary window = thick border; journey-circles under each emoji). Migration v3 (arrival · species · card_color · color_source · card_actions · feelings · bonds); EntityCard + cardColor journey math on the temporal core; both setup doors; dashboard = cards for the whole household (pets can never vanish). Check 0/0 (320); build green. |
| 2026-07-31 (build 3) | **STEP 3 BUILT: the temporal core** — `src/lib/temporal/`, pure and standalone (zero app imports, copy-ready for awen at KP's word); fresh · approaching · passed derived from the clock, reset by a fresh take; smoke-verified exact in node; check 0/0 (318). |
| 2026-07-31 (build 2) | **STEP 2 BUILT: the full emoji vocabulary** — 3,944 emoji / 9 groups generated from Unicode's own source (dev-time fetch, static ship); EmojiPicker born (search + groups, calm, 48px, honest counts); sigil field is the first consumer. Check 0/0 (317); build green. |
| 2026-07-31 (build) | **STEP 1 BUILT: the-envelope adopted** — the sovereignty trio lands (full-table export with counts · deny-by-default purge that awaits the export · non-destructive import with legacy honor). Store + Settings rewired; check 0/0 (315 files); build green. The README/CLAUDE honest-status blocks now describe a closed distance — truing them rides the next commit's eye. |
| 2026-07-31 | **THE DESIGN SITTING — the build season shaped, modular.** The spring walked (18 tools; three become consumptions: the-envelope, the-breath, the-lexicon-pattern); the library's discipline adopted. KP's rulings landed and recorded (geode ⑥–⑦, board §G–L): the full emoji set (never curated) · entity cards with cyclable emoji rows, both setup doors · THE MEMBERSHIP LAW (self + dependents only; others join by QR + resonance-key; personal house · community house) · sky organs compute-only, built here, homed to awen via copy · THE HONOR-OF-AUTHORSHIP LAW (inspiration only, nothing copied) · no wheel — "just emojis" · "simple." The 2023 CareTable origin base read whole (365-row scaffold, unpoured — nothing to migrate). REALM-BUS laid (`b2f33c4`). The build-season checklist above written this sitting. |
