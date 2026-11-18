import { SelectHTMLAttributes, forwardRef, useId } from 'react'
import { Field } from './Field'
import { fieldControlBase, fieldSizeClasses, fieldWidth, type FieldSize } from './fieldStyles'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  fieldSize?: FieldSize
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, fieldSize = 'md', className = '', id, children, ...props },
  ref
) {
  const autoId = useId()
  const selectId = id ?? autoId
  const field = (
    <select
      ref={ref}
      id={selectId}
      className={`${fieldControlBase} ${fieldWidth(className)} ${fieldSizeClasses[fieldSize]} pr-8 ${className}`}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {children}
    </select>
  )
  if (!label && !error && !hint) return field
  return (
    <Field label={label} error={error} hint={hint} htmlFor={selectId}>
      {field}
    </Field>
  )
})

export default Select
