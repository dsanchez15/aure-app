'use client'

import { useState } from 'react'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Button, Input, Modal } from '@/components/ui'
import { ChecklistCategory } from '@/types/checklist'

interface Props {
  categories: ChecklistCategory[]
  onAdd: (name: string, color: string, icon: string) => void
  onUpdate: (id: number, data: Partial<ChecklistCategory>) => void
  onDelete: (id: number) => void
  onClose: () => void
}

const PRESET_COLORS = [
  { value: 'var(--color-info)', labelKey: 'blue' },
  { value: 'var(--color-danger)', labelKey: 'red' },
  { value: 'var(--color-success)', labelKey: 'green' },
  { value: 'var(--color-warning)', labelKey: 'yellow' },
  { value: 'var(--color-primary)', labelKey: 'purple' },
]

const PRESET_ICONS = ['folder', 'work', 'flight', 'home', 'school', 'fitness_center', 'shopping_cart', 'restaurant']

export default function CategoryManager({ categories, onAdd, onUpdate, onDelete, onClose }: Props) {
  const { t } = useAppTranslation()
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0].value)
  const [icon, setIcon] = useState('folder')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), color, icon)
    setName('')
    setColor(PRESET_COLORS[0].value)
    setIcon('folder')
  }

  const startEdit = (cat: ChecklistCategory) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const saveEdit = (id: number) => {
    if (editName.trim()) onUpdate(id, { name: editName.trim() })
    setEditingId(null)
  }

  return (
    <Modal isOpen onClose={onClose} title={t('checklists.categoryManager.title')}>
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('checklists.categoryManager.namePlaceholder')}
          aria-label={t('checklists.categoryManager.namePlaceholder')}
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-10 font-label text-label-sm text-text-muted">
            {t('checklists.categoryManager.color')}
          </span>
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              aria-label={t(`habits.colors.${c.labelKey}`)}
              aria-pressed={color === c.value}
              className={`h-6 w-6 rounded-pill transition-state ${
                color === c.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-surface' : ''
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-10 font-label text-label-sm text-text-muted">
            {t('checklists.categoryManager.icon')}
          </span>
          {PRESET_ICONS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              aria-label={i}
              aria-pressed={icon === i}
              className={`rounded-control p-1 transition-state ${
                icon === i
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                {i}
              </span>
            </button>
          ))}
        </div>

        <Button type="submit" fullWidth disabled={!name.trim()}>
          {t('checklists.categoryManager.addCategory')}
        </Button>
      </form>

      <div className="mt-4 flex max-h-60 flex-col gap-1 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="py-4 text-center font-body text-body-md text-text-muted">
            {t('checklists.categoryManager.noCategories')}
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center gap-2 rounded-control p-2 transition-state hover:bg-bg-surface-hover"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-lg"
                style={{ color: cat.color }}
              >
                {cat.icon}
              </span>
              {editingId === cat.id ? (
                <Input
                  fieldSize="sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => saveEdit(cat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                  aria-label={cat.name}
                  autoFocus
                  className="flex-1"
                />
              ) : (
                <span className="flex-1 font-label text-label-lg text-text-secondary">{cat.name}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={t('common.edit')}
                onClick={() => startEdit(cat)}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  edit
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-muted opacity-0 hover:bg-danger/10 hover:text-danger group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={t('common.delete')}
                onClick={() => onDelete(cat.id)}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  delete
                </span>
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
