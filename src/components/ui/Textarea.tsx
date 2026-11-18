import { TextareaHTMLAttributes, useId } from 'react'
import { Field } from './Field'
import { fieldControlBase, fieldWidth } from './fieldStyles'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', id, rows = 3, ...props }: TextareaProps) {
  const autoId = useId()
  const textareaId = id ?? autoId
  const field = (
    <textarea
      id={textareaId}
      rows={rows}
      className={`${fieldControlBase} ${fieldWidth(className)} px-4 py-2.5 ${className}`}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
  if (!label && !error && !hint) return field
  return (
    <Field label={label} error={error} hint={hint} htmlFor={textareaId}>
      {field}
    </Field>
  )
}

export default Textarea
