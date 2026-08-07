<script lang="ts">
	// The entity card — gentle reminders (KP's rulings, 2026-07-31, held
	// verbatim on the geode's hearth node §⑥b/⑧):
	//   · interactive, expandable; emoji quick-actions in rows, cyclable
	//   · an emoji is a button that does a thing
	//   · color is dynamic — "one of your emojis needs your eyes" — the
	//     vessel's chosen color fading white → yellow → red by percentage
	//   · a second emoji in its danger zone speaks through a thick border
	//   · open card: a small colored circle under each emoji, same journey
	//   · the word, when words appear, is CARE ("Charlie needs care")
	//   · setup from the card itself (Settings holds the other door)
	// Sensory law throughout: no sound, no motion beyond slow color, 48px
	// targets, nothing traps, never color alone (the care line + titles).
	import type { Member, CardActionKind } from '$lib/types/types';
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { signalByState } from '$lib/data/hearth';
	import { cardFace, cardUrgencies, careLine, textOn, DEFAULT_BASE, DEFAULT_APPROACH, journeyColor } from '$lib/data/cardColor';
	import EmojiPicker from '$lib/components/EmojiPicker.svelte';

	let { member }: { member: Member } = $props();

	let open = $state(false);
	let setupOpen = $state(false);
	let pickerOpen = $state(false);
	let medsOpenFor = $state<string | null>(null); // card-action id whose med list is open
	let page = $state(0);
	let quietLine = $state<string | null>(null);

	// The new-action form (setup door one — the card itself).
	let newEmoji = $state('');
	let newLabel = $state('');
	let newKind = $state<CardActionKind>('done');
	let newThingId = $state('');
	let newDays = $state(4);

	const PER_ROW = 5;

	const actions = $derived(hearthStore.actionsFor(member.id));
	const face = $derived(cardFace(member, actions, hearthStore.now));
	const care = $derived(careLine(member, face));
	const ink = $derived(textOn(face.background));
	const urgencies = $derived(cardUrgencies(actions, member.cardColor || DEFAULT_BASE, hearthStore.now));
	const pages = $derived(Math.max(1, Math.ceil(actions.length / PER_ROW)));
	const row = $derived(actions.slice((page % pages) * PER_ROW, (page % pages) * PER_ROW + PER_ROW));
	const signal = $derived(member.kind === 'person' ? hearthStore.signalFor(member.id) : null);
	const isMe = $derived(member.id === hearthStore.deviceMemberId);

	function circleColor(actionId: string): string {
		const u = urgencies.find((x) => x.action.id === actionId);
		return u ? u.color : member.cardColor || DEFAULT_BASE;
	}

	async function tap(actionId: string) {
		const a = actions.find((x) => x.id === actionId);
		if (!a) return;
		if (a.kind === 'take') {
			medsOpenFor = medsOpenFor === actionId ? null : actionId;
			return;
		}
		if (a.kind === 'feeling' && !isMe && member.kind === 'person') {
			quietLine = 'Their feelings are their own to log.';
			return;
		}
		quietLine = await hearthStore.tapCardAction(actionId, hearthStore.deviceMemberId);
	}

	async function takeOne(medId: string) {
		quietLine = await hearthStore.takeMed(medId, 'taken');
	}

	async function addAction() {
		if (!newEmoji) return;
		await hearthStore.addCardAction({
			memberId: member.id,
			emoji: newEmoji,
			label: newLabel.trim() || null,
			kind: newKind,
			thingId: newKind === 'done' ? newThingId || null : null,
			keepsForDays: newKind === 'reset' ? newDays : null,
		});
		newEmoji = ''; newLabel = ''; newThingId = '';
	}

	function sinceLine(): string | null {
		if (!member.arrival) return null;
		return `here since ${new Date(member.arrival).getFullYear()}`;
	}
</script>

<div
	class="card"
	style="background-color: {face.background}; color: {ink}; {face.border ? `box-shadow: inset 0 0 0 4px ${face.border};` : ''}"
