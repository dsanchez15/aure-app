'use client'

import { useState } from 'react'
import { computeBlockerPayload, getSubtaskProgress, isParentAutoCompleted } from '@/lib/checklist-utils'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Badge, Button, Textarea } from '@/components/ui'
import { priorityConfig } from './helpers'
import type { ChecklistItem, Priority } from '@/types/checklist'

interface ChecklistItemRowProps {
  checklistId: number
  item: ChecklistItem
  itemsList: ChecklistItem[]
  depth: number
  mode: 'active' | 'template' | 'history'
  blocked: boolean
  hasChildren: boolean
  isCollapsed: boolean
  isDragged: boolean
  onToggleCollapse: (parentId: number) => void
  onToggleItem: (checklistId: number, item: ChecklistItem) => void
  onUpdateItem: (checklistId: number, item: ChecklistItem, data: Partial<ChecklistItem>) => void
  onDeleteItem: (itemId: number) => void
  onCreateReminder: (checklistId: number, item: ChecklistItem) => void
}

export default function ChecklistItemRow({
  checklistId,
  item,
  itemsList,
  depth,
  mode,
  blocked,
  hasChildren,
  isCollapsed,
  isDragged,
  onToggleCollapse,
  onToggleItem,
  onUpdateItem,
  onDeleteItem,
  onCreateReminder,
}: ChecklistItemRowProps) {
  const { t } = useAppTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editEffort, setEditEffort] = useState<number | ''>('')
  const [editBlockedBy, setEditBlockedBy] = useState<number | ''>('')
  const [showNotes, setShowNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')

  const prio = priorityConfig[item.priority as Priority] || priorityConfig.normal
  const autoCompleted = hasChildren && isParentAutoCompleted(itemsList, item.id)
  const isMuted = autoCompleted || item.completed

  const startEdit = () => {
    setEditTitle(item.title)
    setEditEffort(item.effortEstimate || '')
    setEditBlockedBy(item.blockedByItemId || '')
    setIsEditing(true)
  }

  const saveEdit = () => {
    const updates: Partial<ChecklistItem> = {}
    if (editTitle.trim() && editTitle !== item.title) updates.title = editTitle.trim()
    if (editEffort !== '') updates.effortEstimate = Number(editEffort)
    Object.assign(updates, computeBlockerPayload(item.blockedByItemId ?? null, editBlockedBy))
    if (Object.keys(updates).length > 0) onUpdateItem(checklistId, item, updates)
    setIsEditing(false)
  }

  const openNotes = () => {
    setNotesValue(item.notes || '')
    setShowNotes((prev) => !prev)
  }

  const cyclePriority = () => {
    const next: Record<string, Priority> = { normal: 'high', high: 'low', low: 'normal' }
    onUpdateItem(checklistId, item, { priority: next[item.priority] || 'normal' })
  }

  return (
    <>
      <div
        className={`checklist-item-row group/item flex items-center gap-2.5 py-1.5 ${
          isMuted ? 'opacity-60' : ''
        } ${blocked ? 'opacity-50' : ''} ${isDragged ? 'opacity-40' : ''}`}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {mode !== 'history' && (
          <span className="material-symbols-outlined cursor-grab text-label-md text-text-muted">drag_indicator</span>
        )}

        {/* Chevron toggle for parents with children */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleCollapse(item.id)
            }}
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-text-muted transition-state"
            aria-label={isCollapsed ? 'Expand children' : 'Collapse children'}
          >
            <span
              className="material-symbols-outlined text-body-md transition-transform"
              style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}
            >
              chevron_right
            </span>
          </button>
        ) : depth === 0 ? (
          <span className="w-5 flex-shrink-0" />
        ) : null}

        {/* Checkbox: hidden for parents with children */}
        {hasChildren ? (
          <span className="h-5 w-5 flex-shrink-0" />
        ) : (
          <button
            onClick={() => mode === 'active' && !blocked && onToggleItem(checklistId, item)}
            role="checkbox"
            aria-checked={item.completed}
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 transition-state ${
              item.completed
                ? 'border-primary bg-primary'
                : blocked || mode !== 'active'
                  ? 'cursor-not-allowed border-border-strong'
                  : 'border-border-strong hover:border-primary'
            }`}
          >
            {item.completed && <span className="material-symbols-outlined text-label-md text-text-inverse">check</span>}
          </button>
        )}

        {isEditing && mode !== 'history' ? (
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="flex-1 border-b-2 border-primary bg-transparent px-1 py-0.5 font-body text-body-md text-text-primary focus:outline-none"
            />
            <input
              type="number"
              value={editEffort}
              onChange={(e) => setEditEffort(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Min"
              className="w-16 border-b border-border bg-transparent px-1 py-0.5 font-body text-label-md text-text-primary focus:outline-none"
            />
            <select
              value={editBlockedBy}
              onChange={(e) => setEditBlockedBy(e.target.value ? parseInt(e.target.value) : '')}
              aria-label={t('checklists.expandedItems.noBlocker')}
              className="border-b border-border bg-transparent px-1 py-0.5 font-body text-label-md text-text-primary focus:outline-none"
            >
              <option value="">{t('checklists.expandedItems.noBlocker')}</option>
              {itemsList
                .filter((i) => i.id !== item.id)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title.slice(0, 20)}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <>
            <span
              onDoubleClick={() => mode !== 'history' && startEdit()}
              className={`flex-1 font-body text-body-md ${
                isMuted ? 'line-through' : ''
              } ${isMuted || blocked ? 'text-text-muted' : 'text-text-primary'}`}
            >
              {item.title}
              {blocked && (
                <Badge variant="warning" className="ml-2">
                  <span className="material-symbols-outlined text-body-md">lock</span>
                  {t('checklists.expandedItems.blocked')}
                </Badge>
              )}
              {item.effortEstimate ? (
                <span className="ml-2 font-label text-label-md text-text-muted">({item.effortEstimate}m)</span>
              ) : null}
            </span>
            {hasChildren && (
              <SubtaskCounter itemsList={itemsList} parentId={item.id} />
            )}
          </>
        )}

        {mode !== 'history' && (
          <>
            <button
              onClick={openNotes}
              title={item.notes || 'Add notes'}
              className={`p-0.5 transition-state ${item.notes ? 'text-warning' : 'text-text-muted'} ${
                item.notes ? '' : 'opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-label-md">sticky_note_2</span>
            </button>
            <button
              onClick={cyclePriority}
              title={`Priority: ${item.priority}`}
              className="material-symbols-outlined cursor-pointer text-label-md transition-state hover:scale-125"
              style={{ color: prio.color }}
            >
              {prio.icon}
            </button>
            <button
              onClick={startEdit}
              className="p-0.5 text-text-muted opacity-0 transition-state hover:text-primary group-hover/item:opacity-100 focus-visible:opacity-100"
            >
              <span className="material-symbols-outlined text-body-md">edit</span>
            </button>
            <button
              onClick={() => onCreateReminder(checklistId, item)}
              title="Set reminder"
              className="p-0.5 text-text-muted opacity-0 transition-state hover:text-warning group-hover/item:opacity-100 focus-visible:opacity-100"
            >
              <span className="material-symbols-outlined text-body-md">notifications</span>
            </button>
            <button
              onClick={() => onDeleteItem(item.id)}
              className="p-0.5 text-text-muted opacity-0 transition-state hover:bg-danger/10 hover:text-danger group-hover/item:opacity-100 focus-visible:opacity-100"
            >
              <span className="material-symbols-outlined text-body-md">close</span>
            </button>
          </>
        )}
      </div>

      {/* Notes editor */}
      {showNotes && mode !== 'history' && (
        <div className="mb-2 mt-1" style={{ marginLeft: `${depth * 20 + 40}px` }}>
          <Textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            rows={2}
            placeholder={t('checklists.expandedItems.notesPlaceholder')}
            className="resize-none"
          />
          <div className="mt-1 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onUpdateItem(checklistId, item, { notes: notesValue || null })
                setShowNotes(false)
              }}
            >
              {t('common.save')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNotes(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function SubtaskCounter({ itemsList, parentId }: { itemsList: ChecklistItem[]; parentId: number }) {
  const progress = getSubtaskProgress(itemsList, parentId)
  return (
    <span className="flex-shrink-0 font-label text-label-md font-medium text-text-muted">
      {progress.completed}/{progress.total}
    </span>
  )
}
