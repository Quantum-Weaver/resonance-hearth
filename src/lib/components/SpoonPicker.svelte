<script lang="ts">
	// The Spoon Compass input. "Not Sure" is a first-class answer (inherited
	// from Echoes' design language), and skipping entirely is honored — this
	// component never nags; it simply exists.
	import { SPOON_LABELS } from '$lib/data/hearth';

	let {
		value = $bindable<number | null | undefined>(undefined),
		shared = $bindable(true),
		onpick,
	}: {
		value?: number | null | undefined; // undefined = not picked yet
		shared?: boolean;
		onpick?: (value: number | null, shared: boolean) => void;
	} = $props();

	function pick(v: number | null) {
		value = v;
		onpick?.(v, shared);
	}
</script>

<div class="spoons">
	<div class="spoons__row" role="group" aria-label="How are the spoons?">
		{#each [1, 2, 3, 4, 5] as v}
			<button
				class="spoon"
				class:picked={value === v}
				onclick={() => pick(v)}
				title={SPOON_LABELS[v]}
				aria-label="{v} spoons — {SPOON_LABELS[v]}"
			>
				{'🥄'.repeat(1)}<span class="n">{v}</span>
			</button>
		{/each}
		<button
			class="spoon notsure"
			class:picked={value === null}
			onclick={() => pick(null)}
			aria-label="Not sure"
		>
			Not&nbsp;Sure
		</button>
	</div>
	{#if value !== undefined && value !== null}
		<div class="spoons__word">{SPOON_LABELS[value]}</div>
	{:else if value === null}
		<div class="spoons__word">That's a fine answer.</div>
	{/if}
	<label class="spoons__share">
		<input type="checkbox" bind:checked={shared} />
		<span>share with the household</span>
	</label>
</div>

<style>
	.spoons { display: flex; flex-direction: column; gap: 0.5rem; }

	.spoons__row { display: flex; gap: 0.4rem; flex-wrap: wrap; }

	.spoon {
		min-width: 48px;
		min-height: 48px;
		padding: 0.4rem 0.6rem;
		border-radius: 10px;
		border: 1px solid var(--border-color);
		background-color: var(--bg-surface);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		transition: border-color 0.15s ease, color 0.15s ease;
	}

	.spoon .n { font-size: 0.85rem; }

	.spoon:hover { border-color: var(--accent); color: var(--text); }

	.spoon.picked {
		border-color: var(--accent);
		color: var(--text);
		background-color: color-mix(in srgb, var(--accent) 18%, var(--bg-surface));
	}

	.notsure { font-size: 0.85rem; }

	.spoons__word { color: var(--text-secondary); font-size: 0.9rem; }

	.spoons__share {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-muted);
		font-size: 0.85rem;
		cursor: pointer;
	}

	.spoons__share input { width: 18px; height: 18px; accent-color: var(--accent); }
</style>
