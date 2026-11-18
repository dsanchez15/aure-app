'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  SectionHeader,
  Spinner,
  Textarea,
} from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

interface Milestone {
  id: number
  title: string
  description?: string
  date: string
  color: string
  items?: { itemModule: string; itemId: number }[]
}

interface Suggestion {
  id: number
  module: string
  title: string
  reason: string
}

/** Paleta de hitos sobre tokens; el color se guarda como valor del tema. */
const MILESTONE_COLORS = [
  'var(--color-warning)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-danger)',
  'var(--color-primary)',
]

const DEFAULT_COLOR = MILESTONE_COLORS[0]

export default function MilestonesPage() {
  const { t, language } = useAppTranslation()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Milestone | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setColor(DEFAULT_COLOR)
    setEditing(null)
  }

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await fetch('/api/milestones')
      if (!res.ok) throw new Error(t('milestones.loadError'))
      setMilestones(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchMilestones()
  }, [fetchMilestones])

  const fetchSuggestions = async (milestone: Milestone) => {
    try {
      const res = await fetch(`/api/milestones/suggestions?milestoneId=${milestone.id}`)
      if (res.ok) setSuggestions(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return

    const data = { title: title.trim(), description: description || null, date, color }

    try {
      const res = editing
        ? await fetch(`/api/milestones/${editing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        : await fetch('/api/milestones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
      if (!res.ok) throw new Error(t('milestones.saveError'))
      setShowForm(false)
      resetForm()
      fetchMilestones()
    } catch (err) {
      alert(err instanceof Error ? err.message : t('milestones.saveError'))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('milestones.confirmDelete'))) return
    try {
      const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(t('milestones.deleteError'))
      fetchMilestones()
    } catch (err) {
      alert(err instanceof Error ? err.message : t('milestones.deleteError'))
    }
  }

  const addItem = async (milestoneId: number, itemModule: string, itemId: number) => {
    await fetch(`/api/milestones/${milestoneId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemModule, itemId }),
    })
    fetchMilestones()
    if (selectedMilestone?.id === milestoneId) {
      fetchSuggestions({
        ...selectedMilestone,
        items: [...(selectedMilestone.items || []), { itemModule, itemId }],
      })
    }
  }

  const openDetail = async (m: Milestone) => {
    setSelectedMilestone(m)
    await fetchSuggestions(m)
  }

  const openEdit = (m: Milestone) => {
    setEditing(m)
    setTitle(m.title)
    setDescription(m.description || '')
    setDate(m.date.split('T')[0])
    setColor(m.color)
    setShowForm(true)
  }

  const locale = language === 'es' ? 'es' : 'en'

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
      <div className="flex flex-col gap-4">
        <PageHeader
          title={t('milestones.title')}
          description={t('milestones.subtitle', { count: milestones.length })}
          actions={
            <Button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                add
              </span>
              {t('milestones.newMilestone')}
            </Button>
          }
        />

        {milestones.length === 0 ? (
          <EmptyState
            icon="flag"
            title={t('milestones.noMilestones')}
            description={t('milestones.createHint')}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {milestones.map((m) => (
              <Card key={m.id} padding="md" className="group">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openDetail(m)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-control text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 rounded-pill"
                      style={{ backgroundColor: m.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-title-md text-text-primary">{m.title}</h3>
                      <p className="font-mono text-label-sm text-text-muted">
                        {new Date(m.date).toLocaleDateString(locale, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      {m.description && (
                        <p className="mt-1 truncate font-body text-body-md text-text-secondary">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-1.5 text-text-secondary hover:text-primary"
                      aria-label={t('common.edit')}
                      onClick={() => openEdit(m)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger"
                      aria-label={t('common.delete')}
                      onClick={() => handleDelete(m.id)}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedMilestone && (
          <Card padding="lg" className="flex flex-col gap-3">
            <SectionHeader
              title={`${selectedMilestone.title} — ${t('milestones.suggestions')}`}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-1.5"
                  aria-label={t('common.close')}
                  onClick={() => setSelectedMilestone(null)}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-lg">
                    close
                  </span>
                </Button>
              }
            />
            {suggestions.length === 0 ? (
              <p className="font-body text-body-md text-text-muted">{t('milestones.noSuggestions')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <div
                    key={`${s.module}-${s.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-control bg-bg-surface-hover p-2.5"
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <Badge variant="primary" className="capitalize">
                        {s.module}
                      </Badge>
                      <span className="truncate font-label text-label-lg text-text-primary">{s.title}</span>
                      <span className="font-label text-label-sm text-text-muted">{s.reason}</span>
                    </div>
                    <Button size="sm" onClick={() => addItem(selectedMilestone.id, s.module, s.id)}>
                      {t('milestones.add')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false)
            resetForm()
          }}
          title={editing ? t('milestones.editMilestone') : t('milestones.newMilestone')}
        >
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label={t('milestones.form.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
            <Textarea
              label={t('milestones.form.description')}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('milestones.form.date')}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <fieldset className="flex flex-col gap-2">
                <legend className="font-label text-label-md text-text-secondary">
                  {t('milestones.form.color')}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {MILESTONE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={`${t('milestones.form.color')} ${c}`}
                      aria-pressed={color === c}
                      className={`h-8 w-8 rounded-pill transition-state ${
                        color === c ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
              >
                {t('milestones.form.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={!title.trim() || !date}>
                {editing ? t('milestones.form.save') : t('milestones.form.create')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  )
}
