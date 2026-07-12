import Database from '@tauri-apps/plugin-sql';
import { browser } from '$app/environment';
import type {
	Member,
	Signal,
	SignalState,
	SpoonLog,
	Thing,
	ThingSpecies,
	Med,
	MedTake,
	MedTakeStatus,
	OverwhelmEvent,
	Protocol,
	TellScope,
} from '$lib/types/types';
import { OVERWHELM_PAUSE_MS, pickCelebration } from '$lib/data/hearth';

// The Hearth store — the household's living memory. Same idiom as Echoes'
// echo store (the parent codebase): Svelte 5 runes + tauri-plugin-sql,
// local-first, nothing leaves the device.

let db: Database | null = null;

let members = $state<Member[]>([]);
let signals = $state<Signal[]>([]);
let spoonLogs = $state<SpoonLog[]>([]);
let things = $state<Thing[]>([]);
let meds = $state<Med[]>([]);
let medTakes = $state<MedTake[]>([]);
let overwhelms = $state<OverwhelmEvent[]>([]);
let protocols = $state<Protocol[]>([]);
let loading = $state(false);
let dbError = $state<string | null>(null);
let deviceMemberId = $state<string | null>(null);
// A slow clock for presence math (the 30s pause, loop rests). One minute
// resolution is plenty gentle; the overwhelm route keeps its own 1s clock.
let now = $state(Date.now());
if (browser) setInterval(() => (now = Date.now()), 15_000);

const DEVICE_MEMBER_KEY = 'hearth-device-member';

function generateId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// ——— row mappers ———
const toMember = (r: Record<string, unknown>): Member => ({
	id: r.id as string,
	label: r.label as string,
	sigil: (r.sigil as string) ?? '',
	kind: (r.kind as Member['kind']) ?? 'person',
	createdAt: r.created_at as number,
});
const toSignal = (r: Record<string, unknown>): Signal => ({
	memberId: r.member_id as string,
	state: r.state as SignalState,
	shared: !!r.shared,
	updatedAt: r.updated_at as number,
});
const toSpoon = (r: Record<string, unknown>): SpoonLog => ({
	id: r.id as string,
	memberId: r.member_id as string,
	value: r.value == null ? null : (r.value as number),
	shared: !!r.shared,
	ts: r.ts as number,
});
const toThing = (r: Record<string, unknown>): Thing => ({
	id: r.id as string,
	title: r.title as string,
	species: r.species as ThingSpecies,
	notes: (r.notes as string) ?? undefined,
	spoonCost: r.spoon_cost == null ? null : (r.spoon_cost as number),
	edgeDate: r.edge_date == null ? null : (r.edge_date as number),
	amountCents: r.amount_cents == null ? null : (r.amount_cents as number),
	amountShared: !!r.amount_shared,
	autopay: !!r.autopay,
	holderMemberId: (r.holder_member_id as string) ?? null,
	loopRule: (r.loop_rule as string) ?? null,
	pool: !!r.pool,
	memberId: (r.member_id as string) ?? null,
	petId: (r.pet_id as string) ?? null,
	shared: !!r.shared,
	restedUntil: r.rested_until == null ? null : (r.rested_until as number),
	createdAt: r.created_at as number,
});
const toMed = (r: Record<string, unknown>): Med => ({
	id: r.id as string,
	memberId: r.member_id as string,
	label: r.label as string,
	schedule: r.schedule as string,
	shared: !!r.shared,
	createdAt: r.created_at as number,
});
const toTake = (r: Record<string, unknown>): MedTake => ({
	id: r.id as string,
	medId: r.med_id as string,
	ts: r.ts as number,
	status: r.status as MedTakeStatus,
});
const toOverwhelm = (r: Record<string, unknown>): OverwhelmEvent => ({
	id: r.id as string,
	memberId: r.member_id as string,
	startedAt: r.started_at as number,
	returnedAt: r.returned_at == null ? null : (r.returned_at as number),
	helped: (r.helped as string) ?? null,
	notes: (r.notes as string) ?? null,
	shared: !!r.shared,
	need: (r.need as string) ?? null,
	tell: (r.tell as string) ?? null,
});
const toProtocol = (r: Record<string, unknown>): Protocol => {
	let tellMembers: string[] = [];
	let needs: string[] = [];
	try { tellMembers = JSON.parse((r.tell_members as string) || '[]'); } catch {}
	try { needs = JSON.parse((r.needs as string) || '[]'); } catch {}
	return {
		memberId: r.member_id as string,
		tellScope: (r.tell_scope as TellScope) ?? 'household',
		tellMembers,
		cardText: (r.card_text as string) ?? null,
		needs,
		checkbackMinutes: (r.checkback_minutes as number) ?? 30,
	};
};

