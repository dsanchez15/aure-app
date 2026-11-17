'use client'

import { Badge, Button } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { getProgress, getStatus } from './helpers'
import type { Checklist } from '@/types/checklist'

interface ChecklistCardProps {
  checklist: Checklist
  isExpanded: boolean
  isTemplate: boolean
  isHistory: boolean
  onToggleExpand: (id: number) => void
  onEdit: (c: Checklist) => void
  onDuplicate: (id: number) => void
  onDelete: (id: number) => void
  onArchive?: (id: number) => void
  onInstantiateTemplate?: (template: Checklist) => void
  children?: React.ReactNode
}

export default function ChecklistCard({
  checklist: c,
  isExpanded,
  isTemplate,
  isHistory,
  onToggleExpand,
  onEdit,
  onDuplicate,
  onDelete,
  onArchive,
  onInstantiateTemplate,
  children,
}: ChecklistCardProps) {
  const { t } = useAppTranslation()
  const progress = getProgress(c)
  const status = getStatus(c)

  const itemsList = Array.isArray(c.items) ? c.items : []
  const checklistWithMetrics = c as Checklist & {
    metrics?: { totalItems: number; completedItems: number; completionPercentage: number; totalEffort: number }
  }
  const metrics = checklistWithMetrics.metrics

  const stop =
    (action: () => void) =>
    (event: React.MouseEvent) => {
      event.stopPropagation()
      action()
    }

  return (
    <div
      className={`overflow-hidden rounded-card border bg-bg-surface transition-surface ${
        isExpanded ? 'border-primary/40 shadow-sm' : 'border-border hover:border-border-hover'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => onToggleExpand(c.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggleExpand(c.id)
          }
        }}
        className="group cursor-pointer p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                aria-hidden="true"
                className={`material-symbols-outlined text-lg text-text-muted transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              >
                chevron_right
              </span>
              {c.category && (
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-lg"
                  style={{ color: c.category.color }}
                >
                  {c.category.icon}
                </span>
              )}
              <h3 className="truncate font-display text-title-md text-text-primary">{c.title}</h3>
              {isTemplate && c.version && <Badge variant="neutral">v{c.version}</Badge>}
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            {c.description && (
              <p className="ml-7 truncate font-body text-body-md text-text-muted">{c.description}</p>
            )}
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {isTemplate && onInstantiateTemplate && (
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-secondary hover:text-success"
                title={t('checklists.instantiate')}
                aria-label={t('checklists.instantiate')}
                onClick={stop(() => onInstantiateTemplate(c))}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  play_arrow
                </span>
              </Button>
            )}
            {!isHistory && (
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-secondary hover:text-primary"
                title={t('common.edit')}
                aria-label={t('common.edit')}
                onClick={stop(() => onEdit(c))}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  edit
                </span>
              </Button>
            )}
            {!isTemplate && !isHistory && (
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-secondary hover:text-primary"
                title={t('checklists.duplicate')}
                aria-label={t('checklists.duplicate')}
                onClick={stop(() => onDuplicate(c.id))}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  content_copy
                </span>
              </Button>
            )}
            {!isTemplate && !isHistory && onArchive && (
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-secondary hover:text-warning"
                title={t('checklists.card.archive')}
                aria-label={t('checklists.card.archive')}
                onClick={stop(() => onArchive(c.id))}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  archive
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="px-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger"
              title={t('common.delete')}
              aria-label={t('common.delete')}
              onClick={stop(() => onDelete(c.id))}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                delete
              </span>
            </Button>
          </div>
        </div>

        <div className="ml-7 mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-pill bg-bg-surface-hover">
            <div
              className="h-full rounded-pill"
              style={{ width: `${progress}%`, backgroundColor: c.color }}
            />
          </div>
          <span className="shrink-0 font-mono text-label-sm tabular-nums text-text-muted">
            {t('checklists.itemsCount', {
              completed: itemsList.filter((i) => i.completed).length,
              total: itemsList.length,
              progress,
            })}
          </span>
        </div>

        {isHistory && metrics && (
          <div className="ml-7 mt-2 flex flex-wrap gap-3 font-label text-label-sm text-text-muted">
            <span>{t('checklists.historyMetrics.items', { count: metrics.totalItems })}</span>
            <span>{t('checklists.historyMetrics.completed', { count: metrics.completedItems })}</span>
            <span>{t('checklists.historyMetrics.completion', { count: metrics.completionPercentage })}</span>
            {metrics.totalEffort > 0 && (
              <span>
                {t('checklists.historyMetrics.effort', {
                  hours: Math.floor(metrics.totalEffort / 60),
                  minutes: metrics.totalEffort % 60,
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {isExpanded && children}
    </div>
  )
}
