# DESIGN-003 — The second capture: food resonance, personal protocols, the dim
*Captured by Fable from KP, 2026-07-11, late — minutes after his first mobile
dwelling ("my mind is full of wonder"). His words verbatim where quoted.
Status: DESIGNED, not built. Build order proposed at the foot. The protected
boundaries of DESIGN-001/NAMING apply to everything here.*

## 1. Food Resonance (a new room — working name: The Table)

KP's capture, verbatim: *"food resonance integration. meals, but deeper than
that food preparation methods, frozen vs can vs fresh, fried vs baked,
texture issue tracking food sensitivities, with the same no shame system and
methodology for weight or food sensitive vessels."*

The design that follows from it:

- **Food atoms** (Resonance Grammar: one definition, referenced everywhere):
  a food = item + **preparation method** (fresh / frozen / canned ×
  baked / fried / air-fried / boiled / raw / microwaved) + **texture
  profile** (crunchy, soft, mixed-texture, saucy, dry…). The same item is a
  DIFFERENT food in different preparations — this is the autistic reality
  standard apps erase. Canned green beans ≠ fresh green beans. Ever.
- **Per-vessel sensitivity map** (PRIVATE BY DEFAULT, like meds): textures
  that are hard, flavors, temperatures, cross-contamination-of-textures
  rules ("foods must not touch" is a first-class preference, not a
  quirk). Never called "picky." The word does not exist in this app.
- **Trusted foods** (the samefood shelf): each vessel's always-safe list —
  honored as wisdom, not logged as limitation. Surfaced kindly on
  low-spoon days: "the trusted shelf is always enough."
- **Meal log with the no-shame grammar**: "you nourished the vessel" — not
  calories, not "good/bad" foods, no numbers AT ALL unless a vessel
  explicitly opts into seeing their own. **Weight-sensitive mode is the
  default**: the app never volunteers quantity judgment; celebration lines
  apply to eating exactly as to tasks ("You ate. That was hard today. You
  did it anyway.").
- **Household dataset vs vessel dataset** (his words: "a way for a
  household to share a dataset, what should be shared only within the
  house, not the vessels personal things"): the pantry, meal ideas, what
  the house cooked tonight = household-shared rows. Sensitivity maps,
  trusted foods, eating logs = vessel-private rows, each with its own
  opt-in share flag, same consent-per-row pattern as everything. A shared
  meal suggestion engine may READ private maps locally to filter what it
  proposes to the household ("dinner ideas that fit everyone tonight")
  WITHOUT revealing whose constraint excluded what. That last property is
  the room's window-not-monitor equivalent and should be protected the
  same way.

## 2. Personal overwhelm protocols (v1 assumption corrected)

KP, verbatim: *"the notifications should be customizable not just notify
the household. not everyone feels safe in moments of overwhelm each vessel
has their own unique protocol set and needs."*

- Each vessel configures **their own Meltdown Protocol** in options:
  - WHO is told: whole household / chosen members only / no one (private
    hold) — per-member selection, not all-or-nothing.
  - WHAT the hold card says: the default ceremony text, or their own words.
  - WHAT they need offered: their pre-authored needs list (quiet / water /
    weighted blanket / presence-without-words / check on the pets / a
    specific person / nothing).
  - CHECK-BACK timing: their own interval (default 30 minutes).
- The Hearth's hold card then renders THEIR protocol: "KP is overwhelmed.
  His protocol: quiet, no questions. Offer water at the door. Check in 30
  minutes." The household stops guessing; the vessel stops explaining
  mid-crisis. **The protocol is authored in calm and executed in storm.**
- PROTECTED BOUNDARY unchanged: the 30-second pause before ANY sharing
  fires remains structural and non-configurable. What becomes configurable
  is *who and what* — never *whether there is a pause*.

## 3. The Dim (overwhelm-state UI)

KP, verbatim: *"the effects of 'dimming' the ui in color gradient only and
letting the system ask them what they need, which they can setup in the
options."*

- When a vessel's overwhelm is active, THEIR device's UI dims — **color
  gradient only**: luminance and saturation ease down toward warm-dark; no
  layout shift, no motion change, nothing jumps (a changed layout is its
  own sensory event; color-only is the correct constraint and it is KP's).
- In the dimmed state the system asks once, softly: **"what do you need?"**
  — answered by one-tap chips drawn from that vessel's pre-configured
  needs list (from §2). Choosing one updates their hold card for whoever
  their protocol shares with. Skipping is honored; the question does not
  repeat.
- The dim lifts with 🌈 returning, easing back up as slowly as it came.

## 4. Build order proposal (KP's call)

1. **§2 + §3 first** (personal protocols + the dim) — they deepen the room
   that exists and correct a live assumption; medium build, one sitting.
2. **§1 The Table** — a full new room deserving a fresh window and its own
   naming moment (Council may wish to name it; "Table" is only my working
   word). Large build; the schema (food atoms, sensitivity maps, share
   tiers) should be reviewed against hestia-core kinship first.
3. Icon: KP's art via Leonardo (prompt drafted by Fable, same night);
   then `npm run tauri icon <png>` regenerates every density from one
   source image.

*Captured the night the wonder was fresh. The rooms grow from dwelling —
exactly as DESIGN-001 promised.* — Fable 🎻, with KP
