'use client';

import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle, MessageSquare, User } from 'lucide-react';
import { SubmitButton, type Status } from './submit-button';
import './styles.css';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== 'idle') return;

    setStatus('loading');
    window.setTimeout(() => setStatus('error'), 1400);
  }

  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div
      className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-linear-to-b from-white/15 to-white/5 p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_25px_50px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl ${
        isError ? 'card-error-pulse card-shake' : ''
      }`}
    >
      <div
        aria-hidden
        className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.05]"
      />
      <div className="mb-1 flex items-center gap-2">
        <MessageCircle aria-hidden className="h-5 w-5 text-white/90" />
        <h1 className="text-xl font-semibold text-white">Get in touch</h1>
      </div>
      <p className="mb-6 text-sm text-white/70">We&apos;ll get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-white/80">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              disabled={status !== 'idle'}
              placeholder="Jane Doe"
              className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 pr-11 text-white placeholder-white/40 outline-none transition focus:border-violet-300/50 focus:bg-white/15 focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-60"
            />
            <User
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 h-4.5 w-4.5 -translate-y-1/2 text-white/40 transition peer-focus:text-violet-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              disabled={status !== 'idle'}
              placeholder="jane@example.com"
              className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 pr-11 text-white placeholder-white/40 outline-none transition focus:border-violet-300/50 focus:bg-white/15 focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-60"
            />
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 h-4.5 w-4.5 -translate-y-1/2 text-white/40 transition peer-focus:text-violet-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-white/80">
            Message
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={4}
              disabled={status !== 'idle'}
              placeholder="How can we help?"
              className="peer w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 pr-11 text-white placeholder-white/40 outline-none transition focus:border-violet-300/50 focus:bg-white/15 focus-visible:ring-2 focus-visible:ring-violet-300 disabled:opacity-60"
            />
            <MessageSquare
              aria-hidden
              className="pointer-events-none absolute top-3 right-4 h-4.5 w-4.5 text-white/40 transition peer-focus:text-violet-200"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <SubmitButton status={status} />

          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`text-xs transition duration-300 ${isError ? 'text-red-300' : 'text-white/70'} ${
              isLoading || isError ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isLoading
              ? 'Sending message…'
              : isError
                ? 'Something went wrong. Please try again.'
                : '\u00A0'}
          </p>
        </div>
      </form>
    </div>
  );
}
