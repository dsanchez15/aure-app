'use client'

import { useState } from 'react'
import { Habit, HabitWithMetrics } from '@/types/habit'
import { calculateStreak, calculateCompletionRate, getPeriodLabel, getPeriodRangeText, getTodayDateString, isCompletedOnDate, getLevelName } from '@/lib/habit-utils'
import UserProgressionBadge from './UserProgressionBadge'
import EnergySelector from './EnergySelector'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Card, EmptyState, SectionHeader, Spinner } from '@/components/ui'

interface ToggleCompletionResult {
  xp?: {
    newXP: number
    newLevel: number
    leveledUp: boolean
    milestone: string | null
  }
}

interface ActionViewProps {
  habits: Habit[]
  onToggleCompletion: (id: number, date: string, completed: boolean) => Promise<ToggleCompletionResult | undefined>
  loading?: boolean
}

interface XPPopup {
  id: number
  xp: number
  newLevel: number
  leveledUp: boolean
  milestone: string | null
}

export default function ActionView({ habits, onToggleCompletion, loading }: ActionViewProps) {
  const { t } = useAppTranslation()
  const [completingId, setCompletingId] = useState<number | null>(null)
  const [xpPopups, setXpPopups] = useState<XPPopup[]>([])
  const today = getTodayDateString()

  // Filter only active habits that are within their cycle
  const activeHabits = habits.filter((h) => {
    if (h.state !== 'Active') return false
    if (!h.isPermanent && h.endDate) {
      const end = new Date(h.endDate)
      end.setHours(23, 59, 59, 999)
      if (new Date() > end) return false
    }
    if (!h.isPermanent && h.startDate) {
      const start = new Date(h.startDate)
      start.setHours(0, 0, 0, 0)
      if (new Date() < start) return false
    }
    return true
  })

  const habitsWithMetrics: HabitWithMetrics[] = activeHabits.map((h) => ({
    ...h,
    metrics: {
      currentStreak: calculateStreak(h.completions, h.goalType, h.goalValue),
      completionRate: calculateCompletionRate(h.completions, h.goalType, h.goalValue),
      completionsThisPeriod: h.completions.filter((c) => {
        const cDate = new Date(c.date).toISOString().split('T')[0]
        return cDate === today
      }).length,
      periodTotal: h.goalValue,
    },
  }))

  const completedCount = habitsWithMetrics.filter((h) =>
    isCompletedOnDate(h.completions, today)
  ).length

  const handleToggle = async (id: number, completed: boolean) => {
    setCompletingId(id)
    try {
      const result = await onToggleCompletion(id, today, !completed)
      if (result?.xp) {
        const popup: XPPopup = {
          id: Date.now(),
          xp: result.xp.newXP,
          newLevel: result.xp.newLevel,
          leveledUp: result.xp.leveledUp,
          milestone: result.xp.milestone,
        }
        setXpPopups((prev) => [...prev, popup])
        setTimeout(() => {
          setXpPopups((prev) => prev.filter((p) => p.id !== popup.id))
        }, 4000)
      }
    } finally {
      setCompletingId(null)
    }
  }

  if (loading) {
    return <Spinner size="lg" className="min-h-96" />
  }

  return (
    <div className="relative space-y-6">
      {/* XP Popups */}
      {xpPopups.length > 0 && (
        <div className="fixed right-4 top-4 z-50 space-y-2">
          {xpPopups.map((popup) => (
            <Card key={popup.id} padding="md" className="shadow-lg">
              {popup.leveledUp && (
                <div className="mb-2 text-center">
                  <span aria-hidden="true" className="text-headline-md">🎉</span>
                  <p className="font-display text-title-lg text-primary">{t('habits.action.levelUp')}</p>
                  <p className="font-body text-body-md text-text-secondary">{t('habits.action.level', { level: popup.newLevel, name: getLevelName(popup.newLevel) })}</p>
                </div>
              )}
              {popup.milestone && (
                <p className="text-center font-label text-label-md text-warning">
                  🏆 {popup.milestone}
                </p>
              )}
              {!popup.leveledUp && !popup.milestone && (
                <p className="text-center font-body text-body-md text-text-secondary">
                  +{popup.xp} XP
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <SectionHeader
        title={t('habits.action.title')}
        description={t('habits.action.completedToday', { completed: completedCount, total: habitsWithMetrics.length })}
        actions={<UserProgressionBadge />}
      />

      {/* Summary */}
      {habitsWithMetrics.length > 0 && (
        <Card padding="md">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 overflow-hidden rounded-pill bg-bg-input">
                <div
                  className="h-full rounded-pill bg-success transition-surface"
                  style={{
                    width: `${habitsWithMetrics.length > 0 ? (completedCount / habitsWithMetrics.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <span className="font-label text-label-lg text-text-secondary">
              {Math.round((completedCount / Math.max(1, habitsWithMetrics.length)) * 100)}%
            </span>
          </div>
        </Card>
      )}

      {habitsWithMetrics.length === 0 ? (
        <EmptyState
          title={t('habits.action.noActiveHabits')}
          description={t('habits.action.createInPlanning')}
        />
      ) : (
        <div className="grid gap-3">
          {habitsWithMetrics.map((habit) => {
            const isCompleted = isCompletedOnDate(habit.completions, today)
            const progress = Math.min(100, (habit.metrics.completionsThisPeriod / Math.max(1, habit.goalValue)) * 100)
            const periodLabel = getPeriodLabel(habit.goalType)
            const periodRange = getPeriodRangeText(habit.goalType)

            return (
              <Card
                key={habit.id}
                padding="md"
                className={`border-l-4 transition-surface hover:border-border-hover hover:shadow-md ${
                  isCompleted ? 'opacity-75' : ''
                }`}
                style={{ borderLeftColor: habit.color }}
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggle(habit.id, isCompleted)}
                    disabled={completingId === habit.id}
                    aria-pressed={isCompleted}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-control transition-state ${
                      isCompleted
                        ? 'bg-success/15 text-success hover:bg-success/20'
                        : 'bg-bg-input text-text-muted hover:bg-bg-surface-hover hover:text-text-secondary'
                    }`}
                  >
                    {completingId === habit.id ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
                    ) : isCompleted ? (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3 className={`truncate font-display text-title-md ${isCompleted ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                      {habit.title}
                    </h3>
                    <p className="mt-0.5 font-label text-label-sm text-text-muted">
                      {habit.metrics.completionsThisPeriod} / {habit.goalValue} {periodLabel}
                      {periodRange && ` (${periodRange})`}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-pill bg-bg-input">
                      <div
                        className="h-full rounded-pill transition-surface"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>

                  {habit.metrics.currentStreak > 0 && (
                    <div className="flex shrink-0 items-center gap-1 text-warning">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879.586.585.88 1.2.879 1.879 0 1.5-1.12 2.99-2.76 2.99-1.339 0-2.4-.78-2.87-1.75M7 17v2h6v-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="font-label text-label-md">{habit.metrics.currentStreak}</span>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* End of day summary */}
      {habitsWithMetrics.length > 0 && (
        <div className="rounded-card border border-border bg-primary-light p-4">
          <p className="font-body text-body-md text-text-secondary">
            {completedCount === habitsWithMetrics.length
              ? t('habits.action.allCompleted')
              : completedCount === 0
              ? t('habits.action.startMomentum')
              : t('habits.action.progress', { completed: completedCount, total: habitsWithMetrics.length })}
          </p>
        </div>
      )}

      {/* Energy Selector */}
      <EnergySelector />
    </div>
  )
}
