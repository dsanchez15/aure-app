'use client'

import { Badge, Button } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { formatReminderDate, reminderPriorityConfig } from './helpers'
import type { Reminder, ReminderPriority } from '@/types/reminder'

interface ReminderCardProps {
  reminder: Reminder
  onToggle: (reminder: Reminder) => void
  onEdit: (reminder: Reminder) => void
  onDelete: (id: number) => void
}

export default function ReminderCard({ reminder: r, onToggle, onEdit, onDelete }: ReminderCardProps) {
  const { t } = useAppTranslation()
  const prio = reminderPriorityConfig[r.priority as ReminderPriority] || reminderPriorityConfig.normal
  const due = formatReminderDate(r.dueDate, t)

  return (
    <div
      className={`group flex items-start gap-3 rounded-card border p-4 transition-surface ${
        r.completed ? 'border-border bg-bg-surface-hover opacity-60' : `border-border bg-bg-surface hover:border-border-hover ${prio.cardClass}`
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(r)}
        role="checkbox"
        aria-checked={r.completed}
        aria-label={r.title}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border-2 transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          r.completed
            ? 'border-success bg-success text-text-inverse'
            : 'border-border-strong hover:border-success'
        }`}
      >
        {r.completed && (
          <span aria-hidden="true" className="material-symbols-outlined text-sm">
            check
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-label text-label-lg ${
              r.completed ? 'text-text-muted line-through' : 'text-text-primary'
            }`}
          >
            {r.title}
          </span>
          <span aria-hidden="true" className={`material-symbols-outlined text-sm ${prio.iconClass}`}>
            {prio.icon}
          </span>
          {r.sourceModule && (
            <Badge variant="neutral" className="capitalize">
              {r.sourceModule}
            </Badge>
          )}
        </div>
        {r.description && (
          <p className="mt-0.5 truncate font-body text-body-md text-text-secondary">{r.description}</p>
        )}
        <p className={`mt-1 flex items-center gap-1 font-mono text-label-sm ${due.className}`}>
          <span aria-hidden="true" className="material-symbols-outlined text-sm">
            schedule
          </span>
          {due.text}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-text-secondary hover:text-primary"
          onClick={() => onEdit(r)}
          aria-label={t('common.edit')}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-lg">
            edit
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-text-secondary hover:bg-danger/10 hover:text-danger"
          onClick={() => onDelete(r.id)}
          aria-label={t('common.delete')}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-lg">
            delete
          </span>
        </Button>
      </div>
    </div>
  )
}
