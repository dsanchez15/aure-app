'use client'

import { useState } from 'react'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, Field, Input, SegmentedControl, Textarea } from '@/components/ui'

interface CheckInFormProps {
  onSubmit: (data: {
    weekStartDate: string
    fatigueLevel: number
    completedHours: number | null
    deviations: string
    adjustmentNotes: string
  }) => Promise<void>
  initialData?: {
    weekStartDate?: string
    fatigueLevel?: number
    completedHours?: number | null
    deviations?: string
    adjustmentNotes?: string
  }
}

export default function CheckInForm({ onSubmit, initialData }: CheckInFormProps) {
  const { t } = useAppTranslation()
  const today = new Date()
  const weekStart = new Date(today)
  const day = weekStart.getDay()
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1)
  weekStart.setDate(diff)

  const [form, setForm] = useState({
    weekStartDate: initialData?.weekStartDate || weekStart.toISOString().split('T')[0],
    fatigueLevel: initialData?.fatigueLevel ?? 3,
    completedHours: initialData?.completedHours ?? null,
    deviations: initialData?.deviations || '',
    adjustmentNotes: initialData?.adjustmentNotes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('progress.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const fatigueOptions = [1, 2, 3, 4, 5].map((level) => ({
    value: String(level),
    label: String(level),
  }))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div
          role="alert"
          className="rounded-control bg-danger/10 p-3 font-body text-body-md text-danger"
        >
          {error}
        </div>
      )}

      <Input
        label={t('progress.weekOfLabel')}
        type="date"
        value={form.weekStartDate}
        onChange={e => setForm(f => ({ ...f, weekStartDate: e.target.value }))}
        required
      />

      <Field label={t('progress.fatigueLevelLabel')}>
        <SegmentedControl
          options={fatigueOptions}
          value={String(form.fatigueLevel)}
          onChange={value => setForm(f => ({ ...f, fatigueLevel: Number(value) }))}
          ariaLabel={t('progress.fatigueLevelLabel')}
          fullWidth
        />
      </Field>

      <Input
        label={t('progress.hoursCompletedLabel')}
        type="number"
        step="0.5"
        min="0"
        value={form.completedHours ?? ''}
        onChange={e => setForm(f => ({ ...f, completedHours: e.target.value ? parseFloat(e.target.value) : null }))}
        placeholder="25"
      />

      <Textarea
        label={t('progress.deviationsLabel')}
        value={form.deviations}
        onChange={e => setForm(f => ({ ...f, deviations: e.target.value }))}
        placeholder={t('progress.deviationsPlaceholder')}
        rows={2}
        className="resize-none"
      />

      <Textarea
        label={t('progress.adjustmentNotesLabel')}
        value={form.adjustmentNotes}
        onChange={e => setForm(f => ({ ...f, adjustmentNotes: e.target.value }))}
        placeholder={t('progress.adjustmentNotesPlaceholder')}
        rows={2}
        className="resize-none"
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? t('progress.saving') : t('progress.saveCheckIn')}
      </Button>
    </form>
  )
}
