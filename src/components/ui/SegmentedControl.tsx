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
  /** xs = 28 px para barras de filtro densas · sm = 32 px · md = 36 px */
  size?: 'xs' | 'sm' | 'md'
  fullWidth?: boolean
}

const sizeClasses = {
  xs: 'h-6 px-2 font-mono text-label-sm',
  sm: 'h-8 px-2.5 font-mono text-label-sm',
  md: 'h-9 px-3 font-label text-label-md',
} as const

const containerClasses = {
  xs: 'gap-0.5 p-px',
  sm: 'gap-1 p-1',
  md: 'gap-1 p-1',
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
      className={`inline-flex ${containerClasses[size]} rounded-control border border-border bg-bg-surface ${
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
            className={`inline-flex min-w-0 flex-1 items-center justify-center rounded-sm transition-state focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              sizeClasses[size]
            } ${
              selected
                ? 'bg-primary text-text-inverse'
                : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
            }`}
          >
            <span className="truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
