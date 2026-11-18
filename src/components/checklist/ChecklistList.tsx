'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, EmptyState, Input, SegmentedControl } from '@/components/ui'
import { FilterBar, FilterField, FilterSelect } from '@/components/patterns'
import { PageHeader } from '@/components/layout'
import { useAppTranslation } from '@/components/LanguageProvider'
import ChecklistCard from './ChecklistCard'
import ExpandedItems from './ExpandedItems'
import UndoToast from './UndoToast'
import { filterOptions, sortOptions, getStatus, getProgress, type SortOption } from './helpers'
import type {
  Checklist,
  ChecklistCategory,
  ChecklistFilter,
  ChecklistItem,
  ChecklistTab,
  Priority,
} from '@/types/checklist'

export type { SortOption }

interface Props {
  tab: ChecklistTab
  checklists: Checklist[]
  categories: ChecklistCategory[]
  filter: ChecklistFilter
  categoryFilter: number | null
  expandedId: number | null
  search: string
  sort: SortOption
  onTabChange: (tab: ChecklistTab) => void
  onSearchChange: (s: string) => void
  onSortChange: (s: SortOption) => void
  onFilterChange: (f: ChecklistFilter) => void
  onCategoryFilterChange: (id: number | null) => void
  onToggleExpand: (id: number) => void
  onEdit: (c: Checklist) => void
  onNew: () => void
  onDuplicate: (id: number) => void
  onDelete: (id: number) => void
  onArchive?: (id: number) => void
  onInstantiateTemplate?: (template: Checklist) => void
  onToggleItem: (checklistId: number, item: ChecklistItem) => void
  onAddItem: (checklistId: number, title: string, priority: Priority, parentId?: number | null) => void
  onUpdateItem: (checklistId: number, item: ChecklistItem, data: Partial<ChecklistItem>) => void
  onDeleteItem: (checklistId: number, itemId: number) => void
  onReorder: (checklistId: number, items: ChecklistItem[]) => Promise<void>
  onCreateReminder: (checklistId: number, item: ChecklistItem) => void
}

