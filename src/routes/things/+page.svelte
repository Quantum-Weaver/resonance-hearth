<script lang="ts">
	// Things — the task ledger. Three species, each breathing its own way.
	// No "overdue" exists anywhere in this room. Deferring costs nothing.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { SPECIES, speciesDef } from '$lib/data/hearth';
	import type { ThingSpecies } from '$lib/types/types';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';

	let celebration = $state<string | null>(null);

	// The add form — Quick-Log fast (Echoes lineage): title + species is enough.
	let adding = $state(false);
	let title = $state('');
	let species = $state<ThingSpecies>('breathing');
	let spoonCost = $state<number | null>(null);
	let edgeDate = $state('');
	let loopRule = $state('daily');
	let petId = $state<string>('');
	let personal = $state(false);

	const me = $derived(hearthStore.me);
	const mySpoons = $derived(
		me ? hearthStore.latestSpoons(me.id)?.value ?? null : null
	);
	let fitFilter = $state(false);

	function fits(t: { spoonCost?: number | null }): boolean {
		if (!fitFilter || mySpoons == null) return true;
		return t.spoonCost == null || t.spoonCost <= mySpoons;
	}

	const breathing = $derived(hearthStore.breathing.filter(fits));
	const loops = $derived(hearthStore.things.filter((t) => t.species === 'loop'));
	const edges = $derived(hearthStore.edges);

	async function add() {
		if (!title.trim()) return;
		await hearthStore.addThing({
			title: title.trim(),
			species,
			spoonCost,
			edgeDate: species === 'edge' && edgeDate ? new Date(edgeDate + 'T12:00').getTime() : null,
			loopRule: species === 'loop' ? loopRule : null,
			petId: species === 'loop' && petId ? petId : null,
			pool: !personal,
			memberId: personal ? me?.id ?? null : null,
			shared: !personal,
			amountShared: false,
			autopay: false,
		});
		title = '';
		spoonCost = null;
		edgeDate = '';
		petId = '';
		adding = false;
	}

	async function markDone(id: string) {
		celebration = await hearthStore.doneThing(id, me?.id ?? null);
	}

	function horizon(ts: number | null | undefined): string {
		if (!ts) return '';
		const days = Math.ceil((ts - Date.now()) / 86_400_000);
		if (days < 0) return 'edge passed — still here, no shame';
		if (days === 0) return 'today';
		if (days === 1) return 'tomorrow';
		return `in ${days} days`;
	}

	function resting(t: { restedUntil?: number | null }): boolean {
		return !!t.restedUntil && t.restedUntil > hearthStore.now;
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>Things</h1>
		<p class="sub">Invitations, not demands. Everything here can wait for you.</p>
	</header>

	<CelebrationLine bind:text={celebration} />

	{#if !adding}
		<button class="add-open" onclick={() => (adding = true)}>+ add a thing</button>
	{:else}
		<div class="card form">
			<input
				class="title-input"
				type="text"
				bind:value={title}
				placeholder="what is it?"
				onkeydown={(e) => { if (e.key === 'Enter') add(); }}
			/>
			<div class="species-row" role="group" aria-label="What kind of thing?">
				{#each SPECIES as s}
					<button
						class="chip"
						class:active={species === s.species}
						onclick={() => (species = s.species)}
						title={s.description}
					>
						{s.emoji} {s.name}
					</button>
				{/each}
			</div>
			<p class="hint">{speciesDef(species).description}</p>

			{#if species === 'edge'}
				<label class="field">
					<span>when is the real-world edge?</span>
					<input type="date" bind:value={edgeDate} />
				</label>
			{/if}

			{#if species === 'loop'}
				<label class="field">
					<span>how often does it return?</span>
					<select bind:value={loopRule}>
						<option value="daily">daily</option>
						<option value="weekly">weekly</option>
					</select>
				</label>
				{#if hearthStore.pets.length > 0}
					<label class="field">
						<span>for one of the family?</span>
						<select bind:value={petId}>
							<option value="">— no one specific —</option>
							{#each hearthStore.pets as p}
								<option value={p.id}>{p.sigil} {p.label}</option>
							{/each}
						</select>
					</label>
				{/if}
			{/if}

			<label class="field">
				<span>spoons it might take (a guess is fine, none is fine)</span>
				<div class="chip-row">
					{#each [1, 2, 3, 4, 5] as v}
						<button class="chip" class:active={spoonCost === v} onclick={() => (spoonCost = spoonCost === v ? null : v)}>{v}</button>
					{/each}
				</div>
			</label>

			{#if me}
				<label class="share-row">
					<input type="checkbox" bind:checked={personal} />
					<span>just for me (won't appear on the Hearth)</span>
				</label>
			{/if}

			<div class="form-actions">
				<button class="soft-btn primary" onclick={add}>add it</button>
				<button class="soft-btn" onclick={() => (adding = false)}>never mind</button>
			</div>
		</div>
	{/if}

	{#if mySpoons != null}
		<label class="share-row filter">
			<input type="checkbox" bind:checked={fitFilter} />
			<span>only show what fits my spoons today ({mySpoons})</span>
		</label>
	{/if}

	{#if breathing.length > 0}
		<section class="section">
			<h2>🍃 Breathing</h2>
			<div class="stack">
				{#each breathing as t}
					<div class="thing">
						<span class="thing__title">{t.title}</span>
						{#if t.spoonCost != null}<span class="thing__cost">{'·'.repeat(t.spoonCost)} {t.spoonCost}🥄</span>{/if}
						<button class="soft-btn" onclick={() => markDone(t.id)}>done</button>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if loops.length > 0}
		<section class="section">
			<h2>🫀 Care loops</h2>
			<div class="stack">
				{#each loops as t}
					<div class="thing" class:resting={resting(t)}>
						<span class="thing__title">
							{t.title}
							{#if t.petId}<span class="thing__pet">for {hearthStore.memberById(t.petId)?.label}</span>{/if}
						</span>
						{#if resting(t)}
							<span class="thing__rest">resting — held for now</span>
						{:else}
							<button class="soft-btn" onclick={() => markDone(t.id)}>done</button>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if edges.length > 0}
		<section class="section">
			<h2>🌅 Edges</h2>
			<div class="stack">
				{#each edges as t}
					<div class="thing">
						<span class="thing__title">{t.title}</span>
						<span class="thing__horizon">{horizon(t.edgeDate)}</span>
						<button class="soft-btn" onclick={() => markDone(t.id)}>handled</button>
					</div>
				{/each}
			</div>
			<p class="hint">Edges are the world's dates, not the Hearth's judgment.</p>
		</section>
	{/if}

	{#if breathing.length === 0 && loops.length === 0 && edges.length === 0}
		<div class="card empty">Nothing here yet. The house is allowed to be quiet.</div>
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
	.section h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0 0 0.5rem; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.card.empty { text-align: center; padding: 2rem 1rem; }

	.add-open { min-height: 52px; border-radius: 12px; border: 1px dashed var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.95rem; }
	.add-open:hover { border-color: var(--accent); color: var(--text); }

	.form { display: flex; flex-direction: column; gap: 0.75rem; }
	.title-input { padding: 0.7rem 0.8rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 1rem; }
	.species-row, .chip-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; min-height: 40px; }
	.chip.active { border-color: var(--accent); color: var(--text); background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }
	.field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: var(--text-muted); }
	.field input, .field select { padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; }
	.share-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; }
	.share-row input { width: 18px; height: 18px; accent-color: var(--accent); }
	.form-actions { display: flex; gap: 0.5rem; }

	.thing { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); min-height: 48px; }
	.thing.resting { opacity: 0.6; }
	.thing__title { color: var(--text); min-width: 0; }
	.thing__pet { color: var(--text-muted); font-size: 0.85rem; margin-left: 0.35rem; }
	.thing__cost { color: var(--text-muted); font-size: 0.8rem; }
	.thing__horizon { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; }
	.thing__rest { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; font-style: italic; }

	.soft-btn { margin-left: auto; padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 36px; flex-shrink: 0; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; margin-left: 0; }
	.thing .soft-btn { margin-left: auto; }
	.filter { margin: -0.25rem 0; }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0.4rem 0 0; }
</style>
