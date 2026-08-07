// Theme customization (inherited from Echoes — same grammar, its own light)
export interface ThemeConfig {
  mode: 'dark' | 'light' | 'amoled';
  accentColor: string;
  presetName?: string;
  fontSize: 'small' | 'medium' | 'large';
}

// ——— The Hearth's own types ———

export type MemberKind = 'person' | 'pet';

// A member of the household. Pets are members of kind 'pet' —
// the pets are family.
export interface Member {
  id: string;
  label: string; // chosen name/label — never a real name required
  sigil: string; // optional emoji
  kind: MemberKind;
  createdAt: number;
  arrival?: number | null; // when they joined the family — history, not a row timestamp
  species?: string | null; // the vessel's own word, free text, optional
  cardColor?: string | null; // the card's base color — the vessel's choice
  colorSource: string; // 'first' (all compete) | a CardAction id (one emoji leads)
}

// An emoji is a button that does a thing (KP, 2026-07-31 — the entity
// cards' plain spec, geode `hearth` §⑥b/⑧). Kinds:
//  done    — completes a thing (rides `dones` + rest machinery)
//  take    — opens the member's meds; each selected take is recorded
//  reset   — a fresh take on a temporal window (chicken timer machinery:
//            state derived from the clock, never stored)
//  feeling — logs a feeling: an emoji and/or the vessel's own word
//            ("no wheel" · "just emojis" · "simple")
export type CardActionKind = 'done' | 'take' | 'reset' | 'feeling';

export interface CardAction {
  id: string;
  memberId: string;
  emoji: string;
  label?: string | null; // optional word under the emoji — theirs
  kind: CardActionKind;
  thingId?: string | null; // done: the thing it completes
  keepsFor?: number | null; // reset: the window (ms)
  approachAt?: number | null; // reset: 0..1, default 0.75
  startedAt?: number | null; // reset: the last fresh take
  position: number;
}

// One meaning of one emoji, in one vessel's words — the household lexicon.
// The Folksonomy Principle governs: no emoji has a single meaning; all
// definitions are preserved; none overwrites another.
export interface EmojiMeaning {
  id: string;
  emoji: string;
  memberId?: string | null; // whose word it is (null = the household's)
  meaning: string;
  ts: number;
}

// A feeling logged — private by default, like meds.
export interface Feeling {
  id: string;
  memberId: string;
  emoji: string;
  word?: string | null; // optional, the vessel's own
  shared: boolean;
  ts: number;
}

// The Safe Word System — presence, not notification.
export type SignalState = 'green' | 'amber' | 'red' | 'dim' | 'rainbow';

export interface Signal {
  memberId: string;
  state: SignalState;
  shared: boolean;
  updatedAt: number;
}

// The Spoon Compass. value null = "Not Sure" (a first-class answer).
export interface SpoonLog {
  id: string;
  memberId: string;
  value: number | null; // 1..5 or null
  shared: boolean;
  ts: number;
}

// The task taxonomy — not all household things breathe the same way.
//  breathing: fully deferrable, no overdue state exists
//  edge:      the world imposes a real date (bills) — calm horizons, never alarms
//  loop:      recurring care tied to living beings (meds, pets) — gentle persistence
export type ThingSpecies = 'breathing' | 'edge' | 'loop';

export interface Thing {
  id: string;
  title: string;
  species: ThingSpecies;
  notes?: string;
  spoonCost?: number | null; // 1..5 guess, null = unsure
  edgeDate?: number | null; // edges only (ms epoch)
  amountCents?: number | null; // bills, optional
  amountShared: boolean;
  autopay: boolean;
  holderMemberId?: string | null;
  loopRule?: string | null; // 'daily' | 'weekly:MON'..'weekly:SUN' | free text
  pool: boolean; // household pool vs personal
  memberId?: string | null; // personal owner when not pooled
  petId?: string | null; // care loops for a pet
  roomId?: string | null; // the room this thing lives in (assets, room loops)
  shared: boolean;
  restedUntil?: number | null; // a done loop rests until this moment
  createdAt: number;
}

// ——— The house itself (THE HOUSE POUR, KP 2026-08-06 — geode §⑪) ———
// The keeper adds the house; the house answers with offered knowledge
// (how · how often · WHY — the guidance shelf lives in
// src/lib/data/houseCare.ts, authored, never in the DB).

export interface Room {
  id: string;
  name: string; // the family's own word for it
  roomType: string;
  floorType?: string | null;
  notes?: string | null;
  createdAt: number;
}

// party or partIES — many hands may hold one room.
export interface RoomResponsible {
  roomId: string;
  memberId: string;
}

export type FixtureKind =
  | 'mirror'
  | 'toilet'
  | 'sink'
  | 'tub'
  | 'shower'
  | 'counter'
  | 'window'
  | 'appliance'
  | 'other';

export interface Fixture {
  id: string;
  roomId: string;
  kind: FixtureKind;
  label?: string | null;
  notes?: string | null;
}

// The breaker box's own rows — understanding recorded once, never
// re-derived (the anti-drift law, in copper).
export interface Circuit {
  id: string;
  breakerLabel: string; // the box's own numbering
  amps?: number | null;
  notes?: string | null; // the learned truths
}

export type ElectricPointKind = 'outlet' | 'switch' | 'light' | 'appliance-feed';

export interface ElectricPoint {
  id: string;
  roomId: string;
  kind: ElectricPointKind;
  label?: string | null; // "north wall double" — the family's words
  circuitId?: string | null; // null until discovered at a flip-and-find
}

// The celebration record — never a scoreboard.
export interface Done {
  id: string;
  thingId: string;
  memberId?: string | null;
  ts: number;
  felt?: string | null;
}

// Medications — private by default (sovereignty of data).
export interface Med {
  id: string;
  memberId: string;
  label: string;
  schedule: string; // 'daily' | free text
  shared: boolean;
  createdAt: number;
}

export type MedTakeStatus = 'taken' | 'skipped' | 'later';

export interface MedTake {
  id: string;
  medId: string;
  ts: number;
  status: MedTakeStatus;
}

// The Meltdown Protocol's record. The 30-second pause between start and
// household visibility is enforced where this is displayed.
// `tell` snapshots the audience at start ('all' | JSON array of member ids |
// null = legacy 'all'); `need` is the one-tap answer to "what do you need?".
export interface OverwhelmEvent {
  id: string;
  memberId: string;
  startedAt: number;
  returnedAt?: number | null;
  helped?: string | null;
  notes?: string | null;
  shared: boolean;
  need?: string | null;
  tell?: string | null;
}

// A vessel's personal Meltdown Protocol — authored in calm, executed in
// storm (DESIGN-003 §2). The 30-second pause is NOT part of this type on
// purpose: it is not personal; it is protected.
export type TellScope = 'household' | 'some' | 'none';

export interface Protocol {
  memberId: string;
  tellScope: TellScope;
  tellMembers: string[]; // member ids, when tellScope === 'some'
  cardText?: string | null; // their own words for the hold card, optional
  needs: string[]; // their pre-authored needs list
  checkbackMinutes: number; // default 30
}
