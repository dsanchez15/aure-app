'use client'

import { forwardRef, useId, useState } from 'react'
import { Field } from './Field'
import { fieldControlBase, fieldSizeClasses, type FieldSize } from './fieldStyles'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  error?: string
  hint?: string
  fieldSize?: FieldSize
}

/**
 * Campo de contraseña con visor. Comparte los estilos de control del sistema
 * (`fieldStyles`) y la semántica de `Field` (label/hint/error).
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { label, error, hint, fieldSize = 'md', className = '', id, autoComplete, ...props },
    ref
  ) {
    const autoId = useId()
    const inputId = id ?? autoId
    const [visible, setVisible] = useState(false)

    const control = (
      <div className="relative flex items-center">
        <span
          aria-hidden="true"
          className="material-symbols-outlined pointer-events-none absolute left-3 text-lg text-text-muted"
        >
          lock
        </span>
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete ?? 'current-password'}
          aria-invalid={error ? true : undefined}
          className={`${fieldControlBase} ${fieldSizeClasses[fieldSize]} pl-10 pr-11 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="absolute right-1.5 rounded-control p-1.5 text-text-muted transition-state hover:bg-bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined block text-lg">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    )

    if (!label && !error && !hint) return control
    return (
      <Field label={label} error={error} hint={hint} htmlFor={inputId}>
        {control}
      </Field>
    )
  }
)

export default PasswordInput
