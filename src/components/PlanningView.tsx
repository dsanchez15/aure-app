'use client'

import { useState } from 'react'
import HabitCard from './HabitCard'
import HabitForm from './HabitForm'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Habit, Category, Objective, HabitFormData, HabitState } from '@/types/habit'
import { Button, Card, EmptyState, SegmentedControl, SectionHeader, Spinner } from '@/components/ui'

interface PlanningViewProps {
  habits: Habit[]
  categories: Category[]
  objectives: Objective[]
  onCreate: (data: HabitFormData) => Promise<void>
  onUpdate: (id: number, data: HabitFormData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onStateChange: (id: number, state: HabitState) => Promise<void>
  loading?: boolean
}

export default function PlanningView({
  habits,
  categories,
  objectives,
  onCreate,
  onUpdate,
  onDelete,
  onStateChange,
  loading,
}: PlanningViewProps) {
  const { t } = useAppTranslation()
  const [filter, setFilter] = useState<HabitState | 'All'>('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredHabits = filter === 'All'
    ? habits
    : habits.filter((h) => h.state === filter)

  const handleUpdate = async (id: number, data: HabitFormData) => {
    await onUpdate(id, data)
    setEditingId(null)
  }

  if (loading) {
    return <Spinner size="lg" className="min-h-96" />
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('habits.planning.title')}
        description={t('habits.planning.habitCount', { count: habits.length })}
        actions={
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null) }}>
            {showForm ? t('habits.planning.cancel') : t('habits.planning.newHabit')}
          </Button>
        }
      />

      {/* Filters */}
      <SegmentedControl<HabitState | 'All'>
        ariaLabel={t('common.filter')}
        options={[
          { value: 'All', label: t('habits.planning.filters.all') },
          { value: 'Active', label: t('habits.planning.filters.active') },
          { value: 'Paused', label: t('habits.planning.filters.paused') },
          { value: 'Archived', label: t('habits.planning.filters.archived') },
        ]}
        value={filter}
        onChange={setFilter}
      />

      {showForm && (
        <div className="rounded-card border border-border bg-bg-input p-6">
          <h3 className="mb-4 font-display text-title-md text-text-primary">{t('habits.planning.createHabit')}</h3>
          <HabitForm
            onSubmit={async (data) => { await onCreate(data); setShowForm(false) }}
            onCancel={() => setShowForm(false)}
            categories={categories}
            objectives={objectives}
          />
        </div>
      )}

      {filteredHabits.length === 0 ? (
        <EmptyState title={t('habits.planning.noHabits')} />
      ) : (
        <div className="grid gap-4">
          {filteredHabits.map((habit) => (
            <div key={habit.id}>
              {editingId === habit.id ? (
                <Card
                  padding="lg"
                  className="border-l-4 shadow-md"
                  style={{ borderLeftColor: habit.color }}
                >
                  <HabitForm
                    initialData={habit}
                    onSubmit={(data) => handleUpdate(habit.id, data)}
                    onCancel={() => setEditingId(null)}
                    categories={categories}
                    objectives={objectives}
                  />
                </Card>
              ) : (
                <HabitCard
                  habit={habit}
                  onUpdate={(id, data) => handleUpdate(id, data)}
                  onDelete={onDelete}
                  onStateChange={onStateChange}
                  onEdit={() => setEditingId(habit.id)}
                  mode="planning"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
