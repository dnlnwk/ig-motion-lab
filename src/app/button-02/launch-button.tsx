'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import clsx from 'clsx';

type Status = 'idle' | 'launching' | 'launched';

const LAUNCH_DURATION = 1.3;
const SUCCESS_DELAY = 0.5;

const SMOKE_PARTICLES = [
  { x: -20, y: 6, delay: 0 },
  { x: -9, y: 10, delay: 0.08 },
  { x: 9, y: 10, delay: 0.05 },
  { x: 20, y: 6, delay: 0.12 },
  { x: 0, y: 12, delay: 0.03 },
];

const HOVER_SMOKE_PARTICLES = [
  {
    x: 0,
    yStart: 0.5,
    yEnd: 5,
    rStart: 1.3,
    rEnd: 1.6,
    peakOpacity: 0.95,
    duration: 0.4,
    delay: 0,
  },
  {
    x: -2.5,
    yStart: 1,
    yEnd: 7,
    rStart: 0.9,
    rEnd: 1.8,
    peakOpacity: 0.6,
    duration: 0.5,
    delay: 0.12,
  },
  {
    x: 2.5,
    yStart: 1,
    yEnd: 7.5,
    rStart: 0.9,
    rEnd: 1.9,
    peakOpacity: 0.55,
    duration: 0.5,
    delay: 0.22,
  },
];

export function LaunchButton() {
  const prefersReducedMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [showRocket, setShowRocket] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rocketTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      if (rocketTimeoutRef.current) clearTimeout(rocketTimeoutRef.current);
    },
    []
  );

  const handleClick = useCallback(() => {
    if (status !== 'idle') return;
    setIsHovered(false);
    setStatus('launching');
    setShowRocket(true);

    const successDelayMs = (prefersReducedMotion ? 0.4 : SUCCESS_DELAY) * 1000;
    successTimeoutRef.current = setTimeout(() => setStatus('launched'), successDelayMs);

    const rocketDurationMs = (prefersReducedMotion ? 0.4 : LAUNCH_DURATION) * 1000;
    rocketTimeoutRef.current = setTimeout(() => setShowRocket(false), rocketDurationMs);
  }, [status, prefersReducedMotion]);

  const isIdle = status === 'idle';
  const isLaunching = status === 'launching';
  const isLaunched = status === 'launched';

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        disabled={!isIdle}
        aria-label={isLaunching ? 'Launching' : isLaunched ? 'Launched' : 'Launch'}
        className={clsx(
          'relative flex h-14 w-44 items-center justify-center gap-2 rounded-full text-base font-semibold text-white shadow-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300',
          'bg-linear-to-b from-orange-500 to-red-600 [transition:filter_0.4s_ease-out]',
          'disabled:pointer-events-none',
          isIdle ? 'cursor-pointer hover:brightness-95' : 'cursor-default'
        )}
      >
        <span className="flex items-center gap-2">
          <motion.span animate={{ opacity: isIdle ? 1 : 0 }} transition={{ duration: 0.2 }}>
            Launch!
          </motion.span>
          {(isIdle || showRocket) && (
            <RocketIcon
              isLaunching={status !== 'idle'}
              isHovered={isHovered}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          )}
        </span>

        <AnimatePresence>
          {isLaunched && (
            <motion.span
              key="launched"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', stiffness: 320, damping: 18 }
              }
            >
              <CheckmarkIcon prefersReducedMotion={!!prefersReducedMotion} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {isLaunching ? 'Launching' : isLaunched ? 'Launched' : ''}
      </span>
    </div>
  );
}

function CheckmarkIcon({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <motion.path
        d="M4 12.5L9.5 18L20 6"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.15 }
            : { duration: 0.5, ease: 'easeOut', delay: 0.15 }
        }
      />
    </svg>
  );
}

function RocketIcon({
  isLaunching,
  isHovered,
  prefersReducedMotion,
}: {
  isLaunching: boolean;
  isHovered: boolean;
  prefersReducedMotion: boolean;
}) {
  const isAnticipating = !isLaunching && isHovered && !prefersReducedMotion;

  const shipTransition: Transition = prefersReducedMotion
    ? { duration: 0.2 }
    : isLaunching
      ? {
          duration: LAUNCH_DURATION,
          times: [0, 0.1, 0.24, 1],
          ease: ['easeOut', 'easeIn', 'easeIn'],
        }
      : isAnticipating
        ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
        : { duration: 0.25, ease: 'easeOut' };

  const shipAnimate = prefersReducedMotion
    ? isLaunching
      ? { y: -10, opacity: 0 }
      : { y: 0, rotate: 0, scaleY: 1 }
    : isLaunching
      ? {
          y: [0, 3, -6, -230],
          rotate: [0, 5, -3, 0],
          scale: [1, 1.06, 1.06, 0.6],
          opacity: [1, 1, 1, 0],
        }
      : isAnticipating
        ? { rotate: [0, -7, 6, -5, 3, 0], y: [0, -1, 0, -1, 0] }
        : { y: 0, rotate: 0, scaleY: 1 };

  return (
    <span className="relative inline-flex h-7 w-6 items-center justify-center">
      <ExhaustGraphic
        isLaunching={isLaunching}
        isAnticipating={isAnticipating}
        prefersReducedMotion={prefersReducedMotion}
      />

      <motion.svg
        viewBox="0 0 24 28"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        animate={shipAnimate}
        transition={shipTransition}
      >
        <path
          d="M12 2C9.5 2 7.6 6 7.6 11V17C7.6 17.8 8.3 18.5 9.1 18.5H14.9C15.7 18.5 16.4 17.8 16.4 17V11C16.4 6 14.5 2 12 2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10"
          r="2.1"
          fill="currentColor"
          fillOpacity={0.18}
          stroke="currentColor"
          strokeWidth={1.4}
        />
        <path
          d="M8 13.5C5.6 14.3 4.2 17 4.2 19.5H8V13.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <path
          d="M16 13.5C18.4 14.3 19.8 17 19.8 19.5H16V13.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </motion.svg>
    </span>
  );
}

