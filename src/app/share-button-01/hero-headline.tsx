import './styles.css';

export function HeroHeadline() {
  return (
    <div className="pointer-events-none flex flex-col items-center text-center">
      <span className="text-[11px] font-medium tracking-[0.4em] text-black/40 uppercase">
        Share
      </span>
      <h1 className="hero-headline-shimmer text-2xl font-bold tracking-tight sm:text-3xl">
        Button
      </h1>
    </div>
  );
}