export default function ChecklistList({
  tab,
  checklists,
  categories,
  filter,
  categoryFilter,
  expandedId,
  search,
  sort,
  onTabChange,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onCategoryFilterChange,
  onToggleExpand,
  onEdit,
  onNew,
  onDuplicate,
  onDelete,
  onArchive,
  onInstantiateTemplate,
  onToggleItem,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorder,
  onCreateReminder,
}: Props) {
  const { t } = useAppTranslation()
  const [undoChecklist, setUndoChecklist] = useState<{ checklist: Checklist; timer: NodeJS.Timeout } | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const hydrated = useRef(false)

  // Los filtros sobreviven a un refresh dentro de la sesión del navegador.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('aure-checklist-filters')
      if (raw) {
        const stored = JSON.parse(raw) as {
          search?: string
          filter?: ChecklistFilter
          categoryFilter?: number | null
          sort?: SortOption
        }
        if (typeof stored.search === 'string') onSearchChange(stored.search)
        if (stored.filter) onFilterChange(stored.filter)
        if (stored.categoryFilter !== undefined) onCategoryFilterChange(stored.categoryFilter)
        if (stored.sort) onSortChange(stored.sort)
      }
    } catch {
      // Sin persistencia si el navegador la bloquea.
    }
    hydrated.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      window.sessionStorage.setItem(
        'aure-checklist-filters',
        JSON.stringify({ search, filter, categoryFilter, sort })
      )
    } catch {
      // Sin persistencia si el navegador la bloquea.
    }
  }, [search, filter, categoryFilter, sort])

  const handleDelete = (id: number) => {
    const cl = checklists.find((c) => c.id === id)
    if (!cl) return
    if (undoChecklist) {
      clearTimeout(undoChecklist.timer)
      onDelete(undoChecklist.checklist.id)
    }
    const timer = setTimeout(() => {
      onDelete(id)
      setUndoChecklist(null)
    }, 5000)
    setUndoChecklist({ checklist: cl, timer })
  }

  const handleUndo = () => {
    if (!undoChecklist) return
    clearTimeout(undoChecklist.timer)
    setUndoChecklist(null)
  }

  const dismissUndo = useCallback(() => {
    if (!undoChecklist) return
    clearTimeout(undoChecklist.timer)
    onDelete(undoChecklist.checklist.id)
    setUndoChecklist(null)
  }, [undoChecklist, onDelete])

  const filtered = checklists
    .filter((c) => {
      if (undoChecklist && c.id === undoChecklist.checklist.id) return false
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && c.categoryId !== categoryFilter) return false
      if (tab === 'templates') return true
      if (tab === 'history') return true
      if (filter === 'all') return true
      const statusKey = getStatus(c).key
      if (filter === 'active') return statusKey === 'active' || statusKey === 'days-left' || statusKey === 'upcoming'
      if (filter === 'expired') return statusKey === 'expired'
      if (filter === 'no-dates') return statusKey === 'no-dates'
      return true
    })
    .sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title)
      if (sort === 'progress') return getProgress(b) - getProgress(a)
      if (sort === 'due-date') {
        const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity
        const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity
        return aEnd - bEnd
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const tabLabels: { value: ChecklistTab; label: string }[] = [
    { value: 'active', label: t('checklists.tabs.active') },
    { value: 'templates', label: t('checklists.tabs.templates') },
    { value: 'history', label: t('checklists.tabs.history') },
  ]

  const emptyTitle = search
    ? t('checklists.noResults')
    : tab === 'templates'
      ? t('checklists.noTemplates')
      : tab === 'history'
        ? t('checklists.noHistory')
        : t('checklists.noChecklists')

  const emptyDescription = search
    ? t('checklists.tryDifferentSearch')
    : tab === 'templates'
      ? t('checklists.createTemplateHint')
      : tab === 'history'
        ? t('checklists.archiveHint')
        : t('checklists.createHint')

  const activeChips: string[] = []
  if (search) activeChips.push(`“${search}”`)
  if (tab === 'active' && filter !== 'all') {
    activeChips.push(filterOptions.find((option) => option.value === filter)?.label ?? filter)
  }
  if (tab === 'active' && categoryFilter) {
    const category = categories.find((cat) => cat.id === categoryFilter)
    if (category) activeChips.push(category.name)
  }
  if (tab === 'active' && sort !== 'newest') {
    activeChips.push(sortOptions.find((option) => option.value === sort)?.label ?? sort)
  }

  const clearAllFilters = () => {
    onSearchChange('')
    onFilterChange('all')
    onCategoryFilterChange(null)
    onSortChange('newest')
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('checklists.title')}
        actions={
          <Button onClick={onNew}>
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              add
            </span>
            {t('checklists.newChecklist')}
          </Button>
        }
      />

      <SegmentedControl<ChecklistTab>
        ariaLabel={t('checklists.title')}
        options={tabLabels}
        value={tab}
        onChange={onTabChange}
      />

      <FilterBar
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen((open) => !open)}
        onClear={clearAllFilters}
        active={activeChips}
        summary={t('checklists.checklistCount', { count: filtered.length })}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <FilterField label={t('common.search')} className="sm:col-span-2 xl:col-span-3">
            <Input
              leadingIcon="search"
              fieldSize="sm"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('checklists.searchPlaceholder')}
              aria-label={t('checklists.searchPlaceholder')}
              className="h-7 py-0 pr-8"
            />
          </FilterField>

          {tab === 'active' && (
            <>
              <FilterField label={t('common.filter')}>
                <SegmentedControl<ChecklistFilter>
                  ariaLabel={t('common.filter')}
                  size="xs"
                  fullWidth
                  options={filterOptions}
                  value={filter}
                  onChange={onFilterChange}
                />
              </FilterField>

              <FilterField label={t('common.sortBy')}>
                <FilterSelect
                  label={t('common.sortBy')}
                  value={sort}
                  onChange={(value) => onSortChange(value as SortOption)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterField>

              {categories.length > 0 && (
                <FilterField label={t('common.category')}>
                  <FilterSelect
                    label={t('common.category')}
                    value={categoryFilter !== null ? String(categoryFilter) : ''}
                    onChange={(value) => onCategoryFilterChange(value ? parseInt(value) : null)}
                  >
                    <option value="">{t('common.all')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterField>
              )}
            </>
          )}
        </div>
      </FilterBar>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="fact_check" title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <ChecklistCard
              key={c.id}
              checklist={c}
              isExpanded={expandedId === c.id}
              isTemplate={tab === 'templates'}
              isHistory={tab === 'history'}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={handleDelete}
              onArchive={onArchive}
              onInstantiateTemplate={onInstantiateTemplate}
            >
              <ExpandedItems
                checklist={c}
                onToggleItem={onToggleItem}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
                onAddItem={onAddItem}
                onReorder={onReorder}
                onCreateReminder={onCreateReminder}
                mode={tab === 'history' ? 'history' : tab === 'templates' ? 'template' : 'active'}
              />
            </ChecklistCard>
          ))}
        </div>
      )}

      {undoChecklist && (
        <UndoToast
          message={t('checklists.expandedItems.deleted', { title: undoChecklist.checklist.title })}
          onUndo={handleUndo}
          onClose={dismissUndo}
        />
      )}
    </div>
  )
}
