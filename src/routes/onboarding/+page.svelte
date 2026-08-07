<script lang="ts">
	// The front door. Gentle steps, skippable, never a form-gauntlet.
	// The same rule as everywhere: chosen names are enough, sharing is opt-in,
	// and nothing here is a commitment you can't undo in Settings.
	//
	// THE WALK — this door consumes the-epagoge (the spring's leading-in;
	// the family's shared walk). The walk owns the flow, the dots, and the
	// honest record; every particular below — the members, the device, the
	// household's own data — stays under the hearth's roof, exactly as it
	// did. The membership law's spirit is untouched: nothing here invents
	// pairing; the door only does what it always did, on lawful rails.
	import { goto } from '$app/navigation';
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { PRESET_THEMES } from '$lib/theme/theme';
	import {
		beginWalk,
		current,
		isDone,
		toggleChoice,
		skip,
		advance,
		dots,
		completion,
		type StepDef,
		type Walk
	} from '$lib/epagoge';

	// ALL presets are offered at the door — derived from the shelf itself,
	// never hardcoded, so a new preset appears here the day it is born
	// (KP's ⚛ stroke). The default is WARM: the hearth's own light —
	// same grammar as the family, its own glow.
	const PRESET_ICONS: Record<string, string> = {
		dark: '🌙',
		warm: '🔥',
		ocean: '🌊',
		forest: '🌲',
		sunset: '🌅',
		amoled: '🌑'
	};

	// THE KEY LAW: the key is stored ("amoled"); the display name
	// (presetName, "AMOLED Black") is dress and appears nowhere in the record.
	const themeOffers = Object.entries(PRESET_THEMES).map(([key, t]) => ({
		key,
		name: t.presetName,
		icon: PRESET_ICONS[key] ?? '✨',
		accent: t.accentColor
	}));

	const STEPS: StepDef[] = [
		{ id: 'welcome', kind: 'threshold' },
		{ id: 'household', kind: 'threshold' },
		{ id: 'device', kind: 'threshold' },
		{ id: 'theme', kind: 'choose', atMost: 1, preset: ['warm'], offers: themeOffers }
	];

	const begun = beginWalk(STEPS);
	let walk = $state<Walk>(begun.walk ?? beginWalk([{ id: 'welcome', kind: 'threshold' }]).walk!);
	const beginTrouble = begun.trouble;

	const step = $derived(current(walk));
	const progress = $derived(dots(walk));
	const chosenTheme = $derived((walk.choices['theme'] ?? ['warm'])[0] ?? 'warm');

	let label = $state('');
	let sigil = $state('');
	let kind = $state<'person' | 'pet'>('person');

	async function addMember() {
		if (!label.trim()) return;
		await hearthStore.addMember(label.trim(), sigil.trim(), kind);
		label = '';
		sigil = '';
		kind = 'person';
	}

	function pickTheme(key: string) {
		walk = toggleChoice(walk, key);
		// Live preview is dress, not record — the walk holds the key.
		themeStore.setPreset((walk.choices['theme'] ?? ['warm'])[0] ?? 'warm');
	}

	function onward() {
		walk = advance(walk);
		if (isDone(walk)) finish();
	}

	function pass() {
		walk = skip(walk);
		if (isDone(walk)) finish();
	}

	// "Skip all of this" keeps its old meaning: the door stays open and
	// nothing is demanded — the walk ends early, the theme untouched.
	function finishEarly() {
		localStorage.setItem('hearth_onboarding_complete', '1');
		goto('/');
	}

	// THE DOORWAY LAW: completion hands over what was chosen; the app
	// stores it under its own roof, and every answer stays changeable in
	// Settings.
	function finish() {
		const done = completion(walk);
		themeStore.setPreset((done.choices['theme'] ?? ['warm'])[0] ?? 'warm');
		localStorage.setItem('hearth_onboarding_complete', '1');
		goto('/');
	}
</script>

