'use client'

import { useAppTranslation } from '@/components/LanguageProvider'
import type { DailyProgress } from '@/types/goal'

interface WeekCalendarProps {
  entries: DailyProgress[]
  weekStart: Date
}

export default function WeekCalendar({ entries, weekStart }: WeekCalendarProps) {
  const { t } = useAppTranslation()

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    days.push(date)
  }

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const todayStr = new Date().toISOString().split('T')[0]

  const getEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return entries.find((entry) => {
      const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date
      return entryDate.toISOString().split('T')[0] === dateStr
    })
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(':')
    return `${h}:${m}`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const entry = getEntryForDate(date)
          const isToday = date.toISOString().split('T')[0] === todayStr
          const logged =
            (entry?.studyHours || 0) + (entry?.workHours || 0) > 0

          return (
            <div
              key={i}
              className={`flex flex-col items-center rounded-card border p-2 text-center ${
                entry ? 'border-border bg-bg-surface' : 'border-transparent'
              } ${isToday ? 'ring-2 ring-primary/30' : ''}`}
            >
              <p className="font-label text-label-sm text-text-muted">{dayLabels[i]}</p>
              <p className="mt-0.5 font-mono text-label-lg tabular-nums text-text-primary">{date.getDate()}</p>
              <div className="mt-2 flex w-full flex-col gap-1">
                {entry?.gymCompleted && (
                  <span
                    role="img"
                    aria-label={t('progress.gymCompleted')}
                    className="h-1.5 w-full rounded-pill bg-success"
                  />
                )}
                {entry?.sleepHours ? (
                  <span
                    role="img"
                    aria-label={`${t('progress.sleepHours')}: ${entry.sleepHours} h`}
                    className="h-1.5 w-full rounded-pill bg-info"
                  />
                ) : null}
                {logged && (
                  <span
                    role="img"
                    aria-label={t('progress.loggedHours', {
                      count: (entry?.studyHours || 0) + (entry?.workHours || 0),
                    })}
                    className="h-1.5 w-full rounded-pill bg-warning"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {entries.some((e) => e.plannedTime || e.actualTime) && (
        <div className="border-t border-border pt-4">
          <h4 className="mb-3 font-mono text-label-sm uppercase tracking-wider text-text-muted">
            {t('progress.plannedVsActual')}
          </h4>
          <div className="flex flex-col gap-2">
            {entries
              .filter((e) => e.plannedTime || e.actualTime)
              .map((entry) => {
                const entryDate = typeof entry.date === 'string' ? new Date(entry.date) : entry.date
                const planned = entry.plannedTime?.split(':').map(Number) || []
                const actual = entry.actualTime?.split(':').map(Number) || []
                const plannedMins = planned[0] * 60 + (planned[1] || 0)
                const actualMins = actual[0] * 60 + (actual[1] || 0)
                const diff = actualMins - plannedMins
                const isLate = diff > 0

                return (
                  <div key={entry.id} className="flex items-center justify-between gap-3">
                    <span className="font-label text-label-md text-text-secondary">
                      {entryDate.toLocaleDateString('es', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2">
                      {entry.plannedTime && (
                        <span className="rounded-control bg-info/10 px-2 py-0.5 font-mono text-label-sm text-info">
                          {formatTime(entry.plannedTime)}
                        </span>
                      )}
                      {entry.actualTime && (
                        <>
                          <span aria-hidden="true" className="font-mono text-label-sm text-text-muted">
                            →
                          </span>
                          <span
                            className={`rounded-control px-2 py-0.5 font-mono text-label-sm ${
                              isLate ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                            }`}
                          >
                            {formatTime(entry.actualTime)}
                          </span>
                        </>
                      )}
                      {entry.plannedTime && entry.actualTime && (
                        <span
                          className={`font-mono text-label-sm tabular-nums ${
                            isLate ? 'text-danger' : 'text-success'
                          }`}
                        >
                          {isLate ? '+' : ''}
                          {diff}min
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
