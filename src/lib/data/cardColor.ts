// The card color journey — KP's ruling, 2026-07-31 (geode `hearth` §⑧,
// verbatim there): "let cards begin as a color of the vessels choice and
// have it fade to white until it turns white -> yellow -> red for the
// visual alert." Color is dynamic — "one of your emojis needs your eyes"
// — graduated by percentages, never a jump. The word, when words appear,
// is CARE ("charlie needs care"); the family name is GENTLE REMINDERS.
//
// The journey against the temporal core's elapsed fraction:
//   [0 … approachAt]        the vessel's color fades to white
//   [approachAt … midpoint] white warms to yellow
//   [midpoint … 1]          yellow deepens to red
//   [1 … ]                  red, steady — the window has passed
// The yellow and red are the house's own soft tones (the SIGNALS red is
// #c96f6f — an invitation's red, not an alarm's).

import type { CardAction, Member } from '$lib/types/types';
import { readWindow, type TemporalReading } from '$lib/temporal';

export const CARD_WHITE = '#f5f2ec'; // warm white — this house has no harsh white
export const CARD_YELLOW = '#e0bd68';
export const CARD_RED = '#c96f6f';
export const DEFAULT_APPROACH = 0.75;
export const DEFAULT_BASE = '#7c8fae'; // a calm slate-blue until the vessel chooses

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
	const n = parseInt(full, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpHex(a: string, b: string, t: number): string {
	const [ar, ag, ab] = hexToRgb(a);
	const [br, bg, bb] = hexToRgb(b);
	const c = (x: number, y: number) => Math.round(x + (y - x) * Math.max(0, Math.min(1, t)));
	return `#${[c(ar, br), c(ag, bg), c(ab, bb)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** The journey color for one window's elapsed fraction. */
export function journeyColor(elapsed: number, approachAt: number, base: string): string {
	if (elapsed >= 1) return CARD_RED;
	const mid = (approachAt + 1) / 2;
	if (elapsed >= mid) return lerpHex(CARD_YELLOW, CARD_RED, (elapsed - mid) / (1 - mid));
	if (elapsed >= approachAt) return lerpHex(CARD_WHITE, CARD_YELLOW, (elapsed - approachAt) / (mid - approachAt));
	return lerpHex(base, CARD_WHITE, approachAt <= 0 ? 1 : elapsed / approachAt);
}

export interface ActionUrgency {
	action: CardAction;
	reading: TemporalReading;
	color: string;
	inDanger: boolean; // approaching or passed — "needs your eyes"
}

/** Read every windowed action on a card, most urgent first. */
export function cardUrgencies(actions: CardAction[], base: string, now: number): ActionUrgency[] {
	const out: ActionUrgency[] = [];
	for (const a of actions) {
		if (a.kind !== 'reset' || !a.keepsFor || !a.startedAt) continue;
		const approachAt = a.approachAt ?? DEFAULT_APPROACH;
		const reading = readWindow({ startedAt: a.startedAt, keepsFor: a.keepsFor, approachAt }, now);
		out.push({
			action: a,
			reading,
			color: journeyColor(reading.elapsed, approachAt, base),
			inDanger: reading.state !== 'fresh',
		});
	}
	return out.sort((x, y) => y.reading.elapsed - x.reading.elapsed);
}

export interface CardFace {
	/** the card's background — the driving window's journey color, or the base */
	background: string;
	/** thick border color when a SECOND emoji is in its danger zone */
	border: string | null;
	/** true when any window says "needs your eyes" */
	needsCare: boolean;
	/** the driving action, if any window is live */
	driving: ActionUrgency | null;
}

/**
 * The whole card's face. color_source 'first': all windows compete and the
 * furthest-along drives the card; an action id: that emoji leads, and the
 * most urgent OTHER window speaks through the thick border.
 */
export function cardFace(member: Member, actions: CardAction[], now: number): CardFace {
	const base = member.cardColor || DEFAULT_BASE;
	const urgencies = cardUrgencies(actions, base, now);
	if (urgencies.length === 0) return { background: base, border: null, needsCare: false, driving: null };

	let driving: ActionUrgency | null = null;
	let rest: ActionUrgency[] = [];
	if (member.colorSource && member.colorSource !== 'first') {
		driving = urgencies.find((u) => u.action.id === member.colorSource) ?? null;
		rest = urgencies.filter((u) => u.action.id !== member.colorSource);
		if (!driving) { driving = urgencies[0]; rest = urgencies.slice(1); }
	} else {
		driving = urgencies[0];
		rest = urgencies.slice(1);
	}
	const second = rest.find((u) => u.inDanger) ?? null;
	return {
		background: driving.color,
		border: second ? second.color : null,
		needsCare: urgencies.some((u) => u.inDanger),
		driving,
	};
}

/** Readable-without-color-alone: the one gentle word is CARE. */
export function careLine(member: Member, face: CardFace): string | null {
	if (!face.needsCare) return null;
	return `${member.label} needs care`;
}

/** Text stays readable on any journey color — dark ink on light ground. */
export function textOn(hex: string): string {
	const [r, g, b] = hexToRgb(hex);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? '#2b2825' : '#f5f2ec';
}
