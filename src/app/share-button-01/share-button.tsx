'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link2, Mail, MessageCircle, Send, Share2, X } from 'lucide-react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

type ShareItem = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

const ITEMS: ShareItem[] = [
  { id: 'copy', label: 'Copy link', Icon: Link2 },
  { id: 'message', label: 'Message', Icon: MessageCircle },
  { id: 'mail', label: 'Email', Icon: Mail },
  { id: 'send', label: 'Direct share', Icon: Send },
];

const PADDING = 4;
const BTN = 48;
const GAP = 8;
const STEP = BTN + GAP;
const CLOSED_WIDTH = BTN + PADDING * 2;
const OPEN_WIDTH = PADDING * 2 + BTN * (ITEMS.length + 1) + GAP * ITEMS.length;

// Bouncier on open (slight overshoot), tighter/no-overshoot on close for an asymmetric feel.
const OPEN_SPRING = { type: 'spring', stiffness: 240, damping: 22, mass: 1 } as const;
const CLOSE_SPRING = { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 } as const;
const ITEM_OPEN_SPRING = { type: 'spring', stiffness: 380, damping: 16, mass: 0.7 } as const;
const ITEM_CLOSE_SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 } as const;
const ICON_SWAP_SPRING = { type: 'spring', stiffness: 320, damping: 20 } as const;
const REDUCED_TRANSITION = { duration: 0.15, ease: 'easeOut' } as const;
// "Back" ease (slight overshoot) for one-shot squash/wobble/bounce accents.
const EASE_BACK = [0.34, 1.56, 0.64, 1] as const;
// rgb(236, 89, 76) == --orange-medium, kept as an interpolatable rgba() since motion can't resolve var() inside animated box-shadow strings.
const IDLE_GLOW = [
  '0 0 0 0 rgba(236, 89, 76, 0)',
  '0 0 14px 3px rgba(236, 89, 76, 0.35)',
  '0 0 0 0 rgba(236, 89, 76, 0)',
];

function AnimatedCheck({ reduced }: { reduced: boolean | null }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <motion.path
        d="M20 6 9 17l-5-5"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
      />
    </svg>
  );
}

export function ShareButton() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const toggleOpen = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setSelectedId(null);
    setPulseKey((k) => k + 1);
    setOpen((o) => !o);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      if (!open) return;
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
      setSelectedId(id);
    },
    [open]
  );

  const selectedIndex = selectedId ? ITEMS.findIndex((item) => item.id === selectedId) : -1;

  // Idle: gentle infinite breathing glow to draw the eye before any click. Open: one-shot bounce, no glow.
  const toggleAnimate = prefersReducedMotion
    ? { scale: 1 }
    : open
      ? { scale: [1, 1.12, 1], rotate: [10, 0], boxShadow: 'none' }
      : { scale: [1, 1.035, 1], rotate: 0, boxShadow: IDLE_GLOW };
  const toggleTransition = prefersReducedMotion
    ? REDUCED_TRANSITION
    : open
      ? { duration: 0.55, ease: EASE_BACK }
      : {
          scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.3 },
        };

  return (
    <div className="relative inline-flex">
      <motion.div
        role="group"
        aria-label="Share"
        initial={false}
        animate={{
          width: open ? OPEN_WIDTH : CLOSED_WIDTH,
          scaleY: prefersReducedMotion ? 1 : [0.94, 1],
        }}
        transition={
          prefersReducedMotion
            ? REDUCED_TRANSITION
            : {
                width: open ? OPEN_SPRING : CLOSE_SPRING,
                scaleY: { duration: 0.4, ease: EASE_BACK },
              }
        }
        className="share-shell relative flex h-14 items-center _overflow-x-hidden _overflow-y-visible rounded-full p-1"
        style={{ gap: GAP }}
      >
        <motion.button
          type="button"
          onClick={toggleOpen}
          animate={toggleAnimate}
          transition={toggleTransition}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { scale: 1.06, transition: { type: 'spring', stiffness: 400, damping: 20 } }
          }
          whileTap={
            prefersReducedMotion
              ? undefined
              : { scale: 0.94, transition: { type: 'spring', stiffness: 400, damping: 20 } }
          }
          aria-expanded={open}
          aria-label={open ? 'Close share menu' : 'Share'}
          className="share-toggle relative z-10 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <AnimatePresence initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={prefersReducedMotion ? REDUCED_TRANSITION : ICON_SWAP_SPRING}
                className="absolute flex items-center justify-center"
              >
                <X aria-hidden className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="share"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={prefersReducedMotion ? REDUCED_TRANSITION : ICON_SWAP_SPRING}
                className="absolute flex items-center justify-center"
              >
                <Share2 aria-hidden className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {ITEMS.map(({ id, label, Icon }, index) => {
          const isSelected = selectedId === id;
          // Every chip starts stacked near the toggle button, then fans out to its slot on open.
          const origin = -((index + 1) * STEP);
          // Alternate collapse rotation per chip so the fan-out reads as a livelier spin-in rather than a flat slide.
          const collapsedRotate = index % 2 === 0 ? -14 : 14;
          const delay = prefersReducedMotion
            ? 0
            : open
              ? 0.06 + index * 0.05
              : (ITEMS.length - 1 - index) * 0.04;

          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              disabled={!open}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              aria-label={label}
              title={label}
              whileHover={open && !prefersReducedMotion ? { scale: 1.1 } : undefined}
              whileTap={open && !prefersReducedMotion ? { scale: 0.9 } : undefined}
              initial={false}
              animate={{
                x: open ? 0 : origin,
                scale: !open ? 0 : 1,
                opacity: open ? 1 : 0,
                rotate: open ? 0 : collapsedRotate,
              }}
              transition={
                prefersReducedMotion
                  ? REDUCED_TRANSITION
                  : {
                      ...(open ? ITEM_OPEN_SPRING : ITEM_CLOSE_SPRING),
                      delay,
                    }
              }
              className={clsx(
                'share-chip flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full',
                isSelected && 'share-chip-selected'
              )}
            >
              <AnimatePresence initial={false}>
                {isSelected ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={prefersReducedMotion ? REDUCED_TRANSITION : ICON_SWAP_SPRING}
                    className="absolute flex items-center justify-center"
                  >
                    <AnimatedCheck reduced={prefersReducedMotion} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={prefersReducedMotion ? REDUCED_TRANSITION : ICON_SWAP_SPRING}
                    className="absolute flex items-center justify-center"
                  >
                    <Icon aria-hidden className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {!prefersReducedMotion && (
        <AnimatePresence>
          {pulseKey > 0 && (
            <motion.span
              key={pulseKey}
              aria-hidden
              className="share-ping absolute rounded-full pointer-events-none"
              style={{ left: PADDING, top: PADDING, width: BTN, height: BTN }}
              initial={{ scale: 0.6, opacity: 0.55 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      )}

      {!prefersReducedMotion && (
        <AnimatePresence>
          {selectedIndex >= 0 && (
            <motion.span
              key={selectedId}
              aria-hidden
              className="share-ping share-ping-accent absolute rounded-full pointer-events-none"
              style={{
                left: PADDING + (selectedIndex + 1) * STEP,
                top: PADDING,
                width: BTN,
                height: BTN,
              }}
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
