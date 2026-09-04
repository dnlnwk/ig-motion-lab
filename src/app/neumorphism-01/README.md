# Neumorphism 01 — UI Kit

<p align="center">
  <img src="https://ig.dnlnwk.de/projects/neumorphism-01-website.webp" style="max-width: 250px; width: 100%;" alt="Neumorphism 01 preview" />
</p>

A soft-UI ("neumorphism") component kit: a light gray panel where every control is carved out of, or raised above, the same background color using paired light/dark shadows instead of borders or flat fills.

## Components

- **Icon buttons** — circular and rounded-square, raised by default. The top-row circular icons and the "like" heart are toggleable: clicking switches them into a pressed/inset state with a violet fill, like a persistent selected state.
- **Follow pill** — a wide raised pill button.
- **Search field** — pill-shaped pressed/inset input with a trailing search glyph.
- **Password field** — pill-shaped pressed/inset input, normal-case placeholder styling.
- **Toggle switches** — a small neutral track/knob switch and a larger one whose track fills with a violet gradient when on.
- **Vertical sliders** — native `<input type="range">` rotated to a vertical track via the `writing-mode: vertical-lr; direction: rtl` trick, restyled with inset track + raised thumb.
- **Notification chips** — raised rounded-square chips with a clipped-corner "tail" to read as speech bubbles/tooltips.
- **Progress bar** — pressed/inset track with a raised fill bar inside.

## Details

- All shadows derive from two CSS custom properties per panel (`--neu-dark`/`--neu-light`) so raised and pressed surfaces stay visually consistent — see `styles.css` (`.neu-raised`, `.neu-pressed`, `.neu-toggle-track`).
- Toggle knobs animate their position with a bouncy `cubic-bezier` transition on `transform`; the "on" track crossfades to a violet gradient via a plain CSS `transition: background`.
- Raised buttons lift slightly on hover and dip into an inset shadow on `:active` with a snappier press-in than release, and pill/track surfaces animate their `box-shadow` on state changes — all via plain CSS transitions, no JS motion lib needed.
- Icons are `lucide-react`; muted gray for idle controls, `var(--violet-medium)` for active/accent states, matching the app's existing color tokens.

