<script lang="ts">
	// THE MANTEL — where the household places notes about its life for
	// the others to see and answer. (KP's pour, 2026-08-06, the
	// communications sitting's first built piece; the name his ⚛ word:
	// "yes the mantel".)
	//
	// PLACEMENT IS THE OPT-IN: writing a note here IS the consent —
	// nothing arrives by push; the household sees what stands when they
	// visit. Cards wear their kind's color (KP's stroke) and the owner's
	// sigil (his stroke). The author's note stays the author's —
	// removable by their own hand; its comments rest with it. No counts,
	// no scoreboard, nothing times out.
	import { hearthStore } from '$lib/stores/hearth.svelte';
	import { QUANTUM_COLORS } from '$lib/cosmic';
	import type { MantelKind } from '$lib/types/types';

	// The kinds and their light — color-coded by the type of thing.
	const KIND_DRESS: Record<MantelKind, { color: string; emoji: string; word: string }> = {
		note: { color: QUANTUM_COLORS['cosmic.blue'], emoji: '📝', word: 'a note' },
		win: { color: QUANTUM_COLORS['hearth.gold'], emoji: '✨', word: 'a win' },
		ask: { color: QUANTUM_COLORS['sanctuary.green'], emoji: '🙋', word: 'an ask' },
		idea: { color: QUANTUM_COLORS['quantum.purple'], emoji: '💡', word: 'an idea' }
	};
	const KINDS = Object.keys(KIND_DRESS) as MantelKind[];

	const me = $derived(hearthStore.me);

	// ——— placing ———
	let newKind = $state<MantelKind>('note');
	let newText = $state('');
	let newEmoji = $state('');

	async function place() {
		if (!me || !newText.trim()) return;
		await hearthStore.placeMantelNote(me.id, newKind, newText.trim(), newEmoji.trim() || null);
		newText = '';
		newEmoji = '';
	}

	// ——— answering ———
	let commentFor = $state<string | null>(null);
	let commentText = $state('');
	let commentEmoji = $state('');

	function openComment(noteId: string) {
		commentFor = commentFor === noteId ? null : noteId;
		commentText = '';
		commentEmoji = '';
	}

	async function answer(noteId: string) {
		if (!me) return;
		const text = commentText.trim() || null;
		const emoji = commentEmoji.trim() || null;
		if (!text && !emoji) return;
		await hearthStore.addMantelComment(noteId, me.id, text, emoji);
		commentFor = null;
		commentText = '';
		commentEmoji = '';
	}

	function sigilOf(memberId: string): string {
		const m = hearthStore.memberById(memberId);
		return m?.sigil || (m?.kind === 'pet' ? '🐾' : '🙂');
	}
	function labelOf(memberId: string): string {
		return hearthStore.memberById(memberId)?.label ?? 'someone';
	}

	function softDate(ts: number): string {
		const d = new Date(ts);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (ts >= today.getTime()) return 'today';
		if (ts >= today.getTime() - 86_400_000) return 'yesterday';
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}
</script>

<svelte:head><title>The Mantel</title></svelte:head>