>
	<button class="card__head" onclick={() => (open = !open)} aria-expanded={open}>
		<span class="card__sigil">{member.sigil || (member.kind === 'pet' ? '🐾' : '🙂')}</span>
		<span class="card__label">{member.label}</span>
		{#if signal && signal.shared}
			<span
				class="card__dot"
				style="--glow: {signalByState(signal.state).color}"
				title="{signalByState(signal.state).meaning}"
				aria-label="{signalByState(signal.state).meaning}"
			></span>
		{/if}
		{#if care}
			<span class="card__care">{care}</span>
		{/if}
		<span class="card__hint" aria-hidden="true">{open ? '–' : '+'}</span>
	</button>

	{#if open}
		<div class="card__body">
			{#if member.species || member.arrival}
				<p class="card__facts">
					{#if member.species}{member.species}{/if}
					{#if member.species && member.arrival}&nbsp;·&nbsp;{/if}
					{#if member.arrival}{sinceLine()}{/if}
				</p>
			{/if}

			{#if actions.length > 0}
				<div class="actions" role="group" aria-label="{member.label}'s quick actions">
					{#each row as a (a.id)}
						<span class="action">
							<button class="action__btn" title={a.label || a.emoji} aria-label={a.label || a.emoji} onclick={() => tap(a.id)}>
								{a.emoji}
							</button>
							{#if a.label}<span class="action__label">{a.label}</span>{/if}
							<span class="action__circle" style="background-color: {circleColor(a.id)}" aria-hidden="true"></span>
							{#if setupOpen}
								<button class="action__remove" title="remove this one" aria-label="Remove {a.label || a.emoji}" onclick={() => hearthStore.removeCardAction(a.id)}>×</button>
							{/if}
						</span>
					{/each}
					{#if pages > 1}
						<button class="soft-btn" onclick={() => (page = (page + 1) % pages)} aria-label="More of the row">
							more ({(page % pages) + 1}/{pages})
						</button>
					{/if}
				</div>
			{:else}
				<p class="card__facts">No quick actions yet — shape the card below.</p>
			{/if}

			{#if medsOpenFor}
				<div class="meds">
					{#each hearthStore.cardMeds(member.id) as md (md.id)}
						<div class="med">
							<span class="med__label">{md.label}</span>
							<span class="med__note">{hearthStore.medTakenToday(md.id) ? 'taken today' : 'quietly asking'}</span>
							<button class="soft-btn" onclick={() => takeOne(md.id)}>taken</button>
						</div>
					{:else}
						<p class="card__facts">Nothing here to take — meds live in the Care room.</p>
					{/each}
				</div>
			{/if}

			{#if quietLine}<p class="quiet" aria-live="polite">{quietLine}</p>{/if}

			<div class="card__foot">
				<button class="soft-btn" onclick={() => (setupOpen = !setupOpen)} aria-expanded={setupOpen}>
					{setupOpen ? 'done shaping' : 'shape this card'}
				</button>
			</div>

			{#if setupOpen}
				<div class="setup">
					<div class="setup__row">
						<button class="action__btn picker-door" onclick={() => (pickerOpen = !pickerOpen)} aria-label="Choose an emoji">
							{newEmoji || '＋'}
						</button>
						<input type="text" bind:value={newLabel} placeholder="a word under it (optional)" aria-label="Optional label" />
					</div>
					{#if pickerOpen}
						<EmojiPicker category={newKind} onpick={(e) => { newEmoji = e; pickerOpen = false; }} onclose={() => (pickerOpen = false)} />
					{/if}
					<div class="setup__row chips" role="group" aria-label="What the tap does">
						<button class="chip" class:active={newKind === 'done'} onclick={() => (newKind = 'done')}>marks a thing done</button>
						<button class="chip" class:active={newKind === 'reset'} onclick={() => (newKind = 'reset')}>starts a freshness window</button>
						<button class="chip" class:active={newKind === 'take'} onclick={() => (newKind = 'take')}>opens the meds</button>
						<button class="chip" class:active={newKind === 'feeling'} onclick={() => (newKind = 'feeling')}>logs a feeling</button>
					</div>
					{#if newKind === 'done'}
						<select bind:value={newThingId} aria-label="Which thing it completes">
							<option value="">choose the thing it completes…</option>
							{#each hearthStore.things as t (t.id)}
								<option value={t.id}>{t.title}</option>
							{/each}
						</select>
					{/if}
					{#if newKind === 'reset'}
						<label class="setup__days">
							keeps for
							<input type="number" min="0.5" step="0.5" bind:value={newDays} aria-label="Days the window keeps" />
							days — the color walks toward care as it ages
						</label>
					{/if}
					<button class="soft-btn primary" onclick={addAction} disabled={!newEmoji || (newKind === 'done' && !newThingId)}>
						add it to the card
					</button>

					<div class="setup__row">
						<label class="setup__color">
							the card's color
							<input
								type="color"
								value={member.cardColor || DEFAULT_BASE}
								onchange={(ev) => hearthStore.setMemberCard(member.id, { cardColor: (ev.currentTarget as HTMLInputElement).value })}
								aria-label="The card's base color"
							/>
						</label>
						<label class="setup__lead">
							color follows
							<select
								value={member.colorSource}
								onchange={(ev) => hearthStore.setMemberCard(member.id, { colorSource: (ev.currentTarget as HTMLSelectElement).value })}
								aria-label="Which emoji drives the card's color"
							>
								<option value="first">whichever needs eyes first</option>
								{#each actions.filter((a) => a.kind === 'reset') as a (a.id)}
									<option value={a.id}>{a.emoji} {a.label || ''}</option>
								{/each}
							</select>
						</label>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.card {
		border-radius: 14px;
		border: 1px solid var(--border-color);
		transition: background-color 2s linear, box-shadow 2s linear;
		overflow: hidden;
	}
	.card__head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.65rem 0.85rem;
		min-height: 52px;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		text-align: left;
	}
	.card__sigil { font-size: 1.25rem; flex-shrink: 0; }
	.card__label { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
	.card__dot {
		width: 12px; height: 12px; border-radius: 50%;
		background-color: var(--glow); box-shadow: 0 0 6px var(--glow);
		flex-shrink: 0;
	}
	.card__care { margin-left: auto; font-size: 0.85rem; font-weight: 500; flex-shrink: 0; }
	.card__hint { margin-left: 0.35rem; opacity: 0.7; flex-shrink: 0; }
	.card__care + .card__hint { margin-left: 0.5rem; }
	.card__body { padding: 0 0.85rem 0.85rem; display: flex; flex-direction: column; gap: 0.6rem; }
	.card__facts { margin: 0; font-size: 0.85rem; opacity: 0.85; }

	.actions { display: flex; align-items: flex-start; gap: 0.35rem; flex-wrap: wrap; }
	.action { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; position: relative; }
	.action__btn {
		min-width: 52px; min-height: 52px; font-size: 1.5rem; line-height: 1;
		border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
		border-radius: 12px; background: color-mix(in srgb, currentColor 8%, transparent);
		cursor: pointer; color: inherit;
	}
	.action__label { font-size: 0.7rem; opacity: 0.85; max-width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.action__circle {
		width: 10px; height: 10px; border-radius: 50%;
		transition: background-color 2s linear;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
	}
	.action__remove {
		position: absolute; top: -6px; right: -6px;
		width: 22px; height: 22px; border-radius: 50%;
		border: 1px solid var(--border-color); background-color: var(--bg-surface);
		color: var(--text-secondary); cursor: pointer; line-height: 1;
	}

	.meds { display: flex; flex-direction: column; gap: 0.4rem; }
	.med {
		display: flex; align-items: center; gap: 0.5rem;
		padding: 0.4rem 0.6rem; border-radius: 10px;
		background: color-mix(in srgb, currentColor 8%, transparent);
		min-height: 44px;
	}
	.med__label { font-weight: 500; }
	.med__note { font-size: 0.8rem; opacity: 0.8; margin-left: auto; }

	.quiet { margin: 0; font-size: 0.85rem; opacity: 0.9; }

	.card__foot { display: flex; }
	.soft-btn {
		padding: 0.4rem 0.8rem; border-radius: 999px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: none; color: inherit; cursor: pointer; font-size: 0.85rem; min-height: 40px;
	}
	.soft-btn.primary { background: color-mix(in srgb, currentColor 12%, transparent); font-weight: 600; }
	.soft-btn:disabled { opacity: 0.45; cursor: default; }

	.setup { display: flex; flex-direction: column; gap: 0.55rem; }
	.setup__row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.setup input[type='text'], .setup select, .setup input[type='number'] {
		padding: 0.5rem 0.6rem; border-radius: 8px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: color-mix(in srgb, currentColor 6%, transparent);
		color: inherit; font-size: 0.9rem; min-height: 44px;
	}
	.setup input[type='text'] { flex: 1; }
	.setup input[type='number'] { width: 4.5rem; }
	.picker-door { font-size: 1.3rem; }
	.chips { gap: 0.35rem; }
	.chip {
		padding: 0.4rem 0.7rem; border-radius: 999px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: none; color: inherit; cursor: pointer; font-size: 0.8rem; min-height: 40px;
	}
	.chip.active { background: color-mix(in srgb, currentColor 14%, transparent); font-weight: 600; }
	.setup__days { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; flex-wrap: wrap; }
	.setup__color, .setup__lead { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }
	.setup__color input[type='color'] { width: 48px; height: 40px; border: none; background: none; padding: 0; cursor: pointer; }

	@media (prefers-reduced-motion: reduce) {
		.card, .action__circle { transition: none; }
	}
</style>
