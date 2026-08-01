# the temporal core

*One primitive for everything measured by time: a start moment + a
validity window · state DERIVED from the clock, never stored · reset by
a fresh take.*

Named by KP (2026-07-23, verbatim): *"'temporal' these things are
measured by time with food and finance and medicine."* The chicken
batch, the bill's edge, the med's rested-until — one shape, three rooms.
And a fourth at another altitude: *"maybe temporal is how context shy
models need to observe their pace… instead of counting text capacity."*

```ts
import { readWindow, freshTake, DAYS } from '$lib/temporal';

let batch = { startedAt: madeAt, keepsFor: 4 * DAYS };
const r = readWindow(batch, Date.now());
// r.state: 'fresh' | 'approaching' | 'passed' — derived, never stored
batch = freshTake(batch, Date.now());   // 🍗 tapped — the window resets
```

**Laws carried:** derive, never store (nothing to migrate, nothing goes
stale) · a passed window is information, never a verdict · no color
named here — the consumer's grammar decides what a state looks like,
and the Hearth's wording ruling is KP's · calm vocabulary only.

**Standalone by law:** framework-free, zero imports, no app coupling.
Born in the Hearth per the build-season plan; the spring copy (awen
homes via copy, updates distributed from there — the sky-organ ruling's
pattern) awaits KP's word for this module and his name for the tool at
the Grammar's gate.