<div class="page">
	<header class="page__head">
		<h1>The Mantel</h1>
		<p class="sub">
			What the household places to be seen — in each of our own words,
			answered gently, never pushed.
		</p>
	</header>

	<!-- Placing — the act of placing is the opt-in -->
	{#if me}
		<section class="card form">
			<div class="chip-row" role="group" aria-label="What kind of thing is this?">
				{#each KINDS as k}
					<button
						class="chip"
						class:active={newKind === k}
						style="--kind: {KIND_DRESS[k].color}"
						onclick={() => (newKind = k)}
					>
						{KIND_DRESS[k].emoji} {KIND_DRESS[k].word}
					</button>
				{/each}
			</div>
			<div class="add-row">
				<input type="text" bind:value={newEmoji} placeholder="🙂" class="sigil-input" maxlength="4" aria-label="An emoji for it (optional)" />
				<input
					type="text"
					bind:value={newText}
					placeholder="place something for the household…"
					class="text-input"
					onkeydown={(e) => { if (e.key === 'Enter') place(); }}
					aria-label="Your note"
				/>
				<button class="soft-btn primary" onclick={place} disabled={!newText.trim()}>place it</button>
			</div>
		</section>
	{:else}
		<p class="quiet-line">
			The Mantel knows the hand that places — choose whose device this is
			in Settings, and the shelf opens.
		</p>
	{/if}

	<!-- The shelf -->
	{#if hearthStore.mantelNotes.length === 0}
		<p class="quiet-line">The mantel is clear — whatever is placed first, the household will see it here.</p>
	{:else}
		<div class="stack">
			{#each hearthStore.mantelNotes as n (n.id)}
				{@const dress = KIND_DRESS[n.kind] ?? KIND_DRESS.note}
				{@const comments = hearthStore.commentsFor(n.id)}
				<article class="note" style="--kind: {dress.color}">
					<div class="note__head">
						<span class="note__sigil" title={labelOf(n.memberId)}>{sigilOf(n.memberId)}</span>
						<span class="note__owner">{labelOf(n.memberId)}</span>
						<span class="note__kind">{dress.emoji} {dress.word}</span>
						<span class="note__when">{softDate(n.ts)}</span>
						{#if me && n.memberId === me.id}
							<button class="note__remove" onclick={() => hearthStore.removeMantelNote(n.id)} aria-label="Take this note down">×</button>
						{/if}
					</div>
					<p class="note__text">{#if n.emoji}<span class="note__emoji">{n.emoji}</span> {/if}{n.text}</p>

					{#if comments.length > 0}
						<div class="answers">
							{#each comments as c (c.id)}
								<div class="answer">
									<span class="answer__sigil" title={labelOf(c.memberId)}>{sigilOf(c.memberId)}</span>
									{#if c.emoji}<span class="answer__emoji">{c.emoji}</span>{/if}
									{#if c.text}<span class="answer__text">{c.text}</span>{/if}
									{#if me && c.memberId === me.id}
										<button class="note__remove small" onclick={() => hearthStore.removeMantelComment(c.id)} aria-label="Take your answer back">×</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					{#if me}
						{#if commentFor === n.id}
							<div class="add-row">
								<input type="text" bind:value={commentEmoji} placeholder="🙂" class="sigil-input" maxlength="4" aria-label="An emoji (optional)" />
								<input
									type="text"
									bind:value={commentText}
									placeholder="answer in your own words…"
									class="text-input"
									onkeydown={(e) => { if (e.key === 'Enter') answer(n.id); }}
									aria-label="Your answer"
								/>
								<button class="soft-btn" onclick={() => answer(n.id)} disabled={!commentText.trim() && !commentEmoji.trim()}>answer</button>
							</div>
						{:else}
							<button class="ghost" onclick={() => openComment(n.id)}>answer</button>
						{/if}
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page { padding: 1.25rem; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.1rem; }
	.page__head h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
	.sub { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }

	.quiet-line { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0; line-height: 1.5; }
	.stack { display: flex; flex-direction: column; gap: 0.6rem; }

	.card { padding: 0.9rem 1rem; border-radius: 12px; background-color: var(--bg-surface); border: 1px solid var(--border-color); }
	.form { display: flex; flex-direction: column; gap: 0.6rem; }

	.chip-row { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
	.chip { padding: 0.45rem 0.9rem; border-radius: 999px; border: 1.5px solid color-mix(in srgb, var(--kind) 40%, var(--border-color)); background: none; color: var(--text-secondary); cursor: pointer; min-height: 40px; font-size: 0.85rem; }
	.chip.active { border-color: var(--kind); color: var(--text); background-color: color-mix(in srgb, var(--kind) 14%, var(--bg-surface)); }

	.add-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.sigil-input { width: 3.5rem; text-align: center; }
	.text-input { flex: 1; min-width: 160px; }
	input[type='text'] { padding: 0.6rem 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg); color: var(--text); font-size: 0.95rem; min-height: 44px; box-sizing: border-box; }
	input[type='text']:focus { border-color: var(--accent); outline: none; }

	.note {
		padding: 0.8rem 0.9rem;
		border-radius: 12px;
		background-color: color-mix(in srgb, var(--kind) 6%, var(--bg-surface));
		border: 1px solid color-mix(in srgb, var(--kind) 30%, var(--border-color));
		border-left: 4px solid var(--kind);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.note__head { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.note__sigil { font-size: 1.35rem; line-height: 1; }
	.note__owner { color: var(--text); font-weight: 600; font-size: 0.9rem; }
	.note__kind { color: color-mix(in srgb, var(--kind) 70%, var(--text)); font-size: 0.78rem; }
	.note__when { margin-left: auto; color: var(--text-muted); font-size: 0.78rem; }
	.note__remove { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; min-width: 36px; min-height: 36px; }
	.note__remove:hover { color: var(--text); }
	.note__remove.small { min-width: 28px; min-height: 28px; font-size: 0.85rem; margin-left: auto; }
	.note__text { color: var(--text); font-size: 0.95rem; line-height: 1.55; margin: 0; }
	.note__emoji { font-size: 1.05rem; }

	.answers { display: flex; flex-direction: column; gap: 0.35rem; border-top: 1px solid color-mix(in srgb, var(--kind) 20%, var(--border-color)); padding-top: 0.5rem; }
	.answer { display: flex; align-items: center; gap: 0.45rem; color: var(--text-secondary); font-size: 0.88rem; min-height: 32px; flex-wrap: wrap; }
	.answer__sigil { font-size: 1.05rem; line-height: 1; }
	.answer__emoji { font-size: 1rem; }
	.answer__text { line-height: 1.45; }

	.soft-btn { padding: 0.5rem 1rem; border-radius: 999px; border: 1px solid var(--border-color); background: none; color: var(--text-secondary); cursor: pointer; font-size: 0.88rem; min-height: 44px; flex-shrink: 0; }
	.soft-btn:hover { border-color: var(--accent); color: var(--text); }
	.soft-btn.primary { background-color: var(--accent); border-color: var(--accent); color: #fff; }
	.soft-btn:disabled { opacity: 0.5; cursor: default; }

	.ghost { background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline; align-self: flex-start; padding: 0.25rem 0; }
	.ghost:hover { color: var(--text-secondary); }
</style>
