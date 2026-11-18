'use client'

import { useState, useEffect } from 'react'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, Checkbox, Input, Select, Textarea } from '@/components/ui'
import { HabitFormData, Category, Objective, HabitState, GoalType } from '@/types/habit'

interface HabitFormProps {
  onSubmit: (data: HabitFormData) => void
  onCancel?: () => void
  initialData?: Partial<HabitFormData>
  categories?: Category[]
  objectives?: Objective[]
}

const DEFAULT_COLOR = 'var(--color-info)'

const goalTypeValues: GoalType[] = ['Daily', 'Weekly', 'Monthly', 'Ratio']

export default function HabitForm({
  onSubmit,
  onCancel,
  initialData,
  categories = [],
  objectives = [],
}: HabitFormProps) {
  const { t } = useAppTranslation()
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [color, setColor] = useState(initialData?.color || DEFAULT_COLOR)
  const [state, setState] = useState<HabitState>(initialData?.state || 'Active')
  const [isPermanent, setIsPermanent] = useState(initialData?.isPermanent !== false)
  const [startDate, setStartDate] = useState(initialData?.startDate || '')
  const [endDate, setEndDate] = useState(initialData?.endDate || '')
  const [goalType, setGoalType] = useState<GoalType>(initialData?.goalType || 'Daily')
  const [goalValue, setGoalValue] = useState(initialData?.goalValue || 1)
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [objectiveId, setObjectiveId] = useState(initialData?.objectiveId || '')
  const [cycleError, setCycleError] = useState('')

  const colorOptions = [
    { name: t('habits.colors.blue'), value: 'var(--color-info)' },
    { name: t('habits.colors.green'), value: 'var(--color-success)' },
    { name: t('habits.colors.red'), value: 'var(--color-danger)' },
    { name: t('habits.colors.yellow'), value: 'var(--color-warning)' },
    { name: t('habits.colors.purple'), value: 'var(--color-primary)' },
  ]

  useEffect(() => {
    if (!isPermanent) {
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        setCycleError(t('habits.form.cycleError'))
      } else {
        setCycleError('')
      }
    } else {
      setCycleError('')
    }
  }, [isPermanent, startDate, endDate, t])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (cycleError) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      color,
      state,
      isPermanent,
      startDate: isPermanent ? null : startDate || null,
      endDate: isPermanent ? null : endDate || null,
      goalType,
      goalValue: parseInt(String(goalValue), 10) || 1,
      categoryId: categoryId ? parseInt(String(categoryId), 10) : null,
      objectiveId: objectiveId ? parseInt(String(objectiveId), 10) : null,
    })

    if (!initialData) {
      setTitle('')
      setDescription('')
      setColor(DEFAULT_COLOR)
      setState('Active')
      setIsPermanent(true)
      setStartDate('')
      setEndDate('')
      setGoalType('Daily')
      setGoalValue(1)
      setCategoryId('')
      setObjectiveId('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label={t('habits.form.titleLabel')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('habits.form.titlePlaceholder')}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label={t('habits.form.descriptionLabel')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('habits.form.descriptionPlaceholder')}
            rows={2}
            className="resize-none"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-label text-label-md text-text-secondary">
            {t('habits.form.colorLabel')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                aria-label={c.name}
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

        <Select
          label={t('habits.form.stateLabel')}
          value={state}
          onChange={(e) => setState(e.target.value as HabitState)}
        >
          <option value="Active">{t('habits.card.statusActive')}</option>
          <option value="Paused">{t('habits.card.statusPaused')}</option>
          <option value="Archived">{t('habits.card.statusArchived')}</option>
        </Select>

        <Select
          label={t('habits.form.categoryLabel')}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">{t('habits.form.noCategory')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Select
          label={t('habits.form.objectiveLabel')}
          value={objectiveId}
          onChange={(e) => setObjectiveId(e.target.value)}
        >
          <option value="">{t('habits.form.noObjective')}</option>
          {objectives.map((obj) => (
            <option key={obj.id} value={obj.id}>
              {obj.name}
            </option>
          ))}
        </Select>

        <div className="md:col-span-2">
          <Checkbox
            label={t('habits.form.permanentLabel')}
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
          />
        </div>

        {!isPermanent && (
          <>
            <Input
              label={t('habits.form.startDateLabel')}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label={t('habits.form.endDateLabel')}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={cycleError || undefined}
            />
          </>
        )}

        <Select
          label={t('habits.form.goalTypeLabel')}
          value={goalType}
          onChange={(e) => setGoalType(e.target.value as GoalType)}
        >
          {goalTypeValues.map((value) => (
            <option key={value} value={value}>
              {t(`habits.goalTypes.${value.toLowerCase()}`)}
            </option>
          ))}
        </Select>

        <Input
          label={t('habits.form.goalValueLabel', { unit: goalType === 'Ratio' ? '(%)' : '(veces)' })}
          type="number"
          min={1}
          max={goalType === 'Ratio' ? 100 : 999}
          value={goalValue}
          onChange={(e) => setGoalValue(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">
          {initialData ? t('habits.form.update') : t('habits.form.create')}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
