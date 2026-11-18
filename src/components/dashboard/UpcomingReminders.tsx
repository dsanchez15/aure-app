'use client'

import { Badge, Button, Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { UpcomingReminder } from '@/types/dashboard'

interface UpcomingRemindersProps {
  reminders: UpcomingReminder[]
  onMarkDone: (id: number) => void
}

export default function UpcomingReminders({ reminders, onMarkDone }: UpcomingRemindersProps) {
  const { t } = useAppTranslation()

  const badgeVariant = (daysUntil: number) =>
    daysUntil <= 1 ? 'danger' : daysUntil <= 3 ? 'warning' : 'neutral'

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader
        title={t('dashboard.upcomingReminders')}
        actions={<span className="font-label text-label-sm text-text-muted">{t('dashboard.next14Days')}</span>}
      />
      <div className="max-h-90 space-y-3 overflow-y-auto">
        {reminders.length === 0 && (
          <p className="py-4 text-center font-body text-body-md text-text-muted">
            {t('dashboard.noUpcomingReminders')}
          </p>
        )}
        {reminders.map((r) => (
          <div key={String(r.id)} className="flex items-center gap-3 rounded-control border border-border p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-info/15 text-info">
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                schedule
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-label text-label-lg text-text-primary">{r.title}</p>
              <p className="truncate font-mono text-label-sm text-text-muted">{r.dueDate}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge variant={badgeVariant(r.daysUntil)}>
                {r.daysUntil === 0 ? t('dashboard.todayReminder') : t('dashboard.daysUntil', { count: r.daysUntil })}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-0.5 text-info"
                onClick={() => {
                  const numericId = typeof r.id === 'string' ? parseInt(r.id.split('-')[0], 10) : r.id
                  onMarkDone(numericId)
                }}
              >
                {t('common.done')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
