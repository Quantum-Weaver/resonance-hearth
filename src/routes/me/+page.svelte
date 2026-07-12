<script lang="ts">
	// Me — the private room. My spoons, my signal, my meds, my things.
	// Everything here is mine; sharing is opt-in, per item, revocable.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { SIGNALS, SUGGESTED_NEEDS } from '$lib/data/hearth';
	import type { TellScope } from '$lib/types/types';
	import SpoonPicker from '$lib/components/SpoonPicker.svelte';
	import CelebrationLine from '$lib/components/CelebrationLine.svelte';

	let celebration = $state<string | null>(null);
	let spoonsShared = $state(true);

	// My overwhelm protocol — authored here in calm, executed in storm.
	let protoLoaded = $state(false);
	let tellScope = $state<TellScope>('household');
	let tellMembers = $state<string[]>([]);
	let cardText = $state('');
	let needs = $state<string[]>([]);
	let newNeed = $state('');
	let checkback = $state(30);
	let protoSaved = $state(false);

	$effect(() => {
		if (hearthStore.me && !protoLoaded) {
			const p = hearthStore.protocolFor(hearthStore.me.id);
			tellScope = p.tellScope;
			tellMembers = [...p.tellMembers];
			cardText = p.cardText ?? '';
			needs = [...p.needs];
			checkback = p.checkbackMinutes;
			protoLoaded = true;
		}
	});

	function toggleTellMember(id: string) {
		tellMembers = tellMembers.includes(id)
			? tellMembers.filter((x) => x !== id)
			: [...tellMembers, id];
	}

	function toggleNeed(n: string) {
		needs = needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n];
	}

	function addNeed() {
		const n = newNeed.trim();
		if (n && !needs.includes(n)) needs = [...needs, n];
		newNeed = '';
	}

	async function saveProto() {
		if (!hearthStore.me) return;
		await hearthStore.saveProtocol({
			memberId: hearthStore.me.id,
			tellScope,
			tellMembers,
			cardText: cardText.trim() || null,
			needs,
			checkbackMinutes: Math.max(5, checkback || 30),
		});
		protoSaved = true;
		setTimeout(() => (protoSaved = false), 4000);
	}

	const me = $derived(hearthStore.me);
	const mySignal = $derived(me ? hearthStore.signalFor(me.id) : null);
	const myLatest = $derived(me ? hearthStore.latestSpoons(me.id) : null);
	const myMedsAsking = $derived(me ? hearthStore.medsAsking(me.id) : []);
	const myMeds = $derived(me ? hearthStore.meds.filter((m) => m.memberId === me.id) : []);
	const myThings = $derived(
		me ? hearthStore.things.filter((t) => t.memberId === me.id && !t.pool) : []
	);

	async function pickSpoons(value: number | null, shared: boolean) {
		if (!me) return;
		await hearthStore.logSpoons(me.id, value, shared);
	}

	async function setSignal(state: (typeof SIGNALS)[number]['state']) {
		if (!me) return;
		await hearthStore.setSignal(me.id, state, mySignal?.shared ?? true);
	}

	async function toggleSignalShared() {
		if (!me || !mySignal) return;
		await hearthStore.setSignal(me.id, mySignal.state, !mySignal.shared);
	}

	async function med(medId: string, status: 'taken' | 'skipped' | 'later') {
		const line = await hearthStore.takeMed(medId, status);
		if (line) celebration = line;
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>Me</h1>
		<p class="sub">Your private room. Only what you choose crosses to the household.</p>
	</header>

	<CelebrationLine bind:text={celebration} />

	{#if !me}
		<div class="card">
			<p>This device doesn't know who it belongs to yet.</p>
			{#if hearthStore.people.length > 0}
				<div class="pick-row">
					{#each hearthStore.people as p}
						<button class="soft-btn" onclick={() => hearthStore.setDeviceMember(p.id)}>
							{p.sigil} {p.label}
						</button>
					{/each}
				</div>
			{:else}
				<p class="hint">Add your household in Settings first.</p>
			{/if}
		</div>
	{:else}
		<section class="section">
			<h2>How are the spoons?</h2>
			{#if myLatest}
				<p class="hint">
					Logged today already — you can always update. Skipping is honored too.
				</p>
			{/if}
			<SpoonPicker bind:shared={spoonsShared} onpick={pickSpoons} />
		</section>

		<section class="section">
			<h2>My signal</h2>
			<div class="signal-row" role="group" aria-label="Set my signal">
				{#each SIGNALS as s}
					<button
						class="signal"
						class:active={mySignal?.state === s.state}
						style="--glow: {s.color}"
						onclick={() => setSignal(s.state)}
						title={s.meaning}
						aria-label={s.meaning}
					>
						<span class="signal__dot" aria-hidden="true"></span>
						<span class="signal__word">{s.meaning}</span>
					</button>
				{/each}
			</div>
			<label class="share-row">
				<input
					type="checkbox"
					checked={mySignal?.shared ?? true}
					onchange={toggleSignalShared}
				/>
				<span>show my signal on the Hearth</span>
			</label>
			<p class="hint">Signals are presence, not notifications. Nobody is pinged.</p>
		</section>

		<section class="section">
			<h2>My overwhelm protocol</h2>
			<p class="hint">
				Written now, in calm, so nobody has to guess in the storm — least of
				all you. Not everyone feels safe the same way, and that's the point.
			</p>
			<div class="proto card">
				<div class="proto__group">
					<span class="proto__label">when I press the button, tell…</span>
					<div class="chip-row">
						<button class="chip" class:active={tellScope === 'household'} onclick={() => (tellScope = 'household')}>the whole household</button>
						<button class="chip" class:active={tellScope === 'some'} onclick={() => (tellScope = 'some')}>only my people</button>
						<button class="chip" class:active={tellScope === 'none'} onclick={() => (tellScope = 'none')}>no one — just hold me</button>
					</div>
					{#if tellScope === 'some'}
						<div class="chip-row">
							{#each hearthStore.people.filter((p) => p.id !== me?.id) as p}
								<button class="chip" class:active={tellMembers.includes(p.id)} onclick={() => toggleTellMember(p.id)}>
									{p.sigil} {p.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				{#if tellScope !== 'none'}
					<label class="proto__group">
						<span class="proto__label">in my own words (optional — the gentle default is used otherwise)</span>
						<textarea rows="2" bind:value={cardText} placeholder="e.g. I'm overwhelmed. Please don't ask questions. Sitting nearby quietly helps."></textarea>
					</label>
				{/if}

				<div class="proto__group">
					<span class="proto__label">things that help me (offered back as one-tap answers)</span>
					<div class="chip-row">
						{#each [...new Set([...SUGGESTED_NEEDS, ...needs])] as n}
							<button class="chip" class:active={needs.includes(n)} onclick={() => toggleNeed(n)}>{n}</button>
						{/each}
					</div>
					<div class="add-need">
						<input type="text" bind:value={newNeed} placeholder="something of your own…"
							onkeydown={(e) => { if (e.key === 'Enter') addNeed(); }} />
						<button class="soft-btn" onclick={addNeed}>add</button>
					</div>
				</div>

				{#if tellScope !== 'none'}
					<label class="proto__group inline">
						<span class="proto__label">suggest checking on me after</span>
						<input class="minutes" type="number" min="5" max="240" bind:value={checkback} />
						<span class="proto__label">minutes</span>
					</label>
				{/if}

				<div class="proto__actions">
					<button class="soft-btn primary" onclick={saveProto}>keep my protocol</button>
					{#if protoSaved}<span class="hint">held. you can change it any time.</span>{/if}
				</div>
			</div>
		</section>

		{#if myMedsAsking.length > 0}
			<section class="section">
				<h2>Quietly asking</h2>
				<div class="stack">
					{#each myMedsAsking as m}
						<div class="thing">
							<span class="thing__emoji">🫀</span>
							<span class="thing__title">{m.label}</span>
							<div class="med-actions">
								<button class="soft-btn" onclick={() => med(m.id, 'taken')}>taken</button>
								<button class="soft-btn quiet" onclick={() => med(m.id, 'later')}>later</button>
								<button class="soft-btn quiet" onclick={() => med(m.id, 'skipped')}>not today</button>
							</div>
						</div>
					{/each}
				</div>
				<p class="hint">Every answer is a fine answer. This stays yours unless you share it.</p>
			</section>
		{:else if myMeds.length > 0}
			<section class="section">
				<h2>Care</h2>
				<p class="hint">Nothing is asking right now. All held.</p>
			</section>
		{/if}

		{#if myThings.length > 0}
			<section class="section">
				<h2>My things</h2>
				<div class="stack">
					{#each myThings as t}
						<div class="thing">
							<span class="thing__emoji">🍃</span>
							<span class="thing__title">{t.title}</span>
							<button
								class="soft-btn"
								onclick={async () => (celebration = await hearthStore.doneThing(t.id, me.id))}
							>done</button>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
	.section h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0 0 0.5rem; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-secondary); }
	.pick-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }

	.signal-row { display: flex; flex-direction: column; gap: 0.4rem; }
	.signal { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg-surface); color: var(--text-secondary); cursor: pointer; min-height: 48px; text-align: left; }
	.signal:hover { border-color: var(--glow); color: var(--text); }
	.signal.active { border-color: var(--glow); color: var(--text); background-color: color-mix(in srgb, var(--glow) 12%, var(--bg-surface)); }
	.signal__dot { width: 14px; height: 14px; border-radius: 50%; background-color: var(--glow); box-shadow: 0 0 8px var(--glow); flex-shrink: 0; }
	.signal__word { font-size: 0.9rem; }

	.share-row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; margin-top: 0.6rem; cursor: pointer; }
	.share-row input { width: 18px; height: 18px; accent-color: var(--accent); }

	.thing { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); min-height: 48px; flex-wrap: wrap; }
	.thing__emoji { flex-shrink: 0; }
	.thing__title { color: var(--text); }
	.med-actions { margin-left: auto; display: flex; gap: 0.35rem; flex-wrap: wrap; }

	.soft-btn { padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 36px; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.quiet { opacity: 0.75; }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0.4rem 0 0; }

	.proto { display: flex; flex-direction: column; gap: 0.9rem; }
	.proto__group { display: flex; flex-direction: column; gap: 0.45rem; }
	.proto__group.inline { flex-direction: row; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.proto__label { color: var(--text-muted); font-size: 0.85rem; }
	.chip-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.88rem; min-height: 40px; }
	.chip.active { border-color: var(--accent); color: var(--text); background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }
	.proto textarea { padding: 0.6rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; resize: vertical; font-family: inherit; }
	.add-need { display: flex; gap: 0.5rem; }
	.add-need input { flex: 1; padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.9rem; }
	.minutes { width: 5rem; padding: 0.45rem 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; text-align: center; }
	.proto__actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
</style>
