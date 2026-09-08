# 2026-09-07 · 0.1.1 desktop half rebuilt on G:

*A Sonnet hand, the desktop half only, at KP's word "hearth needs rebuilt" — base item 346's first half, redone after the house moved to G: on 2026-09-06. Nothing committed; nothing signed; nothing stowed; `release/` untouched.*

**What was built.** Version 0.1.1 exactly as `src-tauri/tauri.conf.json` holds it — no bump.

- `npm run tauri build` — exit 0, cold release compile (~2m24s).
  - `src-tauri/target/release/bundle/msi/Resonance Hearth_0.1.1_x64_en-US.msi` — 14,958,592 bytes, 2026-09-07 21:00:00 -0500.
  - `src-tauri/target/release/bundle/nsis/Resonance Hearth_0.1.1_x64-setup.exe` — 13,873,291 bytes, 2026-09-07 21:00:13 -0500.

Both names match the expected canonical set. Both live in Tauri's own transient bundle folder, unsigned, not in `release/`.

**Child-builds law walked.** `guard-gen.py resonance-hearth` exit 0 before and after the build. `git status --short src-tauri/gen/android` empty both times — the android tree was untouched by this desktop-only build.

**Scope.** This hand ran the desktop half only, as directed. The android half of item 346's rebuild is not covered by this entry.
