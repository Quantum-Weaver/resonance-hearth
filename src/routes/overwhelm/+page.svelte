<script lang="ts">
	// The Meltdown Protocol — a ceremony, not a feature. (DESIGN-001)
	// PROTECTED BOUNDARY: the 30-second pause between the personal log and
	// the household's gentle knowing is enforced in the store's data logic
	// (householdOverwhelms) and is not configurable. Do not add a setting.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { OVERWHELM_PAUSE_MS } from '$lib/data/hearth';
	import { onMount } from 'svelte';

	let share = $state(true);
	let helped = $state('');
	let notes = $state('');
	let justReturned = $state(false);
	// A gentle 1-second clock, only for this room's phrasing.
	let tick = $state(Date.now());
	onMount(() => {
		const t = setInterval(() => (tick = Date.now()), 1000);
		return () => clearInterval(t);
	});

	const me = $derived(hearthStore.me);
	const open = $derived(me ? hearthStore.openOverwhelm(me.id) : null);
	const householdKnows = $derived(
		open ? open.shared && open.startedAt + OVERWHELM_PAUSE_MS <= tick : false
	);

	async function press() {
		if (!me) return;
		await hearthStore.startOverwhelm(me.id, share);
	}

	async function returning() {
		if (!open) return;
		await hearthStore.returnFromOverwhelm(
			open.id,
			helped.trim() || undefined,
			notes.trim() || undefined
		);
		helped = '';
		notes = '';
		justReturned = true;
	}
</script>

<div class="page">
	{#if !me}
		<div class="card center">
			<p>This device doesn't know who it belongs to yet — choose yourself in <a href="/me">Me</a>.</p>
		</div>
	{:else if justReturned}
		<div class="card center welcome">
			<div class="big">🌈</div>
			<h1>Welcome back.</h1>
			<p>No explanation needed.</p>
			<p class="soft">The household held you. It will hold you again.</p>
			<a class="soft-btn" href="/">back to the Hearth</a>
		</div>
	{:else if open}
		<div class="card center holding">
			<h1>You are held.</h1>
			<p class="soft">Nothing is required of you. Take the time it takes.</p>
			{#if open.shared}
				<p class="soft small">
					{#if householdKnows}
						The household has been told, gently. They know to give you quiet.
					{:else}
						In a few breaths, the household will be told — gently.
					{/if}
				</p>
			{:else}
				<p class="soft small">This stays between you and the Hearth.</p>
			{/if}

			<div class="return">
				<button class="return-btn" onclick={returning}>🌈 I'm returning</button>
				<details class="optional">
					<summary>want to note anything? (entirely optional)</summary>
					<label>
						<span>what helped?</span>
						<input type="text" bind:value={helped} placeholder="quiet, weight, water…" />
					</label>
					<label>
						<span>what didn't?</span>
						<input type="text" bind:value={notes} placeholder="" />
					</label>
				</details>
			</div>
		</div>
	{:else}
		<div class="card center ask">
			<h1>Overwhelmed?</h1>
			<p class="soft">One press. Nothing else. No explanation, now or ever.</p>
			<button class="big-soft-button" onclick={press}>I'm overwhelmed</button>
			<label class="share-row">
				<input type="checkbox" bind:checked={share} />
				<span>let the household know (gently, after a pause)</span>
			</label>
			<p class="soft small">
				This is not an emergency system. It is a household breathing.
			</p>
		</div>
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 560px; margin: 0 auto; min-height: 80vh; display: flex; align-items: center; }
	.card { width: 100%; padding: 2rem 1.5rem; border-radius: 16px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.center { text-align: center; display: flex; flex-direction: column; gap: 0.9rem; align-items: center; }
	h1 { color: var(--text); font-size: 1.4rem; margin: 0; }
	.soft { margin: 0; line-height: 1.55; }
	.small { font-size: 0.85rem; color: var(--text-muted); }
	.big { font-size: 2.2rem; }

	.big-soft-button {
		width: 100%;
		max-width: 320px;
		min-height: 72px;
		border-radius: 20px;
		border: 1px solid color-mix(in srgb, var(--accent) 50%, var(--border-color));
		background-color: color-mix(in srgb, var(--accent) 14%, var(--bg-surface));
		color: var(--text);
		font-size: 1.15rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.big-soft-button:hover {
		background-color: color-mix(in srgb, var(--accent) 22%, var(--bg-surface));
	}

	.share-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); cursor: pointer; }
	.share-row input { width: 18px; height: 18px; accent-color: var(--accent); }

	.return { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; align-items: center; margin-top: 0.5rem; }
	.return-btn {
		min-height: 56px;
		padding: 0 1.5rem;
		border-radius: 16px;
		border: 1px solid var(--border-color);
		background-color: var(--bg);
		color: var(--text);
		font-size: 1rem;
		cursor: pointer;
	}
	.return-btn:hover { border-color: var(--accent); }

	.optional { width: 100%; max-width: 360px; text-align: left; color: var(--text-muted); font-size: 0.85rem; }
	.optional summary { cursor: pointer; padding: 0.4rem 0; }
	.optional label { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.6rem; }
	.optional input {
		padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color);
		background-color: var(--bg); color: var(--text); font-size: 0.95rem;
	}

	.soft-btn { padding: 0.5rem 1rem; border-radius: 999px; border: 1px solid var(--border-color); color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }

	a { color: var(--accent); }
</style>
