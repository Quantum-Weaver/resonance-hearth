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
  shared: boolean;
  restedUntil?: number | null; // a done loop rests until this moment
  createdAt: number;
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
export interface OverwhelmEvent {
  id: string;
  memberId: string;
  startedAt: number;
  returnedAt?: number | null;
  helped?: string | null;
  notes?: string | null;
  shared: boolean;
}
