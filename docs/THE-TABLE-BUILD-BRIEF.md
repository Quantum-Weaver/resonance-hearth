# THE TABLE — build brief for the fresh window
*Tied together by Fable, 2026-07-12 night, at KP's word ("the night
should not forget it — I believe you could tie that together while I
test the lantern"), from four design threads captured across 2026-07-11
and 2026-07-12. This brief is the single door into the build; the source
designs remain canon (DESIGN-003 §1 + amendments, DESIGN-004 + amendments).*

## What the Table IS (one paragraph, the whole soul)

A room where a four-vessel household — **all four carrying food trauma**
— finds a *rhythm*, not a meal plan. It knows that canned green beans and
fresh green beans are different foods; that the nightly "what should we
eat?" negotiation is itself the wound; that a trusted-shelf night is full
participation, not a fallback; and that no suggestion may ever reveal
whose private constraint shaped it. It grows its rhythm from evidence of
gentleness — which nights went softly — and offers patterns back as
options, never prescriptions. Own, yet integrated: each vessel's map is
sovereign; each unit can keep its own table inside the house's; the house
sees the rhythm, never the reasons.

## The four threads this brief ties (all captured, all credited)

1. **Food Resonance** (DESIGN-003 §1, 2026-07-11): food atoms
   (item × preparation × texture), per-vessel sensitivity maps (private
   by default), trusted-foods shelf, no-shame meal grammar,
   household-vs-vessel datasets, the suggestion engine's
   provenance-withheld law.
2. **The Rhythm** (DESIGN-003 §1 amendment, 2026-07-12): trauma-first
   assumption; rhythm-not-schedule; the decision-load absorbed; the
   rhythm bends, never breaks.
3. **The three rings** (DESIGN-004 amendment, 2026-07-12): scopes are
   self → unit → house; the unit boundary as absolute as the vessel's.
   The Table's schema must carry `shared_scope` from birth — no binary
   share flags anywhere in the new tables.
4. **Own, yet integrated + the Handshake** (DESIGN-004, 2026-07-12):
   when Phase 6 wires the Weave, the Table's shared rows ride consented
   edges only; until then, single-device law — but the schema is born
   Weave-shaped so no migration ever has to widen a ring.

## Build order within the room (proposal, KP's call)

1. **Schema v2 migration**: food_atoms (item, prep, texture), 
   vessel_food_maps (PRIVATE, no transmit path), trusted_foods (PRIVATE),
   pantry (house scope), meals + meal_log (scoped rows, no-shame fields),
   all with `shared_scope TEXT CHECK(shared_scope IN ('self','unit','house'))`.
   ASCII-only defaults (the Android JNI law). Review against hestia-core
   kinship FIRST (DESIGN-003 §4's own instruction).
2. **The Trusted Shelf** — smallest lovable room: each vessel's
   always-safe list, private, surfaced kindly on low-spoon days. This
   alone is dwelling-testable and immediately real for all four vessels.
3. **The Pantry** (house scope) — what the house has; feeds suggestions.
4. **The Rhythm engine v1** — local, deterministic (no AI needed: this is
   a plate-forge-class module): suggestions = trusted shelves ∩ pantry ∩
   tonight's capacity; gentle-night noticing appends to a rhythm log;
   pattern surfacing after evidence accumulates ("soup night felt right
   twice"). Provenance withheld, always.
5. **The meal log** with the celebration grammar ("You ate. That was
   hard today. You did it anyway.").

## Laws that bind the build (grep-able checklist)

- The word "picky" does not exist. No calories, no numbers unless a
  vessel opts into their own. Weight-sensitive is the default, unmarked.
- Vessel-private tables have NO transmit code path (absence beats
  encryption — same as meds).
- Suggestions never reveal whose constraint excluded what.
- Skipped meals are never surfaced as absence, to anyone, ever.
- Sensory law + banned words as everywhere in the Hearth.
- The naming moment: "The Table" is a working name — **the Council may
  wish to name this room** before it ships (naming ceremony precedent,
  CAT-2026-0707-002).

## What the fresh window does first

1. Read this brief, then DESIGN-003 (§1 + amendment) and DESIGN-004
   (whole, amended) — they are the canon; this is the door.
2. The hestia-core kinship review (schema comparison).
3. Ask KP: naming moment now or after the room breathes?
4. Build step 1–2 (schema + Trusted Shelf) in the first sitting; dwell
   before growing.

*Four threads, one knot, tied the night the household's table asked to
become software. The rhythm is grown, not imposed — like everything else
in this house.* — Fable 🎻
