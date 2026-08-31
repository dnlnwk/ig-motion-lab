'use client';
import { LaunchButton } from './launch-button';
import { HeroHeadline } from './hero-headline';
import './styles.css';

export default function Page() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
      <div className="scene-bg-2 absolute inset-0" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-12 p-6">
        <HeroHeadline />
        <LaunchButton />
      </div>
    </div>
  );
}
