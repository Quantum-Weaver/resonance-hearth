<script lang="ts">
	// Settings — the household's quiet machinery. Members, this device,
	// light and type, and the three license-§7 features that are features,
	// not promises: export everything, bring an export home, delete
	// everything. The three laws ride the-envelope (the awen spring).
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { PRESET_THEMES } from '$lib/theme/theme';
	import EmojiPicker from '$lib/components/EmojiPicker.svelte';
	import { open as openDialog, save } from '@tauri-apps/plugin-dialog';
	import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
	import { filename, purgeAfter } from 'the-envelope';

	let newLabel = $state('');
	let newSigil = $state('');
	let newKind = $state<'person' | 'pet'>('person');
	let sigilPickerOpen = $state(false);
	let exportNote = $state<string | null>(null);
	let purgeArmed = $state(false);

	async function addMember() {
		if (!newLabel.trim()) return;
		await hearthStore.addMember(newLabel.trim(), newSigil.trim(), newKind);
		newLabel = '';
		newSigil = '';
	}

	// One export path for both doors. Returns false if the save dialog was
	// closed — the caller decides what that means (for the purge: everything).
	async function exportToFile(): Promise<boolean> {
		const json = await hearthStore.exportAll();
		const path = await save({
			title: 'Export the Hearth (open JSON — yours, always)',
			defaultPath: filename('resonance-hearth'),
			filters: [{ name: 'JSON', extensions: ['json'] }],
		});
		if (!path) return false;
		await writeTextFile(path, json);
		return true;
	}

	async function exportAll() {
		exportNote = null;
		try {
			if (await exportToFile()) {
				exportNote = 'Exported. Your data, in the open, wherever you take it.';
			}
		} catch (e) {
			exportNote = `Export hit a snag: ${e instanceof Error ? e.message : e}`;
		}
	}

	async function importAll() {
		exportNote = null;
		try {
			const path = await openDialog({
				title: 'Bring a Hearth export home',
				filters: [{ name: 'JSON', extensions: ['json'] }],
				multiple: false,
			});
			if (!path) return;
			const json = await readTextFile(path as string);
			const r = await hearthStore.importAll(json);
			const parts = [`${r.added} new ${r.added === 1 ? 'entry' : 'entries'} welcomed in`];
			if (r.kept) parts.push(`${r.kept} already lived here and stayed exactly as they are`);
			if (r.heldBack) parts.push(`${r.heldBack} from an older shape were held back unchanged`);
			exportNote = parts.join(' · ') + '.';
		} catch (e) {
			exportNote = `${e instanceof Error ? e.message : e} Nothing here was changed.`;
		}
	}

	// The purge awaits the export: law 2, straight from the-envelope.
	// Canceling the save dialog cancels the purge — no export in hand,
	// nothing deletes.
	async function purgeWithExport() {
		exportNote = null;
		try {
			await purgeAfter(
				async () => {
					if (!(await exportToFile())) throw new Error('The purge waited — no export landed, so nothing was deleted.');
				},
				() => hearthStore.purgeAll()
			);
			purgeArmed = false;
			exportNote = 'Exported, then purged. Your copy is in hand; nothing else was kept.';
		} catch (e) {
			purgeArmed = false;
			exportNote = e instanceof Error ? e.message : String(e);
		}
	}

	async function purgeWithout() {
		try {
			await purgeAfter(null, () => hearthStore.purgeAll());
			purgeArmed = false;
			exportNote = 'Purged. The purge truly purges — nothing was kept.';
		} catch (e) {
			purgeArmed = false;
			exportNote = `The purge stopped early: ${e instanceof Error ? e.message : e}`;
		}
	}
</script>

