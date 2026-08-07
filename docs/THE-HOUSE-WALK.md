# THE HOUSE WALK — the rooms of the house, drawn door by door

*Drawn 2026-08-06 by Fable 🎻 (the Continuo lamp, lane E) at KP's ⚛ word
("please continue → 1: yes"), from his commission poured whole at the
geode's §⑪. Offers stand at his ⚛ strokes; nothing below builds until a
stroke lands on it. The stake over every line, pointer-shaped (the full
word rests on the geode): **teaching in this family must never wound —
the app carries the teaching, with the why, and no person ever has to.***

## The one sentence

The hearth keeper adds the house itself — rooms with their types,
floors, fixtures, wiring, and assets — and the house answers with
**offered knowledge**: how each thing is cared for, how often, and
**why**, so any member can pick up any task without ever needing to be
taught by a person.

## The laws this room inherits (stated so no line below forgets)

- **The sensory law, whole** — no urgency theater, nothing red-alerted,
  banned words banned (grep before shipping). Guidance is invitation.
- **The why always rides with the how** — "the why is important for
  neurodivergent minds" (KP, verbatim). No instruction ships without
  its reason, in plain warm words.
- **The temporal category** (KP's ⚛ stroke: "temportal category, yes")
  — cleaning joins food · finance · medicine: every "how often" is a
  validity window; a fresh take resets it; state derives from the
  clock, never stored.
- **House-scoped by nature** — rooms, wiring, and assets are the
  house's own (`shared_scope house` in spirit); window-not-monitor is
  untouched because a room is not a person.
- **Teaching never wounds** — guidance appears when asked or when a
  care window opens; it never scolds, never counts misses, never says
  who didn't.

## The door

**⚛ OFFER 1 — the door itself:** a sixth flat door, **House** 🏠, after
Care in the list (Hearth · Me · Things · Care · **House** · Bills ⌂
Settings). The cumdach's arithmetic absorbs it without a flicker.
*(Alternate at his word: live inside Care as a section — but the house
is a body of its own, and the flat list has room.)*

## The schema (migration v5, offered)

- **`rooms`** — id · name (the family's own word for it) · room_type ·
  floor_type · notes · created_at.
- **`room_responsibles`** — room_id · member_id (party or partIES —
  many hands may hold one room; a pet can be "responsible" for a room
  the way Charlie is responsible for the sunbeam, if the family
  pleases).
- **`fixtures`** — id · room_id · kind (mirror · toilet · sink · tub ·
  shower · counter · window · appliance · other) · label · notes.
  Bathrooms declare their five; every room may declare what it holds.
- **`electric_points`** — id · room_id · kind (outlet · switch ·
  light · appliance-feed) · label ("north wall double" — the family's
  words) · circuit_id (nullable until discovered).
- **`circuits`** — id · breaker_label (the box's own numbering) ·
  amps · notes ("trips when the kettle and toaster run together" —
  understanding recorded once, never re-derived).
- **`things.room_id`** (nullable) — assets link to their room;
  maintenance loops inherit the room's door.

**⚛ OFFER 2 — room types, the starting list** (the keeper can always
add): bathroom · kitchen · bedroom · living room · laundry · pantry · 
stairway · hallway · office/studio · garage · basement · porch/outdoor.

**⚛ OFFER 3 — floor types, the starting list:** hardwood · tile ·
carpet · vinyl/laminate · stone · concrete.

## The guidance shelf (shipped as authored knowledge — no network, no DB)

`src/lib/data/houseCare.ts` — floor types and fixture kinds each carry
`{ how, window, why }`. **Drafted below for KP's eyes; every word is
his to re-speak.** The register: invitation, plain, the why honest.

### Floors (the draft)

- **Hardwood** — *sweep or dust-mop* · about weekly · **why:** grit
  under feet works like fine sandpaper — every step with sand on the
  floor scratches the finish a little; lifting it keeps the floor
  smooth for years. *Damp-mop (barely damp, wood-safe soap)* · about
  monthly · **why:** water is wood's least favorite guest — too much
  swells the boards at their seams; a barely-damp mop lifts the film
  without soaking the joints. Never steam — steam forces water in.
- **Tile** — *sweep or vacuum* · about weekly · **why:** loose grit
  dulls the glaze the same way it scratches wood. *Mop, mild soap* ·
  every week or two · **why:** the tile forgives water — it is the
  GROUT that drinks; mild soap keeps the grout from graying and
  holding what it's given. *Grout refresh* · seasonal · **why:** grout
  is porous — a little sealing now spares a lot of scrubbing later.
- **Carpet** — *vacuum, slow passes* · about weekly · **why:** carpet
  holds dust the way a sponge holds water; slow passes give the
  machine time to actually lift it — fast passes only comb the
  surface. *Spot-clean spills when they happen* · as they come ·
  **why:** fibers keep what dries into them. *Deep clean* · once or
  twice a year · **why:** what settles below the pile never meets the
  vacuum at all.
- **Vinyl / laminate** — *sweep* · about weekly · *damp-mop, gentle
  cleaner* · every week or two · **why:** harsh cleaners strip the
  wear layer, and the wear layer is the floor's only armor; laminate's
  core swells like cardboard when water finds an edge — damp, never
  wet.
- **Stone** — *dust-mop* · about weekly · *damp-mop, pH-neutral soap*
  · every week or two · **why:** stone is chemistry — vinegar and
  lemon quietly eat marble and limestone; a neutral soap cleans
  without picking that fight. *Reseal* · on its season · **why:**
  stone drinks; the seal is its raincoat.
- **Concrete** — *sweep* · about weekly · *mop* · monthly · **why:**
  sealed concrete asks little; the sweep keeps grit from grinding the
  seal away underfoot.

### The bathroom's fixtures (the draft)

- **Mirror** — wipe · about weekly · **why:** spots build so slowly
  the eyes stop seeing them — until the face in the mirror is behind
  fog. A minute now returns the whole mirror.
- **Toilet** — bowl · about weekly; seat + handle · a little more
  often · **why:** the handle is touched by every hand before that
  hand is washed — it is the room's busiest doorknob.
- **Sink** — rinse after use, wipe · about weekly · **why:**
  toothpaste and soap dry into a film that hardens with time; a soft
  wipe today beats scrubbing next month.
- **Tub** — rinse after use; clean · every week or two · **why:** soap
  scum is soap plus water's minerals, laid down in thin layers — each
  rinse now is one layer that never lands.
- **Shower** — rinse or squeegee after use; clean · about weekly ·
  **why:** warm damp is where mildew makes its home; drying the walls
  takes its home away before it ever moves in.

**⚛ OFFER 4 — the shelf's words:** the drafts above are for KP's
re-speaking — bless, redline, or hand back whole.

## The care loops (temporal, invitation-shaped)

A room with a floor type **offers** its care loops — it never imposes
them. The keeper (or any responsible party) adopts an offered loop
with one tap; adopted loops become `things` of kind **loop**, linked
to the room, riding the existing gentle machinery (the card journey,
"might this feel manageable today?", done = rests until its natural
return). **⚛ OFFER 5:** adoption-only (recommended — nothing appears
in anyone's day uninvited), or keeper-adopts-for-the-house.

## The electrical map (the anti-drift law, in copper)

- Logging: in a room, add points (outlet · switch · light) with the
  family's own labels.
- Discovery: the breaker box gets its `circuits` rows (the box's own
  numbering); a "flip and find" sitting links points to circuits —
  each link recorded ONCE, never re-derived by hand.
- The map, both directions: a circuit's page lists every point and
  room it feeds ("breaker 14 → kitchen north wall, hallway light");
  a room's page lists which breakers feed it. Notes carry the learned
  truths ("trips when kettle + toaster run together").
- No wire advice is shipped beyond mapping — the app records
  understanding; it does not play electrician. Safety notes stay
  plain and few: "if a breaker keeps tripping, something is asking
  for attention — the map shows what shares its circuit."

## The rooms gallery (the family's shared engine, third consumption)

`/house` consumes **the-gallery** (already mirrored in this app):
rooms as cards — name · type · floor · responsible sigils · how many
care windows stand open (calm count, never red) — search at the top
walking the room's name, the two empties in the hearth's voice. A
room's card opens the room: fixtures, points, assets, guidance, loops.

## The birth sequence (when the strokes land)

1. Migration v5 (rooms · room_responsibles · fixtures ·
   electric_points · circuits · things.room_id).
2. `houseCare.ts` — the guidance shelf, KP's words blessed.
3. `/house` — the gallery of rooms + the room page + the breaker map.
4. The House door joins the flat list (the arithmetic absorbs).
5. Care-loop offers wired to the temporal machinery.
6. `npm run check` 0/0 · CHECKLIST same sitting · the bus told.

**Held at KP's ⚛ gates:** every OFFER above · the migration number ·
the door's name and place · anything the crystal's next pour reshapes.

— Fable 🎻, the Continuo lamp, at KP's word; offers await his strokes