// ——— init & load ———
async function initDB() {
	if (!browser || db) return;
	try {
		db = await Database.load('sqlite:hearth.db');
		await loadAll();
		deviceMemberId = localStorage.getItem(DEVICE_MEMBER_KEY);
	} catch (e) {
		dbError = e instanceof Error ? e.message : String(e);
		console.error('[hearthStore] initDB failed:', e);
	}
}

async function loadAll() {
	if (!db) return;
	loading = true;
	try {
		const q = <T>(sql: string) => db!.select<Record<string, unknown>[]>(sql);
		members = (await q('SELECT * FROM members ORDER BY created_at')).map(toMember);
		signals = (await q('SELECT * FROM signals')).map(toSignal);
		spoonLogs = (await q('SELECT * FROM spoon_logs ORDER BY ts DESC LIMIT 500')).map(toSpoon);
		things = (await q('SELECT * FROM things ORDER BY created_at DESC')).map(toThing);
		meds = (await q('SELECT * FROM meds ORDER BY created_at')).map(toMed);
		medTakes = (await q('SELECT * FROM med_takes ORDER BY ts DESC LIMIT 500')).map(toTake);
		overwhelms = (await q('SELECT * FROM overwhelm_events ORDER BY started_at DESC LIMIT 100')).map(toOverwhelm);
		protocols = (await q('SELECT * FROM protocols')).map(toProtocol);
	} catch (e) {
		console.error('[hearthStore] loadAll failed:', e);
	} finally {
		loading = false;
	}
}

// ——— members ———
async function addMember(label: string, sigil: string, kind: Member['kind']) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const id = generateId();
	await db.execute(
		'INSERT INTO members (id, label, sigil, kind, created_at) VALUES ($1,$2,$3,$4,$5)',
		[id, label, sigil, kind, Date.now()]
	);
	// Every person starts green; presence exists from the first breath.
	if (kind === 'person') {
		await db.execute(
			'INSERT OR REPLACE INTO signals (member_id, state, shared, updated_at) VALUES ($1,$2,$3,$4)',
			[id, 'green', 1, Date.now()]
		);
	}
	await loadAll();
	return id;
}

async function updateMember(id: string, label: string, sigil: string) {
	if (!db) return;
	await db.execute('UPDATE members SET label=$1, sigil=$2 WHERE id=$3', [label, sigil, id]);
	await loadAll();
}

function setDeviceMember(id: string | null) {
	deviceMemberId = id;
	try {
		if (id) localStorage.setItem(DEVICE_MEMBER_KEY, id);
		else localStorage.removeItem(DEVICE_MEMBER_KEY);
	} catch {}
}

// ——— spoons ———
async function logSpoons(memberId: string, value: number | null, shared: boolean) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO spoon_logs (id, member_id, value, shared, ts) VALUES ($1,$2,$3,$4,$5)',
		[generateId(), memberId, value, shared ? 1 : 0, Date.now()]
	);
	await loadAll();
}

// ——— signals (current state only — no history, by design) ———
async function setSignal(memberId: string, state: SignalState, shared: boolean) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT OR REPLACE INTO signals (member_id, state, shared, updated_at) VALUES ($1,$2,$3,$4)',
		[memberId, state, shared ? 1 : 0, Date.now()]
	);
	await loadAll();
}