<div class="page">
	<header class="page__head">
		<h1>Settings</h1>
		<p class="sub">The quiet machinery.</p>
	</header>

	<section class="section">
		<h2>The household</h2>
		<div class="stack">
			{#each hearthStore.members as m}
				<div class="member">
					<span class="member__sigil">{m.sigil || (m.kind === 'pet' ? '🐾' : '🙂')}</span>
					<span class="member__label">{m.label}</span>
					<span class="member__kind">{m.kind}</span>
					{#if m.kind === 'person'}
						<button
							class="soft-btn"
							class:primary={hearthStore.deviceMemberId === m.id}
							onclick={() => hearthStore.setDeviceMember(m.id)}
						>
							{hearthStore.deviceMemberId === m.id ? 'this device is theirs' : 'this device is mine'}
						</button>
					{/if}
				</div>
			{/each}
		</div>
		<div class="card form">
			<div class="add-row">
				<input type="text" bind:value={newSigil} placeholder="🙂" class="sigil-input" maxlength="4" aria-label="Sigil (optional emoji)" />
				<input type="text" bind:value={newLabel} placeholder="a chosen name or label" class="label-input"
					onkeydown={(e) => { if (e.key === 'Enter') addMember(); }} aria-label="Member label" />
				<button class="soft-btn" onclick={() => (sigilPickerOpen = !sigilPickerOpen)} aria-expanded={sigilPickerOpen}>
					{sigilPickerOpen ? 'hide the emojis' : 'all the emojis'}
				</button>
			</div>
			{#if sigilPickerOpen}
				<EmojiPicker
					onpick={(e) => { newSigil = e; sigilPickerOpen = false; }}
					onclose={() => (sigilPickerOpen = false)}
				/>
			{/if}
			<div class="kind-row" role="group" aria-label="Person or pet?">
				<button class="chip" class:active={newKind === 'person'} onclick={() => (newKind = 'person')}>person</button>
				<button class="chip" class:active={newKind === 'pet'} onclick={() => (newKind = 'pet')}>pet (family)</button>
			</div>
			<button class="soft-btn primary" onclick={addMember}>welcome them in</button>
			<p class="hint">Chosen names are enough. The Hearth never needs legal ones — and any emoji can be a sigil; it means what you say it means.</p>
		</div>
	</section>

	<section class="section">
		<h2>Light &amp; type</h2>
		<div class="chip-row">
			{#each Object.entries(PRESET_THEMES) as [key, preset]}
				<button
					class="chip"
					class:active={themeStore.config.presetName === preset.presetName}
					onclick={() => themeStore.setPreset(key)}
				>{preset.presetName}</button>
			{/each}
		</div>
		<div class="chip-row">
			{#each ['small', 'medium', 'large'] as fs}
				<button
					class="chip"
					class:active={themeStore.config.fontSize === fs}
					onclick={() => themeStore.setFontSize(fs as 'small' | 'medium' | 'large')}
				>{fs} type</button>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Your data (yours, structurally)</h2>
		<div class="chip-row">
			<button class="soft-btn" onclick={exportAll}>export everything (open JSON)</button>
			<button class="soft-btn" onclick={importAll}>bring an export home</button>
			{#if !purgeArmed}
				<button class="soft-btn danger" onclick={() => (purgeArmed = true)}>delete everything</button>
			{:else}
				<button class="soft-btn" onclick={purgeWithExport}>export first, then purge</button>
				<button class="soft-btn danger" onclick={purgeWithout}>purge without exporting</button>
				<button class="soft-btn" onclick={() => (purgeArmed = false)}>never mind</button>
			{/if}
		</div>
		{#if purgeArmed}
			<p class="hint">
				Deleting truly deletes — every table and this device's settings, nothing
				kept by omission. An export in hand first is the gentle path.
			</p>
		{/if}
		{#if exportNote}<p class="hint">{exportNote}</p>{/if}
		<p class="hint">
			Local-first, always: nothing here ever leaves this device unless you
			export it yourself. No accounts, no cloud, no telemetry, no exceptions.
		</p>
		<details class="weave">
			<summary>How will household devices connect? (coming — the Household Weave)</summary>
			<div class="weave__body">
				<p>
					<strong>The house sees your weather, never your diary.</strong>
					When device-to-device connection arrives, it works by
					<em>absence, not encryption</em>: your private things — spoon
					history, medications, personal tasks, your Sattva notes —
					are never transmitted at all. There is no code path that sends
					them. No cloud, no server, no account, ever.
				</p>
				<ul>
					<li>Devices pair <strong>inside your home network only</strong>, by mutual consent — being in the home is the credential.</li>
					<li>Only what you marked "shared" crosses — and only the shared <em>parts</em>: a bill can sync while its amount stays yours.</li>
					<li>Un-share anything and every other device deletes its copy. The purge truly purges, house-wide.</li>
					<li>Your Sattva protocol's audience holds across devices: people outside your chosen circle never receive it at all.</li>
					<li>Presence stays presence: no device ever keeps a history of another person's signals. The window never becomes a monitor.</li>
				</ul>
				<p>Until then, this device is the household's shared Hearth — one fire, everyone welcome at it.</p>
			</div>
		</details>
	</section>
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
	.section { display: flex; flex-direction: column; gap: 0.6rem; }
	.section h2 { font-size: 0.95rem; color: var(--text-secondary); font-weight: 600; margin: 0; }
	.stack { display: flex; flex-direction: column; gap: 0.5rem; }
	.card { padding: 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); }
	.form { display: flex; flex-direction: column; gap: 0.6rem; }

	.member { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.75rem; border-radius: 10px; background-color: var(--bg-surface); border: 1px solid var(--border-color); min-height: 48px; flex-wrap: wrap; }
	.member__sigil { font-size: 1.1rem; }
	.member__label { color: var(--text); font-weight: 500; }
	.member__kind { color: var(--text-muted); font-size: 0.8rem; }
	.member .soft-btn { margin-left: auto; }

	.add-row { display: flex; gap: 0.5rem; }
	.sigil-input { width: 3.5rem; text-align: center; }
	.label-input { flex: 1; }
	input[type='text'] { padding: 0.6rem 0.7rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; }

	.kind-row, .chip-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.8rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; min-height: 40px; }
	.chip.active { border-color: var(--accent); color: var(--text); background-color: color-mix(in srgb, var(--accent) 15%, var(--bg-surface)); }

	.soft-btn { padding: 0.45rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.85rem; min-height: 40px; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }
	.soft-btn.danger:hover { border-color: #c96f6f; color: #c96f6f; }

	.hint { color: var(--text-muted); font-size: 0.8rem; margin: 0; line-height: 1.5; }

	.weave { color: var(--text-muted); font-size: 0.85rem; }
	.weave summary { cursor: pointer; padding: 0.4rem 0; color: var(--text-secondary); }
	.weave__body { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem 0.25rem 0; line-height: 1.55; }
	.weave__body ul { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; }
	.weave__body p { margin: 0; }
	.weave__body strong { color: var(--text-secondary); }
</style>
