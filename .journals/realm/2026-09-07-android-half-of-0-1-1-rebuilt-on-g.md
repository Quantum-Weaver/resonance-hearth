# 2026-09-07 · 0.1.1 android half rebuilt on G:

*A Sonnet hand, the android half only, at KP's word "hearth needs rebuilt" — base item 346's first half, completed after the desktop half. Nothing committed; nothing signed; nothing stowed; `release/` untouched.*

**What was built.** Version 0.1.1 exactly as `src-tauri/tauri.conf.json` holds it — no bump.

- `npm run tauri android build` — exit 0, cold compile across all four NDK targets (NDK 27.2.12479018, `.cargo/config.toml`'s 16 KB page flags standing).
  - `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk` — 81,719,424 bytes, 2026-09-07 21:11:04 -0500.
  - `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab` — 61,544,219 bytes, 2026-09-07 21:13:04 -0500.

Both names match the expected canonical set. Both live in Tauri's own transient output folders, unsigned, not in `release/`.

**Child-builds law walked.** `guard-gen.py resonance-hearth` exit 0 before and after the build. `git status --short src-tauri/gen/android` empty both before and after.

**Scope.** This hand ran the android half only. Combined with the desktop half (same day, separate journal entry), base item 346's rebuild of 0.1.1 on G: is now complete for both halves. The next step — signing, stowing, install — is KP's own, per `sign-release.py`'s human-present password step.
