'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed right-6 top-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 rounded-card border bg-bg-surface px-5 py-3 shadow-lg ${
          isSuccess ? 'border-success' : 'border-danger'
        }`}
      >
        <span
          aria-hidden="true"
          className={`material-symbols-outlined text-lg ${isSuccess ? 'text-success' : 'text-danger'}`}
        >
          {isSuccess ? 'check_circle' : 'error'}
        </span>
        <span className="font-label text-label-lg text-text-primary">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-text-secondary transition-state hover:text-text-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
