import Database from '@tauri-apps/plugin-sql';
import { browser } from '$app/environment';
import { seal, open as openEnvelope } from 'the-envelope';
import { version as APP_VERSION } from '../../../package.json';
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
	CardAction,
	CardActionKind,
	Feeling,
	EmojiMeaning,
	Room,
	RoomResponsible,
	Fixture,
	FixtureKind,
	Circuit,
	ElectricPoint,
	ElectricPointKind,
	MantelNote,
	MantelKind,
	MantelScope,
	MantelComment,
	Letting,
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
let cardActions = $state<CardAction[]>([]);
let feelings = $state<Feeling[]>([]);
let emojiMeanings = $state<EmojiMeaning[]>([]);
let rooms = $state<Room[]>([]);
let roomResponsibles = $state<RoomResponsible[]>([]);
let fixtures = $state<Fixture[]>([]);
let circuits = $state<Circuit[]>([]);
let electricPoints = $state<ElectricPoint[]>([]);
let mantelNotes = $state<MantelNote[]>([]);
let mantelComments = $state<MantelComment[]>([]);
let lettings = $state<Letting[]>([]);
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
	arrival: r.arrival == null ? null : (r.arrival as number),
	species: (r.species as string) ?? null,
	cardColor: (r.card_color as string) ?? null,
	colorSource: (r.color_source as string) ?? 'first',
});
const toCardAction = (r: Record<string, unknown>): CardAction => ({
	id: r.id as string,
	memberId: r.member_id as string,
	emoji: r.emoji as string,
	label: (r.label as string) ?? null,
	kind: (r.kind as CardActionKind) ?? 'done',
	thingId: (r.thing_id as string) ?? null,
	keepsFor: r.keeps_for == null ? null : (r.keeps_for as number),
	approachAt: r.approach_at == null ? null : (r.approach_at as number),
	startedAt: r.started_at == null ? null : (r.started_at as number),
	position: (r.position as number) ?? 0,
});
const toEmojiMeaning = (r: Record<string, unknown>): EmojiMeaning => ({
	id: r.id as string,
	emoji: r.emoji as string,
	memberId: (r.member_id as string) ?? null,
	meaning: r.meaning as string,
	ts: r.ts as number,
});
const toRoom = (r: Record<string, unknown>): Room => ({
	id: r.id as string,
	name: r.name as string,
	roomType: (r.room_type as string) ?? 'room',
	floorType: (r.floor_type as string) ?? null,
	notes: (r.notes as string) ?? null,
	createdAt: r.created_at as number,
});
const toRoomResponsible = (r: Record<string, unknown>): RoomResponsible => ({
	roomId: r.room_id as string,
	memberId: r.member_id as string,
});
const toFixture = (r: Record<string, unknown>): Fixture => ({
	id: r.id as string,
	roomId: r.room_id as string,
	kind: (r.kind as FixtureKind) ?? 'other',
	label: (r.label as string) ?? null,
	notes: (r.notes as string) ?? null,
});
const toCircuit = (r: Record<string, unknown>): Circuit => ({
	id: r.id as string,
	breakerLabel: r.breaker_label as string,
	amps: r.amps == null ? null : (r.amps as number),
	notes: (r.notes as string) ?? null,
});
const toElectricPoint = (r: Record<string, unknown>): ElectricPoint => ({
	id: r.id as string,
	roomId: r.room_id as string,
	kind: (r.kind as ElectricPointKind) ?? 'outlet',
	label: (r.label as string) ?? null,
	circuitId: (r.circuit_id as string) ?? null,
});
const toMantelNote = (r: Record<string, unknown>): MantelNote => ({
	id: r.id as string,
	memberId: r.member_id as string,
	kind: (r.kind as MantelKind) ?? 'note',
	text: r.text as string,
	emoji: (r.emoji as string) ?? null,
	scope: (r.scope as MantelScope) ?? 'house',
	ts: r.ts as number,
});
const toMantelComment = (r: Record<string, unknown>): MantelComment => ({
	id: r.id as string,
	noteId: r.note_id as string,
	memberId: r.member_id as string,
	emoji: (r.emoji as string) ?? null,
	text: (r.text as string) ?? null,
	ts: r.ts as number,
});
const toLetting = (r: Record<string, unknown>): Letting => ({
	id: r.id as string,
	memberId: r.member_id as string,
	naming: r.naming as string,
	telling: (r.telling as string) ?? null,
	freedom: r.freedom as string,
	releasedAt: r.released_at == null ? null : (r.released_at as number),
	ts: r.ts as number,
});
const toFeeling = (r: Record<string, unknown>): Feeling => ({
	id: r.id as string,
	memberId: r.member_id as string,
	emoji: r.emoji as string,
	word: (r.word as string) ?? null,
	shared: !!r.shared,
	ts: r.ts as number,
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
	roomId: (r.room_id as string) ?? null,
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
		cardActions = (await q('SELECT * FROM card_actions ORDER BY member_id, position')).map(toCardAction);
		// A working view only (export reads the full table live).
		feelings = (await q('SELECT * FROM feelings ORDER BY ts DESC LIMIT 200')).map(toFeeling);
		emojiMeanings = (await q('SELECT * FROM emoji_meanings ORDER BY emoji, ts')).map(toEmojiMeaning);
		rooms = (await q('SELECT * FROM rooms ORDER BY created_at')).map(toRoom);
		roomResponsibles = (await q('SELECT * FROM room_responsibles')).map(toRoomResponsible);
		fixtures = (await q('SELECT * FROM fixtures')).map(toFixture);
		circuits = (await q('SELECT * FROM circuits ORDER BY breaker_label')).map(toCircuit);
		electricPoints = (await q('SELECT * FROM electric_points')).map(toElectricPoint);
		mantelNotes = (await q('SELECT * FROM mantel_notes ORDER BY ts DESC LIMIT 200')).map(toMantelNote);
		mantelComments = (await q('SELECT * FROM mantel_comments ORDER BY ts')).map(toMantelComment);
		lettings = (await q('SELECT * FROM lettings ORDER BY ts DESC')).map(toLetting);
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
			pool, member_id, pet_id, room_id, shared, rested_until, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
		[
			id, t.title, t.species, t.notes ?? null, t.spoonCost ?? null,
			t.edgeDate ?? null, t.amountCents ?? null, t.amountShared ? 1 : 0,
			t.autopay ? 1 : 0, t.holderMemberId ?? null, t.loopRule ?? null,
			t.pool === false ? 0 : 1, t.memberId ?? null, t.petId ?? null,
			t.roomId ?? null, t.shared === false ? 0 : 1, null, Date.now(),
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
			pet_id=$13, room_id=$14, shared=$15, rested_until=$16 WHERE id=$17`,
		[
			t.title, t.species, t.notes ?? null, t.spoonCost ?? null,
			t.edgeDate ?? null, t.amountCents ?? null, t.amountShared ? 1 : 0,
			t.autopay ? 1 : 0, t.holderMemberId ?? null, t.loopRule ?? null,
			t.pool ? 1 : 0, t.memberId ?? null, t.petId ?? null,
			t.roomId ?? null, t.shared ? 1 : 0, t.restedUntil ?? null, id,
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

// ——— the house itself (THE HOUSE POUR — geode §⑪, THE-HOUSE-WALK.md) ———
async function addRoom(name: string, roomType: string, floorType: string | null) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const id = generateId();
	await db.execute(
		'INSERT INTO rooms (id, name, room_type, floor_type, notes, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
		[id, name, roomType, floorType, null, Date.now()]
	);
	await loadAll();
	return id;
}

async function updateRoom(id: string, patch: Partial<Room>) {
	if (!db) return;
	const cur = rooms.find((r) => r.id === id);
	if (!cur) return;
	const r = { ...cur, ...patch };
	await db.execute('UPDATE rooms SET name=$1, room_type=$2, floor_type=$3, notes=$4 WHERE id=$5', [
		r.name, r.roomType, r.floorType ?? null, r.notes ?? null, id,
	]);
	await loadAll();
}

async function removeRoom(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM room_responsibles WHERE room_id=$1', [id]);
	await db.execute('DELETE FROM fixtures WHERE room_id=$1', [id]);
	await db.execute('DELETE FROM electric_points WHERE room_id=$1', [id]);
	// The things keep living; they only lose their room.
	await db.execute('UPDATE things SET room_id=NULL WHERE room_id=$1', [id]);
	await db.execute('DELETE FROM rooms WHERE id=$1', [id]);
	await loadAll();
}

async function toggleRoomResponsible(roomId: string, memberId: string) {
	if (!db) return;
	const held = roomResponsibles.some((x) => x.roomId === roomId && x.memberId === memberId);
	if (held) {
		await db.execute('DELETE FROM room_responsibles WHERE room_id=$1 AND member_id=$2', [roomId, memberId]);
	} else {
		await db.execute('INSERT OR IGNORE INTO room_responsibles (room_id, member_id) VALUES ($1,$2)', [roomId, memberId]);
	}
	await loadAll();
}

async function addFixture(roomId: string, kind: string, label: string | null) {
	if (!db) return;
	await db.execute('INSERT INTO fixtures (id, room_id, kind, label, notes) VALUES ($1,$2,$3,$4,$5)', [
		generateId(), roomId, kind, label, null,
	]);
	await loadAll();
}

async function removeFixture(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM fixtures WHERE id=$1', [id]);
	await loadAll();
}

async function addCircuit(breakerLabel: string, amps: number | null, notes: string | null) {
	if (!db) return;
	await db.execute('INSERT INTO circuits (id, breaker_label, amps, notes) VALUES ($1,$2,$3,$4)', [
		generateId(), breakerLabel, amps, notes,
	]);
	await loadAll();
}

async function updateCircuit(id: string, patch: Partial<Circuit>) {
	if (!db) return;
	const cur = circuits.find((c) => c.id === id);
	if (!cur) return;
	const c = { ...cur, ...patch };
	await db.execute('UPDATE circuits SET breaker_label=$1, amps=$2, notes=$3 WHERE id=$4', [
		c.breakerLabel, c.amps ?? null, c.notes ?? null, id,
	]);
	await loadAll();
}

async function removeCircuit(id: string) {
	if (!db) return;
	// The points keep standing; they simply await a new discovery.
	await db.execute('UPDATE electric_points SET circuit_id=NULL WHERE circuit_id=$1', [id]);
	await db.execute('DELETE FROM circuits WHERE id=$1', [id]);
	await loadAll();
}

async function addElectricPoint(roomId: string, kind: string, label: string | null) {
	if (!db) return;
	await db.execute('INSERT INTO electric_points (id, room_id, kind, label, circuit_id) VALUES ($1,$2,$3,$4,$5)', [
		generateId(), roomId, kind, label, null,
	]);
	await loadAll();
}

async function setPointCircuit(pointId: string, circuitId: string | null) {
	if (!db) return;
	await db.execute('UPDATE electric_points SET circuit_id=$1 WHERE id=$2', [circuitId, pointId]);
	await loadAll();
}

async function removeElectricPoint(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM electric_points WHERE id=$1', [id]);
	await loadAll();
}

// ——— the letting-go (KP's pour — a heart-room, private absolutely) ———
async function holdLetting(memberId: string, naming: string, telling: string | null, freedom: string) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO lettings (id, member_id, naming, telling, freedom, released_at, ts) VALUES ($1,$2,$3,$4,$5,$6,$7)',
		[generateId(), memberId, naming, telling, freedom, null, Date.now()]
	);
	await loadAll();
}

// The release — the record stays, witnessed. Freedom was already written.
async function releaseLetting(id: string) {
	if (!db) return;
	await db.execute('UPDATE lettings SET released_at=$1 WHERE id=$2', [Date.now(), id]);
	await loadAll();
}

async function removeLetting(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM lettings WHERE id=$1', [id]);
	await loadAll();
}

// ——— the Mantel (KP's pour — placement is the opt-in) ———
async function placeMantelNote(memberId: string, kind: MantelKind, text: string, emoji: string | null) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO mantel_notes (id, member_id, kind, text, emoji, scope, ts) VALUES ($1,$2,$3,$4,$5,$6,$7)',
		[generateId(), memberId, kind, text, emoji, 'house', Date.now()]
	);
	await loadAll();
}

// The author's note stays the author's — its comments rest with it.
async function removeMantelNote(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM mantel_comments WHERE note_id=$1', [id]);
	await db.execute('DELETE FROM mantel_notes WHERE id=$1', [id]);
	await loadAll();
}

async function addMantelComment(noteId: string, memberId: string, text: string | null, emoji: string | null) {
	if (!db) return;
	if (!text && !emoji) return; // emoji and/or words — something, gently
	await db.execute(
		'INSERT INTO mantel_comments (id, note_id, member_id, emoji, text, ts) VALUES ($1,$2,$3,$4,$5,$6)',
		[generateId(), noteId, memberId, emoji, text, Date.now()]
	);
	await loadAll();
}

async function removeMantelComment(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM mantel_comments WHERE id=$1', [id]);
	await loadAll();
}

// Adopt an offered care loop — adoption-only, by the walk's law: nothing
// appears in anyone's day uninvited. The why rides in the notes so the
// reason is never separated from the task.
async function adoptRoomLoop(roomId: string, title: string, loopRule: string | null, why: string) {
	return addThing({
		title,
		species: 'loop',
		notes: why,
		loopRule,
		roomId,
		pool: true,
		shared: true,
	});
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
// Notification is OPT-IN (KP's refinement, 2026-07-19: "maybe if the me
// settings wants others notified" — each person chooses in Me whether
// their people are told at all; DEFAULT: not). Consent lives in settings,
// set in calm; the moment itself stays silent either way.
function protocolFor(memberId: string): Protocol {
	return (
		protocols.find((p) => p.memberId === memberId) ?? {
			memberId,
			tellScope: 'none',
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

// ——— the entity cards: gentle reminders (KP's rulings, 2026-07-31) ———
// An emoji is a button that does a thing. Windows derive from the clock,
// never stored; the fresh take resets the start. The card's color journey
// (vessel's color → white → yellow → red) lives in $lib/data/cardColor.

async function addCardAction(a: {
	memberId: string; emoji: string; label?: string | null; kind: CardActionKind;
	thingId?: string | null; keepsForDays?: number | null; approachAt?: number | null;
}) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const id = generateId();
	const position = cardActions.filter((c) => c.memberId === a.memberId).length;
	const keepsFor = a.kind === 'reset' && a.keepsForDays ? Math.round(a.keepsForDays * 86_400_000) : null;
	await db.execute(
		`INSERT INTO card_actions (id, member_id, emoji, label, kind, thing_id, keeps_for, approach_at, started_at, position)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
		[
			id, a.memberId, a.emoji, a.label ?? null, a.kind, a.thingId ?? null,
			keepsFor, a.approachAt ?? null,
			a.kind === 'reset' ? Date.now() : null, // a new window begins fresh
			position,
		]
	);
	await loadAll();
	return id;
}

async function removeCardAction(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM card_actions WHERE id=$1', [id]);
	// If this emoji was leading a card's color, the card returns to 'first'.
	await db.execute("UPDATE members SET color_source='first' WHERE color_source=$1", [id]);
	await loadAll();
}

// The tap. done → the thing's machinery + celebration · reset → the fresh
// take · feeling → a private feeling row. ('take' opens the med list in
// the UI; each selected med rides takeMed as always.)
async function tapCardAction(id: string, byMemberId: string | null): Promise<string | null> {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	const a = cardActions.find((c) => c.id === id);
	if (!a) return null;
	if (a.kind === 'done' && a.thingId) {
		return await doneThing(a.thingId, byMemberId);
	}
	if (a.kind === 'reset') {
		await db.execute('UPDATE card_actions SET started_at=$1 WHERE id=$2', [Date.now(), id]);
		await loadAll();
		return pickCelebration();
	}
	if (a.kind === 'feeling') {
		await db.execute(
			'INSERT INTO feelings (id, member_id, emoji, word, shared, ts) VALUES ($1,$2,$3,$4,0,$5)',
			[generateId(), a.memberId, a.emoji, null, Date.now()]
		);
		await loadAll();
		return 'Felt, and held. Yours alone unless you share it.';
	}
	return null;
}

async function setMemberCard(id: string, patch: { cardColor?: string | null; colorSource?: string }) {
	if (!db) return;
	const m = members.find((x) => x.id === id);
	if (!m) return;
	await db.execute('UPDATE members SET card_color=$1, color_source=$2 WHERE id=$3', [
		patch.cardColor === undefined ? (m.cardColor ?? null) : patch.cardColor,
		patch.colorSource === undefined ? m.colorSource : patch.colorSource,
		id,
	]);
	await loadAll();
}

function actionsFor(memberId: string): CardAction[] {
	return cardActions.filter((c) => c.memberId === memberId);
}

// ——— the household lexicon (the emoji folksonomy, at home) ———
// Append-only by the Folksonomy Principle: a new meaning is a new row;
// nothing overwrites; removing is only ever one's own hand on one's own word.
async function addEmojiMeaning(emoji: string, meaning: string, memberId: string | null) {
	if (!db) throw new Error('Database not ready — close and reopen the app.');
	await db.execute(
		'INSERT INTO emoji_meanings (id, emoji, member_id, meaning, ts) VALUES ($1,$2,$3,$4,$5)',
		[generateId(), emoji, memberId, meaning.trim(), Date.now()]
	);
	await loadAll();
}

async function removeEmojiMeaning(id: string) {
	if (!db) return;
	await db.execute('DELETE FROM emoji_meanings WHERE id=$1', [id]);
	await loadAll();
}

function meaningsFor(emoji: string): EmojiMeaning[] {
	return emojiMeanings.filter((m) => m.emoji === emoji);
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

// ——— export, import & delete (license §7 — features, not promises) ———
// The three laws ride the family's shared library (the-envelope, referenced
// from the awen spring, never absorbed): counts on the outside · the export
// complete IN HAND before anything deletes · import non-destructive by law.

const APP_ID = 'resonance-hearth';

// Every app table, discovered live — never a curated list. The parent's own
// warning ("future keys must not survive a purge by omission") applies to
// export equally: a table this list can't see is a table the vessel can't
// take with them. sqlite_% is the engine's; _% (the _sqlx_migrations ledger)
// is the plugin's machinery — deleting it re-runs migrations into existing
// tables and breaks the app; neither is household data.
async function appTables(): Promise<string[]> {
	const rows = await db!.select<{ name: string }[]>(
		"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '\\_%' ESCAPE '\\' ORDER BY name"
	);
	return rows.map((r) => r.name);
}

// Full tables, straight from the base — never the in-memory arrays, whose
// working caps (recent spoons/takes/events) are a view, not the vessel's data.
async function exportAll(): Promise<string> {
	if (!db) throw new Error('Database not ready — nothing was exported.');
	const data: Record<string, Record<string, unknown>[]> = {};
	const counts: Record<string, number> = {};
	for (const t of await appTables()) {
		const rows = await db.select<Record<string, unknown>[]>(`SELECT * FROM "${t}"`);
		data[t] = rows;
		counts[t] = rows.length;
	}
	return JSON.stringify(seal(APP_ID, APP_VERSION, data, counts), null, 2);
}

// The 07-11 era export (pre-envelope): one object, camelCase arrays, no dones.
// A vessel's old backup must never be told it's worthless — carried whole.
function legacyObjectToTables(raw: Record<string, unknown>): Record<string, Record<string, unknown>[]> {
	const arr = (k: string) => (Array.isArray(raw[k]) ? (raw[k] as Record<string, unknown>[]) : []);
	const b = (v: unknown) => (v ? 1 : 0);
	return {
		members: arr('members').map((m) => ({
			id: m.id, label: m.label, sigil: m.sigil ?? '', kind: m.kind ?? 'person', created_at: m.createdAt,
		})),
		signals: arr('signals').map((s) => ({
			member_id: s.memberId, state: s.state, shared: b(s.shared), updated_at: s.updatedAt,
		})),
		spoon_logs: arr('spoonLogs').map((l) => ({
			id: l.id, member_id: l.memberId, value: l.value ?? null, shared: b(l.shared), ts: l.ts,
		})),
		things: arr('things').map((t) => ({
			id: t.id, title: t.title, species: t.species, notes: t.notes ?? null,
			spoon_cost: t.spoonCost ?? null, edge_date: t.edgeDate ?? null,
			amount_cents: t.amountCents ?? null, amount_shared: b(t.amountShared),
			autopay: b(t.autopay), holder_member_id: t.holderMemberId ?? null,
			loop_rule: t.loopRule ?? null, pool: b(t.pool), member_id: t.memberId ?? null,
			pet_id: t.petId ?? null, shared: b(t.shared), rested_until: t.restedUntil ?? null,
			created_at: t.createdAt,
		})),
		meds: arr('meds').map((m) => ({
			id: m.id, member_id: m.memberId, label: m.label, schedule: m.schedule,
			shared: b(m.shared), created_at: m.createdAt,
		})),
		med_takes: arr('medTakes').map((t) => ({ id: t.id, med_id: t.medId, ts: t.ts, status: t.status })),
		overwhelm_events: arr('overwhelms').map((e) => ({
			id: e.id, member_id: e.memberId, started_at: e.startedAt,
			returned_at: e.returnedAt ?? null, helped: e.helped ?? null, notes: e.notes ?? null,
			shared: b(e.shared), need: e.need ?? null, tell: e.tell ?? null,
		})),
		protocols: arr('protocols').map((p) => ({
			member_id: p.memberId, tell_scope: p.tellScope ?? 'household',
			tell_members: JSON.stringify(p.tellMembers ?? []), card_text: p.cardText ?? null,
			needs: JSON.stringify(p.needs ?? []), checkback_minutes: p.checkbackMinutes ?? 30,
		})),
	};
}

// Import — non-destructive by law: an existing row is the household's current
// mind and is never overwritten by a file. New rows are welcomed in; rows a
// changed schema can't hold are counted honestly, never guessed at.
async function importAll(json: string): Promise<{ added: number; kept: number; heldBack: number }> {
	if (!db) throw new Error('Database not ready — nothing was imported.');
	const parsed: unknown = JSON.parse(json);
	let tables: Record<string, Record<string, unknown>[]>;
	if (
		parsed && typeof parsed === 'object' && !Array.isArray(parsed) &&
		!('envelope' in (parsed as Record<string, unknown>)) &&
		(parsed as Record<string, unknown>).app === APP_ID
	) {
		tables = legacyObjectToTables(parsed as Record<string, unknown>);
	} else {
		const reading = openEnvelope<Record<string, Record<string, unknown>[]>>(parsed, APP_ID);
		if (reading.kind !== 'envelope') {
			throw new Error('This file is older than any Hearth export — nothing was changed.');
		}
		tables = reading.data;
	}
	let added = 0, kept = 0, heldBack = 0;
	const live = new Set(await appTables());
	for (const [t, rows] of Object.entries(tables)) {
		if (!live.has(t) || !Array.isArray(rows)) { heldBack += Array.isArray(rows) ? rows.length : 0; continue; }
		const info = await db.select<{ name: string }[]>(`PRAGMA table_info("${t}")`);
		const liveCols = new Set(info.map((c) => c.name));
		for (const row of rows) {
			if (!row || typeof row !== 'object') continue;
			const cols = Object.keys(row).filter((c) => liveCols.has(c));
			if (!cols.length) { heldBack++; continue; }
			try {
				const res = await db.execute(
					`INSERT OR IGNORE INTO "${t}" (${cols.map((c) => `"${c}"`).join(',')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(',')})`,
					cols.map((c) => (row as Record<string, unknown>)[c] ?? null)
				);
				if (res.rowsAffected > 0) added++;
				else kept++;
			} catch {
				heldBack++;
			}
		}
	}
	await loadAll();
	return { added, kept, heldBack };
}

async function purgeAll() {
	if (!db) throw new Error('Database not ready — nothing was purged');
	// Deny-by-default: every app table, discovered live (see appTables) —
	// a curated list forgets in silence; this one cannot. localStorage
	// rides too (device selection, theme): everything means everything.
	for (const t of await appTables()) {
		await db.execute(`DELETE FROM "${t}"`);
	}
	try { localStorage.clear(); } catch {}
	deviceMemberId = null;
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

	get cardActions() { return cardActions; },
	get feelings() { return feelings; },
	get emojiMeanings() { return emojiMeanings; },

	// ——— the house itself ———
	get rooms() { return rooms; },
	get roomResponsibles() { return roomResponsibles; },
	get fixtures() { return fixtures; },
	get circuits() { return circuits; },
	get electricPoints() { return electricPoints; },
	roomById(id: string | null | undefined): Room | null {
		return rooms.find((r) => r.id === id) ?? null;
	},
	fixturesFor(roomId: string): Fixture[] {
		return fixtures.filter((f) => f.roomId === roomId);
	},
	pointsFor(roomId: string): ElectricPoint[] {
		return electricPoints.filter((p) => p.roomId === roomId);
	},
	responsiblesFor(roomId: string): Member[] {
		const ids = roomResponsibles.filter((x) => x.roomId === roomId).map((x) => x.memberId);
		return members.filter((m) => ids.includes(m.id));
	},
	roomLoops(roomId: string): Thing[] {
		return things.filter((t) => t.roomId === roomId && t.species === 'loop');
	},
	roomAssets(roomId: string): Thing[] {
		return things.filter((t) => t.roomId === roomId && t.species !== 'loop');
	},

	// ——— the Mantel ———
	get mantelNotes() { return mantelNotes; },
	commentsFor(noteId: string): MantelComment[] {
		return mantelComments.filter((c) => c.noteId === noteId);
	},

	// ——— the letting-go: ONLY the vessel's own, ever ———
	myLettings(memberId: string): Letting[] {
		return lettings.filter((l) => l.memberId === memberId);
	},
	actionsFor,
	meaningsFor,
	// Meds visible on a member's card: their own on their own device, a
	// pet's for any hand (someone must give them), a person's only if that
	// med is shared. Private meds never surface on another's screen.
	cardMeds(memberId: string): Med[] {
		const m = members.find((x) => x.id === memberId);
		if (!m) return [];
		return meds.filter(
			(md) =>
				md.memberId === memberId &&
				(m.kind === 'pet' || memberId === deviceMemberId || md.shared)
		);
	},

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
	addCardAction,
	removeCardAction,
	tapCardAction,
	setMemberCard,
	addEmojiMeaning,
	removeEmojiMeaning,
	addRoom,
	updateRoom,
	removeRoom,
	toggleRoomResponsible,
	addFixture,
	removeFixture,
	addCircuit,
	updateCircuit,
	removeCircuit,
	addElectricPoint,
	setPointCircuit,
	removeElectricPoint,
	adoptRoomLoop,
	placeMantelNote,
	removeMantelNote,
	addMantelComment,
	removeMantelComment,
	holdLetting,
	releaseLetting,
	removeLetting,
	exportAll,
	importAll,
	purgeAll,
};
