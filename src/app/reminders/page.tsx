'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import { Button, EmptyState, SegmentedControl, Spinner } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { useReminders, type ReminderFilter } from '@/hooks/useReminders'
import ReminderCard from '@/components/reminders/ReminderCard'
import ReminderFormModal from '@/components/reminders/ReminderFormModal'
import type { Reminder } from '@/types/reminder'

const FILTER_TABS: ReminderFilter[] = ['pending', 'all', 'completed']

export default function RemindersPage() {
  const { t } = useAppTranslation()
  const {
    filtered,
    loading,
    filter,
    setFilter,
    pendingCount,
    completedCount,
    fetchReminders,
    toggleReminder,
    deleteReminder,
  } = useReminders()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Reminder | null>(null)

  const openNew = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (r: Reminder) => {
    setEditing(r)
    setShowForm(true)
  }

  const handleSaved = () => {
    setShowForm(false)
    setEditing(null)
    fetchReminders()
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <PageHeader
          title={t('reminders.title')}
          description={t('reminders.subtitle', { pending: pendingCount, completed: completedCount })}
          actions={
            <Button onClick={openNew}>
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                add
              </span>
              {t('reminders.newReminder')}
            </Button>
          }
        />

        <SegmentedControl<ReminderFilter>
          ariaLabel={t('reminders.title')}
          options={FILTER_TABS.map((f) => ({ value: f, label: t(`reminders.filters.${f}`) }))}
          value={filter}
          onChange={setFilter}
        />

        {filtered.length === 0 ? (
          <EmptyState icon="notifications_active" title={t('reminders.noReminders')} />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleReminder}
                onEdit={openEdit}
                onDelete={deleteReminder}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ReminderFormModal reminder={editing} onSaved={handleSaved} onClose={() => setShowForm(false)} />
      )}
    </AppLayout>
  )
}
