# Navigation 03

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/navigation-03-website.webp" style="max-width: 250px; width: 100%;" alt="" />
</p>

A floating glassmorphic bottom navigation bar with a liquid, goo-blended active-state indicator.

## Interaction

1. **Idle** — four tabs (icon above, label below, both always visible) sit inside a frosted glass pill; the active tab shows a solid white circle behind its icon, and the pill itself bulges around it.
2. **Select** — tapping another tab glides the circle directly there along a springy, slightly overshooting ease. It never stretches into an oval, it stays a perfect circle the whole time.
3. **Bulge** — the flat glass pill locally pushes outward, up and down, to wrap around the circle wherever it currently sits, blending smoothly into a single liquid silhouette instead of a hard-edged shape.
4. **Color pop** — the tab flips to its active color (violet icon/label on white) the instant it's tapped, rather than waiting for the indicator to visually arrive.

## Details

- The indicator is a fixed-diameter circle centered on each tab's icon rather than a capsule matching the tab's full width. Its center is derived from the tab button's measured rect (`left + width / 2`); only `left` is ever animated, width stays constant, so it's always a perfect circle — never an oval.
- The pill background itself is flat (60px tall) everywhere except around the indicator, where it bulges up and down to make room for the larger circle — a "goo"/metaball effect. Two SVG `<mask>`s (one for the border rim, one for the glass fill) each combine a flat base `<rect>` spanning the full width with a second `<rect>` sharing the indicator's own `left`/width, both passed through an SVG `feGaussianBlur` + `feColorMatrix` filter (the classic gooey blend) so the two shapes visually melt into one smooth silhouette instead of a hard-edged union.
- Applying the goo filter directly to the visible glass layer would wreck its translucency (blur/contrast crush the subtle alpha). Instead the filter only computes a black/white silhouette inside the `<mask>`s; the actual `bg-white/10 backdrop-blur-xl` glass `div` and the `bg-white/25` border-rim `div` stay untouched and are simply cropped to that silhouette via `mask-image`/`-webkit-mask-image`. The border rim is a second layer using the same shapes inflated by ~1.5px, peeking out from behind the fill layer as a ~1.5px stroke that follows the bulge.
- Selecting a tab just re-measures the target tab and moves the indicator's `left` (and the mask bump's `x`) there in one shot, sharing the same transition duration/easing so the background bulge and the white indicator glide in lockstep — no separate phases or timers needed.
- Every tab always renders its icon and label (only the color changes between active/inactive) — all tabs share the same content height, so they stay vertically centered and aligned with each other instead of icons jumping around as a label is shown/hidden.
- `prefers-reduced-motion` disables the slide transition entirely (on both the indicator and the mask bumps) and jumps straight to the target tab.

