'use client';

import { useCallback, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import { Home, Images, Plus, Search, Wallet } from 'lucide-react';
import clsx from 'clsx';
import './styles.css';

type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'search', label: 'Search', icon: Search },
];

type IndicatorRect = { left: number; width: number };

export function BottomNav() {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const [pulseKey, setPulseKey] = useState(0);
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);
  const buttonsRef = useRef(new Map<string, HTMLButtonElement>());

  const updateIndicator = useCallback(() => {
    const button = buttonsRef.current.get(activeId);
    if (!button) return;

    setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useLayoutEffect(() => {
    // Re-measure while the active label expands/collapses so the pill chases the button in real time.
    const observer = new ResizeObserver(updateIndicator);
    buttonsRef.current.forEach((button) => observer.observe(button));

    window.addEventListener('resize', updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  function handleSelect(id: string) {
    if (id === activeId) return;
    setActiveId(id);
    setPulseKey((key) => key + 1);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        role="tablist"
        aria-label="Primary"
        className="relative flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_25px_50px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        {indicator && (
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-0 z-0 [transition:left_0.6s_cubic-bezier(0.34,1.75,0.64,1),width_0.55s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ left: indicator.left, width: indicator.width }}
          >
            <span
              key={pulseKey}
              className="indicator-wobble block h-full w-full rounded-full bg-white"
            />
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
                'relative z-10 flex h-11 cursor-pointer items-center rounded-full px-3.5 transition-colors duration-300 active:scale-95',
                isActive ? 'text-violet-900' : 'text-white/70 hover:text-white'
              )}
            >
              <span
                key={isActive ? pulseKey : 'idle'}
                className={clsx('flex', isActive && 'nav-icon-pop')}
              >
                <Icon aria-hidden className="h-5 w-5 shrink-0" />
              </span>

              <span
                className="grid [transition:grid-template-columns_0.5s_cubic-bezier(0.65,0,0.35,1)]"
                style={{ gridTemplateColumns: isActive ? '1fr' : '0fr' }}
              >
                <span className="overflow-hidden whitespace-nowrap">
                  <span className="pl-1.5 text-sm font-semibold">{item.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Create"
        className="relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_15px_30px_-8px_rgba(124,58,237,0.7)] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span aria-hidden className="fab-ring absolute inset-0 rounded-full bg-violet-500" />
        <Plus aria-hidden className="relative h-6 w-6" />
      </button>
    </div>
  );
}
