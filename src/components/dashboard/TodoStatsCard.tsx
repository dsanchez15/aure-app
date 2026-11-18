'use client'

import { useEffect, useState } from 'react'
import { Card, SectionHeader, Skeleton } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { apiClient } from '@/lib/api-client'
import { formatEffort } from '@/lib/todo-utils'
import type { TodoMetrics } from '@/types/todo'

/**
 * Estadísticas globales de tareas. Vivían en el detalle de la tarea; ahora
 * pertenecen al Panel, donde se leen de un vistazo.
 */
export default function TodoStatsCard() {
  const { t } = useAppTranslation()
  const [metrics, setMetrics] = useState<TodoMetrics | null>(null)

  useEffect(() => {
    let active = true
    apiClient
      .get<TodoMetrics>('/api/todos/metrics')
      .then((data) => {
        if (active) setMetrics(data)
      })
      .catch(() => {
        // Best-effort: el panel sigue funcionando sin estadísticas.
      })
    return () => {
      active = false
    }
  }, [])

  const rows = metrics
    ? [
        { label: t('todos.statistics.allTasks'), value: metrics.total, className: 'text-text-primary' },
        { label: t('todos.statuses.pending'), value: metrics.pending, className: 'text-info' },
        { label: t('todos.statuses.completed'), value: metrics.completed, className: 'text-success' },
        { label: t('todos.overdue'), value: metrics.overdue, className: 'text-danger' },
      ]
    : []

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader title={t('todos.statistics.title')} description={t('todos.statistics.subtitle')} icon="insights" />

      {metrics ? (
        <>
          <div className="flex flex-col gap-2.5">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="font-label text-label-md text-text-secondary">{row.label}</span>
                <span className={`font-mono text-title-md tabular-nums ${row.className}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-control bg-bg-surface-hover p-3">
              <p className="font-mono text-label-sm uppercase tracking-wider text-text-muted">
                {t('todos.statistics.effort')}
              </p>
              <p className="mt-0.5 font-mono text-title-md tabular-nums text-text-primary">
                {formatEffort(metrics.totalEffortMinutes)}
              </p>
            </div>
            <div className="rounded-control bg-bg-surface-hover p-3">
              <p className="font-mono text-label-sm uppercase tracking-wider text-text-muted">
                {t('todos.statistics.compliance')}
              </p>
              <p className="mt-0.5 font-mono text-title-md tabular-nums text-text-primary">
                {metrics.completionRate}%
              </p>
            </div>
          </div>
        </>
      ) : (
        <Skeleton lines={4} />
      )}
    </Card>
  )
}
