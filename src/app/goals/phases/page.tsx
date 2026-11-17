'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import { Button, Card, EmptyState, Input, SectionHeader, Spinner, Textarea } from '@/components/ui'
import { Phase } from '@/types/goal'
import { useAppTranslation } from '@/components/LanguageProvider'

const backLink =
  'inline-flex items-center gap-2 rounded-control border border-border bg-bg-surface px-4 py-2 font-label text-label-lg text-text-primary transition-state hover:bg-bg-surface-hover'

export default function PhasesPage() {
  const { t, language } = useAppTranslation()
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ number: '', title: '', description: '', startDate: '', endDate: '' })
  const [saving, setSaving] = useState(false)

  const fetchPhases = async () => {
    try {
      const res = await fetch('/api/phases')
      if (res.ok) {
        const data = await res.json()
        setPhases(data.phases)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhases()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.number) return

    setSaving(true)
    try {
      const res = await fetch('/api/phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: parseInt(form.number),
          title: form.title.trim(),
          description: form.description.trim() || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      })

      if (res.ok) {
        setForm({ number: '', title: '', description: '', startDate: '', endDate: '' })
        setShowForm(false)
        fetchPhases()
      }
    } finally {
      setSaving(false)
    }
  }

  const deletePhase = async (id: string) => {
    if (!confirm(t('phases.confirmDelete'))) return
    try {
      const res = await fetch(`/api/phases/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPhases(phases.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const locale = language === 'es' ? 'es' : 'en'

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('phases.title')}
          description={t('phases.subtitle')}
          actions={
            <>
              <Link href="/goals" className={backLink}>
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
                {t('goals.title')}
              </Link>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? t('common.cancel') : t('phases.newPhase')}
              </Button>
            </>
          }
        />

        {showForm && (
          <Card padding="lg" className="flex flex-col gap-4">
            <SectionHeader title={t('phases.newPhase')} icon="stairs" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t('phases.phaseNumber')}
                  type="number"
                  min="1"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                  required
                />
                <Input
                  label={t('phases.phaseTitle')}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Fundamentos"
                  required
                />
              </div>
              <Textarea
                label={t('phases.description')}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder={t('phases.descriptionPlaceholder')}
                rows={2}
                className="resize-none"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t('phases.startDate')}
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
                <Input
                  label={t('phases.endDate')}
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving || !form.title.trim() || !form.number}>
                  {saving ? t('progress.saving') : t('phases.createPhase')}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : phases.length === 0 ? (
          <EmptyState
            icon="stairs"
            title={t('phases.noPhases')}
            description={t('phases.createPhaseHint')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {phases
              .sort((a, b) => a.number - b.number)
              .map((phase) => (
                <Card key={phase.id} padding="lg" className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-primary/10 font-mono text-label-md text-primary">
                        {phase.number}
                      </span>
                      <h3 className="truncate font-display text-title-md text-text-primary">{phase.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
                      aria-label={t('common.delete')}
                      onClick={() => deletePhase(phase.id)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </Button>
                  </div>
                  {phase.description && (
                    <p className="font-body text-body-md text-text-secondary">{phase.description}</p>
                  )}
                  {(phase.startDate || phase.endDate) && (
                    <p className="font-mono text-label-sm text-text-muted">
                      {phase.startDate && new Date(phase.startDate).toLocaleDateString(locale)}
                      {phase.startDate && phase.endDate && ' — '}
                      {phase.endDate && new Date(phase.endDate).toLocaleDateString(locale)}
                    </p>
                  )}
                  <p className="font-label text-label-sm text-text-muted">
                    {phase._count?.goals || 0} {t('goals.title').toLowerCase()}
                  </p>
                </Card>
              ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
