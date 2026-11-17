export interface MetaItem {
  label: string
  value: React.ReactNode
}

export interface MetaGridProps {
  items: MetaItem[]
  columns?: 1 | 2
  className?: string
}

/**
 * Pares etiqueta/valor para paneles de detalle (drawer, sidebar de tarea).
 * La etiqueta usa Fragment Mono en mayúsculas; el valor, body-md.
 * Para valores vacíos usar "Ninguno" desde el consumidor (i18n).
 */
export function MetaGrid({ items, columns = 2, className = '' }: MetaGridProps) {
  return (
    <dl className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'} ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <dt className="font-mono text-label-sm uppercase tracking-wider text-text-muted">{item.label}</dt>
          <dd className="font-body text-body-md text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default MetaGrid
