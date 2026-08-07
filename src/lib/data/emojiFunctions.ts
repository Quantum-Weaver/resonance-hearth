// The function shelves — the narrowed offering (KP's ⚛ ruling, 2026-08-06,
// superseding the 07-31 full-set ruling by its own author): "i also want
// to narror the emoji set… we simply narrow it to a certain amount per
// category" · "categories should be based on the thing we want the emoji
// press to trigger, the type of funtioin it is." Twenty per category —
// his stroke — with his named emojis among them (the poultry leg, cat,
// dog, dna, rainbow, unicorn, wizard, man, woman, pill, calendar, and
// the colored dots).
//
// The vessel-brings-the-meaning law is untouched: a shelf narrows the
// OFFERING, never the vocabulary — the picker's search still reaches
// every emoji, and the lexicon may give any emoji any meaning.

export interface FunctionShelf {
	id: 'done' | 'take' | 'reset' | 'feeling' | 'sigil';
	label: string;
	emojis: { e: string; n: string }[];
}

export const FUNCTION_SHELVES: FunctionShelf[] = [
	{
		id: 'done',
		label: 'marks a thing done',
		emojis: [
			{ e: '✅', n: 'check mark' },
			{ e: '🍗', n: 'poultry leg' },
			{ e: '🍽️', n: 'plate with cutlery' },
			{ e: '🥣', n: 'bowl with spoon' },
			{ e: '🧹', n: 'broom' },
			{ e: '🧽', n: 'sponge' },
			{ e: '🧺', n: 'laundry basket' },
			{ e: '🧼', n: 'soap' },
			{ e: '🗑️', n: 'wastebasket' },
			{ e: '🛁', n: 'bathtub' },
			{ e: '🚿', n: 'shower' },
			{ e: '🪥', n: 'toothbrush' },
			{ e: '🦴', n: 'bone' },
			{ e: '🌱', n: 'seedling' },
			{ e: '💧', n: 'droplet' },
			{ e: '🔧', n: 'wrench' },
			{ e: '📦', n: 'package' },
			{ e: '🛏️', n: 'bed' },
			{ e: '🪣', n: 'bucket' },
			{ e: '✨', n: 'sparkles' }
		]
	},
	{
		id: 'take',
		label: 'opens the meds / an intake',
		emojis: [
			{ e: '💊', n: 'pill' },
			{ e: '💉', n: 'syringe' },
			{ e: '🩹', n: 'adhesive bandage' },
			{ e: '🧴', n: 'lotion bottle' },
			{ e: '🌡️', n: 'thermometer' },
			{ e: '🩺', n: 'stethoscope' },
			{ e: '🥛', n: 'glass of milk' },
			{ e: '🚰', n: 'potable water' },
			{ e: '☕', n: 'hot beverage' },
			{ e: '🍵', n: 'teacup' },
			{ e: '🥤', n: 'cup with straw' },
			{ e: '🍎', n: 'red apple' },
			{ e: '🥗', n: 'green salad' },
			{ e: '🍌', n: 'banana' },
			{ e: '🥕', n: 'carrot' },
			{ e: '🧘', n: 'person in lotus position' },
			{ e: '🚶', n: 'person walking' },
			{ e: '🛌', n: 'person in bed' },
			{ e: '⏲️', n: 'timer clock' },
			{ e: '🫁', n: 'lungs' }
		]
	},
	{
		id: 'reset',
		label: 'starts a freshness window',
		emojis: [
			{ e: '🔄', n: 'counterclockwise arrows' },
			{ e: '📅', n: 'calendar' },
			{ e: '🗓️', n: 'spiral calendar' },
			{ e: '⏰', n: 'alarm clock' },
			{ e: '⌛', n: 'hourglass done' },
			{ e: '⏳', n: 'hourglass not done' },
			{ e: '🔁', n: 'repeat' },
			{ e: '🌅', n: 'sunrise' },
			{ e: '🌙', n: 'crescent moon' },
			{ e: '🕯️', n: 'candle' },
			{ e: '🧊', n: 'ice' },
			{ e: '🥩', n: 'cut of meat' },
			{ e: '🥫', n: 'canned food' },
			{ e: '🧃', n: 'beverage box' },
			{ e: '🌸', n: 'cherry blossom' },
			{ e: '🍂', n: 'fallen leaf' },
			{ e: '💦', n: 'sweat droplets' },
			{ e: '🧯', n: 'fire extinguisher' },
			{ e: '🔋', n: 'battery' },
			{ e: '🪫', n: 'low battery' }
		]
	},
	{
		id: 'feeling',
		label: 'logs a feeling',
		emojis: [
			{ e: '🔴', n: 'red circle' },
			{ e: '🟠', n: 'orange circle' },
			{ e: '🟡', n: 'yellow circle' },
			{ e: '🟢', n: 'green circle' },
			{ e: '🔵', n: 'blue circle' },
			{ e: '🟣', n: 'purple circle' },
			{ e: '🟤', n: 'brown circle' },
			{ e: '⚫', n: 'black circle' },
			{ e: '⚪', n: 'white circle' },
			{ e: '🌈', n: 'rainbow' },
			{ e: '☀️', n: 'sun' },
			{ e: '🌧️', n: 'cloud with rain' },
			{ e: '⛈️', n: 'cloud with lightning and rain' },
			{ e: '🌫️', n: 'fog' },
			{ e: '🌊', n: 'water wave' },
			{ e: '😊', n: 'smiling face' },
			{ e: '😴', n: 'sleeping face' },
			{ e: '😢', n: 'crying face' },
			{ e: '🤗', n: 'smiling face with open hands' },
			{ e: '💜', n: 'purple heart' }
		]
	},
	{
		id: 'sigil',
		label: 'a sigil — who you are',
		emojis: [
			{ e: '🧙', n: 'wizard' },
			{ e: '🦄', n: 'unicorn' },
			{ e: '🐱', n: 'cat face' },
			{ e: '🐶', n: 'dog face' },
			{ e: '🧬', n: 'dna' },
			{ e: '👨', n: 'man' },
			{ e: '👩', n: 'woman' },
			{ e: '🧑', n: 'person' },
			{ e: '🙂', n: 'slightly smiling face' },
			{ e: '🐾', n: 'paw prints' },
			{ e: '⭐', n: 'star' },
			{ e: '🌟', n: 'glowing star' },
			{ e: '🔥', n: 'fire' },
			{ e: '🌻', n: 'sunflower' },
			{ e: '🦊', n: 'fox' },
			{ e: '🐢', n: 'turtle' },
			{ e: '🎸', n: 'guitar' },
			{ e: '🎨', n: 'artist palette' },
			{ e: '📚', n: 'books' },
			{ e: '⚛️', n: 'atom symbol' }
		]
	}
];

export function shelfFor(id: string | null | undefined): FunctionShelf | null {
	if (!id) return null;
	return FUNCTION_SHELVES.find((s) => s.id === id) ?? null;
}
