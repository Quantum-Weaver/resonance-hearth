<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { uiStore } from '$lib/stores/ui.svelte';
	import Icons from '$lib/components/icons/Icons.svelte';
	import type { IconName } from '$lib/components/icons/Icons.svelte';

	// Default-collapsed on every platform (Compass pattern): the content is the
	// destination, the nav is a drawer — even on desktop.
	let open = $state(false);
	let isMobile = $state(true);

	// SVG icons for chrome (Compass pattern) — they follow currentColor and size
	// consistently across Android emoji fonts. Emoji stays for content, not chrome.
	const navItems: { href: string; icon: IconName; label: string }[] = [
		{ href: '/', icon: 'home', label: 'Hearth' },
		{ href: '/me', icon: 'me', label: 'Me' },
		{ href: '/things', icon: 'things', label: 'Things' },
		{ href: '/care', icon: 'care', label: 'Care' },
		{ href: '/bills', icon: 'bills', label: 'Bills' },
		{ href: '/settings', icon: 'settings', label: 'Settings' }
	];

	// The vessel opened the ComfortBar panel — they want to see it, not the nav.
	$effect(() => {
		if (uiStore.comfortBarExpanded) open = false;
	});

	onMount(() => {
		isMobile = window.innerWidth < 768;
	});

	function navigate(href: string) {
		goto(href);
		open = false;
	}

	function toggle() {
		open = !open;
	}
</script>

<!-- Hamburger (always visible) -->
<button
	class="hamburger"
	onclick={toggle}
	aria-label={open ? 'Close navigation' : 'Open navigation'}
	aria-expanded={open}
>
	{open ? '✕' : '☰'}
</button>

<!-- Backdrop — dismisses the sidebar on outside interaction whenever it's open,
     desktop or mobile, since the hamburger toggle is always visible on both. -->
{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="backdrop"
		onclick={() => (open = false)}
		onkeydown={(e) => { if (e.key === 'Escape') open = false; }}
		role="presentation"
	></div>
{/if}

<!-- Sidebar panel -->
<nav class="sidebar" class:open aria-label="Main navigation">
	<div class="sidebar__header">
		<!-- cosmic-sparkle-text adds the animated glow; the scoped accent color
		     below outranks its light-gray color so light mode stays readable. -->
		<span class="sidebar__wordmark cosmic-sparkle-text">Hearth</span>
	</div>

	<ul class="sidebar__nav">
		{#each navItems as item}
			<li>
				<button
					class="nav-item"
					class:active={page.url.pathname === item.href}
					onclick={() => navigate(item.href)}
				>
					<span class="nav-icon"><Icons name={item.icon} size={18} /></span>
					<span class="nav-label">{item.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.hamburger {
		position: fixed;
		bottom: calc(56px + env(safe-area-inset-bottom, 0px));
		left: 1rem;
		z-index: 120;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-color);
		color: var(--text);
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 8px;
		font-size: 1.1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 49;
		/* Transparent (Compass pattern): dismissal surface, not a dimmer —
		   the drawer is small and the content should stay readable. */
		background-color: transparent;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 20vw;
		min-width: 180px;
		max-width: 280px;
		background-color: var(--bg-surface);
		border-right: 1px solid var(--border-color);
		z-index: 50;
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar__header {
		padding: calc(1rem + env(safe-area-inset-top, 0px)) 1.25rem 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.sidebar__wordmark {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--accent);
		letter-spacing: 0.02em;
	}

	.sidebar__nav {
		list-style: none;
		padding: 0.75rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.65rem 0.75rem;
		border-radius: 8px;
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		text-align: left;
		font-size: 0.95rem;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.nav-item:hover {
		background-color: var(--bg);
		color: var(--text);
	}

	.nav-item.active {
		background-color: var(--accent);
		color: #fff;
	}

	.nav-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.sidebar {
			transition: none;
		}
	}
</style>
