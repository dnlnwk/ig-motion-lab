# Button 01 — Error

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/button-01-error-website.webp" style="max-width: 400px; width: 100%;" alt="Button 01 Error preview" />
</p>

A glassmorphic contact form with an animated submit button, recreating a micro-interaction seen on Instagram — this variant shows the failure state.

## Flow

1. **Idle** — pill-shaped button reading "Send message".
2. **Loading** — on submit, the button morphs into a circle and shows a spinner while inputs are disabled.
3. **Error** — the spinner is replaced by an animated X icon (each stroke draws in with a slight delay, then pops with a bouncy scale/rotate), the button turns red, a radar/ping ring pulses outward behind it, and the card shakes horizontally while its border briefly pulses red.

## Details

- Width/shape morph (`pill` → `circle`) is driven by an animated `width` transition with a spring-like easing curve.
- Each state change ("bounce") re-triggers a small scale bounce on the button via a re-applied CSS animation class.
- The X icon uses `pathLength` + staggered stroke draw-in animations on its two strokes, plus a pop/rotate entrance.
- Background image and blurred glass card (`backdrop-blur`, subtle noise overlay) give the frosted UI look.
