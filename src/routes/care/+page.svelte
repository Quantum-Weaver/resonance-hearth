<script lang="ts">
	// Care — the loops: medications (private by default), the pets' needs,
	// and the household's recurring rhythms. Gentle persistence lives here:
	// things return softly until acknowledged, and "can someone else?" is a
	// first-class answer, never a failure.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';

	let celebration = $state<string | null>(null);

	// med add form
	let addingMed = $state(false);
	let medLabel = $state('');
	let medShared = $state(false);

	// pet loop add form
	let addingLoop = $state(false);
	let loopTitle = $state('');
	let loopPetId = $state('');
	let loopRule = $state('daily');

	const me = $derived(hearthStore.me);
	const myMeds = $derived(me ? hearthStore.meds.filter((m) => m.memberId === me.id) : []);
	const petLoops = $derived(hearthStore.things.filter((t) => t.species === 'loop'));

	async function addMed() {
		if (!me || !medLabel.trim()) return;
		await hearthStore.addMed(me.id, medLabel.trim(), 'daily', medShared);
		medLabel = '';
		addingMed = false;
	}

	async function addLoop() {
		if (!loopTitle.trim()) return;
		await hearthStore.addThing({
			title: loopTitle.trim(),
			species: 'loop',
			loopRule,
			petId: loopPetId || null,
			pool: true,
			shared: true,
			amountShared: false,
			autopay: false,
		});
		loopTitle = '';
		loopPetId = '';
		addingLoop = false;
	}

	async function med(medId: string, status: 'taken' | 'skipped' | 'later') {
		const line = await hearthStore.takeMed(medId, status);
		if (line) celebration = line;
	}

	async function loopDone(id: string) {
		celebration = await hearthStore.doneThing(id, me?.id ?? null);
	}

	function resting(t: { restedUntil?: number | null }): boolean {
		return !!t.restedUntil && t.restedUntil > hearthStore.now;
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>Care</h1>
		<p class="sub">The loops that keep living beings well — including you.</p>
	</header>

	<CelebrationLine bind:text={celebration} />

	<section class="section">
		<h2>My medications</h2>
		<p class="hint">
			Private by default — the household sees nothing unless you choose.
			The Hearth never sounds or vibrates; meds ask quietly, in-app, and
			every answer is a fine answer.
		</p>
		{#if !me}
			<div class="card">Choose yourself in <a href="/me">Me</a> first.</div>
		{:else}
			<div class="stack">
				{#each myMeds as m}
					<div class="thing">
						<span class="thing__emoji">🫀</span>
						<span class="thing__title">{m.label}</span>
						{#if hearthStore.medTakenToday(m.id)}
							<span class="thing__rest">held today</span>
						{:else}
							<div class="med-actions">
								<button class="soft-btn" onclick={() => med(m.id, 'taken')}>taken</button>
								<button class="soft-btn quiet" onclick={() => med(m.id, 'later')}>later</button>
							</div>
						{/if}
						<button class="remove" onclick={() => hearthStore.removeMed(m.id)} aria-label="Remove {m.label}">✕</button>
					</div>
				{/each}
			</div>
			{#if !addingMed}
				<button class="add-open" onclick={() => (addingMed = true)}>+ add a medication</button>
			{:else}
				<div class="card form">
					<input type="text" bind:value={medLabel} placeholder="what shall we call it? (your word is enough)"
						onkeydown={(e) => { if (e.key === 'Enter') addMed(); }} />
					<label class="share-row">
						<input type="checkbox" bind:checked={medShared} />
						<span>let the household gently know how I'm doing with it</span>
					</label>
					<div class="form-actions">
						<button class="soft-btn primary" onclick={addMed}>add</button>
						<button class="soft-btn" onclick={() => (addingMed = false)}>never mind</button>
					</div>
				</div>
			{/if}
		{/if}
	</section>

	<section class="section">
		<h2>The family's loops</h2>
		<p class="hint">Pets and rhythms. The pool does them — no assignment, no blame.</p>
		<div class="stack">
			{#each petLoops as t}
				<div class="thing" class:restingrow={resting(t)}>
					<span class="thing__emoji">{t.petId ? hearthStore.memberById(t.petId)?.sigil || '🐾' : '🔁'}</span>
					<span class="thing__title">
						{t.title}
						{#if t.petId}<span class="thing__pet">for {hearthStore.memberById(t.petId)?.label}</span>{/if}
					</span>
					{#if resting(t)}
						<span class="thing__rest">resting — held for now</span>
					{:else}
						<button class="soft-btn" onclick={() => loopDone(t.id)}>done</button>
					{/if}
				</div>
			{/each}
		</div>
		{#if !addingLoop}
			<button class="add-open" onclick={() => (addingLoop = true)}>+ add a care loop</button>
		{:else}
			<div class="card form">
				<input type="text" bind:value={loopTitle} placeholder="feed the cats, litter, walk, water plants…"
					onkeydown={(e) => { if (e.key === 'Enter') addLoop(); }} />
				<label class="field">
					<span>returns</span>
					<select bind:value={loopRule}>
						<option value="daily">daily</option>
						<option value="weekly">weekly</option>
					</select>
				</label>
				{#if hearthStore.pets.length > 0}
					<label class="field">
						<span>for</span>
						<select bind:value={loopPetId}>
							<option value="">the whole house</option>
							{#each hearthStore.pets as p}
								<option value={p.id}>{p.sigil} {p.label}</option>
							{/each}
						</select>
					</label>
				{/if}
				<div class="form-actions">
					<button class="soft-btn primary" onclick={addLoop}>add</button>
					<button class="soft-btn" onclick={() => (addingLoop = false)}>never mind</button>
				</div>
			</div>
		{/if}
	</section>
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
	.section { display: flex; flex-direction: column; gap: 0.6rem; }
	.section h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.form { display: flex; flex-direction: column; gap: 0.75rem; }
	.form input[type='text'] { padding: 0.7rem 0.8rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 1rem; }
	.field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: var(--text-muted); }
	.field select { padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; }
	.share-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; }
	.share-row input { width: 18px; height: 18px; accent-color: var(--accent); }
	.form-actions { display: flex; gap: 0.5rem; }

	.add-open { min-height: 48px; border-radius: 12px; border: 1px dashed var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; }
	.add-open:hover { border-color: var(--accent); color: var(--text); }

	.thing { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); min-height: 48px; flex-wrap: wrap; }
	.thing.restingrow { opacity: 0.6; }
	.thing__emoji { flex-shrink: 0; }
	.thing__title { color: var(--text); min-width: 0; }
	.thing__pet { color: var(--text-muted); font-size: 0.85rem; margin-left: 0.35rem; }
	.thing__rest { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; font-style: italic; }
	.med-actions { margin-left: auto; display: flex; gap: 0.35rem; }

	.soft-btn { padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 36px; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.quiet { opacity: 0.75; }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }
	.thing .soft-btn { margin-left: auto; }
	.thing .med-actions .soft-btn { margin-left: 0; }

	.remove { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; padding: 0.4rem; flex-shrink: 0; }
	.remove:hover { color: var(--text); }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0; line-height: 1.5; }
	a { color: var(--accent); }
</style>
