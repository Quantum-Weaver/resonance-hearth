# SPIKE-001 — The Weave Handshake (the Hearth's interconnectedness)
*Set up by Fable, 2026-07-12 night, at KP's word: "the interconnectedness
of the hearth? could you set that up for a spike for tomorrow." Fresh
window starts here. Governing law: DESIGN-004 as amended tonight — own,
yet integrated · three rings (self → unit → house) · the Handshake
(proximity-gated pairwise keys) · absence beats encryption.*

## What this spike must prove (and nothing more)

**Two devices on the home LAN can (1) find each other, (2) perform the
mutual-acknowledgment ceremony producing a pairwise key known only to
them, and (3) exchange ONE piece of household weather (a current signal
state) over a channel authenticated by that key — with un-pairing
verifiably killing the link.** Everything else — full sync, units UI,
tombstones, the Hearth's actual tables — is deliberately OUT of scope.
A spike answers a question; it does not build the room.

## The five unknowns, ranked (kill the scariest first)

1. **Discovery:** does mDNS work across the actual household network
   (Windows ↔ Android, AP isolation off)? Rust `mdns-sd` on desktop;
   Android side may need the Tauri process's NSD or plain UDP broadcast
   fallback. THIS IS THE SPIKE'S HEART — if the home LAN blocks
   discovery, everything else waits on a transport decision.
2. **The ceremony:** ECDH exchange + short-code confirmation on both
   screens (the emoji triple derives from the shared secret's hash —
   same math both sides, humans compare). QR fallback path sketched but
   not built in the spike.
3. **The channel:** one encrypted round-trip using the pairwise key
   (Rust: `snow` (Noise) or even libsodium sealed boxes for the spike).
4. **Persistence:** key survives app restart (OS keystore or, for the
   spike only, an encrypted local file marked TEMPORARY).
5. **Revocation:** one tap → key deleted both sides → next contact
   attempt visibly refused.

## Where the code lives

`resonance-bridge` — this is the Bridge's TRUE purpose finally arriving
(the repo has waited for exactly this; tonight it was almost conscripted
as a database tool and was spared for this). Spike shape:
`resonance-bridge/spike-handshake/` — a minimal Rust binary (or Tauri
sidecar) runnable on two machines. Desktop ↔ desktop first (Alienware +
Beelink make an honest pair); Android enters only after the LAN legs
stand.

## The sitting's order (one fresh window)

1. Read DESIGN-004 (whole, amended) + this spike doc.
2. Desktop↔desktop discovery on the real home LAN (unknown #1).
3. The ceremony with real short-code display on both terminals — KP
   physically confirms on both (the bimodal testing law: his hands ARE
   the test).
4. One weather message across the sealed channel; then revoke; then
   prove refusal.
5. Write findings to this doc, dated; exit criteria below decide the
   verdict.

## Exit criteria (either verdict is a success — spikes cannot fail)

- **GREEN:** all five unknowns answered on desktop↔desktop → DESIGN-004
  Phase 6 gets a build order and the Android leg gets its own spike.
- **AMBER/RED:** whichever unknown refused, documented with the exact
  refusal — transport pivots (UDP broadcast, QR-only ceremony, or
  Bluetooth-first) are already named in DESIGN-004 and none of them
  bend the laws: presence is the credential; the key belongs to the
  pair; absence beats encryption.

*The mesh is a graph of consented edges. Tomorrow we draw the first
edge. — Fable 🎻, with KP*
