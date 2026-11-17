export interface SectionHeaderProps {
  title: string
  icon?: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

/** Cabecera de sección o tarjeta: icono opcional + título + acciones. */
export function SectionHeader({ title, icon, description, actions, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-2">
        {icon && (
          <span aria-hidden="true" className="material-symbols-outlined text-xl text-primary">
            {icon}
          </span>
        )}
        <div>
          <h2 className="font-display text-title-md text-text-primary">{title}</h2>
          {description && <p className="mt-0.5 font-body text-body-md text-text-secondary">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

export default SectionHeader
