'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import { Button, Card, Input, SectionHeader, Select, Textarea } from '@/components/ui'
import { Phase } from '@/types/goal'
import { useAppTranslation } from '@/components/LanguageProvider'

const secondaryLink =
  'flex flex-1 items-center justify-center rounded-control border border-border bg-bg-surface px-4 py-2 font-label text-label-lg text-text-primary transition-state hover:bg-bg-surface-hover'

export default function NewGoalPage() {
  const { t } = useAppTranslation()
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'PERSONAL' as 'PROFESIONAL' | 'PERSONAL',
    priority: 'MEDIA' as 'ALTA' | 'MEDIA' | 'BAJA',
    deadline: '',
    estimatedHours: '',
    phaseId: '',
  })
  const [milestones, setMilestones] = useState<{ title: string; targetDate: string }[]>([])
  const [milestoneErrors, setMilestoneErrors] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/phases')
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.phases) setPhases(data.phases)
      })
      .catch(() => {})
  }, [])

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', targetDate: '' }])
  }

  const updateMilestone = (index: number, field: 'title' | 'targetDate', value: string) => {
    const updated = [...milestones]
    updated[index][field] = value
    setMilestones(updated)
    if (milestoneErrors[index]) {
      setMilestoneErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    }
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
    if (milestoneErrors[index]) {
      setMilestoneErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError(`${t('goals.titleLabel').replace(' *', '')} ${t('common.required').toLowerCase()}`)
      return
    }

    const errors: Record<number, string> = {}
    let hasError = false
    milestones.forEach((m, i) => {
      if (m.title.trim() && !m.targetDate) {
        errors[i] = t('goals.milestoneDateRequired')
        hasError = true
      }
    })
    setMilestoneErrors(errors)

    if (hasError) {
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          deadline: form.deadline || null,
          estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : null,
          phaseId: form.phaseId || null,
          milestones: milestones.filter((m) => m.title.trim()),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || t('common.error'))
      }

      router.push('/goals')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const priorityLabel = (p: string) => {
    if (p === 'ALTA') return t('goals.priorityHigh')
    if (p === 'MEDIA') return t('goals.priorityMedium')
    return t('goals.priorityLow')
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader title={t('goals.newGoal')} description={t('goals.newPageSubtitle')} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div role="alert" className="rounded-card border border-danger/30 bg-danger/10 p-4">
              <p className="font-label text-label-md text-danger">{error}</p>
            </div>
          )}

          <Card padding="lg" className="flex flex-col gap-4">
            <SectionHeader title={t('goals.titleLabel')} icon="flag" />
            <Input
              label={t('goals.titleLabel')}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={t('goals.titlePlaceholder')}
              required
            />
            <Textarea
              label={t('goals.descriptionLabel')}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder={t('goals.descriptionPlaceholder')}
              rows={3}
              className="resize-none"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label={t('goals.categoryLabel')}
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as 'PROFESIONAL' | 'PERSONAL' }))
                }
              >
                <option value="PERSONAL">{t('goals.categoryPersonal')}</option>
                <option value="PROFESIONAL">{t('goals.categoryProfessional')}</option>
              </Select>
              <Select
                label={t('goals.priorityLabel')}
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value as 'ALTA' | 'MEDIA' | 'BAJA' }))
                }
              >
                <option value="BAJA">{priorityLabel('BAJA')}</option>
                <option value="MEDIA">{priorityLabel('MEDIA')}</option>
                <option value="ALTA">{priorityLabel('ALTA')}</option>
              </Select>
            </div>

            {phases.length > 0 && (
              <Select
                label={t('goals.phaseLabel')}
                value={form.phaseId}
                onChange={(e) => setForm((f) => ({ ...f, phaseId: e.target.value }))}
              >
                <option value="">{t('goals.noPhase')}</option>
                {phases
                  .sort((a, b) => a.number - b.number)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {t('progress.phase')} {p.number}: {p.title}
                    </option>
                  ))}
              </Select>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label={t('goals.deadlineLabel')}
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
              <Input
                label={t('goals.estimatedHoursLabel')}
                type="number"
                step="0.5"
                min="0"
                value={form.estimatedHours}
                onChange={(e) => setForm((f) => ({ ...f, estimatedHours: e.target.value }))}
                placeholder="40"
              />
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-4">
            <SectionHeader
              title={t('goals.milestones')}
              icon="checklist"
              actions={
                <Button type="button" variant="secondary" size="sm" onClick={addMilestone}>
                  {t('goals.addMilestone')}
                </Button>
              }
            />

            {milestones.length === 0 ? (
              <p className="py-4 text-center font-body text-body-md text-text-muted">
                {t('goals.noMilestones')}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Input
                        fieldSize="sm"
                        value={m.title}
                        onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                        placeholder={t('goals.milestoneTitlePlaceholder')}
                        aria-label={t('goals.milestoneTitlePlaceholder')}
                      />
                      <Input
                        fieldSize="sm"
                        type="date"
                        value={m.targetDate}
                        onChange={(e) => updateMilestone(i, 'targetDate', e.target.value)}
                        aria-label={t('goals.deadlineLabel')}
                        error={milestoneErrors[i]}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-1 px-2 text-text-muted hover:bg-danger/10 hover:text-danger"
                      aria-label={t('common.delete')}
                      onClick={() => removeMilestone(i)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex gap-3">
            <Link href="/goals" className={secondaryLink}>
              {t('common.cancel')}
            </Link>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? t('common.loading') : t('common.create')}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
