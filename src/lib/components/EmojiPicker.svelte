<script lang="ts">
	// EmojiPicker — the full vocabulary, no curation. KP's ruling
	// (2026-07-31): "we want to load the hearth with a full set of options
	// otherwise we limit its vessel to what we chose." Names are search
	// keys, never definitions — meaning is the vessel's own.
	//
	// Sensory law holds: no sound, no motion, targets ≥48px, dismissible,
	// nothing traps. One group renders at a time (plus content-visibility)
	// so the whole set stays light on a phone.
	import { EMOJI_GROUPS, EMOJI_COUNT, type EmojiEntry } from '$lib/data/emojis.gen';

	let {
		onpick,
		onclose,
	}: {
		onpick: (emoji: string) => void;
		onclose?: () => void;
	} = $props();

	let search = $state('');
	let activeGroup = $state(0);

	// Search walks every group; the shown slice is capped visibly, never
	// silently — the count always says how many matched.
	const SHOW_CAP = 400;
	let matches = $derived.by((): { total: number; shown: EmojiEntry[] } => {
		const q = search.trim().toLowerCase();
		if (!q) return { total: 0, shown: [] };
		const shown: EmojiEntry[] = [];
		let total = 0;
		for (const g of EMOJI_GROUPS) {
			for (const en of g.emojis) {
				if (en.n.includes(q) || en.e === q) {
					total++;
					if (shown.length < SHOW_CAP) shown.push(en);
				}
			}
		}
		return { total, shown };
	});
</script>

<div class="picker" role="group" aria-label="Emoji picker — every emoji, yours to mean">
	<div class="picker__top">
		<input
			type="text"
			bind:value={search}
			placeholder="search all {EMOJI_COUNT} by name…"
			aria-label="Search emoji by name"
		/>
		{#if onclose}
			<button class="soft-btn" onclick={onclose} aria-label="Close the picker">done</button>
		{/if}
	</div>

	{#if search.trim()}
		<p class="count" aria-live="polite">
			{matches.total} match{matches.total === 1 ? '' : 'es'}{matches.total > SHOW_CAP
				? ` — showing the first ${SHOW_CAP}; keep typing to narrow`
				: ''}
		</p>
		<div class="grid">
			{#each matches.shown as en (en.e)}
				<button class="cell" title={en.n} aria-label={en.n} onclick={() => onpick(en.e)}>{en.e}</button>
			{/each}
		</div>
	{:else}
		<div class="tabs" role="tablist" aria-label="Emoji groups">
			{#each EMOJI_GROUPS as g, i}
				<button
					class="tab"
					class:active={activeGroup === i}
					role="tab"
					aria-selected={activeGroup === i}
					title={g.group}
					aria-label={g.group}
					onclick={() => (activeGroup = i)}
				>{g.emojis[0]?.e}</button>
			{/each}
		</div>
		<p class="count">{EMOJI_GROUPS[activeGroup].group} · {EMOJI_GROUPS[activeGroup].emojis.length}</p>
		<div class="grid">
			{#each EMOJI_GROUPS[activeGroup].emojis as en (en.e)}
				<button class="cell" title={en.n} aria-label={en.n} onclick={() => onpick(en.e)}>{en.e}</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.picker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 12px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-color);
	}
	.picker__top { display: flex; gap: 0.5rem; }
	.picker__top input {
		flex: 1;
		padding: 0.6rem 0.7rem;
		border-radius: 8px;
		border: 1px solid var(--border-color);
		background-color: var(--bg);
		color: var(--text);
		font-size: 0.95rem;
		min-height: 48px;
	}
	.soft-btn {
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.85rem;
		min-height: 48px;
	}
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.tabs { display: flex; gap: 0.25rem; flex-wrap: wrap; }
	.tab {
		min-width: 48px;
		min-height: 48px;
		font-size: 1.25rem;
		border-radius: 10px;
		border: 1px solid transparent;
		background: none;
		cursor: pointer;
		line-height: 1;
	}
	.tab.active { border-color: var(--accent); background-color: color-mix(in srgb, var(--accent) 12%, var(--bg-surface)); }
	.count { color: var(--text-muted); font-size: 0.8rem; margin: 0; }
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
		gap: 0.15rem;
		max-height: 40vh;
		overflow-y: auto;
	}
	.cell {
		min-width: 48px;
		min-height: 48px;
		font-size: 1.4rem;
		border: none;
		border-radius: 10px;
		background: none;
		cursor: pointer;
		line-height: 1;
		content-visibility: auto;
		contain-intrinsic-size: 48px;
	}
	.cell:hover, .cell:focus-visible { background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }
</style>
