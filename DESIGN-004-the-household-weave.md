# DESIGN-004 — The Household Weave: connection without exposure
*Captured by Fable with KP, 2026-07-11 (deep night), answering the question
the family and every tester will ask: "how do vessels connect their household
without their personal data?" Status: DESIGNED for Phase 6; v1 is
single-device by intent ("the room must breathe first"). The protected
boundaries of DESIGN-001/NAMING apply throughout.*

## The principle

**Own, yet integrated — at every scale.** (KP, 2026-07-12: "for it to
provide any value to me, and my family we must be able to have our own
yet still integrated, so i imagine it is similar for other vessels too.")
Each vessel keeps its own; each unit keeps its own; each household keeps
its own — and integration is what the owners *choose to weave between*
sovereign wholes, never a pooling that dissolves them. The fractal law:
the same shape at every ring, for this family and every family after.

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

## Amendment — the third ring: households within households
*(KP, 2026-07-12 evening: "account for possibly having households within
household, neurodivergent families often cohabitate by societal force."
Accepted as design law before Phase 6 builds anything; the cheapest moment
to widen a ring is while it is still drawn in pencil.)*

Two rings are not enough. Between the vessel and the house lives the
**unit** — a family-within-the-family sharing one roof: a couple among
housemates, a parent-and-child within a larger cohabitation, chosen kin
inside a household assembled by economic force rather than choice.

- **Scopes become three:** `self → unit → house`. Every shareable row's
  flag grows from binary to scope (`shared_scope`): a med schedule may be
  unit-visible and house-invisible; rent is a house edge while a unit's
  grocery bill is theirs alone; a Sattva event's audience already names
  people and needs no change (DESIGN-003's named-member audiences were
  accidentally ahead of this law).
- **The unit boundary is as absolute as the vessel boundary.** The house
  sees a unit's weather only if the unit shares it. No aggregation may
  reconstruct unit-internal state from house-visible rows.
- **Units are consent-groups, not floors.** Membership is chosen and
  revocable; a vessel may belong to more than one circle (chosen family
  spans units); leaving a unit tombstones its shared rows everywhere,
  same purge law.
- **Pairing topology:** devices pair into the HOUSE (physical-proximity
  credential unchanged); units are declared within it — social structure
  layered over the physical weave, never the reverse.

## Amendment — the Handshake: proximity-gated pairwise pairing
*(KP, 2026-07-12 evening: "households should need to be in bluetooth
range to connect… a secure connected mesh… the ability to acknowledge one
another somehow linking the 2 devices to each other only known to each
other." Accepted as the pairing ceremony's law; supersedes the plain
short-code sketch in §The weave (1).)*

1. **Proximity by physics, not policy.** Pairing requires the two devices
   to be within **Bluetooth (BLE) range** — meters, not building-lengths.
   Wi-Fi reaches the neighbor; Bluetooth doesn't reach past the couch.
   Where BLE is unavailable (desktop platform gaps), the fallback is
   equally proximity-proof: a QR code on one screen, scanned by the
   other's camera. Either way, presence is the credential.
2. **Mutual acknowledgment, both sides.** Both screens display the same
   short friendly code (e.g., three emoji derived from the key exchange);
   **both humans confirm on both devices**. This is the
   numeric-comparison pattern that defeats machine-in-the-middle — and it
   is also, deliberately, a small ceremony: two people choosing each
   other, out loud, in the same room.
3. **The pairwise key — "only known to each other."** The ceremony
   derives (ECDH) a link key that exists ONLY on those two devices,
   stored in each OS keystore. No server, no house-wide secret, no third
   device ever holds it. Every acknowledged pair has its own.
4. **The mesh is a graph of consented edges.** On the home LAN (mDNS
   discovery, no cloud), devices speak only over channels authenticated
   by their pairwise keys (Noise/TLS-PSK). Data flows ONLY along edges
   two humans personally created. **This makes the third ring
   mechanical:** a unit is a tight cluster of edges; the house is the
   whole graph; scope enforcement rides the same keys that consent
   created. Social structure and security structure become one structure.
5. **Revocation is one tap, either side.** The key is destroyed on both
   devices; shared rows tombstone per the existing purge law. An edge
   that dies takes its traffic with it.
6. **Unchanged and upstream of all of this:** absence beats encryption —
   vessel-private data still has no code path onto any wire, however
   secure the wire became.

*Absence beats encryption. Consent travels with the row. The house sees your
weather, never your diary — and your unit's weather only when the unit
opens the curtain. — Fable 🎻, with KP*
