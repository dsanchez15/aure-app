'use client'

import { Button, Card, EmptyState, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { HabitTracker } from '@/types/dashboard'

interface HabitGridProps {
  habits: HabitTracker[]
  onMarkDone: (id: number) => void
}

export default function HabitGrid({ habits, onMarkDone }: HabitGridProps) {
  const { t } = useAppTranslation()

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title={t('dashboard.habitTrackers')} />
      {habits.length === 0 ? (
        <EmptyState icon="routine" title={t('dashboard.noHabits')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {habits.slice(0, 5).map((habit) => {
        const done = habit.completedToday
        return (
          <Card
            key={habit.id}
            padding="md"
            className={`flex flex-col gap-3 ${done ? 'border-success/30 bg-success/10' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-pill"
                  style={{ backgroundColor: habit.color }}
                />
                <h3
                  className={`truncate font-label text-label-lg ${
                    done ? 'text-success' : 'text-text-primary'
                  }`}
                >
                  {habit.title}
                </h3>
              </div>
              {done && (
                <span aria-hidden="true" className="material-symbols-outlined text-lg text-success">
                  check_circle
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="font-label text-label-sm text-text-muted">
                  {habit.streak > 0 ? t('dashboard.streakDays', { count: habit.streak }) : t('dashboard.startStreak')}
                </p>
                <p className="mt-0.5 truncate font-label text-label-sm text-text-muted">
                  {habit.goalType === 'Daily'
                    ? t('dashboard.dailyGoal')
                    : t('dashboard.goalFormat', { value: habit.goalValue, type: habit.goalType.toLowerCase() })}
                </p>
              </div>
              {!done && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 border-success/40 text-success hover:bg-success/10"
                  onClick={() => onMarkDone(habit.id)}
                >
                  {t('dashboard.markDone')}
                </Button>
              )}
            </div>
          </Card>
        )
      })}
        </div>
      )}
    </section>
  )
}
