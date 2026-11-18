'use client'

import { Badge, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { DailyProgress, Goal } from '@/types/goal'

interface ActivityListProps {
  entries: DailyProgress[]
  goals: Goal[]
}

export default function ActivityList({ entries, goals }: ActivityListProps) {
  const { t, language: lang } = useAppTranslation()

  if (entries.length === 0) return null

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
      <SectionHeader title={t('progress.loggedActivities')} />
      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date
          const goal = goals.find((g) => g.id === entry.goalId)
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-control border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-mono text-label-sm uppercase text-text-muted">
                  {entryDate.toLocaleDateString(lang === 'es' ? 'es' : 'en', {
                    weekday: 'short',
                    day: 'numeric',
                  })}
                </span>
                {goal && (
                  <span className="truncate font-label text-label-lg text-text-primary">{goal.title}</span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {entry.workHours ? (
                  <Badge variant="primary">{entry.workHours.toFixed(1)}h</Badge>
                ) : null}
                {entry.studyHours ? (
                  <Badge variant="info">{entry.studyHours.toFixed(1)}h</Badge>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
