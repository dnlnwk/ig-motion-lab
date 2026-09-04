# Share Button 01

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/share-button-01-website.webp" style="max-width: 250px; width: 100%;" alt="" />
</p>

A compact share button that physically morphs into a row of sharing options, inspired by [Share Button Concept — UX Motion Design](https://dribbble.com/shots/3682521-Share-Button-Concept-UX-Motion-Design).

## Flow

1. **Idle** — a dark, circular share button breathes with a subtle looping scale/glow pulse (orange); hovering nudges it slightly larger still.
2. **Open** — clicking it stretches the same pill outward (no fade, no swap) while the share icon crossfades into a close (X) icon in place. Four light chip buttons — copy link, message, email, direct share — fan out from directly behind that button in a fast, staggered sequence with a small spring overshoot before settling.
3. **Select** — tapping a chip swaps its icon for a checkmark and turns it orange; the menu stays open so another target can be picked, or the toggle/X can be clicked to close it.
4. **Close** — clicking the X (or the button again) retracts the chips — farthest first — back into the shell as it shrinks back into a circle.

## Details

- Built with `motion` (`motion/react`). The outer shell is one continuous element whose `width` is animated between a circle and a pill — never unmounted — so the button visually *becomes* the expanded control instead of being swapped for a menu.
- Chip buttons are always mounted. When closed they sit at `scale: 0`, `opacity: 0`, translated (`x`) back to the shell's origin, and are clipped by the shell's `overflow-hidden`; opening animates each one to `x: 0, scale: 1, opacity: 1`. Because every chip's initial position converges on the same origin point (the toggle button), they read as emerging from one shared source rather than appearing independently.
- Opening uses a lighter, springier transition (`stiffness: 240, damping: 22`) that lets the shell/chips settle with a slight overshoot; closing uses a stiffer, more damped spring (`stiffness: 320-420, damping: 30-32`) with no overshoot, so the retraction feels crisp rather than bouncy — an intentionally asymmetric pair of easings for open vs. close.
- Chips are staggered 40-50ms apart via a per-index `delay` in their `transition`, in forward order on open and reverse order on close, so the fan-out/retraction reads as one coordinated wave instead of simultaneous pops.
- The toggle icon (`Share2` ↔ `X`) and each chip's icon (icon ↔ `Check`) are cross-faded with `AnimatePresence`, each layer absolutely positioned so the swap doesn't shift layout. The check mark is a custom `motion.path` (not the static lucide icon) animating `pathLength` from 0 to 1, so it visibly draws itself in rather than just fading/scaling.
- Extra "juice" layered on top of the base morph: the shell squashes (`scaleY` dips to 0.94 with a back-ease) on every open/close for a squash-and-stretch feel, chips spin in with an alternating rotate offset instead of a flat slide, and the toggle wobbles (`rotate`) once on open.
- The idle (closed) toggle button breathes indefinitely — a subtle looping `scale`/`boxShadow` pulse — so the control still reads as "alive" and clickable in the first frame of a silent, autoplaying clip.
- Clicking the toggle and selecting a chip each spawn a one-shot expanding-ring "ping" (colored to match the element it comes from: violet for the toggle, orange for a selected chip), rendered as absolutely-positioned siblings outside the shell so they aren't clipped by its `overflow-x-hidden`.
- Selecting a chip is purely local UI state (no real share targets are wired up): it just swaps the icon for a checkmark and fills the chip orange; the menu stays open until the toggle or X is clicked.
- Respects `prefers-reduced-motion` via motion's `useReducedMotion()` — springs and stagger delays collapse to a single short, non-bouncy transition.