// ——— things ———
async function addThing(t: Partial<Thing> & { title: string; species: ThingSpecies }) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const id = generateId();
	await db.execute(
		`INSERT INTO things (id, title, species, notes, spoon_cost, edge_date,
			amount_cents, amount_shared, autopay, holder_member_id, loop_rule,
			pool, member_id, pet_id, shared, rested_until, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
		[
			id, t.title, t.species, t.notes ?? null, t.spoonCost ?? null,
			t.edgeDate ?? null, t.amountCents ?? null, t.amountShared ? 1 : 0,
			t.autopay ? 1 : 0, t.holderMemberId ?? null, t.loopRule ?? null,
			t.pool === false ? 0 : 1, t.memberId ?? null, t.petId ?? null,
			t.shared === false ? 0 : 1, null, Date.now(),
		]
	);
	await loadAll();
	return id;
}

async function updateThing(id: string, patch: Partial<Thing>) {
	if (!db) return;
	const cur = things.find((x) => x.id === id);
	if (!cur) return;
	const t = { ...cur, ...patch };
	await db.execute(
		`UPDATE things SET title=$1, species=$2, notes=$3, spoon_cost=$4,
			edge_date=$5, amount_cents=$6, amount_shared=$7, autopay=$8,
			holder_member_id=$9, loop_rule=$10, pool=$11, member_id=$12,
			pet_id=$13, shared=$14, rested_until=$15 WHERE id=$16`,
		[
			t.title, t.species, t.notes ?? null, t.spoonCost ?? null,
			t.edgeDate ?? null, t.amountCents ?? null, t.amountShared ? 1 : 0,
			t.autopay ? 1 : 0, t.holderMemberId ?? null, t.loopRule ?? null,
			t.pool ? 1 : 0, t.memberId ?? null, t.petId ?? null,
			t.shared ? 1 : 0, t.restedUntil ?? null, id,
		]
	);
	await loadAll();
}

async function removeThing(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM dones WHERE thing_id=$1', [id]);
	await db.execute('DELETE FROM things WHERE id=$1', [id]);
	await loadAll();
}

// When a loop is done it rests — until the next natural return.
function nextRest(loopRule: string | null): number {
	const midnight = new Date();
	midnight.setHours(24, 0, 0, 0); // next local midnight
	if (!loopRule || loopRule === 'daily') return midnight.getTime();
	if (loopRule.startsWith('weekly')) {
		const d = new Date(midnight);
		d.setDate(d.getDate() + 6); // returns in a week, give or take the morning
		return d.getTime();
	}
	return midnight.getTime(); // custom rules rest at least a day
}

// Done — the celebration. Returns the quiet line to show, then let fade.
async function doneThing(thingId: string, memberId: string | null, felt?: string) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO dones (id, thing_id, member_id, ts, felt) VALUES ($1,$2,$3,$4,$5)',
		[generateId(), thingId, memberId, Date.now(), felt ?? null]
	);
	const t = things.find((x) => x.id === thingId);
	if (t?.species === 'loop') {
		await db.execute('UPDATE things SET rested_until=$1 WHERE id=$2', [
			nextRest(t.loopRule ?? null), thingId,
		]);
	} else if (t?.species === 'breathing') {
		// A done breathing task is complete; it leaves quietly.
		await db.execute('DELETE FROM things WHERE id=$1', [thingId]);
	} else if (t?.species === 'edge') {
		// A paid bill's edge has passed safely; it leaves quietly too
		// (recurring bills are added as loops or re-added — v1 keeps it simple).
		await db.execute('DELETE FROM things WHERE id=$1', [thingId]);
	}
	await loadAll();
	return pickCelebration();
}

// ——— meds (private by default) ———
async function addMed(memberId: string, label: string, schedule: string, shared: boolean) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO meds (id, member_id, label, schedule, shared, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
		[generateId(), memberId, label, schedule, shared ? 1 : 0, Date.now()]
	);
	await loadAll();
}

async function removeMed(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM med_takes WHERE med_id=$1', [id]);
	await db.execute('DELETE FROM meds WHERE id=$1', [id]);
	await loadAll();
}

async function takeMed(medId: string, status: MedTakeStatus) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO med_takes (id, med_id, ts, status) VALUES ($1,$2,$3,$4)',
		[generateId(), medId, Date.now(), status]
	);
	await loadAll();
	return status === 'taken' ? pickCelebration() : null;
}

// A med is "quietly asking" if it has no take yet today. Gentle persistence:
// in-app presence only — the Hearth never pushes, sounds, or vibrates.
function medTakenToday(medId: string): boolean {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	return medTakes.some((t) => t.medId === medId && t.ts >= start.getTime());
}

// ——— personal protocols (DESIGN-003 §2) ———
function protocolFor(memberId: string): Protocol {
	return (
		protocols.find((p) => p.memberId === memberId) ?? {
			memberId,
			tellScope: 'household',
			tellMembers: [],
			cardText: null,
			needs: [],
			checkbackMinutes: 30,
		}
	);
}

async function saveProtocol(p: Protocol) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		`INSERT OR REPLACE INTO protocols
			(member_id, tell_scope, tell_members, card_text, needs, checkback_minutes)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		[
			p.memberId, p.tellScope, JSON.stringify(p.tellMembers),
			p.cardText ?? null, JSON.stringify(p.needs), p.checkbackMinutes,
		]
	);
	await loadAll();
}

