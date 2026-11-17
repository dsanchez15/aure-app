'use client'

import { Badge, Card, MetaGrid, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { formatDate, formatEffort } from '@/lib/todo-utils'
import type { Todo, TodoMetrics } from '@/types/todo'

interface TodoDetailsSidebarProps {
  todo: Todo | null
  metrics: TodoMetrics | null
}

function StatRow({
  dotClass,
  label,
  valueClass,
  value,
}: {
  dotClass?: string
  label: string
  valueClass?: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {dotClass && <span aria-hidden="true" className={`h-2 w-2 rounded-pill ${dotClass}`} />}
        <span className="font-label text-label-md text-text-secondary">{label}</span>
      </div>
      <span className={`font-mono text-title-md tabular-nums ${valueClass ?? 'text-text-primary'}`}>{value}</span>
    </div>
  )
}

export default function TodoDetailsSidebar({ todo, metrics }: TodoDetailsSidebarProps) {
  const { t } = useAppTranslation()

  const detailItems = [
    { label: t('todos.details.category'), value: todo?.category ? todo.category.name : t('todos.details.none') },
    {
      label: t('todos.details.status'),
      value: todo ? (
        <Badge variant={todo.completed ? 'success' : 'info'}>
          {todo.completed ? t('todos.statuses.completed') : t('todos.statuses.pending')}
        </Badge>
      ) : (
        t('todos.details.none')
      ),
    },
    {
      label: t('todos.details.priority'),
      value: todo?.priority ? t(`todos.priorities.${todo.priority}`) : t('todos.details.none'),
    },
    {
      label: t('todos.details.date'),
      value: todo?.dueDate
        ? `${formatDate(todo.dueDate)}${todo.dueTime ? ` ${todo.dueTime}` : ''}`
        : t('todos.details.none'),
    },
    {
      label: t('todos.details.effort'),
      value: todo && todo.effortMinutes > 0 ? formatEffort(todo.effortMinutes) : t('todos.details.none'),
    },
  ]

  return (
    <div className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-6 xl:w-72">
      <Card padding="lg" className="flex flex-col gap-4">
        <SectionHeader title={t('todos.details.title')} icon="info" />
        {todo?.title && (
          <p className="font-label text-label-lg text-text-primary">{todo.title}</p>
        )}
        <MetaGrid items={detailItems} />
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <SectionHeader
          title={t('todos.statistics.title')}
          description={t('todos.statistics.subtitle')}
          icon="insights"
        />
        {metrics ? (
          <>
            <div className="flex flex-col gap-2.5">
              <StatRow label={t('todos.statistics.allTasks')} value={metrics.total} />
              <StatRow
                dotClass="bg-info"
                valueClass="text-info"
                label={t('todos.statuses.pending')}
                value={metrics.pending}
              />
              <StatRow
                dotClass="bg-success"
                valueClass="text-success"
                label={t('todos.statuses.completed')}
                value={metrics.completed}
              />
              <StatRow
                dotClass="bg-danger"
                valueClass="text-danger"
                label={t('todos.overdue')}
                value={metrics.overdue}
              />
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
          <p className="font-body text-body-md text-text-muted">{t('common.loading')}</p>
        )}
      </Card>
    </div>
  )
}
