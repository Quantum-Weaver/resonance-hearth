<script lang="ts">
	// Celebration over punishment: one quiet line that fades on its own.
	// No streaks, no scores, no confetti. It appears, warms, and goes.
	let { text = $bindable<string | null>(null) }: { text?: string | null } = $props();

	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (text) {
			visible = true;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				visible = false;
				// let the fade finish before clearing
				setTimeout(() => (text = null), 900);
			}, 5200);
		}
	});
</script>

{#if text}
	<div class="celebration" class:visible role="status">{text}</div>
{/if}

<style>
	.celebration {
		padding: 0.7rem 1rem;
		border-radius: 10px;
		background-color: color-mix(in srgb, var(--accent) 14%, var(--bg-surface));
		border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border-color));
		color: var(--text);
		font-size: 0.95rem;
		opacity: 0;
		transition: opacity 0.9s ease;
	}

	.celebration.visible { opacity: 1; }

	@media (prefers-reduced-motion: reduce) {
		.celebration { transition: opacity 0.2s ease; }
	}
</style>
