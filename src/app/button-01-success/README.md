# Button 01 — Success

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/button-01-success-website.webp" style="max-width: 250px; width: 100%;" alt="Button 01 Success preview" />
</p>

A glassmorphic contact form with an animated submit button, recreating a micro-interaction seen on Instagram.

## Flow

1. **Idle** — pill-shaped button reading "Send message".
2. **Loading** — on submit, the button morphs into a circle and shows a spinner while inputs are disabled.
3. **Success** — the spinner is replaced by an animated checkmark (SVG stroke draw-in), the button turns green, a radar/ping ring pulses outward behind it, and the card briefly pulses to celebrate the successful send.

## Details

- Width/shape morph (`pill` → `circle`) is driven by an animated `width` transition with a spring-like easing curve.
- Each state change ("bounce") re-triggers a small scale bounce on the button via a re-applied CSS animation class.
- The checkmark uses `pathLength` + a CSS stroke animation for a draw-in effect.
- Background image and blurred glass card (`backdrop-blur`, subtle noise overlay) give the frosted UI look.
