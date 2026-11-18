'use client'

import { useState, useEffect } from 'react'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, Checkbox, Input, Modal, Select, Textarea } from '@/components/ui'
import { Checklist, ChecklistCategory, ChecklistFormData } from '@/types/checklist'

interface Props {
  checklist?: Checklist | null
  categories: ChecklistCategory[]
  onSave: (data: ChecklistFormData) => void
  onCancel: () => void
  onManageCategories: () => void
}

const colors = [
  { value: 'var(--color-info)', labelKey: 'blue' },
  { value: 'var(--color-danger)', labelKey: 'red' },
  { value: 'var(--color-success)', labelKey: 'green' },
  { value: 'var(--color-warning)', labelKey: 'yellow' },
  { value: 'var(--color-primary)', labelKey: 'purple' },
]

const DEFAULT_COLOR = colors[0].value

export default function ChecklistForm({ checklist, categories, onSave, onCancel, onManageCategories }: Props) {
  const { t } = useAppTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [isTemplate, setIsTemplate] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('')

  useEffect(() => {
    if (checklist) {
      setTitle(checklist.title)
      setDescription(checklist.description || '')
      setColor(checklist.color)
      setStartDate(checklist.startDate ? new Date(checklist.startDate).toISOString().split('T')[0] : '')
      setEndDate(checklist.endDate ? new Date(checklist.endDate).toISOString().split('T')[0] : '')
      setCategoryId(checklist.categoryId || null)
      setIsTemplate(checklist.isTemplate || false)
      setRecurrencePattern(checklist.recurrencePattern || '')
    }
  }, [checklist])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      color,
      startDate: startDate || null,
      endDate: endDate || null,
      categoryId,
      isTemplate,
      recurrencePattern: recurrencePattern || null,
    })
  }

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={checklist ? t('checklists.form.editTitle') : t('checklists.form.newTitle')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t('checklists.form.title')}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          required
        />

        <Textarea
          label={t('checklists.form.description')}
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="resize-none"
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="font-label text-label-md text-text-secondary">
            {t('checklists.form.color')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                aria-label={t(`habits.colors.${c.labelKey}`)}
                aria-pressed={color === c.value}
                className={`h-8 w-8 rounded-pill transition-state ${
                  color === c.value
                    ? 'ring-2 ring-border-strong ring-offset-2 ring-offset-bg-surface'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('checklists.form.startDate')}
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <Input
            label={t('checklists.form.endDate')}
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-label text-label-md text-text-secondary">
              {t('checklists.form.category')}
            </span>
            <button
              type="button"
              onClick={onManageCategories}
              className="rounded-sm font-label text-label-md text-primary transition-state hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('checklists.form.manageCategories')}
            </button>
          </div>
          <Select
            value={categoryId ?? ''}
            onChange={e => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
            aria-label={t('checklists.form.category')}
          >
            <option value="">{t('checklists.form.noCategory')}</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </Select>
        </div>

        <Checkbox
          label={t('checklists.form.saveAsTemplate')}
          checked={isTemplate}
          onChange={e => setIsTemplate(e.target.checked)}
        />

        {isTemplate && (
          <Select
            label={t('checklists.form.recurrence')}
            value={recurrencePattern}
            onChange={e => setRecurrencePattern(e.target.value)}
          >
            <option value="">{t('checklists.form.none')}</option>
            <option value="EVERY_MONDAY">{t('checklists.form.everyMonday')}</option>
            <option value="EVERY_FRIDAY">{t('checklists.form.everyFriday')}</option>
            <option value="FIRST_FRIDAY_OF_MONTH">{t('checklists.form.firstFridayOfMonth')}</option>
            <option value="FIRST_MONDAY_OF_MONTH">{t('checklists.form.firstMondayOfMonth')}</option>
          </Select>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" disabled={!title.trim()}>
            {checklist ? t('common.save') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
