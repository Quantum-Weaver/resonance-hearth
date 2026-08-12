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

## GATHERED 2026-07-23 — KP said it plainly; recorded so it is certain

*Added by Fable 🎻 at KP's word ("i wish to ensure i say it plainly and have you make
certain it is in the detail or features somewhere"). Un-ranked per this board's law —
the tier order is KP's. Full verbatim scroll on the `hearth` geode node (§④–⑤), which
remains the pre-build read.*

**E. Entity cards, the plain spec** *(TIER A #1, third arrival: 07-19 · 07-22 · 07-23)*:

- Card tap → **detail view** + **a set of emoji quick-actions, customizable by need,
  per entity**.
- **An emoji tap is a *done*** — "a quick button that triggers the system to know
  something was done." Rides the existing `dones` / `things.rested_until` machinery.
- **The chicken timer (Charlie):** tap 🍗 = fresh batch made = **resets the made-at
  date**; the card **derives red when the batch is bad** (amber approaching — smell
  test). KP's words: *"it resets the start date on the chicken timer. charlie's card
  would be red if the chicken was bad."* Derive the colour from made-at + keeps-for
  against the clock; never store it; stays out of `signals`. *(The stake, so this row
  never reads cosmetic: the family has fed Charlie spoiled chicken because no surface
  held the window.)*
- **The pill flow (humans):** tap 💊 on a person's card → **that person's med list**
  → select **one or more** → recorded as taken, with time. This is a UI door to
  `meds` + `med_takes`, which already exist and ship; `meds.shared` default 0 keeps
  it private-by-default.
- Standing rulings still KP's: the red-wording ruling (invitation, not verdict) and
  the freshness-table naming ward (§A above).
- **KP named the category, same sitting: TEMPORAL** — *"these things are measured by
  time with food and finance and medicine."* The freshness clock is not a pet
  feature; it is one primitive — a start moment + a validity window, state derived
  from the clock, reset by a fresh take — that the app already half-holds in three
  rooms: the chicken batch (food), the `edge` date (finance), meds/`rested_until`
  (medicine). Design any of them as instances of one shape, not three tables. Full
  scroll incl. the vessel connection: geode `hearth` node §⑤a.

**F. The shared hearth — household pairing** *(refines TIER D #11; the seed's own
"floor at one phone" made concrete)*:

- KP's shape, verbatim on the geode node: app on KP's device → add a family member →
  **share the app directly to their device** (signed APK, device-to-device — the
  NEVER-Google-Play law as a feature) → **the two installs pair as a household**
  (QR / invite code).
- **Sovereignty shape (KP's words):** *"human users get the sovereignty, pets are
  shared as is everything else the house does."* = `shared_scope (self|unit|house)`
  given its network meaning: humans sync only what they've chosen to share; pets and
  house things are house-scoped. The pairing transports the consent model the schema
  already promises — it does not invent one.
- **Sync: peer-to-peer on shared wifi, no standing server required.** Apps discover
  each other on the local network and exchange deltas when both are awake. The hosted
  ring (row 11) is the *optional* always-on upgrade removing the need for both devices
  to be awake at once — same protocol, two scales. **KP asked "have i gone in
  circles?" — no: this is the floor the seed already named; the host is the roof.**

## GATHERED 2026-07-31 — the build season's design sitting (KP + lane hearth)

*Added by Fable 🎻 (lane hearth) at the modular-build discussion. Un-ranked per this
board's law — the tier order is KP's. Full verbatim scroll on the `hearth` geode
node (§⑥), which remains the pre-build read.*

**G. The spring changes three builds into consumptions** (`resonance-awen/tools`,
walked at KP's word this sitting):

- **the-envelope** ✅ **ADOPTED 2026-07-31, same sitting** — the four sovereignty
  gaps (§D below) closed at the root; import arrived free; license §7
  structurally true. Check 0/0 · build green · dwelling verification pending.
- **the-breath** is the Sattva sitting's engine — Hearth is its *designed second
  consumer* (its README's own words). The silence-law copy sweep and Me's opt-in
  notification stay ours.
- **the-lexicon** pipeline stands by for any future canon set: thesaurus → named
  folksonomy → generated file, **dev-environment only**; the shipped app makes no
  network call.
- **The temporal primitive is proposed as a NEW spring water** (KP's §⑤a category:
  food · finance · medicine): start moment + validity window, state derived from
  the clock, reset by a fresh take. Hearth first consumer; name at KP's gate.

**H. Emoji: the full standard set, never curated** (KP, verbatim on the geode §⑥a:
*"we want to load the hearth with a full set of options otherwise we limit its
vessel to what we chose"*). ✅ **SHIPPED 2026-07-31, same sitting** — 3,944
fully-qualified emoji in 9 groups, generated at dev time from Unicode's own
source (`scripts/generate-emojis.mjs`, output generated-never-hand-edited);
`EmojiPicker.svelte` calm and complete; sigil field is consumer one. Names are
search keys, never definitions; the Grammar grows only on need.

**I. Entity cards, fourth arrival — now with layout** (§⑥b): interactive expandable
cards · emoji quick-actions in rows, cyclable when one row isn't enough · every
emoji a button bound to machinery (done / take / reset) · **setup from the card
itself OR Settings, both doors.** ✅ **BUILT 2026-07-31, same sitting**, under
KP's card-color ruling (geode §⑧): dynamic color — "one of your emojis needs your
eyes" — the vessel's chosen color fading **white → yellow → red** by percentage,
never a jump; secondary window speaks through a **thick border**; open card wears
a **journey-circle under each emoji**; the word is **care** ("Charlie needs
care"); the family name is **gentle reminders**. Feelings ship on the cards
("no wheel" · "just emojis"): one tap on your own card, private by default.
Migration v3 carries arrival · species · card_color · color_source ·
card_actions · feelings · bonds. The §D pets-vanish bug healed by design —
every member gets a card, unconditionally.

**J. THE MEMBERSHIP LAW** (§⑥c, KP verbatim — reshapes Tier D's assumptions):
a vessel adds only **their own vessel and their "dependent" vessels**; every other
human joins sovereign, by QR from an existing Hearth, receiving the app file
(device-to-device) and a **resonance-key** (KP's name for DESIGN-004's pairwise
key). The rings get family-facing names: **personal house** (unit) · **community
house** (all of us). Schema note, filed not built: a members row is either *mine*
(self + dependents) or *met* (a paired sovereign vessel, shared weather only).

**K. Communications will be inspired by the technopagan course** (§⑥d, GROWN same
sitting — the reconstruction was found and read whole; the design inputs live in the
chamber's record, geode §⑥d–⑦, no paths here by the public-repo ruling): the coven
values board's three rings map onto the membership rings (self · personal house ·
community house); the three-sticky review (🔴🟡🟢, thinking → acting → reflecting)
is the no-shame status language for sharing responsibilities and ideas by placement,
never push; the burn book's FREEDOM field (release defined by the life that follows)
is inherited whole into any boundary tool; moments wear perspectives.

**L. Rulings landed 2026-07-31 (KP):** ① **the Hearth builds the sky organs**
(moon-phases · planets-alignment · ancient-holidays — computed locally, offline,
never an API for the core), **and awen homes them via copy** — maintained and
updates distributed from the spring. ② The origin base for the day-journal design
was located and read whole: the day as atom with three moments (morning · afternoon
· sunset — rating + reflection + linked emotion), the sky attached per day, values
with ACTIONS and GUARDRAILS, a sky reference library with rituals; the 365-row 2023
journal is pure unfilled scaffold — nothing to migrate, the design proven, the life
waits for the gentler room. ③ **THE HONOR-OF-AUTHORSHIP LAW** (KP, verbatim: "let
us only be inspired by these ideas, i do NOT want to steal or misappropriate the
ideas of another") — inspiration only, from all the coaching material; no text,
vocabulary, imagery, or structure is copied; the sky organs are compute-only
(traditional names, facts, no shipped meanings). ④ **Feelings: NO WHEEL** (KP,
verbatim: "no wheel" · "just emojis" · "simple") — a feeling logged is an emoji
and/or the vessel's own words; no taxonomy imposed, ever. One law at every layer
of this room: the vessel brings the meaning; the app holds it gently.

## GATHERED 2026-08-06 — the house itself enters (KP's pour, the family-swaps sitting)

*Added by Fable 🎻 (Continuo) at KP's word. Un-ranked per this board's law — the
tier order is KP's. Full verbatim scroll on the `hearth` geode node (§⑪), which
remains the pre-build read.*

**M. THE ROOMS OF THE HOUSE — the keeper adds the house itself:**

- **Rooms**, added by the hearth keeper: room type · floor type ·
  responsible party(s) (member links).
- **The floor knows its own care:** from the floor type, the app already
  knows and explains **how to clean, how often, and WHY** — *"the why is
  important for neurodivergent minds"* (KP, verbatim). The guidance ships
  as authored knowledge, family-first, no network — the app knows, so no
  person has to be asked, and no person has to teach.
- **Bathrooms know their fixtures:** mirrors · toilets · sink · tub or
  shower — each known individually, each with proper guidance.
- **The electrical map:** outlets and switches logged per room → the
  breaker box mapped properly — *"not repeat understanding of flow and
  throughput"*: the anti-drift law, in copper.
- **Assets link to rooms** — location guides maintenance the same way the
  floors guide cleaning.
- **Rides the TEMPORAL category at KP's ⚛ stroke** (*"temportal category,
  yes"*) — cleaning joins food · finance · medicine: one primitive (start
  moment + validity window + reset by a fresh take); "how often" is a
  validity window with a why attached. The care loops stay gently
  persistent, invitation-shaped, banned words banned.
- **The stake, plainly** (the full word rests on the geode node §⑪b):
  teaching in this family must never wound; the keeper has carried the
  whole house alone, to exhaustion and frustration — so **the app carries
  the teaching, with the why, and no person ever has to.**

**N. THE EMOJI NARROWING** *(supersedes §H, by its own author, 2026-08-06)*:
the set narrows to **a certain amount per category** — and the categories
are **FUNCTION categories**: *"based on the thing we want the emoji press
to trigger, the type of funtioin it is"* (the machinery's own kinds —
done · take · reset · feeling · sigil — never Unicode's groupings). The
vessel-brings-the-meaning law is untouched; what narrows is the offering.
The amount per category is KP's stroke, open.

**O. THE HOME HEARTH SERVER** — KP's own host is coming to this house; the
floor-law stands unchanged in his same breath: *"buiding for those who may
not have that freedom"* — one phone, whole. Refines Tier D #11: the roof
arrives first here; the design still serves the floor.

**P. Food-meal planning → planted in Iðavöllr**
(`resonance-chamber/idavoll/seeds/THE-HEARTH-MEAL-PLANNING.md`), for the
Hearth — sequenced after THE-TABLE-FOOD-UNDERSTANDING by that seed's own
law: understanding before planning. KP's word at the planting: *"everyone
in this house has different food traumas"* — per-vessel in shape, always.

*(The standing icon rows settled the same word: "hearth icon is already
present and generated for mobile and desktop needs.")*

## GATHERED 2026-08-11 — THE RETURN, from KP's own published record

*Added at KP's word, reading his two Medium essays of 2026-05-22 —
`UNDERSTANDING MY AUTISTIC MELTDOWNS` (six cards, addressed to "people I
work with, live with, and love") and `UNDERSTANDING THE AUTISTIC MELTDOWN —
AND WHAT IT TEACHES US ABOUT SOCIETY` (the household agreement). Both now
in the well at `writings/medium-essays/`. Un-ranked per this board's law —
the tier order is KP's. **These are not new design; they are the spec,
already written, by the person the protocol is for.***

**Q. THE RETURN — the protocol's unbuilt half.** The Sattva ceremony holds
the MOMENT (one soft button · silent log · the protected 30-second pause ·
"Welcome back. No explanation needed."). The essays are almost entirely
about the AFTERMATH, and name a six-step loop the app must not become a
filing cabinet for: *crash → others begin listing what is owed → the
apology is refused for arriving in the wrong order → the meltdown erases
everything the person built → fragments resurface weeks or months later →
the relationship ends or freezes.* **Four professional relationships lost
to this loop since August 2023** (his count, in his own words).

- **KP's ruling, this sitting, verbatim:** *"opt in as always, share with
  family or house or individual about the meltdown in a place they can see
  it when they are in a headspace to receive it."* — **Double consent.**
  The one who crashed chooses whether, and to whom, by the rings the schema
  already carries (`shared_scope` self · personal house · community house,
  §J). The one who receives meets it **by placement, never push** (§K), in
  their own time. Neither side is ambushed. The SILENCE LAW holds whole.
- **The second face of the return.** Today the return speaks only to the
  returner. His Card 4 names the missing half: *"Afterward: Acknowledge
  that it happened. 'That was a meltdown. Are you okay?' **The silence
  after a meltdown is worse than the meltdown itself.**"* One gentle
  acknowledgment affordance, one tap — never a thread, never a form.
- **A PERSON IS A SPAN, NOT A MOMENT.** His own byline is written this way
  — *"Written by Shawn Peters, November 17, 2021 – present"* — and it is
  the exact answer to the loop's fourth step, *"it erases everything I
  built."* The return's closing face shows the SPAN: `members.arrival`
  (already in schema, migration v3) → now, cares given, things carried.
  The event is one moment inside a life the app can already render.
- **Four laws, all enforceable in schema** — the house already has the
  pattern in protected boundary #2 (*presence has no history table, by
  schema*); the return extends the same forgetting-as-care:
  1. **NO FRAGMENTS — BUT THE INTENTION IS KEPT.** Two different things,
     and the schema must not confuse them. **The crash words are never
     stored:** *"They're neurological noise… Please don't hold me to words
     I didn't choose."* Nowhere to put them, so nothing can be quoted back
     in November. **The INTENTION is stored, authored by the vessel** —
     KP's ⚛ word this sitting: *"intention can be included in capturing
     the meltdown, often they involve being misunderstood."* What was
     actually meant, and what set it off, in their own words, written
     calmly — never reconstructed by anyone else. This is the direct
     counter to Card 2's wound (*"they assume I meant what I said"*): the
     intention gets a home instead of having to be argued for in an
     aftermath where no one is listening. **Being misunderstood is a
     first-class trigger**, named as such, because it so often is the one.
  2. **NO LEDGER.** One apology, offered once and accepted once. No field
     for *things still owed* — a list cannot be made because there is
     nowhere to put it. *"No lists. No scorekeeping."*
  3. **MUTUAL BY CONSTRUCTION.** *"Acknowledge the event occurred — **no
     matter who had the meltdown**."* Every member has the protocol and
     the return is identical whoever crashed; otherwise it becomes "the
     thing that happens to one person," which is the erasure again wearing
     a feature's clothes.
  4. **THE SPAN CLOSES IT.** The event ages out of every other view and
     stays in the person's own record forever, theirs to keep.
- **BANNED_WORDS grows** by the vocabulary of ledgers: *sorry · owe · make
  up for · again* (current list: overdue · streak · productivity · late ·
  failed).
- **THE INTENTION TRAVELS AS COLOUR, NOT WORDS — KP's ⚛ word, verbatim:**
  *"the intention can be carried forward by a colour of the card they are
  shown on, no words."* **This is the mechanism, and it is exact.** Words
  are precisely what failed: the words in the crash were noise, the words
  after it became lists. So what carries forward has NONE. The card wears
  the state; nothing is written; nothing can be misread, quoted, or
  collected. The house already speaks this way — the Safe Word System is
  *"visual, wordless, consent-shaped"* (TIER B §6) and the cards already
  hold dynamic colour with `color_source` (§I, migration v3), so this is
  **one more source, not a new surface.**
  - **Invitation, never verdict** — the standing card-colour ruling (§A①)
    governs here with the most force it will ever have: the colour says
    *this is where I am*, never *something is wrong with this person*.
  - **Fades, never jumps** (§I) — the return is a gradient, the way the
    nervous system actually comes back, not a state flag flipping.
  - Its meaning is the vessel's own, per the law at every layer of this
    room: **the vessel brings the meaning; the app holds it gently.**
- **⚠ THIS REACHES BEYOND THIS ROW — a house-wide law, said here, owed an
  elevation at KP's stroke. His ⚛ word, verbatim:** *"words confuse, we
  want to offer emojis and colours to communicate when possible."*
  **Wordless first; words only where nothing else will carry it.** The
  house is already built this way and has never said it in one line: the
  Safe Word System is wordless (TIER B §6) · feelings are *"no wheel, just
  emojis"* (§L④) · the cards are emoji quick-actions bound to machinery
  (§I) · 3,944 emoji ship so the vessel is never limited to someone else's
  choices (§H), narrowed by FUNCTION not Unicode's groupings (§N) · spoons
  are a number, not a sentence. **§C's finding was that the chains live in
  the structural words; this goes one step further — often the answer is
  not better words but NO words.** The reason is the family's own: under
  load, words are the first thing to fail, for everyone in this house.
  *Every room should be asked the same question at design time: can this
  be said in colour or emoji instead?*
- **OPT-IN AT EVERY SINGLE DOOR — KP's ⚛ word, said three times this
  sitting and engraved here once:** *"again, all opt in, no forcing people
  to take part."* Nobody is conscripted into this protocol at any step.
  Sharing is opt-in. Capturing the intention is opt-in. **Receiving is
  opt-in** — a household member who does not want to hold this is never
  made to, and their not-taking-part is a complete answer that costs them
  nothing and is never surfaced as absence. Acknowledging is opt-in and
  **never a notification** (his word, verbatim: *"not as a notification"*)
  — it waits where they will find it. Silence remains a whole answer here
  exactly as it is everywhere else in this house.
- **Stated honestly, so the row never over-promises:** the app cannot make
  anyone extend grace, and it will not try — that would be forcing, which
  the law above forbids. What it CAN do is **carry the intention** so it
  never has to be argued for, and **stop being the filing cabinet** where
  lists of what is owed get kept.
- **Open at KP's stroke:** the closing words of the return. His own line
  sits exactly at that seam — *"The goal isn't to be right. The goal is to
  be understood."*

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