<div class="door">
	{#if beginTrouble}
		<!-- Trouble is data, told never thrown — and it should never stand
		     here: the steps are static. Honest anyway. -->
		<div class="panel"><p class="body">{beginTrouble}</p></div>
	{:else if step?.id === 'welcome'}
		<div class="panel">
			<div class="flame">🔥</div>
			<!-- The Three Words are street-wide (KP's ruling, 2026-07-29):
			     Velkomin at every door, Fáilte at every hearth, Gweld ti'n
			     fuan at every going — the signed register: calm, gentle,
			     no inflection. This is the door. -->
			<h1>Velkomin</h1>
			<p class="lead">Welcome. This is Resonance Hearth — the Family Room. A translation layer for love.</p>
			<p class="body">
				This is a home for the household's real life — the bills, the meds,
				the pets, the endless things — spoken in invitation instead of demand.
				Tasks here <em>breathe</em>. Nothing shames. Nothing is ever "overdue."
				Nothing beeps, buzzes, or flashes red. Everything stays on this device.
			</p>
			<button class="soft-btn primary" onclick={onward}>come in</button>
			<button class="skip" onclick={finishEarly}>or skip all of this — the door stays open</button>
			<div class="dots" role="progressbar" aria-label={progress.label} aria-valuenow={progress.valuenow} aria-valuemin={progress.valuemin} aria-valuemax={progress.valuemax}>
				{#each progress.states as s, i (i)}
					<div class="dot" class:active={s === 'active'} class:done={s === 'past'}></div>
				{/each}
			</div>
		</div>
	{:else if step?.id === 'household'}
		<div class="panel">
			<h1>Who lives here?</h1>
			<p class="body">
				Chosen names or labels are enough — the Hearth never needs legal ones.
				Pets are family; add them too.
			</p>

			{#if hearthStore.members.length > 0}
				<div class="stack">
					{#each hearthStore.members as m}
						<div class="member">{m.sigil || (m.kind === 'pet' ? '🐾' : '🙂')} {m.label} <span class="kind">{m.kind}</span></div>
					{/each}
				</div>
			{/if}

			<div class="add-row">
				<input type="text" bind:value={sigil} placeholder="🙂" class="sigil-input" maxlength="4" aria-label="Sigil (optional)" />
				<input type="text" bind:value={label} placeholder="name or label" class="label-input"
					onkeydown={(e) => { if (e.key === 'Enter') addMember(); }} aria-label="Name or label" />
			</div>
			<div class="chip-row">
				<button class="chip" class:active={kind === 'person'} onclick={() => (kind = 'person')}>person</button>
				<button class="chip" class:active={kind === 'pet'} onclick={() => (kind = 'pet')}>pet</button>
				<button class="soft-btn" onclick={addMember}>add</button>
			</div>

			<button class="soft-btn primary" onclick={onward} disabled={hearthStore.people.length === 0}>
				{hearthStore.people.length === 0 ? 'add at least one person' : 'onward'}
			</button>
			<button class="skip" onclick={finishEarly}>finish later in Settings</button>
			<div class="dots" role="progressbar" aria-label={progress.label} aria-valuenow={progress.valuenow} aria-valuemin={progress.valuemin} aria-valuemax={progress.valuemax}>
				{#each progress.states as s, i (i)}
					<div class="dot" class:active={s === 'active'} class:done={s === 'past'}></div>
				{/each}
			</div>
		</div>
	{:else if step?.id === 'device'}
		<div class="panel">
			<h1>Whose device is this?</h1>
			<p class="body">
				So the Hearth greets the right person. Private things stay on the
				private side of the window, always.
			</p>
			<div class="stack">
				{#each hearthStore.people as p}
					<button
						class="member as-btn"
						class:chosen={hearthStore.deviceMemberId === p.id}
						onclick={() => hearthStore.setDeviceMember(p.id)}
					>
						{p.sigil || '🙂'} {p.label}
					</button>
				{/each}
			</div>
			<button class="soft-btn primary" onclick={onward}>onward</button>
			<button class="skip" onclick={pass}>decide later</button>
			<div class="dots" role="progressbar" aria-label={progress.label} aria-valuenow={progress.valuenow} aria-valuemin={progress.valuemin} aria-valuemax={progress.valuemax}>
				{#each progress.states as s, i (i)}
					<div class="dot" class:active={s === 'active'} class:done={s === 'past'}></div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="panel">
			<h1>Choose your light</h1>
			<p class="body">
				Every atmosphere the Hearth holds — warm is its own. Change it
				anytime in Settings; the door never locks.
			</p>
			<div class="theme-grid">
				{#each themeOffers as opt (opt.key)}
					<button
						class="theme-card"
						class:selected={chosenTheme === opt.key}
						style="--card-accent: {opt.accent};"
						onclick={() => pickTheme(opt.key)}
						aria-pressed={chosenTheme === opt.key}
					>
						<span class="theme-icon">{opt.icon}</span>
						<span class="theme-name">{opt.name}</span>
						<div class="theme-swatch" style="background: {opt.accent};"></div>
					</button>
				{/each}
			</div>
			<button class="soft-btn primary" onclick={onward}>light the hearth</button>
			<button class="skip" onclick={pass}>decide later</button>
			<div class="dots" role="progressbar" aria-label={progress.label} aria-valuenow={progress.valuenow} aria-valuemin={progress.valuemin} aria-valuemax={progress.valuemax}>
				{#each progress.states as s, i (i)}
					<div class="dot" class:active={s === 'active'} class:done={s === 'past'}></div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.door {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.panel {
		max-width: 480px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: center;
		align-items: center;
	}

	.flame { font-size: 2.6rem; }

	h1 { color: var(--text); font-size: 1.6rem; margin: 0; }
	.lead { color: var(--text-secondary); font-size: 1.05rem; margin: 0; }
	.body { color: var(--text-secondary); line-height: 1.6; margin: 0; font-size: 0.95rem; }

	.stack { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
	.member { padding: 0.6rem 0.8rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text); min-height: 48px; display: flex; align-items: center; gap: 0.5rem; justify-content: center; }
	.member .kind { color: var(--text-muted); font-size: 0.8rem; }
	.member.as-btn { cursor: pointer; font-size: 1rem; }
	.member.as-btn:hover { border-color: var(--accent); }
	.member.chosen { border-color: var(--accent); background-color: color-mix(in srgb, var(--accent) 14%, var(--bg-surface)); }

	.add-row { display: flex; gap: 0.5rem; width: 100%; }
	.sigil-input { width: 3.5rem; text-align: center; }
	.label-input { flex: 1; }
	input[type='text'] { padding: 0.65rem 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg-surface); color: var(--text); font-size: 1rem; }

	.chip-row { display: flex; gap: 0.4rem; align-items: center; justify-content: center; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.9rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; min-height: 40px; }
	.chip.active { border-color: var(--accent); color: var(--text); background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }

	.soft-btn { padding: 0.6rem 1.2rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.95rem; min-height: 48px; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }
	.soft-btn.primary:disabled { opacity: 0.5; cursor: default; }

	.skip { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; text-decoration: underline; }
	.skip:hover { color: var(--text-secondary); }

	/* ── The atmosphere step — every preset the shelf holds ── */
	.theme-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		width: 100%;
	}

	@media (min-width: 640px) {
		.theme-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.theme-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.2rem 0.5rem 0.9rem;
		background: var(--bg-surface);
		border: 2px solid var(--border-color);
		border-radius: 16px;
		cursor: pointer;
		min-height: 48px;
		transition: border-color 0.2s, background 0.2s;
	}
	.theme-card.selected {
		border-color: var(--card-accent);
		background: color-mix(in srgb, var(--card-accent) 10%, var(--bg-surface));
	}

	.theme-icon { font-size: 1.8rem; line-height: 1; }
	.theme-name { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
	.theme-swatch { width: 28px; height: 5px; border-radius: 3px; }

	/* ── The dots — derived by the walk, drawn in the hearth's calm ── */
	.dots {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 4px;
		background: var(--border-color);
		transition: width 0.3s ease, background 0.3s ease;
	}
	.dot.active {
		width: 22px;
		background: var(--accent);
	}
	.dot.done {
		background: color-mix(in srgb, var(--accent) 45%, var(--border-color));
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			transition: none;
		}
	}
</style>
