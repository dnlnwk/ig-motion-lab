'use client';

import { useCallback, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import { Home, Images, Search, Wallet } from 'lucide-react';
import clsx from 'clsx';
import './styles.css';

type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean; strokeWidth?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'search', label: 'Search', icon: Search },
];

type IndicatorRect = { left: number; width: number };

// The indicator always stays a perfect circle and just slides to the new tab, with a springy ease for some fluidity.
const MOVE_MS = 500;
const MOVE_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// The indicator is a fixed-size circle centered on a tab; only its center ever moves.
// Sized to enclose the icon + label stack, not just the icon.
const INDICATOR_DIAMETER = 64;
const INDICATOR_RADIUS = INDICATOR_DIAMETER / 2;

// The pill background is flat (60px) everywhere except a goo-blended bump around the indicator.
const CONTAINER_HEIGHT = 84;
const BASE_HEIGHT = 60;
const BASE_Y = (CONTAINER_HEIGHT - BASE_HEIGHT) / 2;
const BUMP_HEIGHT = 76;
const BUMP_Y = (CONTAINER_HEIGHT - BUMP_HEIGHT) / 2;
const BORDER_STROKE = 2.5;
const GOO_FILTER_ID = 'nav-goo';
const FILL_MASK_ID = 'nav-pill-mask-fill';
const BORDER_MASK_ID = 'nav-pill-mask-border';

function toCircle(rect: IndicatorRect): IndicatorRect {
  return { left: rect.left + rect.width / 2 - INDICATOR_RADIUS, width: INDICATOR_DIAMETER };
}

export function BottomNav() {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);
  const buttonsRef = useRef(new Map<string, HTMLButtonElement>());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    setContainerWidth(node.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const measure = useCallback((id: string): IndicatorRect | null => {
    const button = buttonsRef.current.get(id);
    if (!button) return null;
    return { left: button.offsetLeft, width: button.offsetWidth };
  }, []);

  const updateRects = useCallback(() => {
    const rect = measure(activeId);
    if (rect) setIndicator(toCircle(rect));
  }, [activeId, measure]);

  useLayoutEffect(() => {
    // ResizeObserver fires an initial measurement for each newly observed button, so this also
    // covers the first mount and every activeId change without calling setState directly here.
    const observer = new ResizeObserver(updateRects);
    buttonsRef.current.forEach((button) => observer.observe(button));

    window.addEventListener('resize', updateRects);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateRects);
    };
  }, [updateRects]);

  function handleSelect(id: string) {
    if (id === activeId) return;

    const targetRect = measure(id);
    if (!targetRect) return;

    setActiveId(id);
    setIndicator(toCircle(targetRect));
  }

  // Shared transition for both masks' bump rects and the visible indicator, kept in lockstep.
  const indicatorTransition = {
    transitionProperty: 'x, left',
    transitionDuration: `${MOVE_MS}ms`,
    transitionTimingFunction: MOVE_EASING,
  };

  return (
    <div ref={containerRef} className="relative" style={{ height: CONTAINER_HEIGHT }}>
      <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <defs>
          <filter id={GOO_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
          </filter>

          <mask
            id={FILL_MASK_ID}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={containerWidth}
            height={CONTAINER_HEIGHT}
          >
            <g filter={`url(#${GOO_FILTER_ID})`}>
              <rect
                x="0"
                y={BASE_Y}
                width={containerWidth}
                height={BASE_HEIGHT}
                rx={BASE_HEIGHT / 2}
                fill="#fff"
              />
              {indicator && (
                <rect
                  x={indicator.left}
                  y={BUMP_Y}
                  width={indicator.width}
                  height={BUMP_HEIGHT}
                  rx={BUMP_HEIGHT / 2}
                  fill="#fff"
                  className="nav-indicator-bump"
                  style={indicatorTransition}
                />
              )}
            </g>
          </mask>

          <mask
            id={BORDER_MASK_ID}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={containerWidth + BORDER_STROKE * 2}
            height={CONTAINER_HEIGHT}
          >
            <g filter={`url(#${GOO_FILTER_ID})`}>
              <rect
                x="0"
                y={BASE_Y - BORDER_STROKE}
                width={containerWidth + BORDER_STROKE * 2}
                height={BASE_HEIGHT + BORDER_STROKE * 2}
                rx={BASE_HEIGHT / 2 + BORDER_STROKE}
                fill="#fff"
              />
              {indicator && (
                <rect
                  x={indicator.left}
                  y={BUMP_Y - BORDER_STROKE}
                  width={indicator.width + BORDER_STROKE * 2}
                  height={BUMP_HEIGHT + BORDER_STROKE * 2}
                  rx={BUMP_HEIGHT / 2 + BORDER_STROKE}
                  fill="#fff"
                  className="nav-indicator-bump"
                  style={indicatorTransition}
                />
              )}
            </g>
          </mask>
        </defs>
      </svg>

      {/* Border layer: slightly inflated goo silhouette peeking out from behind the fill layer as a rim.
          Widened by BORDER_STROKE on each side so its rounded tips taper naturally instead of getting clipped. */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 bg-white/30 filter-[drop-shadow(0_25px_50px_-12px_rgba(0,0,0,0.4))]"
        style={{
          left: -BORDER_STROKE,
          width: containerWidth + BORDER_STROKE * 2,
          WebkitMaskImage: `url(#${BORDER_MASK_ID})`,
          maskImage: `url(#${BORDER_MASK_ID})`,
        }}
      />
      {/* Fill layer: the real glass look, cropped to the same goo silhouette. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-white/12 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
        style={{ WebkitMaskImage: `url(#${FILL_MASK_ID})`, maskImage: `url(#${FILL_MASK_ID})` }}
      />

      <div
        role="tablist"
        aria-label="Primary"
        className="relative z-10 flex h-full items-center gap-2 px-3"
      >
        {indicator && (
          <span
            aria-hidden
            className="nav-indicator absolute top-2.5 z-0 h-16 filter-[drop-shadow(0_4px_8px_rgba(0,0,0,0.25))]"
            style={{ left: indicator.left, width: indicator.width, ...indicatorTransition }}
          >
            <span className="block h-full w-full rounded-full bg-linear-to-b from-white to-slate-100 shadow-[inset_0_-3px_6px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,1)]" />
          </span>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) buttonsRef.current.set(item.id, node);
                else buttonsRef.current.delete(item.id);
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(item.id)}
              className={clsx(
                'relative z-10 flex h-full w-16 cursor-pointer flex-col items-center justify-center gap-1 transition-colors duration-300 active:scale-95',
                isActive ? 'text-violet-900' : 'text-slate-300 hover:text-white'
              )}
            >
              <Icon aria-hidden strokeWidth={2.5} className="h-5 w-5 shrink-0" />
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
