<script lang="ts">
	// Bills — the edges. The world imposes these dates; the Hearth's job is
	// to make them visible early and calmly, never to turn them into alarms.
	// Amounts are hideable (shared money is a household choice, not a default).
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';

	let celebration = $state<string | null>(null);

	let adding = $state(false);
	let title = $state('');
	let dueDate = $state('');
	let amount = $state('');
	let amountShared = $state(false);
	let autopay = $state(false);
	let holderId = $state('');

	const me = $derived(hearthStore.me);
	const edges = $derived(hearthStore.edges);

	async function add() {
		if (!title.trim()) return;
		const cents = amount.trim()
			? Math.round(parseFloat(amount.replace(/[^0-9.]/g, '')) * 100) || null
			: null;
		await hearthStore.addThing({
			title: title.trim(),
			species: 'edge',
			edgeDate: dueDate ? new Date(dueDate + 'T12:00').getTime() : null,
			amountCents: cents,
			amountShared,
			autopay,
			holderMemberId: holderId || null,
			pool: true,
			shared: true,
		});
		title = ''; dueDate = ''; amount = ''; holderId = '';
		autopay = false; amountShared = false;
		adding = false;
	}

	async function handled(id: string) {
		celebration = await hearthStore.doneThing(id, me?.id ?? null);
	}

	function horizon(ts: number | null | undefined): string {
		if (!ts) return 'no date set';
		const days = Math.ceil((ts - Date.now()) / 86_400_000);
		if (days < 0) return 'edge passed — still here, no shame';
		if (days === 0) return 'today';
		if (days === 1) return 'tomorrow';
		return `in ${days} days`;
	}

	function dollars(cents: number | null | undefined): string {
		if (cents == null) return '';
		return `$${(cents / 100).toFixed(2)}`;
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>Bills</h1>
		<p class="sub">Calm horizons. The dates are the world's; the calm is ours.</p>
	</header>

	<CelebrationLine bind:text={celebration} />

	{#if !adding}
		<button class="add-open" onclick={() => (adding = true)}>+ add a bill</button>
	{:else}
		<div class="card form">
			<input type="text" bind:value={title} placeholder="internet, electric, phone…"
				onkeydown={(e) => { if (e.key === 'Enter') add(); }} />
			<label class="field">
				<span>the edge (due date)</span>
				<input type="date" bind:value={dueDate} />
			</label>
			<label class="field">
				<span>amount (optional)</span>
				<input type="text" inputmode="decimal" bind:value={amount} placeholder="0.00" />
			</label>
			<label class="share-row">
				<input type="checkbox" bind:checked={amountShared} />
				<span>show the amount on the household views</span>
			</label>
			<label class="share-row">
				<input type="checkbox" bind:checked={autopay} />
				<span>autopay handles this one</span>
			</label>
			{#if hearthStore.people.length > 0}
				<label class="field">
					<span>who's holding it? (optional — the pool holds it otherwise)</span>
					<select bind:value={holderId}>
						<option value="">the household pool</option>
						{#each hearthStore.people as p}
							<option value={p.id}>{p.sigil} {p.label}</option>
						{/each}
					</select>
				</label>
			{/if}
			<div class="form-actions">
				<button class="soft-btn primary" onclick={add}>add</button>
				<button class="soft-btn" onclick={() => (adding = false)}>never mind</button>
			</div>
		</div>
	{/if}

	{#if edges.length > 0}
		<div class="stack">
			{#each edges as t}
				<div class="bill">
					<div class="bill__main">
						<span class="bill__title">{t.title}</span>
						<span class="bill__horizon">{horizon(t.edgeDate)}</span>
					</div>
					<div class="bill__meta">
						{#if t.amountCents != null && t.amountShared}<span>{dollars(t.amountCents)}</span>{/if}
						{#if t.autopay}<span class="tag">autopay</span>{/if}
						{#if t.holderMemberId}
							<span class="tag">{hearthStore.memberById(t.holderMemberId)?.label} is holding it</span>
						{/if}
						<button class="soft-btn" onclick={() => handled(t.id)}>handled</button>
					</div>
				</div>
			{/each}
		</div>
		<p class="hint">
			A passed edge is information, not a verdict. The household solves those together.
		</p>
	{:else}
		<div class="card empty">No edges on the horizon. Breathe easy.</div>
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.card.empty { text-align: center; padding: 2rem 1rem; }

	.add-open { min-height: 52px; border-radius: 12px; border: 1px dashed var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.95rem; }
	.add-open:hover { border-color: var(--accent); color: var(--text); }

	.form { display: flex; flex-direction: column; gap: 0.75rem; }
	.form input[type='text'] { padding: 0.7rem 0.8rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 1rem; }
	.field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: var(--text-muted); }
	.field input, .field select { padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; }
	.share-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; }
	.share-row input { width: 18px; height: 18px; accent-color: var(--accent); }
	.form-actions { display: flex; gap: 0.5rem; }

	.bill { padding: 0.7rem 0.85rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.4rem; }
	.bill__main { display: flex; align-items: center; gap: 0.6rem; }
	.bill__title { color: var(--text); font-weight: 500; }
	.bill__horizon { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; }
	.bill__meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; color: var(--text-secondary); font-size: 0.85rem; }
	.tag { padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-muted); }

	.soft-btn { margin-left: auto; padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 36px; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; margin-left: 0; }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0; }
</style>
