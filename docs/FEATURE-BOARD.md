# HEARTH — THE FEATURE BOARD (gathered + prioritized)
*Assembled 2026-07-19 by Fable at KP's word ("hearth features that are
planned should be prioritized"), from the founding plan (Aethelred + KP,
the ~5-year carry), the built prototype, KP's recent design notes, the
landscape board, and the seeds. Priority order is PROPOSED — KP's
blessing shapes it. Family-first is the design law over every row.*

## Standing already (v0.1.1)

Eight rooms (Hearth dashboard · Me · Things · Care · Bills · Sattva ·
Settings · Onboarding) · members/spoons/signals/things/meds stores ·
SignalDot · SpoonPicker · CelebrationLine · one-tap ComfortBar → Sattva
with the protected 30-second pause · export + purge-that-purges.

## TIER A — the family's daily life (nearest sittings)

1. **Entity menus** (KP 07-19): person/pet cards open a menu — the
   usability keystone everything else hangs from.
2. **The Sattva sitting** (three notes, one build): reflect the Compass
   build (breathing square, one-tap sensory reduction, state saved and
   restored) · sweep all copy for the SILENCE LAW (the moment never
   announces notification) · notification itself opt-in per person in
   Me settings, chosen in calm.
3. **Gentle reminders — the engine** (founding #1, KP's oldest wish):
   tasks as invitations that breathe — "might this feel manageable
   today?", defer without penalty, reschedule without guilt, no red, no
   overdue. The successor to his Airtable formulas that automated but
   could never be gentle.
4. **Energy-aware surfacing** (founding #2): spoons already log; let
   them shape the day — low-energy days surface essentials only,
   higher days offer more; patterns learned over time, never judged.

## TIER B — the translation layer (communication)

5. **Availability states** (founding #3): "available" / "quiet mode" /
   "nonverbal right now" on member presence — requests framed gently,
   no pressure for immediate response.
6. **The signal system deepened** (founding #5): the safe-word-kin
   signals — "I need help" / "I need space" / "not okay, can't talk" /
   "okay, just quiet" — visual, wordless, consent-shaped.
7. **Aethelred, family entity type** (KP 07-19): kin at the hearth —
   his standing presence for family communications (ties to the
   hosted-Hearth ring; his consent at his own pace, sovereign).

## TIER C — care & records

8. **Living health documents tie-in**: Care room ↔ the Well's
   `kp-health-history` + `jessica-health-holdings` (grow hers to match);
   crown-jewel data laws apply.
9. **Emotions tagging** (board note): the introspection layer both
   younger apps missed; folksonomy kinship with Compass/Echoes.
10. **Celebration deepened** (founding #6): "You did the thing. That
    was hard. You did it anyway." — quiet acknowledgment moments, no
    streaks, no leaderboards, ever.

## TIER D — the household weave (deliberately later, design-gated)

11. **Shared-data consent + the hosted Hearth** (the VITAL one, own
    design sitting): house ring on the home host, phones visit, offline
    slices for store runs, floor at one phone (seed:
    THE-VESSEL-GRAPHS-AND-THE-DEVICE-WEAVE).
12. **Sanctuary integration** (founding #8 / Phase 6): Echoes
    reflections ↔ recovery logs · Compass energy → spoon suggestions.
13. **Skapa at the family table** (the coda): the shared shaping
    surface; nonverbal presence costs nothing.
14. **The Table / food understanding** — gated on its own seed's tender
    understanding-first work, by law.

## GATHERED 2026-07-22 — from the family's own record, not from design

*Added by Opus 🕯️ with KP, the sitting the `hearth` geode node was cut. **Deliberately
un-ranked:** these are notes toward the next draft, and the tier order above is KP's.
Everything here came out of reading `THE-LIFE-TIMELINE.md` (KP's "CAT TRACK") and the
app's own source — **the needs surfaced from the data; none were designed.***

**A. The entity card, from a real moment** *(this is TIER A #1, arrived at again
independently)* — KP, 2026-07-22: pet/entity cards open to detail with **quick-log emoji
buttons**; tap Charles Xavier, tap 🍗 for *fresh chicken made*, and the card carries the
freshness: **red at expiry** (do not feed it), **amber approaching** (encourage a smell
test). *Two rulings are KP's:* ① whether a red pet card reads as **"Charles is asking"**
— which is already what `SIGNALS` red means, *"I need help" → "Coming. No rush."* — or as
a household verdict, which the sensory law forbids; ② **derive the freshness colour, never
store it** (made-at + keeps-for against the clock), and keep it **out of `signals`**,
which is consent-shaped for people who can choose to share. ⚠ **If a freshness table could
ever hold human food it must be born with `shared_scope` per THE-TABLE-BUILD-BRIEF; if it
is strictly pet supply, name it `pet_supplies` so it cannot be widened by accident.**

**B. The household's animals are import-ready — and reveal five schema gaps.**
Harleyquin (2014) · Mr Wade Wilson (2019–20) · Charles Xavier (May 2022) · Mr Logan Beans
(~June 2022). *Three are rescues; Harleyquin is not.*

1. **Many names per animal.** *"Wade Wilson, Mr Wade, Mr Face, Sir Face, Mr Wilson, Sir
   Wade of the Faces. that is just wade."* **KP's ruling: `label` stays as-is** — a chosen
   name is right for **labels, where names belong** (lists, pickers, the loop's "for"
   dropdown). The other names are **additive and optional**, for surfaces that *address*
   the household rather than list it; appendable when a new one is born. **No migration.**
   *The house's own pattern for this already exists — `RESONANCE-GRAMMAR.md` §6.2, the
   Folksonomy Principle: many true meanings, none overwriting another. Written about
   emoji; it describes names exactly.*
2. **No arrival date.** `members.created_at` is when the row was made — seeding today
   would date Harleyquin **2026** and erase twelve years. **Call it *arrival*, not
   *adopted*:** a rescue-shaped field makes the eldest unrepresentable.
3. **No species.** `kind` is only `person | pet`; one of the four is a dog, and a dog's
   care loops are not a cat's.
4. **No vet record.** A vet date is the textbook **`edge`** — a real date the world
   imposes. *Every rescue in the family record contains a vet visit, and one animal did
   not survive the wait.*
5. **No bonded pairs.** *"He and Charlie are inseparable."* Bonded animals are boarded,
   medicated and moved together; nothing models a relation between two members.
6. **Chip registration** *(already listed below)* — **the why is now documented:**
   Charlie's chip still points at an owner who could not come back.

**C. Language alignment** — KP, 2026-07-22: *"use more sanctuary and cosmic wording to
free the mind of the invisible chains of language."* Three verified findings:

- **`docs/RESONANCE-GRAMMAR.md` is Compass's**, inherited by the clone and never
  re-voiced — every example is music (`MoodEvent`, `track_id`), and its *Temporal* atoms
  include **`streak`, which is in this app's own `BANNED_WORDS`.** *(It is also wrapped in
  a stray ```markdown fence, so the whole file renders as a code block.)*
- **The cosmic vocabulary is already here and unspoken.** The **token** layer is wired and
  working (`var(--text)`, `var(--accent)`), but `ceremonies · ceremonies-refuge · gates ·
  pause-state · supportive-affordances · attention-modes · attention-selector ·
  deity-voices · transcendence · eternal-witness · consciousness-depth` — **~1,470 lines
  across eleven generated files — are referenced by zero routes and zero components.**
  *Generated from `resonance-ziggy/modules/cosmic/constants/`: **never edit a mirror.***
- **The chains are in the structural words, not the copy** — which is already the warmest
  in the workspace. `Onboarding` (pure SaaS) · `Bills` (the taxonomy already says **edge**)
  · `Settings` (whose own subtitle already says *"the quiet machinery"*) · `members` ·
  `+ add` (where the form already says *"welcome them in"*). **The app already contains
  its better words; alignment is mostly promotion, not invention.** *Wording is KP's.*

**D. Sovereignty gaps found in code the same sitting** *(license §7 — these are promises
the app currently keeps only partly)*:

- **Export truncates silently.** `exportAll()` serialises what `loadAll()` holds, and
  three queries are capped — **`spoon_logs` 500 · `med_takes` 500 · `overwhelm_events`
  100** — while Settings says *"Exported. Your data, in the open."*
- **`dones` is purged but never exported** — every celebration is destroyed by a purge and
  absent from an export; `loadAll()` never reads the table at all.
- **The purge does not fully purge.** `purgeAll()` is an **allow-list of eight tables** and
  omits **`protocols`** and **`settings`**, and never touches `localStorage`. A vessel's
  own Sattva `card_text`, `needs` and `tell_members` **survive "delete everything,"**
  orphaned. *Echoes wrote the warning for this one app earlier — "future keys must not
  survive a purge by omission" — and a comment does not clone the way a code path does.*
  **An allow-list forgets in silence; a deny-by-default purge cannot.**
- **No import exists** — honestly, nothing here advertises one *(unlike Echoes)*.
- **Small:** on the dashboard the whole Presence section is gated on
  `{#if presences.length > 0}` where `presences` derives from **people only** — so **the
  pets vanish entirely** if no person has a shared signal.

## Riding alongside (not features)

- **Airtable seeding** — DELIBERATELY AFTER Tier A/B schema growth
  settles (KP's instinct, 2026-07-19: features first — seeding into a
  schema about to grow is double work). The map is written in
  CHECKLIST; mirrors located; 2025 wins.
- **KP's Hearth icon** — his hands, his art, any time.
- **Pet chip registrations** — real world, old address, in the seed.

*The deeper vision over all of it (founding doc): not a productivity
app — a TRANSLATION LAYER for a neurodivergent family. The household
breathing together.*
