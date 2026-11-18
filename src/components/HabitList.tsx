'use client'

import { useState, useEffect, useCallback } from 'react'
import HabitCard from './HabitCard'
import HabitForm from './HabitForm'
import { Habit, HabitFormData } from '@/types/habit'
import { getTodayDateString, isCompletedOnDate } from '@/lib/habit-utils'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, EmptyState, SectionHeader, Spinner } from '@/components/ui'

export default function HabitList() {
  const { t } = useAppTranslation()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/habits')
      if (!response.ok) throw new Error('Failed to fetch habits')
      const data = await response.json()
      setHabits(data)
    } catch (err) {
      setError(t('habits.errors.loadData'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleCreateHabit = async (data: HabitFormData) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create habit')
      const newHabit = await response.json()
      setHabits([newHabit, ...habits])
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert(t('habits.errors.create'))
    }
  }

  const handleUpdateHabit = async (id: number, data: HabitFormData) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update habit')
      const updatedHabit = await response.json()
      setHabits(habits.map((h) => (h.id === id ? updatedHabit : h)))
    } catch (err) {
      console.error(err)
      alert(t('habits.errors.update'))
    }
  }

  const handleDeleteHabit = async (id: number) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete habit')
      setHabits(habits.filter((h) => h.id !== id))
    } catch (err) {
      console.error(err)
      alert(t('habits.errors.deleteHabit'))
    }
  }

  const handleToggleCompletion = async (id: number, date: string, completed: boolean) => {
    try {
      if (completed) {
        const response = await fetch(`/api/habits/${id}/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date }),
        })
        if (!response.ok) throw new Error('Failed to create completion')
        const newCompletion = await response.json()
        setHabits(
          habits.map((h) =>
            h.id === id
              ? { ...h, completions: [...h.completions, newCompletion] }
              : h
          )
        )
      } else {
        const response = await fetch(`/api/habits/${id}/completions?date=${date}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete completion')
        setHabits(
          habits.map((h) =>
            h.id === id
              ? {
                ...h,
                completions: h.completions.filter(
                  (c) => new Date(c.date).toISOString().split('T')[0] !== date
                ),
              }
              : h
          )
        )
      }
    } catch (err) {
      console.error(err)
      alert(t('habits.errors.updateCompletion'))
    }
  }

  const totalCompletionsToday = habits.filter((h) =>
    isCompletedOnDate(h.completions, getTodayDateString())
  ).length

  if (loading) {
    return <Spinner size="lg" className="min-h-96" />
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-body text-body-md text-danger">{error}</p>
        <Button className="mt-4" onClick={fetchHabits}>
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('habits.myHabits')}
        description={
          habits.length === 0
            ? t('habits.noHabitsRegistered')
            : t('habits.habitSummary', { count: habits.length, plural: habits.length !== 1 ? 's' : '', completed: totalCompletionsToday })
        }
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{t('habits.cancelHabit')}</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('habits.newHabitBtn')}</span>
              </>
            )}
          </Button>
        }
      />

      {showForm && (
        <div className="rounded-card border border-border bg-bg-surface-hover p-6">
          <h3 className="mb-4 font-display text-title-md text-text-primary">{t('habits.createHabit')}</h3>
          <HabitForm onSubmit={handleCreateHabit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {habits.length === 0 ? (
        <EmptyState
          title={t('habits.stillNoHabits')}
          description={t('habits.startHabitTip')}
        />
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleUpdateHabit}
              onDelete={handleDeleteHabit}
              onToggleCompletion={handleToggleCompletion}
            />
          ))}
        </div>
      )}
    </div>
  )
}
