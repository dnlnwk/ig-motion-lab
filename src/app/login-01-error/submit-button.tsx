import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';

export type Status = 'idle' | 'loading' | 'error';

const IDLE_WIDTH = 200;
const CIRCLE_WIDTH = 48;

const OVERLAY = 'absolute inset-0 flex items-center justify-center';

type SubmitButtonProps = {
  status: Status;
};

export function SubmitButton({ status }: SubmitButtonProps) {
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevStatus = useRef<Status | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button && prevStatus.current !== null && prevStatus.current !== status) {
      button.classList.remove('button-bounce');
      void button.offsetWidth;
      button.classList.add('button-bounce');
    }
    prevStatus.current = status;
  }, [status]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {isError && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-red-400 radar-ring-button" />
      )}

      <button
        ref={buttonRef}
        type="submit"
        disabled={status !== 'idle'}
        aria-busy={isLoading}
        aria-label={
          isLoading ? 'Sending message' : isError ? 'Message failed to send' : 'Send message'
        }
        style={{ width: status === 'idle' ? IDLE_WIDTH : CIRCLE_WIDTH }}
        className={clsx(
          'relative h-12 rounded-full font-semibold text-white shadow-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300',
          '[transition:width_0.55s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.4s_ease-out,filter_0.4s_ease-out]',
          isError ? 'bg-red-500' : 'bg-white',
          status === 'idle' ? 'cursor-pointer hover:brightness-95' : 'cursor-default'
        )}
      >
        <IdleLabel active={status === 'idle'} />
        <LoadingSpinner active={isLoading} />
        <ErrorIcon active={isError} />
      </button>
    </div>
  );
}

function IdleLabel({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden={!active}
      className={clsx(
        OVERLAY,
        'gap-1.5 whitespace-nowrap text-violet-900',
        active ? 'opacity-100 transition-opacity duration-100 ease-in' : 'opacity-0 duration-0'
      )}
    >
      Send message
      <Send aria-hidden className="h-4 w-4" />
    </span>
  );
}

function LoadingSpinner({ active }: { active: boolean }) {
  return (
    <span
      className={clsx(
        OVERLAY,
        'transition-opacity duration-200',
        active ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-900/30 border-t-violet-900" />
    </span>
  );
}

function ErrorIcon({ active }: { active: boolean }) {
  return (
    <span
      className={clsx(
        OVERLAY,
        'transition-opacity duration-200',
        active ? 'opacity-100' : 'opacity-0'
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={clsx('h-5 w-5', active ? 'error-icon-pop' : '')}
        aria-hidden="true"
      >
        <path
          d="M6 6L18 18"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          className={active ? 'error-icon-path-1' : ''}
        />
        <path
          d="M18 6L6 18"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          className={active ? 'error-icon-path-2' : ''}
        />
      </svg>
    </span>
  );
}
