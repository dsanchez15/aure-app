import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { Field, type FieldProps } from './Field'
import { fieldControlBase, fieldSizeClasses, type FieldSize } from './fieldStyles'

export { FieldWrapper, type FieldWrapperProps } from './Field'
export { fieldControlBase, fieldSizeClasses, type FieldSize }

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  fieldSize?: FieldSize
  /** Icono de Material Symbols a la izquierda del valor. */
  leadingIcon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, fieldSize = 'md', leadingIcon, className = '', id, ...props },
  ref
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const classes = `${fieldControlBase} ${fieldSizeClasses[fieldSize]} ${leadingIcon ? 'pl-10' : ''} ${className}`

  const control = (
    <input
      ref={ref}
      id={inputId}
      className={classes}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )

  const field = leadingIcon ? (
    <div className="relative flex items-center">
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute left-3 text-lg text-text-muted"
      >
        {leadingIcon}
      </span>
      {control}
    </div>
  ) : (
    control
  )

  if (!label && !error && !hint) return field
  return (
    <Field label={label} error={error} hint={hint} htmlFor={inputId}>
      {field}
    </Field>
  )
})

export default Input

export type { FieldProps }
