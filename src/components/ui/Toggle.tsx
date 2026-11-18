'use client'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  ariaLabel?: string
}

export function Toggle({ checked, onChange, label, description, disabled = false, ariaLabel }: ToggleProps) {
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary' : 'bg-border-strong'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-pill bg-text-inverse shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )

  if (!label && !description) return toggle

  return (
    <span className="inline-flex items-center gap-3">
      {toggle}
      <span className="flex flex-col">
        {label && <span className="font-label text-label-lg text-text-primary">{label}</span>}
        {description && <span className="font-label text-label-md text-text-muted">{description}</span>}
      </span>
    </span>
  )
}

export default Toggle
