'use client';
import { useState } from 'react';
import {
  Bookmark,
  Heart,
  Home,
  Menu,
  MessageSquare,
  Search,
  Square,
  Star,
  User,
} from 'lucide-react';
import clsx from 'clsx';

const MUTED = '#8b93a3';

function IconCircle({
  icon: Icon,
  size = 'md',
  toggleable = false,
}: {
  icon: typeof User;
  size?: 'md' | 'lg';
  toggleable?: boolean;
}) {
  const [active, setActive] = useState(false);
  const dims = size === 'lg' ? 'h-16 w-16' : 'h-14 w-14';
  const iconSize = size === 'lg' ? 22 : 19;
  const isActive = toggleable && active;
  return (
    <button
      type="button"
      aria-pressed={toggleable ? active : undefined}
      onClick={toggleable ? () => setActive((v) => !v) : undefined}
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-full',
        dims,
        isActive ? 'neu-pressed' : 'neu-raised'
      )}
    >
      <Icon
        size={iconSize}
        className={isActive ? 'fill-current' : undefined}
        style={{ color: isActive ? 'var(--violet-medium)' : MUTED }}
      />
    </button>
  );
}

function IconSquare({ icon: Icon }: { icon: typeof User }) {
  return (
    <button
      type="button"
      className="neu-raised flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl"
    >
      <Icon size={19} style={{ color: MUTED }} />
    </button>
  );
}

function Toggle({ on, onToggle, large }: { on: boolean; onToggle: () => void; large?: boolean }) {
  const track = large ? 'h-12 w-24 p-1.5' : 'h-9 w-[4.25rem] p-1';
  const knob = large ? 'h-9 w-9' : 'h-7 w-7';
  const travel = large ? 48 : 34;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      data-on={on}
      className={clsx('neu-toggle-track flex cursor-pointer items-center rounded-full', track)}
    >
      <span
        className={clsx('neu-toggle-knob rounded-full', knob)}
        style={{ transform: on ? `translateX(${travel}px)` : 'translateX(0)' }}
      />
    </button>
  );
}

function VerticalSlider({ defaultValue }: { defaultValue: number }) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      defaultValue={defaultValue}
      className="neu-slider-vertical"
      aria-label="slider"
    />
  );
}

function NotificationChip({ icons, accent }: { icons: (typeof User)[]; accent?: boolean }) {
  return (
    <div className="relative flex h-16 items-center gap-3 rounded-2xl px-5 neu-raised">
      {icons.map((Icon, i) => (
        <Icon
          key={i}
          size={20}
          className={accent ? 'fill-current' : undefined}
          style={{ color: accent ? 'var(--violet-medium)' : MUTED }}
        />
      ))}
      <span className="neu-tail" />
    </div>
  );
}

export function NeumorphismPanel() {
  const [liked, setLiked] = useState(true);
  const [smallToggle, setSmallToggle] = useState(false);
  const [bigToggle, setBigToggle] = useState(true);

  return (
    <div className="neu-panel w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-12">
      <div className="flex flex-col gap-10">
        {/* Row 1 — icon buttons, liked state, follow pill */}
        <div className="flex flex-wrap items-center gap-6">
          <IconCircle icon={User} toggleable />
          <IconCircle icon={Star} toggleable />
          <IconCircle icon={Search} toggleable />
          <IconCircle icon={Heart} size="lg" toggleable />
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={clsx(
              'flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl',
              liked ? 'neu-pressed' : 'neu-raised'
            )}
          >
            <Heart
              size={19}
              className={liked ? 'fill-current' : undefined}
              style={{ color: liked ? 'var(--violet-medium)' : MUTED }}
            />
          </button>
          <div className="neu-flat flex h-12 w-12 items-center justify-center">
            <Heart size={20} style={{ color: '#9aa3b3' }} />
          </div>
          <button
            type="button"
            className="neu-raised ml-auto flex h-12 cursor-pointer items-center justify-center rounded-full px-8 text-xs font-semibold tracking-[0.2em]"
            style={{ color: MUTED }}
          >
            FOLLOW
          </button>
        </div>

        {/* Row 2 — search field, icon buttons, toggle, sliders */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="neu-pressed flex h-14 w-full max-w-72 items-center gap-3 rounded-full pl-6 pr-5">
            <input className="neu-input min-w-0 flex-1 text-sm" placeholder="Search" />
            <Search size={16} className="shrink-0" style={{ color: '#a3acbc' }} />
          </div>
          <IconSquare icon={Bookmark} />
          <IconSquare icon={Square} />
          <Toggle on={smallToggle} onToggle={() => setSmallToggle((v) => !v)} />
          <div className="flex items-center gap-6 py-1">
            <VerticalSlider defaultValue={70} />
            <VerticalSlider defaultValue={30} />
          </div>
        </div>

        {/* Row 3 — password field, icon buttons, large toggle */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="neu-pressed flex h-14 w-full max-w-72 items-center rounded-full px-6">
            <input
              type="password"
              className="neu-input w-full text-sm normal-case"
              placeholder="Password"
            />
          </div>
          <IconCircle icon={Star} />
          <IconCircle icon={Home} />
          <Toggle large on={bigToggle} onToggle={() => setBigToggle((v) => !v)} />
        </div>

        {/* Row 4 — notification chips, menu button, progress bar */}
        <div className="flex flex-wrap items-center gap-8 pt-2">
          <NotificationChip icons={[MessageSquare, User]} />
          <NotificationChip icons={[Heart]} accent />
          <IconSquare icon={Menu} />
          <div className="neu-pressed h-4 min-w-56 flex-1 rounded-full p-0.75">
            <div className="neu-progress-fill h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
