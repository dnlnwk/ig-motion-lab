# Navigation 02

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/navigation-02-website.webp" style="max-width: 250px; width: 100%;" alt="" />
</p>


A floating glassmorphic bottom navigation bar with a stretch-and-catch-up active-state indicator, plus a separate floating action button.

## Interaction

1. **Idle** — four icon-only tabs sit inside a frosted glass pill; the active tab shows a solid white capsule with its icon and label.
2. **Stretch** — tapping another tab first extends the capsule from its current spot to span both the old and the newly picked tab, like a rubber band reaching out.
3. **Catch up** — the trailing edge then springs forward to catch up with the leading edge, landing the capsule on the new tab with a slight overshoot; the tab flips to its active state (label reveal + icon pop) right as this catch-up begins.
4. **Landing squash** — once the capsule arrives, it does a quick single squash-and-release to sell the impact, instead of a wobbling blob.
5. **Create button** — a separate violet floating action button pulses a soft glow ring to stay visually distinct from the tab group.

## Details

- Selecting a tab runs a two-phase state machine (`stretch` → `settle`): phase one animates `left`/`width` to the bounding box of the old and new tab rects with a fast ease-out; phase two animates from that bounding box to the new tab's rect with a springy overshoot easing, driven by inline `transitionDuration`/`transitionTimingFunction` so each phase gets its own timing.
- A `ResizeObserver` on each tab keeps re-measuring the active tab's rect during the `settle` phase (and while idle), so the capsule keeps chasing the label as its `grid-template-columns` reveal grows the button's width — it's ignored during `stretch` so the bounding box isn't clobbered mid-animation.
- The landing squash is triggered on the indicator's `transitionend` (filtered to the `width` property) rather than a fixed timeout, with a safety-net timer as a fallback.
- The label reveal uses the `0fr` → `1fr` grid-template-columns trick to animate an intrinsic-width element smoothly, avoiding JS text measurement.
- `prefers-reduced-motion` skips the stretch/catch-up sequence entirely and jumps the indicator straight to the target tab.

