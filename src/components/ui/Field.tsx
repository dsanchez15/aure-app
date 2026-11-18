import { ReactNode } from 'react'

export interface FieldProps {
  label?: string
  error?: string
  hint?: string
  htmlFor?: string
  required?: boolean
  className?: string
  children: ReactNode
}

/**
 * Envoltorio estándar de campo: label + control + ayuda/error.
 * Los mensajes usan tokens de tipografía y color; nunca tamaños crudos.
 */
export function Field({ label, error, hint, htmlFor, required = false, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block font-label text-label-md text-text-secondary">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="mt-1.5 font-label text-label-md text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="mt-1.5 font-label text-label-md text-danger"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/** Compatibilidad: alias histórico de Field. */
export interface FieldWrapperProps {
  label?: string
  error?: string
  htmlFor?: string
  children: ReactNode
}

export function FieldWrapper({ label, error, htmlFor, children }: FieldWrapperProps) {
  return (
    <Field label={label} error={error} htmlFor={htmlFor}>
      {children}
    </Field>
  )
}

export default Field
