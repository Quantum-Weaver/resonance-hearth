<script lang="ts">
	// The Hearth — the Family Dashboard.
	// PROTECTED BOUNDARY (naming ceremony, 2026-07-07): this is a window,
	// not a monitor. Only shared state appears here; only current presence,
	// never history; nothing on this page demands anything of anyone.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { speciesDef } from '$lib/data/hearth';
	import EntityCard from '$lib/components/EntityCard.svelte';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';
	import { readSky } from '$lib/sky';
	import { goto } from '$app/navigation';
	import { galleryOf, type GalleryConfig } from '$lib/gallery';
	import type { Member } from '$lib/types/types';

	let celebration = $state<string | null>(null);

	const people = $derived(hearthStore.people);

	// Every member gets a card — the entity cards ARE the household view
	// now (gentle reminders, KP's 2026-07-31 rulings). The pets appear
	// unconditionally: presence gating applies to signals, never to being
	// family. A person's shared signal rides ON their card; unshared
	// signals simply don't appear (window, not monitor — unchanged).
	const household = $derived(hearthStore.members);

	// THE GALLERY — the household roster consumes the-gallery (the family's
	// shared engine: rows in, cards out). EntityCard stays the dress; its
	// canon is untouched. The search walks the label ONLY — a label is for
	// finding (the crystal's ruling) — and the two empties speak in this
	// hearth's own voice. Every kind of member rides: presence gating
	// applies to signals, never to being family.
	let memberQuery = $state('');
	const memberConfig: GalleryConfig<Member> = {
		searchIn: [(m) => m.label],
		card: {
			id: (m) => m.id,
			title: (m) => m.label,
			address: (m) => `#member-${m.id}`,
		},
		empty: {
			silent: 'The hearth is warm and waiting — the household gathers in Settings.',
			unmatched: 'No one by that name — the whole household is still here.',
		},
	};
	const memberView = $derived(galleryOf(memberConfig, household, memberQuery));
	const memberById = $derived(new Map(household.map((m) => [m.id, m])));

	const holds = $derived(
		hearthStore.householdOverwhelms.map((e) => ({
			event: e,
			member: hearthStore.memberById(e.memberId),
			protocol: hearthStore.protocolFor(e.memberId),
		}))
	);

	// The sky organs — facts only, computed offline, derived never stored
	// (KP's rulings, 2026-07-31): the moon's phase, the wheel's next
	// turning, and any wanderers standing together. No meanings shipped;
	// what the sky means is the family's own.
	const sky = $derived(readSky(new Date(hearthStore.now)));
	const skyLine = $derived.by(() => {
		const parts = [
			`${sky.moon.emoji} ${sky.moon.phase}, ${Math.round(sky.moon.illumination * 100)}% lit`,
			sky.season.next.daysUntil === 0
				? `${sky.season.next.name} is today`
				: `${sky.season.next.name} in ${sky.season.next.daysUntil} day${sky.season.next.daysUntil === 1 ? '' : 's'}`,
		];
		for (const m of sky.meetings) parts.push(`${m.a} and ${m.b} stand together`);
		return parts.join(' · ');
	});

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
		<!-- The second of the Three Words: Fáilte at every hearth — and of
		     every app on the street, this hearth is the literal one. -->
		<h1>The Hearth</h1>
		<p class="sub">Fáilte — the hearth is warm. The household, breathing together; only what each of us chose to share.</p>
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
				This is not an emergency. This is a household breathing.<br />
				<!-- The third word, at the going — the only departure that
				     carries a return inside it. Spoken to the household about
				     the one who stepped away; their own screen stays silent,
				     per the silence law. -->
				<em>Gweld ti'n fuan — see you soon.</em>
			</div>
		</div>
	{/each}

	{#if household.length > 0}
		<section class="section">
			<h2>The household</h2>
			<!-- The very top of the gallery — KP's ⚛ stroke. -->
			<input
				type="search"
				class="member-search"
				placeholder="find by chosen name"
				bind:value={memberQuery}
				aria-label="Find a household member by chosen name"
			/>
			{#if memberView.empty}
				<p class="weather">{memberView.empty.message}</p>
			{:else}
				<div class="stack">
					{#each memberView.cards as card (card.id)}
						{@const m = memberById.get(card.id)}
						{#if m}<EntityCard member={m} />{/if}
					{/each}
				</div>
			{/if}
			{#if weatherLine}<p class="weather">{weatherLine}</p>{/if}
			<p class="weather">{skyLine}</p>
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

	{#if household.length === 0 && loops.length === 0 && edges.length === 0 && breathing.length === 0 && holds.length === 0}
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

	.member-search { width: 100%; min-height: 48px; padding: 0.6rem 0.9rem; margin-bottom: 0.6rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg-surface); color: var(--text); font-size: 0.95rem; outline: none; box-sizing: border-box; }
	.member-search:focus { border-color: var(--accent); }
	.member-search::placeholder { color: var(--text-muted); }

	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.card.empty { text-align: center; padding: 2rem 1rem; }
	.gentle-error { border-color: color-mix(in srgb, #c96f6f 45%, var(--border-color)); }

	.hold { border-color: color-mix(in srgb, var(--accent) 45%, var(--border-color)); }
	.hold__title { color: var(--text); font-weight: 600; margin-bottom: 0.4rem; }
	.hold__body { font-size: 0.9rem; line-height: 1.5; }

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
