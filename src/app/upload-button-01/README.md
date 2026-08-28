# Upload Button 01

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/upload-button-01-website.webp" style="max-width: 250px; width: 100%;" alt="" />
</p>


A pill-shaped upload button that morphs into a circular progress indicator.

## Flow

1. **Idle** — pill-shaped button reading "Upload file".
2. **Uploading** — on click, the button morphs into a circle; a ring traces around its edge to show progress while the upload icon gently bobs in the center.
3. **Success** — once the ring completes, it fades out and a checkmark scales in with a spring while its stroke draws itself in, plus a radar/ping ring pulses outward behind the button.
4. **Done** — the circle expands back into a pill reading "Uploaded" and stays in that final state.

## Details

- Built with `framer-motion`: the pill ↔ circle width morph is an animated `width` value using two different spring transitions — a well-damped, non-bouncy spring when shrinking into the circle, and a slightly bouncier one when expanding back into the pill — and icon/label swaps use `AnimatePresence` for crossfades.
- Progress is driven by a single `useMotionValue` animated imperatively via `animate()` through a multi-segment keyframe easing curve (quick start → steady middle → quick finish) rather than one flat easing curve, so the fill feels less mechanically linear. It's mapped to the ring's `strokeDashoffset` with `useTransform` so the SVG circle fills in sync with the (simulated) upload duration.
- The ring SVG is rotated -90° so the stroke starts at 12 o'clock and sweeps clockwise, matching the visual convention of upload/progress indicators.
- The checkmark is an inline SVG `path` animated via framer-motion's `pathLength` (0 → 1) for a draw-in effect, layered inside a container that also scales/fades in with a spring.
- Idle/uploading/success/done content layers are all stacked absolutely inside the button and cross-faded by opacity/`AnimatePresence`, so the button's own width animation is the only thing driving layout change — no reflow of sibling content.