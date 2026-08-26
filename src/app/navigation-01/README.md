# Navigation 01

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/navigation-01-website.webp" style="max-width: 250px; width: 100%;" alt="" />
</p>


A floating glassmorphic bottom navigation bar with a liquid active-state indicator, plus a separate floating action button.

## Interaction

1. **Idle** — four icon-only tabs sit inside a frosted glass pill; the active tab shows a solid white capsule with its icon and label.
2. **Switching tabs** — the white capsule slides and resizes to the newly selected tab in one continuous motion, chasing the label as it expands/collapses via a `grid-template-columns` width animation.
3. **Icon feedback** — the icon of the newly active tab pops in with a small overshoot bounce to reinforce the selection.
4. **Create button** — a separate violet floating action button pulses a soft glow ring to stay visually distinct from the tab group.

## Details

- The indicator's `left`/`width` are measured from the active button via `offsetLeft`/`offsetWidth` and animated with an elastic easing on position and a calmer easing on width, so the pill glides and settles like a liquid blob instead of a linear slide.
- A `ResizeObserver` on each tab re-measures the indicator continuously while the label's `grid-template-columns` transition runs, keeping the capsule perfectly synced to the growing/shrinking label instead of jumping to its final size.
- The label reveal uses the `0fr` → `1fr` grid-template-columns trick to animate an intrinsic-width element smoothly, avoiding JS text measurement.
- All animations respect `prefers-reduced-motion`.
