export interface FilterFieldProps {
  label: string
  className?: string
  children: React.ReactNode
}

/** Etiqueta mono + control, unidad básica de una barra de filtros. */
export function FilterField({ label, className = '', children }: FilterFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="px-1 font-mono text-label-sm uppercase tracking-wide text-text-muted">{label}</span>
      {children}
    </div>
  )
}

export default FilterField
