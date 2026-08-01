# the sky organs

*moon-phases · ancient-holidays · planets-alignment — the sky, computed
offline, forever. Facts and traditional names only; no meanings shipped
(KP's ruling: the material that inspired this room inspires concepts,
never words — what the sky means is the family's own).*

```ts
import { readSky } from '$lib/sky';

const sky = readSky(new Date());
sky.moon;      // 🌖 phase name · illumination · age · days to full/new
sky.season;    // after which spoke, next turning and its distance
sky.planets;   // each wanderer's sign (±a few degrees, perspective-grade)
sky.meetings;  // wanderers standing together (within the orb)
```

**Accuracy, honest:** moon to ~hours; solstices/equinoxes to ~minutes
(Meeus); planets to a few degrees (mean elements). Perspective-grade,
never telescope-grade — the sky as a calendar of moments, not an
instrument. **Retroactive by design:** any timestamp, past or future,
answers the same — perspectives attach backward as easily as forward.

**Provenance:** ported whole from the working proof (`sky.py`, lane B,
2026-07-30), verified against it on the same date. **Homing (KP's
ruling, 2026-07-31):** built in the Hearth; **awen homes these organs
via copy, maintained and updates distributed from the spring** — the
copy travels when KP names the tool at the Grammar's gate.

**Standalone by law:** framework-free, zero imports, no app coupling.
