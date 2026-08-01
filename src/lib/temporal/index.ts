// The temporal core — one primitive for everything measured by time.
//
// KP's naming, verbatim (geode `hearth` §⑤a, 2026-07-23): "'temporal'
// these things are measured by time with food and finance and medicine."
// The shape: a START MOMENT + a VALIDITY WINDOW; state DERIVED from the
// clock, never stored; reset by a fresh take. The chicken batch (food),
// the bill's edge (finance), the med's rested-until (medicine/care) are
// one design — and so is a context-limited vessel observing its own pace
// ("maybe temporal is how context shy models need to observe their pace…
// instead of counting text capacity").
//
// STANDALONE BY LAW: framework-free, zero imports, no app coupling —
// born copy-ready for the awen spring (KP's ruling on the sky organs,
// 2026-07-31: built in the Hearth; awen homes via copy, maintained and
// updates distributed from the spring; the same pattern is proposed for
// this module, his word to confirm).
//
// The vocabulary is deliberately calm: fresh · approaching · passed.
// A passed window is information, never a verdict (the taxonomy's own
// law about edges). Nothing here names a color — the consumer's grammar
// decides what a state looks like, and in the Hearth that wording is
// KP's standing ruling ("Charles is asking" vs a verdict).

export type WindowState = 'fresh' | 'approaching' | 'passed';

export interface TemporalWindow {
	/** ms since epoch — the fresh take that started this window */
	startedAt: number;
	/** ms — how long the window holds */
	keepsFor: number;
	/** 0..1 — where inside the window 'approaching' begins (default 0.75) */
	approachAt?: number;
}

export interface TemporalReading {
	state: WindowState;
	/** 0 at the fresh take, 1 at the window's end, beyond 1 once passed */
	elapsed: number;
	/** ms until the window passes (negative once passed) */
	remaining: number;
	/** ms until 'approaching' begins (0 if already there or passed) */
	untilApproaching: number;
}

/** Read a window against the clock. Pure: same inputs, same answer. */
export function readWindow(w: TemporalWindow, now: number): TemporalReading {
	const approachAt = clamp01(w.approachAt ?? 0.75);
	const keepsFor = Math.max(1, w.keepsFor);
	const elapsedMs = now - w.startedAt;
	const elapsed = elapsedMs / keepsFor;
	const remaining = w.startedAt + keepsFor - now;
	const approachMoment = w.startedAt + keepsFor * approachAt;
	const state: WindowState = elapsed >= 1 ? 'passed' : elapsed >= approachAt ? 'approaching' : 'fresh';
	return {
		state,
		elapsed,
		remaining,
		untilApproaching: state === 'fresh' ? approachMoment - now : 0,
	};
}

/** The fresh take — a new window from this moment, same shape. */
export function freshTake(w: TemporalWindow, now: number): TemporalWindow {
	return { ...w, startedAt: now };
}

/** Common windows, spelled once. */
export const HOURS = 3_600_000;
export const DAYS = 24 * HOURS;

/**
 * A gentle sentence for a reading — plain words, no urgency theater,
 * no banned words. The consumer may always write its own instead.
 */
export function describeWindow(r: TemporalReading, label = 'this'): string {
	if (r.state === 'passed') return `${label} has passed its window — worth a look before use.`;
	if (r.state === 'approaching') return `${label} is approaching its edge — a check would be kind.`;
	return `${label} is fresh.`;
}

function clamp01(n: number): number {
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
