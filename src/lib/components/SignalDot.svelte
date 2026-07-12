<script lang="ts">
	// A presence indicator — not a notification. It breathes slowly and
	// demands nothing. Sensory law: no sound, no vibration, no alarm colors;
	// reduced motion turns the breath into a steady glow.
	import type { Member, Signal } from '$lib/types/types';
	import { signalByState } from '$lib/data/hearth';

	let {
		member,
		signal,
		size = 'medium',
	}: {
		member: Member;
		signal: Signal | null;
		size?: 'small' | 'medium' | 'large';
	} = $props();

	const def = $derived(signalByState(signal?.state ?? 'green'));
</script>

<div class="presence {size}" title="{member.label}: {def.meaning}">
	<span class="dot" style="--glow: {def.color}" aria-hidden="true"></span>
	<span class="who">
		{#if member.sigil}<span class="sigil">{member.sigil}</span>{/if}
		<span class="label">{member.label}</span>
	</span>
	<span class="meaning">{def.meaning}</span>
</div>

<style>
	.presence {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.75rem;
		border-radius: 10px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-color);
		min-height: 48px;
	}

	.dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background-color: var(--glow);
		box-shadow: 0 0 8px var(--glow);
		flex-shrink: 0;
		animation: breathe 3.5s ease-in-out infinite;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--text);
		font-weight: 500;
	}

	.sigil { font-size: 1.05rem; }

	.meaning {
		color: var(--text-secondary);
		font-size: 0.85rem;
		margin-left: auto;
		text-align: right;
	}

	.presence.small { min-height: 40px; padding: 0.35rem 0.6rem; }
	.presence.small .meaning { display: none; }
	.presence.large .meaning { font-size: 0.95rem; }

	@keyframes breathe {
		0%, 100% { opacity: 0.65; }
		50% { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.dot { animation: none; opacity: 0.9; }
	}
</style>
