'use client'

import { InputHTMLAttributes, forwardRef, useId } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
}

/**
 * Checkbox nativo estilizado. Mantiene el comportamiento y la accesibilidad
 * del input real (teclado, formularios, lectores de pantalla).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className = '', id, ...props },
  ref
) {
  const autoId = useId()
  const inputId = id ?? autoId

  const input = (
    <input
      ref={ref}
      id={inputId}
      type="checkbox"
      className={`h-4 w-4 shrink-0 cursor-pointer rounded-sm border-border accent-primary transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )

  if (!label && !description) return input

  return (
    <span className="inline-flex items-start gap-2">
      <span className="pt-0.5">{input}</span>
      <label htmlFor={inputId} className="flex cursor-pointer select-none flex-col">
        {label && <span className="font-label text-label-lg text-text-primary">{label}</span>}
        {description && <span className="font-label text-label-md text-text-muted">{description}</span>}
      </label>
    </span>
  )
})

export default Checkbox
