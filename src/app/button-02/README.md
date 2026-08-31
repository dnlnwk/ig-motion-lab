# Button 02 — Launch

A playful submit button styled as a rocket about to lift off.

## Flow

1. **Idle** — pill-shaped button reading "Launch!" with a rocket icon that trembles gently and whose flame flickers, primed for liftoff, sitting on a small puff of exhaust cloud.
2. **Launching** — on click, the flame flares brightly, the rocket ship shakes a little harder, then shoots straight up and out of the button, shrinking and fading as it flies into the sky, while the flame and exhaust clouds it leaves behind puff outward and dissipate.
3. **Launched** — the label swaps to "Launched!" with a checkmark.

## Details

- Built with `motion` (`motion/react`): the rocket is a custom inline SVG split into two independently animated layers — a "ship" (nose, window, fins) and a grounded "exhaust" (flame + clouds) — so on launch the ship flies away while the exhaust stays behind and dissipates, instead of the whole icon moving as one rigid unit.
- The ship layer's `animate` target switches between an idle "trembling" keyframe loop and a one-shot "liftoff" keyframe sequence (`y`/`rotate`/`scale`/`opacity`) driven by component state; it travels far enough above the button to read as actually leaving the frame rather than just fading in place.
- The flame flickers continuously at idle, then flares and cuts out on launch; a handful of small circles burst outward from the base at the same moment to sell the ignition/liftoff.
- Label and icon layers are cross-faded with `AnimatePresence`, and the whole sequence respects `prefers-reduced-motion` via motion's `useReducedMotion()` hook (a short, near-instant transition instead of the full flight).

