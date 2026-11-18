'use client'

import { useState, useMemo } from 'react'
import { Habit } from '@/types/habit'
import { calculateStreak, calculateCompletionRate } from '@/lib/habit-utils'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Badge, Card, EmptyState, MetricCard, SectionHeader, Select, Spinner } from '@/components/ui'

interface ArchiveViewProps {
  habits: Habit[]
  loading?: boolean
}

export default function ArchiveView({ habits, loading }: ArchiveViewProps) {
  const { t } = useAppTranslation()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 5 }, (_, i) => currentYear - i)
  }, [])

  const months = [
    { value: 1, label: t('habits.archive.months.january') },
    { value: 2, label: t('habits.archive.months.february') },
    { value: 3, label: t('habits.archive.months.march') },
    { value: 4, label: t('habits.archive.months.april') },
    { value: 5, label: t('habits.archive.months.may') },
    { value: 6, label: t('habits.archive.months.june') },
    { value: 7, label: t('habits.archive.months.july') },
    { value: 8, label: t('habits.archive.months.august') },
    { value: 9, label: t('habits.archive.months.september') },
    { value: 10, label: t('habits.archive.months.october') },
    { value: 11, label: t('habits.archive.months.november') },
    { value: 12, label: t('habits.archive.months.december') },
  ]

  const periodStart = new Date(selectedYear, selectedMonth - 1, 1)
  const periodEnd = new Date(selectedYear, selectedMonth, 1)

  const periodData = useMemo(() => {
    return habits.map((habit) => {
      const periodCompletions = habit.completions.filter((c) => {
        const d = new Date(c.date)
        return d >= periodStart && d < periodEnd
      })

      const streak = calculateStreak(habit.completions, habit.goalType, habit.goalValue)
      const rate = calculateCompletionRate(periodCompletions, habit.goalType, habit.goalValue)

      return {
        habit,
        completions: periodCompletions.length,
        streak,
        rate,
      }
    })
  }, [habits, selectedYear, selectedMonth])

  const totalCompletions = periodData.reduce((sum, d) => sum + d.completions, 0)

  if (loading) {
    return <Spinner size="lg" className="min-h-96" />
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t('habits.archive.title')} description={t('habits.archive.subtitle')} />

      {/* Period Selector */}
      <div className="flex flex-wrap gap-3">
        <div className="w-40">
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
        </div>
        <div className="w-24">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label={t('habits.archive.totalCompletions')} value={totalCompletions} />
        <MetricCard
          label={t('habits.archive.activeHabits')}
          value={habits.filter((h) => h.state === 'Active').length}
        />
        <MetricCard
          label={t('habits.archive.bestStreak')}
          value={Math.max(0, ...periodData.map((d) => d.streak))}
        />
      </div>

      {/* Habit Breakdown */}
      <div className="space-y-3">
        <SectionHeader title={t('habits.archive.habitDetail')} />
        {periodData.length === 0 ? (
          <EmptyState title={t('habits.archive.noHabits')} />
        ) : (
          periodData.map(({ habit, completions, streak, rate }) => (
            <Card
              key={habit.id}
              padding="md"
              className="border-l-4"
              style={{ borderLeftColor: habit.color }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-title-md text-text-primary">{habit.title}</h3>
                  <p className="mt-0.5 font-label text-label-sm text-text-muted">
                    {t('habits.archive.completions', { count: completions })} · {t('habits.archive.currentStreak', { count: streak })} · {t('habits.archive.rate', { rate })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      habit.state === 'Active'
                        ? 'success'
                        : habit.state === 'Paused'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {habit.state === 'Active' ? t('habits.archive.status.active') : habit.state === 'Paused' ? t('habits.archive.status.paused') : t('habits.archive.status.archived')}
                  </Badge>
                </div>
              </div>

              {/* Streak chart - simple bar representation */}
              {habit.completions.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-0.5">
                    {Array.from({ length: Math.min(30, habit.completions.length) }, (_, i) => {
                      const completion = habit.completions[i]
                      return (
                        <div
                          key={i}
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: habit.color }}
                          title={new Date(completion.date).toLocaleDateString()}
                        />
                      )
                    })}
                  </div>
                  <p className="mt-1 font-label text-label-sm text-text-muted">{t('habits.archive.lastCompletions')}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