// ——— the Sattva system (the Meltdown Protocol) ———
// Family-facing name: Sattva (DESIGN-005). Function/table names below keep
// their legacy 'overwhelm' spelling deliberately — installed devices carry
// data under them, and identifiers are not UI.
// The vessel's own protocol decides who is told; the audience is snapshotted
// onto the event so later protocol edits never change a live event.
async function startOverwhelm(memberId: string) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const p = protocolFor(memberId);
	const shared = p.tellScope !== 'none';
	const tell = p.tellScope === 'household' ? 'all' : JSON.stringify(p.tellMembers);
	const id = generateId();
	await db.execute(
		'INSERT INTO overwhelm_events (id, member_id, started_at, shared, tell) VALUES ($1,$2,$3,$4,$5)',
		[id, memberId, Date.now(), shared ? 1 : 0, tell]
	);
	await loadAll();
	return id;
}

// The one-tap answer to "what do you need?" — from the vessel's own list.
async function setOverwhelmNeed(eventId: string, need: string) {
	if (!db) return;
	await db.execute('UPDATE overwhelm_events SET need=$1 WHERE id=$2', [need, eventId]);
	await loadAll();
}

async function returnFromOverwhelm(eventId: string, helped?: string, notes?: string) {
	if (!db) return;
	await db.execute(
		'UPDATE overwhelm_events SET returned_at=$1, helped=$2, notes=$3 WHERE id=$4',
		[Date.now(), helped ?? null, notes ?? null, eventId]
	);
	const ev = overwhelms.find((e) => e.id === eventId);
	if (ev) await setSignal(ev.memberId, 'rainbow', true);
	await loadAll();
}

// ——— export & delete (license §7 — features, not promises) ———
async function exportAll(): Promise<string> {
	return JSON.stringify(
		{
			exported_at: new Date().toISOString(),
			app: 'resonance-hearth',
			members, signals, spoonLogs, things, meds, medTakes, overwhelms, protocols,
		},
		null,
		2
	);
}

async function purgeAll() {
	if (!db) throw new Error('Database not ready — nothing was purged');
	for (const table of [
		'dones', 'med_takes', 'meds', 'overwhelm_events', 'spoon_logs',
		'signals', 'things', 'members',
	]) {
		await db.execute(`DELETE FROM ${table}`);
	}
	await loadAll();
}

