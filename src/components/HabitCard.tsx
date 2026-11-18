'use client'

import { useState } from 'react'
import { Habit, HabitFormData, HabitState } from '@/types/habit'
import { calculateStreak, getTodayDateString, getLast7Days, isCompletedOnDate } from '@/lib/habit-utils'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Badge, Button, Card, Modal } from '@/components/ui'

interface HabitCardProps {
  habit: Habit
  onUpdate: (id: number, data: HabitFormData) => void
  onDelete: (id: number) => void
  onToggleCompletion?: (id: number, date: string, completed: boolean) => void
  onStateChange?: (id: number, state: HabitState) => Promise<void>
  onEdit?: () => void
  mode?: 'planning' | 'action'
}

export default function HabitCard({
  habit,
  onUpdate: _onUpdate,
  onDelete,
  onToggleCompletion,
  onStateChange,
  onEdit,
  mode = 'planning',
}: HabitCardProps) {
  const { t } = useAppTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [stateLoading, setStateLoading] = useState(false)

  const today = getTodayDateString()
  const isCompletedToday = isCompletedOnDate(habit.completions, today)
  const last7Days = getLast7Days()
  const streak = calculateStreak(habit.completions, habit.goalType, habit.goalValue)

  const handleStateChange = async (newState: HabitState) => {
    if (!onStateChange) return
    setStateLoading(true)
    try {
      await onStateChange(habit.id, newState)
    } finally {
      setStateLoading(false)
    }
  }

  const stateActions: { label: string; state: HabitState; toneClass: string }[] = []
  if (habit.state === 'Active') {
    stateActions.push(
      { label: t('habits.card.pause'), state: 'Paused', toneClass: 'text-warning' },
      { label: t('habits.card.archive'), state: 'Archived', toneClass: 'text-text-secondary' }
    )
  } else if (habit.state === 'Paused') {
    stateActions.push(
      { label: t('habits.card.activate'), state: 'Active', toneClass: 'text-success' },
      { label: t('habits.card.archive'), state: 'Archived', toneClass: 'text-text-secondary' }
    )
  } else if (habit.state === 'Archived') {
    stateActions.push({ label: t('habits.card.reactivate'), state: 'Active', toneClass: 'text-success' })
  }

  const goalTypeLabel =
    habit.goalType === 'Daily'
      ? t('habits.goalTypes.daily')
      : habit.goalType === 'Weekly'
        ? t('habits.goalTypes.weekly')
        : habit.goalType === 'Monthly'
          ? t('habits.goalTypes.monthly')
          : t('habits.goalTypes.ratio')

  const stateVariant = habit.state === 'Active' ? 'success' : habit.state === 'Paused' ? 'warning' : 'neutral'
  const stateLabel =
    habit.state === 'Active'
      ? t('habits.card.statusActive')
      : habit.state === 'Paused'
        ? t('habits.card.statusPaused')
        : t('habits.card.statusArchived')

  return (
    <>
      <Card
        padding="lg"
        className="flex flex-col gap-4 border-l-4"
        style={{ borderLeftColor: habit.color }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-title-md text-text-primary">{habit.title}</h3>
              <Badge variant={stateVariant}>{stateLabel}</Badge>
              {habit.category && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-bg-surface-hover px-2 py-0.5 font-label text-label-sm text-text-muted">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-pill"
                    style={{ backgroundColor: habit.category.color }}
                  />
                  {habit.category.name}
                </span>
              )}
            </div>
            {habit.description && (
              <p className="mt-1 font-body text-body-md text-text-muted">{habit.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-3 font-label text-label-sm text-text-muted">
              <span>
                {t('habits.card.goalLabel', {
                  type: goalTypeLabel,
                  value: habit.goalValue,
                  unit: habit.goalType === 'Ratio' ? '%' : 'x',
                })}
              </span>
              {habit.isPermanent ? (
                <span>{t('habits.card.permanent')}</span>
              ) : (
                <span>
                  {habit.startDate ? new Date(habit.startDate).toLocaleDateString() : ''} –{' '}
                  {habit.endDate ? new Date(habit.endDate).toLocaleDateString() : ''}
                </span>
              )}
              {habit.objective && (
                <span>{t('habits.card.objectiveLabel', { name: habit.objective.name })}</span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-text-muted hover:text-primary"
                title={t('habits.card.edit')}
                aria-label={t('habits.card.edit')}
                onClick={onEdit}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  edit
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-text-muted hover:bg-danger/10 hover:text-danger"
              title={t('habits.card.deleteTitle')}
              aria-label={t('habits.card.deleteTitle')}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                delete
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onToggleCompletion && mode === 'planning' && (
            <Button
              variant="secondary"
              size="sm"
              className={
                isCompletedToday
                  ? 'border-success/40 bg-success/10 text-success'
                  : 'text-text-secondary'
              }
              onClick={() => onToggleCompletion(habit.id, today, !isCompletedToday)}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                {isCompletedToday ? 'check_circle' : 'check'}
              </span>
              {isCompletedToday ? t('habits.card.completedToday') : t('habits.card.markDone')}
            </Button>
          )}

          {streak > 0 && (
            <span className="inline-flex items-center gap-1 font-label text-label-md text-warning">
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                local_fire_department
              </span>
              {t('habits.card.streakDays', { count: streak })}
            </span>
          )}

          {mode === 'planning' &&
            onStateChange &&
            stateActions.map((action) => (
              <Button
                key={action.state}
                variant="ghost"
                size="sm"
                className={action.toneClass}
                disabled={stateLoading}
                onClick={() => handleStateChange(action.state)}
              >
                {stateLoading ? '…' : action.label}
              </Button>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-2 font-label text-label-sm text-text-muted">
            {t('habits.card.last7Days')}
          </span>
          {last7Days.map((date) => {
            const isCompleted = isCompletedOnDate(habit.completions, date)
            const dayName = new Date(date).toLocaleDateString(undefined, { weekday: 'narrow' })
            return (
              <span
                key={date}
                className={`flex h-8 w-8 items-center justify-center rounded-control font-mono text-label-sm ${
                  isCompleted
                    ? 'bg-success text-text-inverse'
                    : 'bg-bg-surface-hover text-text-muted'
                }`}
                title={new Date(date).toLocaleDateString()}
              >
                {dayName}
              </span>
            )
          })}
        </div>

        {habit.blockers && habit.blockers.length > 0 && (
          <p className="font-label text-label-sm text-text-muted">
            <span className="font-medium">{t('habits.card.blockersLabel')}</span>{' '}
            {habit.blockers.map((b) => b.blockerHabit?.title).join(', ')}
          </p>
        )}
      </Card>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('habits.card.deleteConfirmTitle')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(habit.id)
                setShowDeleteConfirm(false)
              }}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="font-body text-body-md text-text-secondary">
          {t('habits.card.deleteConfirmMessage', { title: habit.title })}
        </p>
      </Modal>
    </>
  )
}