function ExhaustGraphic({
  isLaunching,
  isAnticipating,
  prefersReducedMotion,
}: {
  isLaunching: boolean;
  isAnticipating: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <svg viewBox="0 0 24 28" className="absolute inset-0 h-full w-full" aria-hidden>
      <motion.path
        d="M12 16.5C12 16.5 9.6 19 9.6 21.1C9.6 22.4 10.7 23.4 12 23.4C13.3 23.4 14.4 22.4 14.4 21.1C14.4 19 12 16.5 12 16.5Z"
        fill="#ffb95e"
        animate={
          prefersReducedMotion
            ? { opacity: isLaunching ? 0 : 0.45 }
            : isLaunching
              ? { scale: [1, 1.9, 0.2], opacity: [0.9, 1, 0] }
              : isAnticipating
                ? { scaleX: [1, 1.1, 1], scaleY: [1, 1.75, 1.05], opacity: [0.75, 1, 0.8] }
                : { scale: 0.85, opacity: 0.45 }
        }
        transition={
          isLaunching
            ? { duration: LAUNCH_DURATION * 0.7, times: [0, 0.25, 1], ease: 'easeOut' }
            : isAnticipating
              ? { duration: 0.35, repeat: Infinity, ease: 'easeOut' }
              : { duration: 0.25 }
        }
        style={{ originX: '50%', originY: '15%' }}
      />

      <motion.ellipse
        cx="12"
        cy="18.2"
        rx="1.2"
        ry="1.8"
        fill="#fff3c4"
        animate={
          prefersReducedMotion
            ? { opacity: 0 }
            : isAnticipating
              ? { scaleY: [1, 1.7, 1.1], opacity: [0.55, 1, 0.6] }
              : { opacity: 0 }
        }
        transition={
          isAnticipating ? { duration: 0.3, repeat: Infinity, ease: 'easeOut' } : { duration: 0.2 }
        }
        style={{ originX: '50%', originY: '10%' }}
      />

      <motion.g
        animate={
          prefersReducedMotion
            ? { opacity: isLaunching ? 0 : 0 }
            : isLaunching
              ? { scale: [1, 1.8, 2.4], opacity: [0.85, 0.55, 0] }
              : { scale: 1, opacity: 0 }
        }
        transition={
          isLaunching ? { duration: LAUNCH_DURATION, ease: 'easeOut' } : { duration: 0.25 }
        }
        style={{ originX: '50%', originY: '85%' }}
      >
        <circle cx="6" cy="22" r="1.8" fill="white" fillOpacity={0.6} />
        <circle cx="7.5" cy="21" r="2.2" fill="white" fillOpacity={0.7} />
        <circle cx="12" cy="22.6" r="2.8" fill="white" fillOpacity={0.85} />
        <circle cx="16.5" cy="21" r="2.2" fill="white" fillOpacity={0.7} />
        <circle cx="18" cy="22" r="1.8" fill="white" fillOpacity={0.6} />
      </motion.g>

      {isAnticipating && (
        <g>
          {HOVER_SMOKE_PARTICLES.map((particle, index) => (
            <motion.ellipse
              key={index}
              cx={12 + particle.x}
              cy="19.5"
              rx={particle.rStart}
              ry={particle.rStart * 1.4}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, particle.peakOpacity, 0],
                y: [particle.yStart, (particle.yStart + particle.yEnd) / 2, particle.yEnd],
                scale: [
                  1,
                  (particle.rStart + particle.rEnd) / (2 * particle.rStart),
                  particle.rEnd / particle.rStart,
                ],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </g>
      )}

      {isLaunching && !prefersReducedMotion && (
        <g>
          {SMOKE_PARTICLES.map((particle, index) => (
            <motion.circle
              key={index}
              cx="12"
              cy="21"
              r="1.6"
              fill="white"
              fillOpacity={0.7}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.7, 0],
                x: particle.x,
                y: particle.y,
                scale: [0.5, 1.3, 1.7],
              }}
              transition={{ duration: 0.7, delay: particle.delay, ease: 'easeOut' }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
