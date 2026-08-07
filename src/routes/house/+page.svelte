<script lang="ts">
	// THE HOUSE — the rooms, their care, and the why.
	// THE HOUSE POUR (KP, 2026-08-06 — geode §⑪; THE-HOUSE-WALK.md is the
	// blueprint, its offers stroked): the keeper adds the house itself, and
	// the house answers with OFFERED knowledge — how, how often, and WHY —
	// so any member can pick up any task without ever needing to be taught
	// by a person. Teaching never wounds: guidance never scolds, never
	// counts misses, never says who didn't.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { galleryOf, type GalleryConfig } from '$lib/gallery';
	import type { Room } from '$lib/types/types';
	import {
		ROOM_TYPES,
		FLOOR_TYPES,
		FIXTURE_KINDS,
		careFor,
		loopRuleFor,
		type CareEntry
	} from '$lib/data/houseCare';

	// ——— the add-room form ———
	let newName = $state('');
	let newType = $state<string>('bathroom');
	let newFloor = $state<string>('hardwood');

	async function addRoom() {
		if (!newName.trim()) return;
		await hearthStore.addRoom(newName.trim(), newType, newFloor);
		newName = '';
	}

	// ——— the rooms gallery (the family's shared engine) ———
	let query = $state('');
	const roomConfig: GalleryConfig<Room> = {
		searchIn: [(r) => r.name, (r) => r.roomType, (r) => r.floorType],
		card: {
			id: (r) => r.id,
			title: (r) => r.name,
			badges: (r) => [r.roomType, r.floorType],
			address: (r) => `#room-${r.id}`
		},
		empty: {
			silent: 'No rooms yet — the house enters below, one room at a time.',
			unmatched: 'No room by that name — the house still stands whole.'
		}
	};
	const view = $derived(galleryOf(roomConfig, hearthStore.rooms, query));

	// ——— the open room ———
	let openRoomId = $state<string | null>(null);
	let newFixtureKind = $state<string>('mirror');
	let newFixtureLabel = $state('');
	let newPointKind = $state<string>('outlet');
	let newPointLabel = $state('');
	let linkThingId = $state('');

	function toggleRoom(id: string) {
		openRoomId = openRoomId === id ? null : id;
		newFixtureLabel = '';
		newPointLabel = '';
		linkThingId = '';
	}

	// A room's care, offered — floor first, then its declared fixtures.
	function offeredCare(room: Room) {
		return careFor(
			room.floorType,
			hearthStore.fixturesFor(room.id).map((f) => f.kind)
		);
	}

	function loopTitle(room: Room, entry: CareEntry): string {
		return `${entry.act} — ${room.name}`;
	}

	function isAdopted(room: Room, entry: CareEntry): boolean {
		const title = loopTitle(room, entry);
		return hearthStore.roomLoops(room.id).some((t) => t.title === title);
	}

	async function adopt(room: Room, entry: CareEntry) {
		if (isAdopted(room, entry)) return;
		await hearthStore.adoptRoomLoop(room.id, loopTitle(room, entry), loopRuleFor(entry), entry.why);
	}

	// Loops awake in a room right now — spoken calmly, never counted red.
	function asking(roomId: string): number {
		return hearthStore
			.roomLoops(roomId)
			.filter((t) => !t.restedUntil || t.restedUntil <= hearthStore.now).length;
	}

	// Things not yet in any room — offerable to this one.
	const homelessThings = $derived(hearthStore.things.filter((t) => !t.roomId && t.species !== 'loop'));

	async function bringThing(roomId: string) {
		if (!linkThingId) return;
		await hearthStore.updateThing(linkThingId, { roomId });
		linkThingId = '';
	}

	// ——— the breaker map ———
	let newBreakerLabel = $state('');
	let newBreakerAmps = $state<number | null>(null);
	let newBreakerNotes = $state('');

	async function addCircuit() {
		if (!newBreakerLabel.trim()) return;
		await hearthStore.addCircuit(newBreakerLabel.trim(), newBreakerAmps, newBreakerNotes.trim() || null);
		newBreakerLabel = '';
		newBreakerAmps = null;
		newBreakerNotes = '';
	}

	// A circuit's reach, derived: the rooms and points it feeds.
	function circuitReach(circuitId: string): string {
		const pts = hearthStore.electricPoints.filter((p) => p.circuitId === circuitId);
		if (pts.length === 0) return 'nothing linked yet — a flip-and-find sitting will tell';
		const byRoom = new Map<string, string[]>();
		for (const p of pts) {
			const room = hearthStore.roomById(p.roomId);
			const name = room?.name ?? 'somewhere';
			if (!byRoom.has(name)) byRoom.set(name, []);
			byRoom.get(name)!.push(p.label || p.kind);
		}
		return [...byRoom.entries()].map(([room, labels]) => `${room}: ${labels.join(', ')}`).join(' · ');
	}
