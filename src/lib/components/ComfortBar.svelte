<script lang="ts">
	// The ComfortBar — inherited from Resonance Echoes (the parent codebase),
	// retuned as the Hearth's gentle voice. Two laws live here:
	//   * the greeting knows who you are only if you told this device;
	//   * the Sattva door is always exactly one tap away (DESIGN-001; named
	//     Sattva in DESIGN-005 — balance as the destination, not the deficit).
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { hearthStore } from '$lib/stores/hearth.svelte';

	let expanded = $state(false);
	let previousPath = $state(page.url.pathname);

	// Collapse on route change only — not on initial mount.
	$effect(() => {
		const currentPath = page.url.pathname;
		if (currentPath !== previousPath && expanded) {
			expanded = false;
		}
		previousPath = currentPath;
	});

	// Broadcast the panel state so the Sidebar can close itself when it opens.
	$effect(() => {
		uiStore.setComfortBarExpanded(expanded);
	});

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 17) return 'Good afternoon';
		return 'Good evening';
	}

	const greeting = $derived(
		`${getGreeting()}, ${hearthStore.me?.label ?? 'friend'}`
	);

	// Live, gentle summary — presence, not pressure.
	const statsLine = $derived.by(() => {
		const loops = hearthStore.activeLoops.length;
		const held = hearthStore.householdOverwhelms.length;
		if (held > 0) return 'The household is holding someone. Gently does it.';
		if (loops === 0) return 'Nothing is asking right now. The house is breathing.';
		if (loops === 1) return 'One small thing is quietly asking.';
		return `${loops} small things are quietly asking.`;
	});

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="comfort-bar" class:expanded>
	{#if expanded}
		<div class="comfort-bar__expanded">
			<button class="comfort-bar__collapse" onclick={toggleExpanded} aria-label="Collapse">⌄</button>
			<div class="comfort-bar__greeting">{greeting}</div>
			<div class="comfort-bar__stats">{statsLine}</div>
			<div class="comfort-bar__actions">
				<button class="cb-action primary" onclick={() => goto('/things')}>+ Add a thing</button>
				<button class="cb-action" onclick={() => goto('/me')}>Me</button>
				<button class="cb-action" onclick={() => goto('/settings')}>Settings</button>
			</div>
		</div>
	{:else}
		<div class="comfort-bar__minimized">
			<button class="comfort-bar__greeting-btn" onclick={toggleExpanded}>
				{greeting}
			</button>
			<button
				class="comfort-bar__sattva"
				onclick={() => goto('/sattva')}
				aria-label="Sattva — a door back to balance"
			>
				Sattva
			</button>
		</div>
	{/if}
</div>

<style>
	.comfort-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 110;
		background-color: var(--bg-surface);
		border-top: 1px solid var(--border-color);
		padding-bottom: env(safe-area-inset-bottom, 0px);
		transition: background-color 0.2s ease;
		/* Own compositor layer (ghost-bar fix inherited from Compass/Echoes). */
		transform: translateZ(0);
	}

	/* Minimized */
	.comfort-bar__minimized {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48px;
		padding: 0 1rem;
		gap: 0.75rem;
	}

	.comfort-bar__greeting-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0;
		text-align: left;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.comfort-bar__greeting-btn:hover {
		color: var(--text);
	}

	/* The Sattva door: soft, present, never alarming — a candle, not a siren. */
	.comfort-bar__sattva {
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background-color: var(--bg);
		color: var(--text-secondary);
		font-size: 0.85rem;
		cursor: pointer;
		flex-shrink: 0;
		min-height: 36px;
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	.comfort-bar__sattva:hover {
		border-color: var(--accent);
		color: var(--text);
	}

	/* Expanded */
	.comfort-bar__expanded {
		padding: 0.75rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		position: relative;
	}

	.comfort-bar__collapse {
		position: absolute;
		top: 0.25rem;
		right: 0.75rem;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.25rem 0.5rem;
		line-height: 1;
	}

	.comfort-bar__greeting {
		font-size: 1rem;
		color: var(--text);
		font-weight: 500;
		padding-right: 2rem;
	}

	.comfort-bar__stats {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.comfort-bar__actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.cb-action {
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		background-color: var(--bg);
		border: 1px solid var(--border-color);
		color: var(--text-secondary);
		font-size: 0.85rem;
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.cb-action:hover {
		background-color: var(--border-color);
		color: var(--text);
	}

	.cb-action.primary {
		background-color: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}

	.cb-action.primary:hover {
		opacity: 0.9;
	}

	@media (prefers-reduced-motion: reduce) {
		.comfort-bar {
			transition: none;
		}
	}
</style>
