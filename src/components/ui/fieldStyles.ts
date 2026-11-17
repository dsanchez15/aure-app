/**
 * Estilos compartidos de control de formulario.
 * Única fuente para Input, Select, Textarea y PasswordInput:
 * si un control necesita un cambio visual, se cambia aquí.
 */
export const fieldControlBase =
  'w-full rounded-control border border-border bg-bg-input font-body text-body-md text-text-primary placeholder:text-text-muted transition-state focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50';

export const fieldSizeClasses = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2.5',
} as const;

export type FieldSize = keyof typeof fieldSizeClasses;
