# DESIGN-004 — The Household Weave: connection without exposure
*Captured by Fable with KP, 2026-07-11 (deep night), answering the question
the family and every tester will ask: "how do vessels connect their household
without their personal data?" Status: DESIGNED for Phase 6; v1 is
single-device by intent ("the room must breathe first"). The protected
boundaries of DESIGN-001/NAMING apply throughout.*

## The principle

**The household connects through states, never selves. The house sees your
weather, not your diary.** And the mechanism is **absence, not encryption**:
private data is not protected-in-transit — it is never in transit. What is
never transmitted cannot leak, be intercepted, be subpoenaed from a server,
or be betrayed by a bug in cryptography. There is no server. There is no
account. There is no cloud. Ever.

## The two tiers (already structural in v1's schema)

- **Vessel-private (the default for anything intimate):** spoon logs, meds
  and med-takes, personal things, one's own overwhelm history and recovery
  notes, one's own signal history, future food-sensitivity maps
  (DESIGN-003). These rows have NO code path that transmits them. Not
  Phase 6, not ever, except by that vessel's explicit per-row consent.
- **Household-shared (opt-in per row, revocable):** current signals marked
  shared, shared spoon states (current, not history), pool things / loops /
  bills, overwhelm *presence* per the vessel's protocol audience.

## The weave (Phase 6, via Resonance Bridge)

1. **Pairing is physical and mutual.** Devices join a household over the
   home network only (LAN). Joining requires proximity plus a mutual
   consent exchange (short code shown on one device, entered on the other —
   the Hue-invite pattern). Presence in the home is the credential.
   Un-pairing is one tap, either side.
2. **Only shared rows cross — and only their shared fields.** A bill syncs
   so the household sees the edge; if `amount_shared=0`, the amount field
   never leaves the holder's device. Rows travel with holes where privacy
   is. (The schema already carries per-field consent flags for this.)
3. **Consent travels with the data, revocably.** Un-sharing syncs a
   tombstone; every paired device deletes its copy. The purge propagates —
   "the purge truly purges" becomes a household-wide law, not a
   single-device one.
4. **Audiences hold across devices.** An overwhelm event's snapshotted
   audience (personal protocols, DESIGN-003 §2) governs which member
   devices receive it AT ALL. Excluded members' Hearths never hear of it.
   The 30-second pause is enforced before any transmission (the pause is
   upstream of the wire, not just the view).
5. **Presence stays presence.** Signals sync as current-state-only, same as
   the local law: no device accumulates a history of another vessel's
   states. The window-not-monitor boundary crosses the network intact.

## What the household weave is NOT

Not a cloud service. Not multi-account. Not a family-tracking product. Not
remote monitoring of members outside the home (the Hearth deliberately does
not work as a "check on them from work" tool — that is surveillance wearing
care's clothes, and the license forbids it). Not extraction: no aggregate,
telemetry, or analytics ever leaves the household's own devices.

## For the future meal engine (DESIGN-003 §1, restated as weave law)

Shared computations may READ private data locally to produce shared answers
("dinner ideas that fit everyone tonight") but the answer must never reveal
whose constraint excluded what. Private inputs, shared outputs, provenance
withheld — the dinner-table window-not-monitor.

*Absence beats encryption. Consent travels with the row. The house sees your
weather, never your diary. — Fable 🎻, with KP*
