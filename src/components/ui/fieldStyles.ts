/**
 * Estilos compartidos de control de formulario.
 * Única fuente para Input, Select, Textarea y PasswordInput:
 * si un control necesita un cambio visual, se cambia aquí.
 */
export const fieldControlBase =
  'rounded-control border border-border bg-bg-input font-body text-body-md text-text-primary placeholder:text-text-muted transition-state focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50';

/** `w-full` por defecto, salvo que el consumidor fije su propio ancho (w-auto, w-52…). */
export function fieldWidth(className: string): string {
  return /(^|\s)w-/.test(className) ? '' : 'w-full';
}

export const fieldSizeClasses = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2.5',
} as const;

export type FieldSize = keyof typeof fieldSizeClasses;