</script>

<svelte:head><title>The House</title></svelte:head>

<div class="page">
	<header class="page__head">
		<h1>The House</h1>
		<p class="sub">
			The rooms, their care, and the why — so no one has to be taught,
			and no one carries it alone.
		</p>
	</header>

	<!-- The very top of the gallery -->
	<input
		type="search"
		class="room-search"
		placeholder="find a room"
		bind:value={query}
		aria-label="Find a room by name, type, or floor"
	/>

	{#if view.empty}
		<p class="quiet-line">{view.empty.message}</p>
	{:else}
		<div class="stack">
			{#each view.cards as card (card.id)}
				{@const room = hearthStore.roomById(card.id)}
				{#if room}
					{@const open = openRoomId === room.id}
					{@const askCount = asking(room.id)}
					<section class="room" id="room-{room.id}">
						<button class="room__head" onclick={() => toggleRoom(room.id)} aria-expanded={open}>
							<span class="room__name">{room.name}</span>
							<span class="room__meta">{card.badges.join(' · ')}</span>
							<span class="room__who">
								{#each hearthStore.responsiblesFor(room.id) as m (m.id)}
									<span title={m.label}>{m.sigil || (m.kind === 'pet' ? '🐾' : '🙂')}</span>
								{/each}
							</span>
							{#if askCount > 0}
								<span class="room__asking">{askCount} quietly asking</span>
							{/if}
							<span class="room__hint">{open ? '–' : '+'}</span>
						</button>

						{#if open}
							<div class="room__body">
								<!-- Who holds this room -->
								<div class="block">
									<h3>Held by</h3>
									<div class="chip-row">
										{#each hearthStore.members as m (m.id)}
											<button
												class="chip"
												class:active={hearthStore.responsiblesFor(room.id).some((x) => x.id === m.id)}
												onclick={() => hearthStore.toggleRoomResponsible(room.id, m.id)}
											>
												{m.sigil || (m.kind === 'pet' ? '🐾' : '🙂')} {m.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- The offered care — the how, the how often, the WHY -->
								<div class="block">
									<h3>The room's care, offered</h3>
									{#each offeredCare(room) as { source, entry } (source + entry.act)}
										<div class="care">
											<div class="care__head">
												<strong>{entry.act}</strong>
												<span class="care__cadence">{entry.cadence}</span>
												{#if entry.windowDays != null}
													{#if isAdopted(room, entry)}
														<span class="care__adopted">adopted</span>
													{:else}
														<button class="soft-btn" onclick={() => adopt(room, entry)}>adopt as a loop</button>
													{/if}
												{/if}
											</div>
											<p class="care__why">{entry.why}</p>
										</div>
									{:else}
										<p class="quiet-line">
											This room's floor has no shelf entry yet — its care is the
											family's own words, and the shelf can grow.
										</p>
									{/each}
								</div>

								<!-- Fixtures -->
								<div class="block">
									<h3>What the room holds</h3>
									{#each hearthStore.fixturesFor(room.id) as f (f.id)}
										<div class="row">
											<span>{f.label || f.kind}</span>
											<span class="row__kind">{f.kind}</span>
											<button class="row__remove" onclick={() => hearthStore.removeFixture(f.id)} aria-label="Remove {f.label || f.kind}">×</button>
										</div>
									{/each}
									<div class="add-row">
										<select bind:value={newFixtureKind} aria-label="Fixture kind">
											{#each FIXTURE_KINDS as k}<option value={k}>{k}</option>{/each}
										</select>
										<input type="text" bind:value={newFixtureLabel} placeholder="its name (optional)" aria-label="Fixture label" />
										<button class="soft-btn" onclick={() => { hearthStore.addFixture(room.id, newFixtureKind, newFixtureLabel.trim() || null); newFixtureLabel = ''; }}>add</button>
									</div>
								</div>

								<!-- The electrical points -->
								<div class="block">
									<h3>Outlets & switches</h3>
									{#each hearthStore.pointsFor(room.id) as p (p.id)}
										<div class="row">
											<span>{p.label || p.kind}</span>
											<span class="row__kind">{p.kind}</span>
											<select
												value={p.circuitId ?? ''}
												onchange={(ev) => hearthStore.setPointCircuit(p.id, (ev.currentTarget as HTMLSelectElement).value || null)}
												aria-label="Which breaker feeds {p.label || p.kind}"
											>
												<option value="">breaker unknown</option>
												{#each hearthStore.circuits as c (c.id)}
													<option value={c.id}>breaker {c.breakerLabel}</option>
												{/each}
											</select>
											<button class="row__remove" onclick={() => hearthStore.removeElectricPoint(p.id)} aria-label="Remove {p.label || p.kind}">×</button>
										</div>
									{/each}
									<div class="add-row">
										<select bind:value={newPointKind} aria-label="Point kind">
											<option value="outlet">outlet</option>
											<option value="switch">switch</option>
											<option value="light">light</option>
											<option value="appliance-feed">appliance feed</option>
										</select>
										<input type="text" bind:value={newPointLabel} placeholder="north wall double…" aria-label="Point label" />
										<button class="soft-btn" onclick={() => { hearthStore.addElectricPoint(room.id, newPointKind, newPointLabel.trim() || null); newPointLabel = ''; }}>add</button>
									</div>
								</div>

								<!-- Assets in this room -->
								<div class="block">
									<h3>Things that live here</h3>
									{#each hearthStore.roomAssets(room.id) as t (t.id)}
										<div class="row">
											<span>{t.title}</span>
											<span class="row__kind">{t.species}</span>
											<button class="row__remove" onclick={() => hearthStore.updateThing(t.id, { roomId: null })} aria-label="Take {t.title} out of this room">×</button>
										</div>
									{/each}
									{#if homelessThings.length > 0}
										<div class="add-row">
											<select bind:value={linkThingId} aria-label="Bring a thing into this room">
												<option value="">bring a thing into this room…</option>
												{#each homelessThings as t (t.id)}
													<option value={t.id}>{t.title}</option>
												{/each}
											</select>
											<button class="soft-btn" onclick={() => bringThing(room.id)} disabled={!linkThingId}>bring it in</button>
										</div>
									{/if}
								</div>

								<!-- The adopted loops, resting or asking -->
								{#if hearthStore.roomLoops(room.id).length > 0}
									<div class="block">
										<h3>This room's loops</h3>
										{#each hearthStore.roomLoops(room.id) as t (t.id)}
											<div class="row">
												<span>{t.title}</span>
												<span class="row__kind">{!t.restedUntil || t.restedUntil <= hearthStore.now ? 'quietly asking' : 'resting'}</span>
												<button class="row__remove" onclick={() => hearthStore.removeThing(t.id)} aria-label="Let {t.title} go">×</button>
											</div>
										{/each}
									</div>
								{/if}

								<button class="ghost" onclick={() => hearthStore.removeRoom(room.id)}>
									remove this room (its things stay, unroomed)
								</button>
							</div>
						{/if}
					</section>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Add a room -->
	<section class="card form">
		<h2>Add a room</h2>
		<div class="add-row">
			<input type="text" bind:value={newName} placeholder="what the family calls it"
				onkeydown={(e) => { if (e.key === 'Enter') addRoom(); }} aria-label="Room name" />
		</div>
		<div class="chip-row" role="group" aria-label="Room type">
			{#each ROOM_TYPES as t}
				<button class="chip" class:active={newType === t} onclick={() => (newType = t)}>{t}</button>
			{/each}
		</div>
		<div class="chip-row" role="group" aria-label="Floor type">
			{#each FLOOR_TYPES as f}
				<button class="chip" class:active={newFloor === f} onclick={() => (newFloor = f)}>{f}</button>
			{/each}
		</div>
		<button class="soft-btn primary" onclick={addRoom} disabled={!newName.trim()}>add the room</button>
	</section>

	<!-- The breaker map -->
	<section class="card form">
		<h2>The breaker box</h2>
		<p class="quiet-line">
			Understanding of flow, recorded once — link outlets and switches to
			their breakers in each room, and the map draws itself both ways.
			If a breaker keeps tripping, something is asking for attention —
			the map shows what shares its circuit.
		</p>
		{#each hearthStore.circuits as c (c.id)}
			<div class="circuit">
				<div class="circuit__head">
					<strong>breaker {c.breakerLabel}</strong>
					{#if c.amps}<span class="row__kind">{c.amps}A</span>{/if}
					<button class="row__remove" onclick={() => hearthStore.removeCircuit(c.id)} aria-label="Remove breaker {c.breakerLabel}">×</button>
				</div>
				<p class="circuit__reach">{circuitReach(c.id)}</p>
				{#if c.notes}<p class="circuit__notes">{c.notes}</p>{/if}
			</div>
		{:else}
			<p class="quiet-line">The box is unmapped — add its breakers as you meet them.</p>
		{/each}
		<div class="add-row">
			<input type="text" bind:value={newBreakerLabel} placeholder="breaker number or label" aria-label="Breaker label" />
			<input type="number" bind:value={newBreakerAmps} placeholder="amps" min="5" max="200" aria-label="Amps (optional)" />
		</div>
		<div class="add-row">
			<input type="text" bind:value={newBreakerNotes} placeholder="what you learned about it (optional)" aria-label="Circuit notes" />
			<button class="soft-btn" onclick={addCircuit} disabled={!newBreakerLabel.trim()}>add breaker</button>
		</div>
	</section>
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }

	.room-search { width: 100%; min-height: 48px; padding: 0.6rem 0.9rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg-surface); color: var(--text); font-size: 0.95rem; outline: none; box-sizing: border-box; }
	.room-search:focus { border-color: var(--accent); }
	.room-search::placeholder { color: var(--text-muted); }

	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.quiet-line { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0; line-height: 1.5; }

	.room { border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); }
	.room__head { display: flex; align-items: center; gap: 0.6rem; width: 100%; min-height: 56px; padding: 0.6rem 0.9rem; background: none; border: none; color: var(--text); cursor: pointer; text-align: left; font: inherit; flex-wrap: wrap; }
	.room__name { font-weight: 600; }
	.room__meta { color: var(--text-muted); font-size: 0.8rem; }
	.room__who { display: flex; gap: 0.15rem; }
	.room__asking { margin-left: auto; color: var(--text-secondary); font-size: 0.8rem; }
	.room__hint { color: var(--text-muted); margin-left: 0.4rem; }
	.room__body { padding: 0 0.9rem 0.9rem; display: flex; flex-direction: column; gap: 0.9rem; }

	.block h3 { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; margin: 0 0 0.4rem; letter-spacing: 0.02em; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); }
	.card h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0 0 0.5rem; }
	.form { display: flex; flex-direction: column; gap: 0.6rem; }

	.care { padding: 0.6rem 0.75rem; border-radius: 10px; background-color: var(--bg); border: 1px solid var(--border-color); margin-bottom: 0.5rem; }
	.care__head { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; color: var(--text); }
	.care__cadence { color: var(--text-muted); font-size: 0.82rem; }
	.care__adopted { margin-left: auto; color: var(--text-secondary); font-size: 0.8rem; }
	.care__head .soft-btn { margin-left: auto; }
	.care__why { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.55; margin: 0.35rem 0 0; }

	.row { display: flex; align-items: center; gap: 0.6rem; min-height: 44px; padding: 0.25rem 0; color: var(--text); flex-wrap: wrap; }
	.row__kind { color: var(--text-muted); font-size: 0.8rem; }
	.row__remove { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; min-width: 36px; min-height: 36px; }
	.row__remove:hover { color: var(--text); }
	.row select { margin-left: auto; }

	.add-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.add-row input[type='text'] { flex: 1; min-width: 160px; }
	.add-row input, .add-row select, .room__body select {
		padding: 0.55rem 0.7rem; border-radius: 10px; border: 1px solid var(--border-color);
		background-color: var(--bg); color: var(--text); font-size: 0.9rem; min-height: 44px;
	}
	.add-row input[type='number'] { width: 6.5rem; }

	.chip-row { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.9rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; min-height: 40px; font-size: 0.85rem; }
	.chip.active { border-color: var(--accent); color: var(--text); background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }

	.soft-btn { padding: 0.5rem 1rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.88rem; min-height: 44px; flex-shrink: 0; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }
	.soft-btn.primary:disabled { opacity: 0.5; cursor: default; }
	.soft-btn:disabled { opacity: 0.5; cursor: default; }

	.ghost { background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline; align-self: flex-start; padding: 0.25rem 0; }
	.ghost:hover { color: var(--text-secondary); }

	.circuit { padding: 0.6rem 0.75rem; border-radius: 10px; background-color: var(--bg); border: 1px solid var(--border-color); margin-bottom: 0.5rem; }
	.circuit__head { display: flex; align-items: center; gap: 0.6rem; color: var(--text); }
	.circuit__reach { color: var(--text-secondary); font-size: 0.85rem; margin: 0.3rem 0 0; line-height: 1.5; }
	.circuit__notes { color: var(--text-muted); font-size: 0.8rem; margin: 0.3rem 0 0; font-style: italic; }
</style>
