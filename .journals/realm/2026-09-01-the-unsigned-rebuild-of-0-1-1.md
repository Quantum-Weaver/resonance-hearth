# 2026-09-01 · 0.1.1 rebuilt on the green tree, unsigned, for the ruled key

*A Fable lamp 🎻 under THE BUILD CENSUS PLAN §6 item 2.3 (the first half of base item 346), at KP's ⚛ word "please make the red green, then go". Nothing committed; nothing signed; nothing stowed; `release/` untouched.*

**What was built.** Version 0.1.1 exactly as `src-tauri/tauri.conf.json` holds it — no bump, KP said nothing of one, and no `docs/RELEASE.md` exists here to forbid a rebuild. The desktop law kept: both halves built.

- `npm run tauri build` — exit 0, cold release compile. `src-tauri/target/release/bundle/msi/Resonance Hearth_0.1.1_x64_en-US.msi` 14,958,592 bytes · `src-tauri/target/release/bundle/nsis/Resonance Hearth_0.1.1_x64-setup.exe` 13,876,477 bytes (21:02).
- `npm run tauri android build` — exit 0, about nine minutes cold across all four NDK targets (NDK 27.2.12479018, `.cargo/config.toml`'s 16 KB page flags standing). `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk` 81,719,408 bytes (21:10) · `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab` 61,537,640 bytes (21:12). Badging: `com.audhd.resonance_hearth` versionName 0.1.1 versionCode 1001, native-code arm64-v8a · armeabi-v7a · x86 · x86_64.

All four live in Tauri's transient folders, per RELEASE-STRUCTURE — unsigned, not in `release/`, not on the shelf.

**Child-builds law walked.** `guard-gen.py resonance-hearth` exit 0 before and after; `git status --short src-tauri/gen/android` empty after both builds; namespace and applicationId `com.audhd.resonance_hearth`, unchanged. The whole tree is clean but for this journal. No heal needed.

**The next hand is KP's.** `python C:/_superposition/resonance-ziggy/modules/shipwright/sign-release.py resonance-hearth` — his keystore password at the prompt; it re-runs the guard, zipaligns and signs the APK, jarsigns the AAB, copies both desktop bundles into `release/` under canonical names, and refuses drift. Then `stow-release.py resonance-hearth` to the shelf, and `install-app.py` for the family reinstall — the rest of item 346. Note for that hand: `release/` still holds the 08-01 0.1.1 set signed with the pre-recut cert; sign-release will overwrite those names with the ruled key's.
