import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  /** Línea mono sobre el título (contexto: fecha, sección, módulo). */
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/** Cabecera de página: único `h1` de la vista + acciones. */
export function PageHeader({ title, eyebrow, description, actions, className = '' }: PageHeaderProps) {
  return (
    <header className={`flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 font-mono text-label-sm uppercase tracking-wider text-text-muted">{eyebrow}</p>
        )}
        <h1 className="font-display text-headline-md text-text-primary lg:text-headline-lg">{title}</h1>
        {description && (
          <p className="mt-1 font-body text-body-md text-text-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export default PageHeader;