// ——— derived helpers ———
export const hearthStore = {
	get members() { return members; },
	get people() { return members.filter((m) => m.kind === 'person'); },
	get pets() { return members.filter((m) => m.kind === 'pet'); },
	get signals() { return signals; },
	get spoonLogs() { return spoonLogs; },
	get things() { return things; },
	get meds() { return meds; },
	get medTakes() { return medTakes; },
	get overwhelms() { return overwhelms; },
	get loading() { return loading; },
	get dbError() { return dbError; },
	get now() { return now; },

	get deviceMemberId() { return deviceMemberId; },
	get me() { return members.find((m) => m.id === deviceMemberId) ?? null; },

	memberById(id: string | null | undefined): Member | null {
		return members.find((m) => m.id === id) ?? null;
	},

	// The window, not the monitor: only shared signals, only current state.
	get sharedSignals(): Signal[] {
		return signals.filter((s) => s.shared);
	},

	signalFor(memberId: string): Signal | null {
		return signals.find((s) => s.memberId === memberId) ?? null;
	},

	// My latest spoons today (or null if none logged).
	latestSpoons(memberId: string): SpoonLog | null {
		const start = new Date(); start.setHours(0, 0, 0, 0);
		return spoonLogs.find((l) => l.memberId === memberId && l.ts >= start.getTime()) ?? null;
	},

	// Shared spoons across the household — the collective weather.
	get householdSpoons(): SpoonLog[] {
		const start = new Date(); start.setHours(0, 0, 0, 0);
		const seen = new Set<string>();
		return spoonLogs.filter((l) => {
			if (!l.shared || l.ts < start.getTime() || seen.has(l.memberId)) return false;
			seen.add(l.memberId);
			return true;
		});
	},

	// Loops awake right now (not resting).
	get activeLoops(): Thing[] {
		return things.filter(
			(t) => t.species === 'loop' && (!t.restedUntil || t.restedUntil <= now)
		);
	},

	// Edges sorted by nearness — the calm horizons.
	get edges(): Thing[] {
		return things
			.filter((t) => t.species === 'edge')
			.sort((a, b) => (a.edgeDate ?? Infinity) - (b.edgeDate ?? Infinity));
	},

	get breathing(): Thing[] {
		return things.filter((t) => t.species === 'breathing');
	},

	// Meds for a member that are still quietly asking today.
	medsAsking(memberId: string): Med[] {
		return meds.filter((m) => m.memberId === memberId && !medTakenToday(m.id));
	},
	medTakenToday,

	// Overwhelm events currently open (not yet returned).
	openOverwhelm(memberId: string): OverwhelmEvent | null {
		return overwhelms.find((e) => e.memberId === memberId && !e.returnedAt) ?? null;
	},

	// PROTECTED BOUNDARY — the 30-second pause, enforced in data:
	// the household sees a shared overwhelm only after the pause has passed.
	// Personal protocols (DESIGN-003 §2) additionally scope WHO sees it:
	// the event's snapshotted audience ('all' or a member-id list) filters
	// against this device's member. The pause itself is never personal.
	get householdOverwhelms(): OverwhelmEvent[] {
		return overwhelms.filter((e) => {
			if (!e.shared || e.returnedAt || e.startedAt + OVERWHELM_PAUSE_MS > now) return false;
			if (e.memberId === deviceMemberId) return false; // the vessel has their own room
			if (!e.tell || e.tell === 'all') return true;
			try {
				const list: string[] = JSON.parse(e.tell);
				return deviceMemberId != null && list.includes(deviceMemberId);
			} catch { return true; }
		});
	},

	get protocols() { return protocols; },
	protocolFor,

	initDB,
	loadAll,
	addMember,
	updateMember,
	setDeviceMember,
	logSpoons,
	setSignal,
	addThing,
	updateThing,
	removeThing,
	doneThing,
	addMed,
	removeMed,
	takeMed,
	startOverwhelm,
	setOverwhelmNeed,
	returnFromOverwhelm,
	saveProtocol,
	exportAll,
	purgeAll,
};
