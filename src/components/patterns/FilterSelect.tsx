'use client'

export interface FilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

/** Select compacto (28 px) con el mismo lenguaje visual que `SegmentedControl xs`. */
export function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  return (
    <label className="inline-flex h-7 w-full items-center rounded-control border border-border bg-bg-surface px-2 transition-state focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full bg-bg-surface font-mono text-label-sm text-text-primary focus:outline-none"
      >
        {children}
      </select>
    </label>
  )
}

export default FilterSelect
