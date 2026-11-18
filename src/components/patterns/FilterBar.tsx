'use client'

import { useId } from 'react'
import { Badge, Button } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

export interface FilterBarProps {
  isOpen: boolean
  onToggle: () => void
  onClear?: () => void
  /** Solo se muestran cuando el panel está cerrado. */
  active: string[]
  summary?: React.ReactNode
  children: React.ReactNode
}

/**
 * Barra de filtros de listas: botón `Filtros`, chips de filtros activos,
 * limpiar y resumen vivo a la derecha. El panel lo compone cada pantalla.
 * Referencia: Tareas. Ver `docs/design-system.md` §Patrón de barra de filtros.
 */
export function FilterBar({ isOpen, onToggle, onClear, active, summary, children }: FilterBarProps) {
  const { t } = useAppTranslation()
  const panelId = `${useId()}-filters`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              filter_list
            </span>
            {t('common.filter')}
          </Button>

          {!isOpen &&
            active.map((chip) => (
              <Badge key={chip} variant="neutral">
                {chip}
              </Badge>
            ))}

          {active.length > 0 && onClear && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-danger">
              {t('common.clearFilters')}
            </Button>
          )}
        </div>

        {summary && (
          <p aria-live="polite" className="font-mono text-label-sm tabular-nums text-text-muted">
            {summary}
          </p>
        )}
      </div>

      {isOpen && (
        <div
          id={panelId}
          className="flex flex-col gap-2.5 rounded-card border border-border bg-bg-surface p-3"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default FilterBar
