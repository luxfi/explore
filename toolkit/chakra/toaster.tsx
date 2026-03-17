'use client';

import type React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

import { SECOND } from '../utils/consts';

const DURATION = 10 * SECOND;

interface ToastOptions {
  readonly id?: string | number;
  readonly title?: string;
  readonly description?: string;
  readonly type?: 'info' | 'warning' | 'success' | 'error' | 'loading';
  readonly duration?: number;
  readonly action?: { readonly label: string; readonly onClick: () => void };
  readonly onStatusChange?: (details: { readonly status: string }) => void;
}

function mapOptions(opts: ToastOptions): Parameters<typeof toast>[1] {
  const external: Parameters<typeof toast>[1] = {
    id: opts.id,
    description: opts.description,
    duration: opts.duration,
  };

  if (opts.action) {
    external.action = {
      label: opts.action.label,
      onClick: opts.action.onClick,
    };
  }

  if (opts.onStatusChange) {
    const cb = opts.onStatusChange;
    external.onDismiss = () => cb({ status: 'unmounted' });
    external.onAutoClose = () => cb({ status: 'unmounted' });
  }

  return external;
}

function create(opts: ToastOptions): string | number {
  const external = mapOptions(opts);
  const title = opts.title ?? '';

  switch (opts.type) {
    case 'success':
      return toast.success(title, external);
    case 'error':
      return toast.error(title, external);
    case 'warning':
      return toast.warning(title, external);
    case 'loading':
      return toast.loading(title, external);
    case 'info':
    default:
      return toast.info(title, external);
  }
}

function update(id: string | number, opts: ToastOptions): void {
  const title = opts.title ?? '';

  // Sonner does not have a dedicated update method.
  // Re-calling a typed toast with the same id replaces it in-place.
  const external = mapOptions({ ...opts, id });

  switch (opts.type) {
    case 'success':
      toast.success(title, external);
      break;
    case 'error':
      toast.error(title, external);
      break;
    case 'warning':
      toast.warning(title, external);
      break;
    case 'loading':
      toast.loading(title, external);
      break;
    case 'info':
    default:
      toast.info(title, external);
      break;
  }
}

export const toaster = {
  create,
  success: (opts: ToastOptions) => create({ ...opts, type: 'success' }),
  error: (opts: ToastOptions) => create({ ...opts, type: 'error' }),
  loading: (opts: ToastOptions) => create({ ...opts, type: 'loading' }),
  update,
  remove: (id: string | number) => toast.dismiss(id),
} as const;

export const Toaster: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={ DURATION }
      offset={{ top: 12, right: 12, bottom: 12, left: 12 }}
      mobileOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
      toastOptions={{
        className: 'font-sans',
        style: {
          fontFamily: 'var(--font-sans, "Geist", sans-serif)',
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-divider)',
        },
      }}
    />
  );
};
