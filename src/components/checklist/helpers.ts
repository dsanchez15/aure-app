import { t } from '@/lib/i18n'
import { isExpired, daysRemaining } from '@/lib/checklist-utils'
import type { BadgeVariant } from '@/components/ui'
import type { Checklist, ChecklistFilter, Priority } from '@/types/checklist'

export const priorityConfig: Record<Priority, { icon: string; color: string }> = {
  high: { icon: 'arrow_upward', color: 'var(--color-danger)' },
  normal: { icon: 'remove', color: 'var(--color-text-muted)' },
  low: { icon: 'arrow_downward', color: 'var(--color-info)' },
}

export type SortOption = 'newest' | 'name' | 'progress' | 'due-date'

export interface ChecklistStatus {
  key: string
  label: string
  variant: BadgeVariant
}

export function getStatus(c: Checklist): ChecklistStatus {
  if (c.lifecycleState === 'Completed') return { key: 'completed', label: t('checklists.status.completed'), variant: 'success' }
  if (c.lifecycleState === 'Archived') return { key: 'archived', label: t('checklists.status.archived'), variant: 'neutral' }
  if (!c.startDate && !c.endDate) return { key: 'no-dates', label: t('checklists.status.noDates'), variant: 'neutral' }
  const now = new Date()
  const end = c.endDate ? new Date(c.endDate) : null
  const start = c.startDate ? new Date(c.startDate) : null
  if (end && isExpired(end)) return { key: 'expired', label: t('checklists.status.expired'), variant: 'danger' }
  if (end) {
    const days = daysRemaining(end)
    if (days <= 3) return { key: 'days-left', label: t('checklists.status.daysLeft', { count: days }), variant: 'warning' }
  }
  if (start && start > now) return { key: 'upcoming', label: t('checklists.status.upcoming'), variant: 'info' }
  return { key: 'active', label: t('checklists.status.active'), variant: 'success' }
}

export function getProgress(c: Checklist): number {
  const items = Array.isArray(c.items) ? c.items : []
  if (items.length === 0) return 0
  return Math.round((items.filter((i) => i.completed).length / items.length) * 100)
}

export function getTotalEffort(c: Checklist): number {
  const items = Array.isArray(c.items) ? c.items : []
  return items.reduce((sum, i) => sum + (i.effortEstimate || 0), 0)
}

export function getOverallPriority(c: Checklist): Priority {
  const items = Array.isArray(c.items) ? c.items : []
  if (items.some((i) => i.priority === 'high')) return 'high'
  if (items.some((i) => i.priority === 'normal')) return 'normal'
  return 'low'
}

export const filterOptions: { value: ChecklistFilter; label: string }[] = [
  { value: 'all', label: t('checklists.filters.all') },
  { value: 'active', label: t('checklists.filters.active') },
  { value: 'expired', label: t('checklists.filters.expired') },
  { value: 'no-dates', label: t('checklists.filters.noDates') },
]

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: t('checklists.sort.newest') },
  { value: 'name', label: t('checklists.sort.name') },
  { value: 'progress', label: t('checklists.sort.progress') },
  { value: 'due-date', label: t('checklists.sort.dueDate') },
]
