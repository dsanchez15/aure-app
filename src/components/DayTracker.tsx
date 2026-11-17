'use client'

import { useState, useEffect } from 'react'
import { Goal } from '@/types/goal'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, Input, Select, Textarea } from '@/components/ui'

interface DailyProgressForm {
  date: string
  goalId: string
  plannedTime: string | null
  actualTime: string | null
  gymCompleted: boolean
  sleepHours: number | null
  studyHours: number | null
  workHours: number | null
  notes: string
}

interface DayTrackerProps {
  onSubmit: (data: DailyProgressForm) => Promise<void>
  initialData?: Partial<DailyProgressForm>
}

export default function DayTracker({ onSubmit, initialData }: DayTrackerProps) {
  const { t } = useAppTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [form, setForm] = useState<DailyProgressForm>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    goalId: initialData?.goalId || '',
    plannedTime: initialData?.plannedTime ?? null,
    actualTime: initialData?.actualTime ?? null,
    gymCompleted: initialData?.gymCompleted || false,
    sleepHours: initialData?.sleepHours ?? null,
    studyHours: initialData?.studyHours ?? null,
    workHours: initialData?.workHours ?? null,
    notes: initialData?.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/goals?status=ACTIVE')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.goals) setGoals(data.goals) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
      setForm(f => ({ ...f, plannedTime: null, actualTime: null, notes: '' }))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('progress.saveError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="rounded-control border border-danger/30 bg-danger/10 p-3 font-label text-label-md text-danger">
          {error}
        </div>
      )}

      <Input
        type="date"
        label={t('progress.dateLabel')}
        value={form.date}
        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
        required
      />

      {goals.length > 0 && (
        <Select
          label={t('progress.goalLabel')}
          value={form.goalId}
          onChange={e => setForm(f => ({ ...f, goalId: e.target.value }))}
        >
          <option value="">{t('progress.generalGoal')}</option>
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </Select>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="time"
          label={t('progress.plannedTimeLabel')}
          value={form.plannedTime ?? ''}
          onChange={e => setForm(f => ({ ...f, plannedTime: e.target.value || null }))}
        />
        <Input
          type="time"
          label={t('progress.actualTimeLabel')}
          value={form.actualTime ?? ''}
          onChange={e => setForm(f => ({ ...f, actualTime: e.target.value || null }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label={t('progress.sleepHours')}
          step="0.5"
          min="0"
          max="24"
          value={form.sleepHours ?? ''}
          onChange={e => setForm(f => ({ ...f, sleepHours: e.target.value ? parseFloat(e.target.value) : null }))}
          placeholder="7.5"
        />

        <Input
          type="number"
          label={t('progress.studyHours')}
          step="0.5"
          min="0"
          value={form.studyHours ?? ''}
          onChange={e => setForm(f => ({ ...f, studyHours: e.target.value ? parseFloat(e.target.value) : null }))}
          placeholder="2"
        />

        <Input
          type="number"
          label={t('progress.workHours')}
          step="0.5"
          min="0"
          value={form.workHours ?? ''}
          onChange={e => setForm(f => ({ ...f, workHours: e.target.value ? parseFloat(e.target.value) : null }))}
          placeholder="1"
        />

        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className={form.gymCompleted ? 'border-success/40 bg-success/10 text-success' : ''}
            onClick={() => setForm(f => ({ ...f, gymCompleted: !f.gymCompleted }))}
          >
            {form.gymCompleted ? `✓ ${t('dashboard.gymDone')}` : t('dashboard.gym')}
          </Button>
        </div>
      </div>

      {form.gymCompleted && form.sleepHours !== null && form.sleepHours < 7 && (
        <div role="alert" className="rounded-control border border-warning/30 bg-warning/10 p-3 font-label text-label-md text-warning">
          {t('dashboard.gymSleepWarning')}
        </div>
      )}

      <Textarea
        label={t('progress.notesLabel')}
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        placeholder={t('progress.notesPlaceholder')}
        rows={2}
        className="resize-none"
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? t('progress.saving') : t('progress.saveProgress')}
      </Button>
    </form>
  )
}
