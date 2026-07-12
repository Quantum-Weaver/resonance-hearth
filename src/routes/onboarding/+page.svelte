<script lang="ts">
	// The front door. Three gentle steps, skippable, never a form-gauntlet.
	// The same rule as everywhere: chosen names are enough, sharing is opt-in,
	// and nothing here is a commitment you can't undo in Settings.
	import { goto } from '$app/navigation';
	import { hearthStore } from '$lib/stores/hearth.svelte';

	let step = $state(0);
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

	function finish() {
		localStorage.setItem('hearth_onboarding_complete', '1');
		goto('/');
	}
</script>

<div class="door">
	{#if step === 0}
		<div class="panel">
			<div class="flame">🔥</div>
			<h1>Resonance Hearth</h1>
			<p class="lead">The Family Room. A translation layer for love.</p>
			<p class="body">
				This is a home for the household's real life — the bills, the meds,
				the pets, the endless things — spoken in invitation instead of demand.
				Tasks here <em>breathe</em>. Nothing shames. Nothing is ever "overdue."
				Nothing beeps, buzzes, or flashes red. Everything stays on this device.
			</p>
			<button class="soft-btn primary" onclick={() => (step = 1)}>come in</button>
			<button class="skip" onclick={finish}>or skip all of this — the door stays open</button>
		</div>
	{:else if step === 1}
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

			<button class="soft-btn primary" onclick={() => (step = 2)} disabled={hearthStore.people.length === 0}>
				{hearthStore.people.length === 0 ? 'add at least one person' : 'onward'}
			</button>
			<button class="skip" onclick={finish}>finish later in Settings</button>
		</div>
	{:else}
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
			<button class="soft-btn primary" onclick={finish}>light the hearth</button>
			<button class="skip" onclick={finish}>decide later</button>
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
</style>
