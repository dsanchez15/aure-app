'use client'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  size?: 'sm' | 'md'
  fullWidth?: boolean
}

const sizeClasses = {
  sm: 'h-8 px-2.5 font-mono text-label-sm',
  md: 'h-9 px-3 font-label text-label-md',
} as const

/**
 * Grupo de opciones exclusivas (2–6 valores). Reemplaza los botones sueltos
 * de configuración por un control con estado explícito.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex gap-1 rounded-control border border-border bg-bg-surface p-1 ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`inline-flex flex-1 items-center justify-center rounded-sm transition-state focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              sizeClasses[size]
            } ${
              selected
                ? 'bg-primary text-text-inverse'
                : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
