<script lang="ts">
	// The Hearth — the Family Dashboard.
	// PROTECTED BOUNDARY (naming ceremony, 2026-07-07): this is a window,
	// not a monitor. Only shared state appears here; only current presence,
	// never history; nothing on this page demands anything of anyone.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { speciesDef } from '$lib/data/hearth';
	import SignalDot from '$lib/components/SignalDot.svelte';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';
	import { goto } from '$app/navigation';

	let celebration = $state<string | null>(null);

	const people = $derived(hearthStore.people);
	const pets = $derived(hearthStore.pets);

	// Only members whose signal is shared appear on the window.
	const presences = $derived(
		people
			.map((m) => ({ member: m, signal: hearthStore.signalFor(m.id) }))
			.filter((p) => p.signal?.shared !== false)
	);

	const holds = $derived(
		hearthStore.householdOverwhelms.map((e) => ({
			event: e,
			member: hearthStore.memberById(e.memberId),
			protocol: hearthStore.protocolFor(e.memberId),
		}))
	);

	const weather = $derived(hearthStore.householdSpoons);
	const weatherLine = $derived.by(() => {
		if (weather.length === 0) return null;
		const known = weather.filter((w) => w.value != null);
		if (known.length === 0) return 'The household is not sure today — that is allowed.';
		const avg = known.reduce((s, w) => s + (w.value ?? 0), 0) / known.length;
		if (avg <= 2) return 'A gentle day. Only soft things.';
		if (avg < 3.5) return 'Steady enough. One thing at a time.';
		return 'Good wind today.';
	});

	// My capacity filters what surfaces — the path adapts to the walker.
	const mySpoons = $derived(
		hearthStore.me ? hearthStore.latestSpoons(hearthStore.me.id)?.value ?? null : null
	);

	const loops = $derived(hearthStore.activeLoops.filter((t) => t.shared));
	const edges = $derived(hearthStore.edges.slice(0, 3));
	const breathing = $derived.by(() => {
		let list = hearthStore.breathing.filter((t) => t.shared || t.memberId === hearthStore.me?.id);
		if (mySpoons != null) {
			list = list.filter((t) => t.spoonCost == null || t.spoonCost <= mySpoons);
		}
		return list.slice(0, 5);
	});

	function horizon(ts: number | null | undefined): string {
		if (!ts) return '';
		const days = Math.ceil((ts - Date.now()) / 86_400_000);
		if (days < 0) return 'its edge has passed — still here, no shame';
		if (days === 0) return 'edge is today';
		if (days === 1) return 'edge is tomorrow';
		return `edge in ${days} days`;
	}

	async function markDone(thingId: string) {
		celebration = await hearthStore.doneThing(thingId, hearthStore.me?.id ?? null);
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>The Hearth</h1>
		<p class="sub">The household, breathing together. Only what each of us chose to share.</p>
	</header>

	{#if hearthStore.dbError}
		<div class="card gentle-error">
			The hearth couldn't reach its memory: {hearthStore.dbError}. Closing and
			reopening the app usually helps. Nothing is lost.
		</div>
	{/if}

	<CelebrationLine bind:text={celebration} />

	{#each holds as h}
		<div class="card hold">
			<div class="hold__title">
				{h.member?.sigil} {h.member?.label ?? 'Someone'} is seeking sattva.
			</div>
			<div class="hold__body">
				{#if h.protocol.cardText}
					<em>“{h.protocol.cardText}”</em><br />
				{:else}
					They need quiet.<br />
				{/if}
				{#if h.event.need}
					They asked for: <strong>{h.event.need}</strong>.<br />
				{/if}
				Check on them in {h.protocol.checkbackMinutes} minutes unless they signal otherwise.<br />
				This is not an emergency. This is a household breathing.
			</div>
		</div>
	{/each}

	{#if presences.length > 0}
		<section class="section">
			<h2>Presence</h2>
			<div class="stack">
				{#each presences as p}
					<SignalDot member={p.member} signal={p.signal} />
				{/each}
				{#each pets as pet}
					<div class="pet-row">
						<span class="pet-sigil">{pet.sigil || '🐾'}</span>
						<span>{pet.label}</span>
						<span class="pet-note">family</span>
					</div>
				{/each}
			</div>
			{#if weatherLine}<p class="weather">{weatherLine}</p>{/if}
		</section>
	{/if}

	{#if loops.length > 0}
		<section class="section">
			<h2>Quietly asking</h2>
			<div class="stack">
				{#each loops as t}
					<div class="thing">
						<span class="thing__emoji">{speciesDef(t.species).emoji}</span>
						<span class="thing__title">
							{t.title}
							{#if t.petId}<span class="thing__pet">for {hearthStore.memberById(t.petId)?.label}</span>{/if}
						</span>
						<button class="soft-btn" onclick={() => markDone(t.id)}>done</button>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if edges.length > 0}
		<section class="section">
			<h2>Calm horizons</h2>
			<div class="stack">
				{#each edges as t}
					<button class="thing as-link" onclick={() => goto('/bills')}>
						<span class="thing__emoji">🌅</span>
						<span class="thing__title">{t.title}</span>
						<span class="thing__horizon">{horizon(t.edgeDate)}</span>
					</button>
				{/each}
			</div>
		</section>
	{/if}

	{#if breathing.length > 0}
		<section class="section">
			<h2>Might feel manageable today</h2>
			<div class="stack">
				{#each breathing as t}
					<div class="thing">
						<span class="thing__emoji">🍃</span>
						<span class="thing__title">{t.title}</span>
						<button class="soft-btn" onclick={() => markDone(t.id)}>done</button>
					</div>
				{/each}
			</div>
			<p class="hint">Only if you have capacity. They'll be here when you do.</p>
		</section>
	{/if}

	{#if presences.length === 0 && loops.length === 0 && edges.length === 0 && breathing.length === 0 && holds.length === 0}
		<div class="card empty">
			The hearth is warm. Nothing needs you right now.
			{#if people.length === 0}
				<br /><button class="soft-btn inline" onclick={() => goto('/settings')}>
					Add your household in Settings
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }

	.section h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0 0 0.5rem; letter-spacing: 0.02em; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }

	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.card.empty { text-align: center; padding: 2rem 1rem; }
	.gentle-error { border-color: color-mix(in srgb, #c96f6f 45%, var(--border-color)); }

	.hold { border-color: color-mix(in srgb, var(--accent) 45%, var(--border-color)); }
	.hold__title { color: var(--text); font-weight: 600; margin-bottom: 0.4rem; }
	.hold__body { font-size: 0.9rem; line-height: 1.5; }

	.pet-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px dashed var(--border-color); color: var(--text-secondary); min-height: 44px; }
	.pet-sigil { font-size: 1.05rem; }
	.pet-note { margin-left: auto; font-size: 0.8rem; color: var(--text-muted); }

	.weather { color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0 0; }

	.thing { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); min-height: 48px; }
	.thing.as-link { width: 100%; text-align: left; cursor: pointer; color: inherit; font: inherit; }
	.thing__emoji { flex-shrink: 0; }
	.thing__title { color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; }
	.thing__pet { color: var(--text-muted); font-size: 0.85rem; margin-left: 0.35rem; }
	.thing__horizon { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; flex-shrink: 0; }

	.soft-btn { margin-left: auto; padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 36px; flex-shrink: 0; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.inline { margin: 0.5rem auto 0; }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0.4rem 0 0; }
</style>
