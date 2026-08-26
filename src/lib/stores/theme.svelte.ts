import { DEFAULT_THEME, PRESET_THEMES } from '$lib/theme/theme';
import type { ThemeConfig, TintLevel } from '$lib/types/types';

const STORAGE_KEY = 'resonance-hearth-theme';

const HEARTH_DEFAULT: ThemeConfig = {
	...DEFAULT_THEME,
	accentColor: PRESET_THEMES.warm.accentColor,
	presetName: PRESET_THEMES.warm.presetName
};

let config = $state<ThemeConfig>({ ...HEARTH_DEFAULT });

function persist() {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	}
}

export const themeStore = {
	get config() {
		return config;
	},
	loadTheme() {
		if (typeof localStorage === 'undefined') return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;
		try {
			// Merged over the default so a config saved before a field existed keeps working.
			config = { ...HEARTH_DEFAULT, ...(JSON.parse(stored) as Partial<ThemeConfig>) };
		} catch {
			config = { ...HEARTH_DEFAULT };
		}
	},
	/**
	 * Take a preset's COLOUR only. Display mode, font size and tint are the
	 * reader's own choices and survive untouched - the one exception being a
	 * preset that declares a mode because its identity IS a mode (AMOLED).
	 */
	setPreset(presetName: string) {
		const preset = PRESET_THEMES[presetName];
		if (!preset) return;
		config = {
			...config,
			accentColor: preset.accentColor,
			presetName: preset.presetName,
			...(preset.mode ? { mode: preset.mode } : {})
		};
		persist();
	},
	setMode(mode: 'dark' | 'light' | 'amoled') {
		config = { ...config, mode };
		persist();
	},
	setFontSize(size: 'small' | 'medium' | 'large') {
		config = { ...config, fontSize: size };
		persist();
	},
	setTint(tint: TintLevel) {
		config = { ...config, tint };
		persist();
	}
};
