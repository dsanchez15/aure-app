export interface SkeletonProps {
  className?: string
  /** Número de líneas. Si es > 1 se apilan. */
  lines?: number
}

/** Placeholder de carga. Solo para bloques; nunca para simular texto editable. */
export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  const base = 'animate-pulse rounded-control bg-bg-surface-hover'
  if (lines <= 1) {
    return <div aria-hidden="true" className={`${base} h-4 w-full ${className}`} />
  }
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${base} h-4 ${index === lines - 1 ? 'w-2/3' : 'w-full'} ${className}`}
        />
      ))}
    </div>
  )
}

export default Skeleton
