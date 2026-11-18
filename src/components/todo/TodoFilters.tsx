'use client'

import { Badge, Button, Input, SegmentedControl } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { TodoCategory, ViewMode, GroupBy, FilterStatus } from '@/types/todo'

export type TodoSort = 'newest' | 'oldest'
export type TodoPriorityFilter = '' | 'high' | 'normal' | 'low'

export interface TodoFiltersValue {
  viewMode: ViewMode
  sort: TodoSort
  groupBy: GroupBy
  search: string
  priority: TodoPriorityFilter
  category: string
  status: FilterStatus
}

interface TodoFiltersProps {
  value: TodoFiltersValue
  categories: TodoCategory[]
  counts: { pending: number; completed: number }
  isOpen: boolean
  onToggle: () => void
  onChange: (value: TodoFiltersValue) => void
  onClear: () => void
}

const VIEW_MODES: ViewMode[] = ['all', 'today', 'week']
const PRIORITIES: TodoPriorityFilter[] = ['', 'high', 'normal', 'low']
const STATUSES: FilterStatus[] = ['', 'pending', 'completed']
const GROUPS: GroupBy[] = ['none', 'category', 'priority', 'status']

function FilterField({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="px-1 font-mono text-label-sm uppercase tracking-wide text-text-muted">{label}</span>
      {children}
    </div>
  )
}

export default function TodoFilters({
  value,
  categories,
  counts,
  isOpen,
  onToggle,
  onChange,
  onClear,
}: TodoFiltersProps) {
  const { t } = useAppTranslation()

  const isDefault =
    value.viewMode === 'all' &&
    value.sort === 'newest' &&
    value.groupBy === 'none' &&
    value.priority === '' &&
    value.category === '' &&
    value.status === ''

  const set = <K extends keyof TodoFiltersValue>(key: K, v: TodoFiltersValue[K]) =>
    onChange({ ...value, [key]: v })

  const categoryName = categories.find((cat) => String(cat.id) === value.category)?.name

  const chips: string[] = []
  if (value.viewMode !== 'all') chips.push(t(`todos.viewTabs.${value.viewMode}`))
  if (value.sort !== 'newest') chips.push(t(`todos.sort.${value.sort}`))
  if (value.priority) chips.push(t(`todos.priorities.${value.priority}`))
  if (value.status) chips.push(t(`todos.statuses.${value.status}`))
  if (value.groupBy !== 'none') chips.push(t(`todos.groupBy.${value.groupBy}`))
  if (categoryName) chips.push(categoryName)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="todo-filter-panel"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              filter_list
            </span>
            {t('common.filter')}
          </Button>

          {!isOpen &&
            chips.map((chip) => (
              <Badge key={chip} variant="neutral">
                {chip}
              </Badge>
            ))}

          {!isDefault && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-danger">
              {t('todos.clearFilters')}
            </Button>
          )}
        </div>

        <p aria-live="polite" className="font-mono text-label-sm tabular-nums text-text-muted">
          {t('todos.filtersSummary', { pending: counts.pending, completed: counts.completed })}
        </p>
      </div>

      {isOpen && (
        <div
          id="todo-filter-panel"
          className="flex flex-col gap-2.5 rounded-card border border-border bg-bg-surface p-3"
        >
          <div className="flex flex-wrap items-end gap-2">
            <FilterField label={t('todos.view')}>
            <SegmentedControl<ViewMode>
              ariaLabel={t('todos.view')}
              size="xs"
              options={VIEW_MODES.map((mode) => ({
                value: mode,
                label: t(`todos.viewTabs.${mode}`),
              }))}
              value={value.viewMode}
              onChange={(mode) => set('viewMode', mode)}
            />
          </FilterField>

          <FilterField label={t('todos.orderLabel')}>
            <SegmentedControl<TodoSort>
              ariaLabel={t('todos.orderLabel')}
              size="xs"
              options={[
                { value: 'newest', label: t('todos.sort.newest') },
                { value: 'oldest', label: t('todos.sort.oldest') },
              ]}
              value={value.sort}
              onChange={(sort) => set('sort', sort)}
            />
          </FilterField>

          <FilterField label={t('common.search')} className="min-w-52 flex-1">
            <div className="relative">
              <Input
                leadingIcon="search"
                autoFocus
                fieldSize="sm"
                value={value.search}
                onChange={(e) => set('search', e.target.value)}
                placeholder={t('todos.searchPlaceholder')}
                aria-label={t('todos.searchPlaceholder')}
                className="h-7 w-full py-0 pr-8"
              />
              {value.search && (
                <button
                  type="button"
                  onClick={() => set('search', '')}
                  aria-label={t('todos.clearFilters')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-pill p-0.5 text-text-muted transition-state hover:text-text-primary"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-base">
                    close
                  </span>
                </button>
              )}
            </div>
          </FilterField>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <FilterField label={t('todos.groupLabel')}>
            <SegmentedControl<GroupBy>
              ariaLabel={t('todos.groupLabel')}
              size="xs"
              fullWidth
              options={GROUPS.map((group) => ({
                value: group,
                label: t(`todos.groupBy.${group}`),
              }))}
              value={value.groupBy}
              onChange={(group) => set('groupBy', group)}
            />
          </FilterField>

          <FilterField label={t('todos.priorityLabel')}>
            <SegmentedControl<TodoPriorityFilter>
              ariaLabel={t('todos.priorityLabel')}
              size="xs"
              fullWidth
              options={PRIORITIES.map((priority) => ({
                value: priority,
                label: priority ? t(`todos.priorities.${priority}`) : t('todos.priorities.all'),
              }))}
              value={value.priority}
              onChange={(priority) => set('priority', priority)}
            />
          </FilterField>

          <FilterField label={t('todos.statusLabel')}>
            <SegmentedControl<FilterStatus>
              ariaLabel={t('todos.statusLabel')}
              size="xs"
              fullWidth
              options={STATUSES.map((status) => ({
                value: status,
                label: status ? t(`todos.statuses.${status}`) : t('todos.statuses.all'),
              }))}
              value={value.status}
              onChange={(status) => set('status', status)}
            />
          </FilterField>

          {categories.length > 0 && (
            <FilterField label={t('todos.form.category')}>
              <label className="inline-flex h-7 w-full items-center rounded-control border border-border bg-bg-surface px-2 transition-state focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <select
                  value={value.category}
                  onChange={(e) => set('category', e.target.value)}
                  aria-label={t('todos.form.category')}
                  className="h-full w-full bg-bg-surface font-mono text-label-sm text-text-primary focus:outline-none"
                >
                  <option value="">{t('common.all')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            </FilterField>
          )}
          </div>
        </div>
      )}
    </div>
  )
}
