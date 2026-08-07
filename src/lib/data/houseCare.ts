// The guidance shelf — the house's offered knowledge (THE HOUSE POUR,
// KP 2026-08-06, geode §⑪; the drafts blessed on THE-HOUSE-WALK.md at
// his ⚛ word: "the rest is good as is").
//
// The law over every entry: THE WHY ALWAYS RIDES WITH THE HOW — "the
// why is important for neurodivergent minds" (KP, verbatim). Teaching
// never wounds: guidance is offered knowledge, invitation-shaped; it
// never scolds, never counts misses, never says who didn't. Shipped
// authored, no network, no DB — the app carries the teaching so no
// person has to.
//
// windowDays feeds the temporal shape (KP's ⚛ stroke: "temportal
// category, yes"): every "how often" is a validity window; a done is a
// fresh take; state derives from the clock. null = a habit ("after
// use", "as they come"), not a window.

export interface CareEntry {
	act: string; // the how, short — becomes an offered loop's title
	cadence: string; // the window in plain words
	windowDays: number | null; // the window as a number; null = habit
	why: string; // the reason, honest and warm — always shown
}

export const ROOM_TYPES = [
	'bathroom',
	'kitchen',
	'bedroom',
	'living room',
	'laundry',
	'pantry',
	'stairway',
	'hallway',
	'office/studio',
	'garage',
	'basement',
	'porch/outdoor'
] as const;

export const FLOOR_TYPES = [
	'hardwood',
	'tile',
	'carpet',
	'vinyl/laminate',
	'stone',
	'concrete'
] as const;

export const FLOOR_CARE: Record<string, CareEntry[]> = {
	hardwood: [
		{
			act: 'Sweep or dust-mop',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Grit under feet works like fine sandpaper — every step with sand on the floor scratches the finish a little. Lifting it keeps the floor smooth for years.'
		},
		{
			act: 'Damp-mop, barely damp, wood-safe soap',
			cadence: 'about monthly',
			windowDays: 30,
			why: "Water is wood's least favorite guest — too much swells the boards at their seams. A barely-damp mop lifts the film without soaking the joints. Never steam — steam forces water in."
		}
	],
	tile: [
		{
			act: 'Sweep or vacuum',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Loose grit dulls the glaze the same way it scratches wood.'
		},
		{
			act: 'Mop with mild soap',
			cadence: 'every week or two',
			windowDays: 10,
			why: "The tile forgives water — it is the grout that drinks. Mild soap keeps the grout from graying and holding what it's given."
		},
		{
			act: 'Grout refresh',
			cadence: 'seasonal',
			windowDays: 90,
			why: 'Grout is porous — a little sealing now spares a lot of scrubbing later.'
		}
	],
	carpet: [
		{
			act: 'Vacuum, slow passes',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Carpet holds dust the way a sponge holds water; slow passes give the machine time to actually lift it — fast passes only comb the surface.'
		},
		{
			act: 'Spot-clean spills when they happen',
			cadence: 'as they come',
			windowDays: null,
			why: 'Fibers keep what dries into them.'
		},
		{
			act: 'Deep clean',
			cadence: 'once or twice a year',
			windowDays: 240,
			why: 'What settles below the pile never meets the vacuum at all.'
		}
	],
	'vinyl/laminate': [
		{
			act: 'Sweep',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Grit grinds the wear layer down underfoot, and the wear layer is the floor’s only armor.'
		},
		{
			act: 'Damp-mop, gentle cleaner',
			cadence: 'every week or two',
			windowDays: 10,
			why: "Harsh cleaners strip the wear layer; laminate's core swells like cardboard when water finds an edge — damp, never wet."
		}
	],
	stone: [
		{
			act: 'Dust-mop',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Grit scratches stone slowly, the way it scratches everything else — lifting it costs a minute.'
		},
		{
			act: 'Damp-mop, pH-neutral soap',
			cadence: 'every week or two',
			windowDays: 10,
			why: 'Stone is chemistry — vinegar and lemon quietly eat marble and limestone. A neutral soap cleans without picking that fight.'
		},
		{
			act: 'Reseal',
			cadence: 'on its season',
			windowDays: 180,
			why: 'Stone drinks; the seal is its raincoat.'
		}
	],
	concrete: [
		{
			act: 'Sweep',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Sealed concrete asks little; the sweep keeps grit from grinding the seal away underfoot.'
		},
		{
			act: 'Mop',
			cadence: 'about monthly',
			windowDays: 30,
			why: 'A gentle mop keeps the seal clear so it can keep doing its quiet work.'
		}
	]
};

export const FIXTURE_KINDS = [
	'mirror',
	'toilet',
	'sink',
	'tub',
	'shower',
	'counter',
	'window',
	'appliance',
	'other'
] as const;

export const FIXTURE_CARE: Record<string, CareEntry[]> = {
	mirror: [
		{
			act: 'Wipe the mirror',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Spots build so slowly the eyes stop seeing them — until the face in the mirror is behind fog. A minute now returns the whole mirror.'
		}
	],
	toilet: [
		{
			act: 'Clean the bowl',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'A weekly bowl never gets hard to face; a forgotten one does. Little and often is the whole trick.'
		},
		{
			act: 'Wipe seat and handle',
			cadence: 'a little more often',
			windowDays: 4,
			why: "The handle is touched by every hand before that hand is washed — it is the room's busiest doorknob."
		}
	],
	sink: [
		{
			act: 'Wipe the sink',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Toothpaste and soap dry into a film that hardens with time; a soft wipe today beats scrubbing next month. A quick rinse after use keeps the film from ever starting.'
		}
	],
	tub: [
		{
			act: 'Clean the tub',
			cadence: 'every week or two',
			windowDays: 10,
			why: "Soap scum is soap plus water's minerals, laid down in thin layers — each rinse after use is one layer that never lands."
		}
	],
	shower: [
		{
			act: 'Clean the shower',
			cadence: 'about weekly',
			windowDays: 7,
			why: 'Warm damp is where mildew makes its home; a rinse or squeegee after use dries the walls and takes its home away before it ever moves in.'
		}
	]
};

/** The loop rule an adopted care entry rides — mapped onto the loop
 *  machinery's own vocabulary (custom rules rest at least a day). */
export function loopRuleFor(entry: CareEntry): string | null {
	if (entry.windowDays == null) return null; // a habit, not a loop
	if (entry.windowDays <= 1) return 'daily';
	if (entry.windowDays <= 10) return 'weekly';
	return `about every ${entry.windowDays} days`;
}

/** Every care entry a room offers, floor and fixtures together. */
export function careFor(floorType: string | null | undefined, fixtureKinds: string[]): { source: string; entry: CareEntry }[] {
	const out: { source: string; entry: CareEntry }[] = [];
	if (floorType && FLOOR_CARE[floorType]) {
		for (const entry of FLOOR_CARE[floorType]) out.push({ source: `${floorType} floor`, entry });
	}
	for (const kind of fixtureKinds) {
		if (FIXTURE_CARE[kind]) {
			for (const entry of FIXTURE_CARE[kind]) out.push({ source: kind, entry });
		}
	}
	return out;
}
