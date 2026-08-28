import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import clsx from 'clsx';

type Status = 'idle' | 'uploading' | 'success' | 'done';

const IDLE_WIDTH = 176;
const CIRCLE_WIDTH = 56;
const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const UPLOAD_DURATION = 1.8;

const SHRINK_TRANSITION = { type: 'spring', stiffness: 220, damping: 30 } as const;
const EXPAND_TRANSITION = { type: 'spring', stiffness: 210, damping: 17 } as const;

const OVERLAY = 'absolute inset-0 flex items-center justify-center';

export function UploadButton() {
  const prefersReducedMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const progress = useMotionValue(0);
  const dashoffset = useTransform(progress, (p) => CIRCUMFERENCE * (1 - p));
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const handleClick = useCallback(() => {
    if (status !== 'idle') return;
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    progress.set(0);
    setStatus('uploading');
    animate(progress, prefersReducedMotion ? 1 : [0, 0.65, 0.88, 1], {
      duration: prefersReducedMotion ? 0 : UPLOAD_DURATION,
      times: prefersReducedMotion ? undefined : [0, 0.5, 0.8, 1],
      ease: prefersReducedMotion ? 'linear' : ['easeOut', 'easeInOut', 'easeIn'],
      onComplete: () => {
        setStatus('success');
        timeouts.current.push(setTimeout(() => setStatus('done'), prefersReducedMotion ? 0 : 1300));
      },
    });
  }, [status, progress, prefersReducedMotion]);

  const isIdle = status === 'idle';
  const isUploading = status === 'uploading';
  const isSuccess = status === 'success';
  const isDone = status === 'done';
  const isExpanded = isIdle || isDone;

  return (
    <div className="relative inline-flex items-center justify-center">
      {isSuccess && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-400 radar-ring-upload" />
      )}

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={!isIdle}
        aria-busy={isUploading}
        aria-label={
          isUploading ? 'Uploading' : isSuccess || isDone ? 'Upload complete' : 'Upload file'
        }
        initial={false}
        animate={{ width: isExpanded ? IDLE_WIDTH : CIRCLE_WIDTH }}
        transition={
          prefersReducedMotion
            ? { duration: 0.15 }
            : isExpanded
              ? EXPAND_TRANSITION
              : SHRINK_TRANSITION
        }
        className={clsx(
          'relative h-14 overflow-hidden rounded-full font-semibold text-white shadow-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300',
          '[transition:background-color_0.4s_ease-out]',
          isSuccess || isDone ? 'bg-emerald-500' : 'bg-violet-600',
          isIdle ? 'cursor-pointer hover:brightness-95' : 'cursor-default'
        )}
      >
        {!isIdle && !isDone && (
          <svg
            viewBox="0 0 56 56"
            className="absolute inset-0 h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="28"
              cy="28"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="3"
            />
            <motion.circle
              cx="28"
              cy="28"
              r={RADIUS}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset: dashoffset, opacity: isSuccess ? 0 : 1 }}
              className="transition-opacity duration-200"
            />
          </svg>
        )}

        <IdleLabel active={isIdle} />
        <UploadingIcon active={isUploading} reducedMotion={!!prefersReducedMotion} />
        <SuccessCheck active={isSuccess} reducedMotion={!!prefersReducedMotion} />
        <DoneLabel active={isDone} />
      </motion.button>
    </div>
  );
}

function IdleLabel({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden={!active}
      className={clsx(
        OVERLAY,
        'gap-2 whitespace-nowrap',
        active ? 'opacity-100 transition-opacity duration-100 ease-in' : 'opacity-0 duration-0'
      )}
    >
      Upload file
      <Upload aria-hidden className="h-4 w-4" />
    </span>
  );
}

function UploadingIcon({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          className={OVERLAY}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: reducedMotion ? 0 : [0, -3, 0] }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.15 },
            y: { duration: 1.4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' },
          }}
        >
          <Upload aria-hidden className="h-5 w-5" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function SuccessCheck({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          className={OVERLAY}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={
            reducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 20 }
          }
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <motion.path
              d="M4 12.5L9.5 18L20 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut', delay: 0.05 }
              }
            />
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function DoneLabel({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden={!active}
      className={clsx(
        OVERLAY,
        'gap-2 whitespace-nowrap',
        active ? 'opacity-100 transition-opacity duration-150 ease-out' : 'opacity-0 duration-0'
      )}
    >
      Uploaded
      <Check aria-hidden className="h-4 w-4" />
    </span>
  );
}
