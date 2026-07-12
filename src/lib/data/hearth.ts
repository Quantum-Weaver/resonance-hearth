// The Hearth's shared language — signals, celebrations, species.
// One definition per state, single source of truth (Resonance Grammar).

import type { SignalState, ThingSpecies } from '$lib/types/types';

// ——— The Safe Word System ———
// These are presence indicators, not notifications. They do not demand
// response. They invite it. (DESIGN-001; the visual language is sensory-safe:
// no sounds, no vibrations, no alarms — color, word, and a slow breath.)
export interface SignalDef {
  state: SignalState;
  emoji: string;
  meaning: string;
  response: string; // what the household offers, never demands
  color: string; // soft, never alarm-toned
}

export const SIGNALS: SignalDef[] = [
  {
    state: 'green',
    emoji: '🟢',
    meaning: "I'm okay, just quiet",
    response: 'None needed',
    color: '#5faf78',
  },
  {
    state: 'amber',
    emoji: '🟡',
    meaning: 'I need space',
    response: 'Holding space for you',
    color: '#d9a95b',
  },
  {
    state: 'red',
    emoji: '🔴',
    meaning: 'I need help',
    response: 'Coming. No rush.',
    color: '#c96f6f',
  },
  {
    state: 'dim',
    emoji: '⚫',
    meaning: "I'm not okay but I can't talk about it",
    response: "I see you. I'm here when you're ready.",
    color: '#6b6b7a',
  },
  {
    state: 'rainbow',
    emoji: '🌈',
    meaning: 'Returning',
    response: 'Welcome back.',
    color: '#9b8cc9',
  },
];

export const signalByState = (s: SignalState): SignalDef =>
  SIGNALS.find((d) => d.state === s) ?? SIGNALS[0];

// ——— Celebration over punishment ———
// One quiet line on any done. No streaks, no scores, no confetti storms.
export const CELEBRATIONS: string[] = [
  'You did the thing. That was hard. You did it anyway.',
  'Done. The household breathes a little easier.',
  'That counts. It always counted.',
  'Quietly noted: you showed up.',
  'The hearth is a little warmer for that.',
  'One thing at a time is exactly the right speed.',
  'That took spoons. Thank you for spending them here.',
  'Noticed, appreciated, and nothing more is owed.',
  'The thing is done and you are allowed to rest.',
  'Small things hold houses together. That was one.',
];

export const pickCelebration = (): string =>
  CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];

// ——— The task taxonomy ———
export interface SpeciesDef {
  species: ThingSpecies;
  name: string;
  emoji: string;
  description: string;
}

export const SPECIES: SpeciesDef[] = [
  {
    species: 'breathing',
    name: 'Breathing',
    emoji: '🍃',
    description:
      'Fully deferrable. No overdue state exists. It will be here when you do.',
  },
  {
    species: 'edge',
    name: 'Edge',
    emoji: '🌅',
    description:
      'The world imposes a real date (bills and such). Shown as a calm horizon — information, never urgency.',
  },
  {
    species: 'loop',
    name: 'Care loop',
    emoji: '🫀',
    description:
      'Recurring care for living beings — meds, pets, rhythms. Returns gently until acknowledged.',
  },
];

export const speciesDef = (s: ThingSpecies): SpeciesDef =>
  SPECIES.find((d) => d.species === s) ?? SPECIES[0];

// Words the Hearth never uses (cartography's sensory law).
// Kept here so reviews can grep for violations.
export const BANNED_WORDS = ['overdue', 'streak', 'productivity', 'late', 'failed'];

// The overwhelm ceremony's protected pause, in milliseconds.
// PROTECTED BOUNDARY (naming ceremony, Executioner, 2026-07-07):
// not configurable below 30 seconds. Do not add a setting for this.
export const OVERWHELM_PAUSE_MS = 30_000;

// Suggested needs for a vessel's personal protocol — starting points only;
// every vessel authors their own list. (DESIGN-003 §2)
export const SUGGESTED_NEEDS: string[] = [
	'quiet',
	'water',
	'weighted blanket',
	'presence, no words',
	'check on the pets',
	'time — just time',
];

// Spoon labels — 1..5 and the first-class "Not Sure".
export const SPOON_LABELS: Record<number, string> = {
  1: 'Running on embers',
  2: 'Low — gentle day',
  3: 'Steady enough',
  4: 'Good wind',
  5: 'Full sails',
};
