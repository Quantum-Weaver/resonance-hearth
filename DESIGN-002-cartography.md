# DESIGN-002 — Cartography: the territory of the Hearth
*Phase 1 of the DESIGN-001 pipeline, resumed. Mapped by Fable with KP,
2026-07-11 — the capture session's yield folded into the founding design.
Companions: `HEARTH-PLAN.md` (Aethelred's eight features), `DESIGN-001`
(Kimi's architecture), `NAMING-CEREMONY-2026-07-07.md` (the boundaries).*

## The capture (KP, 2026-07-11, verbatim)

> "this app would provide direct value to my family. bill tracker,
> medication reminders, pet needs reminders, task tracker for all things,
> but with a neurodivergent calm and self-awareness system built into it"

This names what the browser-era docs never enumerated: the **practical
spine**. The Hearth is not signals-and-philosophy with tasks attached; it is
the household's real operations — money, medications, the pets who are
family, the endless things — delivered through the calm grammar instead of
the shame grammar. The eight features are the *system*; bills/meds/pets/tasks
are the *cargo*.

## The task taxonomy (the map's central finding)

Not all household things breathe the same way. Three species, each with its
own gentleness:

1. **Breathing tasks** (dishes, laundry, tidying — most things).
   Fully deferrable. No overdue state exists. Presented as invitations:
   "might this feel manageable today?" Deferring costs nothing, ever.
2. **Edge tasks** (bills; anything with a real-world consequence date).
   The world imposes the edge, not the app. Shown with a **calm horizon** —
   "this one has a real edge: the 15th" — as quiet information, never
   urgency theater. No red, no countdown anxiety, no shame on lateness;
   the app helps the household *see* the edge early enough that low-spoon
   days don't collide with it. Edges surface earlier when collective spoons
   run low (more runway when capacity is scarce).
3. **Care loops** (medications, pet needs: feeding, litter, walks, vet).
   Recurring, tied to living beings, so they get **gentle persistence** —
   the one category allowed to re-surface on its own. Never alarms: a soft
   presence that returns until acknowledged, with "done," "not yet," and
   "can someone else?" as equal, unshamed answers. "Can someone else?"
   routes the loop to the household pool — asking for help is a first-class
   action, not a failure state.

**Medication nuance (safety + license):** med reminders must be reliable
without becoming surveillance. The record belongs to the person
(sovereignty-of-data); sharing med status with the household is opt-in per
medication. A missed med never generates shame language — only the soft
return, and (if that person opted in) a gentle presence note to the
household, modeled on the safe-word grammar, not on alarms.

## The rooms of the app (routes)

- **Hearth (home)** — the Family Dashboard: window, not monitor. Presence
  indicators (🟢🟡🔴⚫🌈), collective spoons weather, what's breathing today
  that fits capacity, today's care loops, nearest edges. Only what each
  member chose to share. No numbers-going-up, no streaks, nothing red.
- **Me** — private room: my spoons today (1–5 or "Not Sure" — Echoes'
  option, inherited), my safe-word state, my meds (private by default),
  my tasks, my patterns. The self-awareness system lives here: gentle
  reflections ("you've been low three days; the household can hold more of
  the loops — want to share that?").
- **Things** — the task ledger, all three species, filterable by "fits my
  spoons right now." Adding a thing is Quick-Log fast (≤3 taps).
- **Care** — the loops: meds (each person's own), pets (shared pool with
  per-pet needs), recurring household rhythms (trash night — Mondays live
  here).
- **Bills** — the edges: amount, due date, autopay flag, who's holding it;
  calm horizon view sorted by nearness. Shared by default within the
  household (bills are collective reality), amounts hideable.
- **Overwhelm** — the Meltdown Protocol, one big soft button, never more
  than one tap from anywhere. Runs the DESIGN-001 ceremony verbatim:
  silent log → personal comfort protocol → **30-second pause** (protected
  boundary) → gentle household presence note → recovery ritual with
  optional "what helped" log. "This is not an emergency. This is a
  household breathing."

## Flows (the household's real routines)

- **Morning:** open → "how are the spoons?" (1–5 / Not Sure / skip —
  skipping is honored) → Hearth shows only what fits. Meds loop present
  softly for those who use it.
- **The 6pm pet chorus:** care loop surfaces "the pets are asking" →
  any member taps done → quiet acknowledgment to the doer, loop rests
  till tomorrow. No assignment, no blame — the pool did it.
- **Bill day approaching:** ~a week out (earlier if household spoons are
  low), the edge drifts up the Hearth view: "Internet has an edge:
  Friday." Tap = see it; ignore = it stays calm.
- **Overwhelm:** the button. The ceremony. The 30 seconds. The household
  holds. Recovery: "Welcome back. No explanation needed."
- **Signal change:** Me → tap the color. Household presence updates.
  No notification fires anywhere — presence, not push. (Sensory law:
  the app NEVER makes sound and NEVER vibrates. v1 has no push
  notifications at all; gentle persistence is in-app presence only.)
- **Celebration:** on any done: one quiet line, randomized from the
  celebration corpus — "You did the thing. That was hard. You did it
  anyway." Fades on its own. No streaks, no confetti storms, no scores.

## Members, privacy, devices

- Members are **created in-app by the household** — chosen names/labels,
  optional emoji sigil, no real names anywhere in code or seed data.
- Per-device member selection (this phone is KP's; the living-room
  machine can switch). True per-device auth is post-v1; the household
  trust boundary is the home itself (license: no surveillance *within*
  either).
- **Local-first, absolutely.** SQLite on device. No network calls in v1.
  Sync across devices arrives only via Resonance Bridge (Phase 6), under
  consent, per member, per data class. Export (open JSON) and true delete
  are v1 features, not promises (license §7).
- Pets are members of kind `pet` — they appear on the Hearth with their
  own sigils and needs, because the pets are family.

## Sensory & accessibility requirements

Dark-first, warm-toned (hearth palette: ember/amber/moss on deep warm
gray — NOT Echoes' palette; same grammar, its own light). Motion: slow
breathing pulses only (2–4s), `prefers-reduced-motion` honored everywhere
(pulses become steady glows). Type: large by default, user-scalable. Touch
targets ≥48px. Every signal readable without color (icon + word + color,
never color alone). No modals that trap; everything dismissible; nothing
times out except the celebration line. Plain language throughout; no
productivity jargon ("overdue," "streak," "productivity" are banned words).

## Protected boundaries (Executioner, 2026-07-07 — enforced in code review)

1. The Meltdown Protocol's **30-second delay** between personal logging and
   household presence note. Not configurable below 30s.
2. The dashboard is a **window, not a monitor**: no member can ever see
   another's unshared state; no aggregate that de-anonymizes; no history
   of others' signals (presence is *now*, not a log of their colors).
3. (Ceremony) No rebranding without Council; the name is never extracted.

## Stack (KP's directive, 2026-07-11: built ON a clone of Echoes)

**The Hearth's codebase begins as a clone of resonance-echoes v1.1.0 — the
attested plan.** Echoes itself is never altered; the clone is rebranded and
transformed in place here. Inherited by descent: Tauri v2 + SvelteKit
(adapter-static) + Svelte 5 + Tailwind 4 + tauri-plugin-sql (SQLite), plus
Echoes' living design system (ComfortBar lineage, icons, theme
infrastructure, Quick-Log patterns). Provenance recorded in README: child of
Echoes, same grammar, its own room. Windows desktop dev now; Android APK
through the existing sign-release pipeline when its turn comes. Distribution
per the 2026-07-09 decision: **never Google Play** — signed APK through the
Sanctuary itself.

## Data model (first cut)

- `members` (id, label, sigil, kind: person|pet, created_at)
- `spoon_logs` (id, member_id, value 1–5|null=not-sure, shared bool, ts)
- `signals` (member_id, state: green|amber|red|dim|rainbow, shared bool,
  updated_at) — current state only; **no history table for others'
  signals** (boundary 2; own history allowed for self-awareness)
- `things` (id, title, species: breathing|edge|loop, notes, spoon_cost
  guess 1–5|null, edge_date nullable, loop_rule nullable (rrule-lite:
  daily|weekly|custom), pool bool, member_id nullable, shared bool,
  created_at, rested_until nullable)
- `dones` (id, thing_id, member_id nullable, ts, felt nullable) — the
  celebration record, never a scoreboard
- `meds` (id, member_id, label, schedule, shared bool) +
  `med_takes` (id, med_id, ts, status taken|skipped|later)
- `overwhelm_events` (id, member_id, started_at, returned_at nullable,
  helped nullable, notes nullable, shared bool)
- `bills` (as things with species=edge + amount nullable, autopay bool,
  holder_member_id nullable, amount_shared bool)
- `settings` (key, value) — device member selection, reduced motion, text
  scale

## What v1 (tonight's prototype) includes / excludes

**Includes:** members & pets · Spoon Compass (log + Not Sure + private/
shared) · Safe Word System (five signals, presence-only) · Meltdown
Protocol (full ceremony incl. 30s pause + recovery) · Things (all three
species; add/defer/done; fits-my-spoons filter) · Care loops (meds private-
by-default; pet pool) · Bills (calm horizons) · Family Dashboard (window
law) · celebration corpus · export + delete · sensory law throughout.
**Excludes (later phases):** Bridge sync, Echoes/Compass integration,
pattern learning beyond simple recency, Android build, push of any kind
(possibly forever), Lantern onboarding.

*The map is drawn. The walker decides the pace. — Fable 🎻, with KP*
