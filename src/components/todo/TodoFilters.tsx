'use client'

import { useState } from 'react'
import { Button, Input, SegmentedControl, Select } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { TodoCategory, ViewMode, GroupBy, FilterStatus } from '@/types/todo'

export interface TodoFiltersValue {
  viewMode: ViewMode
  groupBy: GroupBy
  search: string
  priority: string
  category: string
  status: FilterStatus
}

interface TodoFiltersProps {
  value: TodoFiltersValue
  categories: TodoCategory[]
  onChange: (value: TodoFiltersValue) => void
  onClear: () => void
}

const VIEW_MODES: ViewMode[] = ['all', 'today', 'week']

export default function TodoFilters({ value, categories, onChange, onClear }: TodoFiltersProps) {
  const { t } = useAppTranslation()
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters =
    value.search !== '' ||
    value.priority !== '' ||
    value.category !== '' ||
    value.status !== '' ||
    value.viewMode !== 'all' ||
    value.groupBy !== 'none'

  const set = <K extends keyof TodoFiltersValue>(key: K, v: TodoFiltersValue[K]) =>
    onChange({ ...value, [key]: v })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl<ViewMode>
          ariaLabel={t('todos.title')}
          size="sm"
          options={VIEW_MODES.map((mode) => ({ value: mode, label: t(`todos.viewTabs.${mode}`) }))}
          value={value.viewMode}
          onChange={(mode) => set('viewMode', mode)}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-lg">
            filter_list
          </span>
          {t('common.filter')}
          {hasActiveFilters && <span className="h-2 w-2 rounded-pill bg-primary" />}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-danger">
            {t('todos.clearFilters')}
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 rounded-card border border-border bg-bg-surface p-3">
          <Select
            fieldSize="sm"
            aria-label={t('todos.groupBy.none')}
            value={value.groupBy}
            onChange={(e) => set('groupBy', e.target.value as GroupBy)}
            className="w-auto"
          >
            <option value="none">{t('todos.groupBy.none')}</option>
            <option value="category">{t('todos.groupBy.category')}</option>
            <option value="priority">{t('todos.groupBy.priority')}</option>
            <option value="status">{t('todos.groupBy.status')}</option>
          </Select>

          <div className="relative min-w-52 flex-1">
            <Input
              fieldSize="sm"
              leadingIcon="search"
              value={value.search}
              onChange={(e) => set('search', e.target.value)}
              placeholder={t('todos.searchPlaceholder')}
              aria-label={t('todos.searchPlaceholder')}
              className="pr-9"
            />
            {value.search && (
              <button
                type="button"
                onClick={() => set('search', '')}
                aria-label={t('todos.clearFilters')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-pill p-0.5 text-text-muted transition-state hover:text-text-primary"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  close
                </span>
              </button>
            )}
          </div>

          <Select
            fieldSize="sm"
            aria-label={t('todos.priorities.all')}
            value={value.priority}
            onChange={(e) => set('priority', e.target.value)}
            className="w-auto"
          >
            <option value="">{t('todos.priorities.all')}</option>
            <option value="high">{t('todos.priorities.high')}</option>
            <option value="normal">{t('todos.priorities.normal')}</option>
            <option value="low">{t('todos.priorities.low')}</option>
          </Select>

          <Select
            fieldSize="sm"
            aria-label={t('todos.form.category')}
            value={value.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-auto"
          >
            <option value="">{t('common.all')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            fieldSize="sm"
            aria-label={t('todos.statuses.all')}
            value={value.status}
            onChange={(e) => set('status', e.target.value as FilterStatus)}
            className="w-auto"
          >
            <option value="">{t('todos.statuses.all')}</option>
            <option value="pending">{t('todos.statuses.pending')}</option>
            <option value="completed">{t('todos.statuses.completed')}</option>
          </Select>
        </div>
      )}
    </div>
  )
}
