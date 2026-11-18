'use client'

import { useState } from 'react'
import SettingCard from '@/components/SettingCard'
import { Button, Input, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

/** Paleta de categorías sobre tokens; el color se guarda como valor del tema. */
export const CATEGORY_COLORS = [
  { name: 'Blue', value: 'var(--color-info)' },
  { name: 'Green', value: 'var(--color-success)' },
  { name: 'Red', value: 'var(--color-danger)' },
  { name: 'Amber', value: 'var(--color-warning)' },
  { name: 'Purple', value: 'var(--color-primary)' },
]

export interface SettingsCategory {
  id: number
  name: string
  color: string
}

interface CategoriesManagerCardProps {
  categories: SettingsCategory[]
  onCreateCategory: (name: string, color: string) => Promise<void>
  onDeleteCategory: (id: number) => void
}

export default function CategoriesManagerCard({
  categories,
  onCreateCategory,
  onDeleteCategory,
}: CategoriesManagerCardProps) {
  const { t } = useAppTranslation()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0].value)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await onCreateCategory(newName.trim(), newColor)
    setNewName('')
    setNewColor(CATEGORY_COLORS[0].value)
    setShowForm(false)
  }

  return (
    <SettingCard>
      <SectionHeader title={t('settings.todoCategories')} icon="label" />
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="font-body text-body-md text-text-muted">{t('settings.noCategories')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-control border border-border bg-bg-surface px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-pill"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-label text-label-lg text-text-primary">{cat.name}</span>
                {cat.name !== 'General' && (
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    className="settings-cat-delete-btn text-text-muted transition-state"
                    aria-label={`${t('common.delete')} ${cat.name}`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-control bg-bg-surface-hover p-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('settings.categoryNamePlaceholder')}
              aria-label={t('settings.categoryNamePlaceholder')}
              autoFocus
            />
            <div className="flex gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setNewColor(c.value)}
                  className={`h-8 w-8 rounded-pill border-2 transition-state ${
                    newColor === c.value ? 'scale-110 border-text-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={newColor === c.value}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setNewName('')
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" size="sm" disabled={!newName.trim()}>
                {t('common.create')}
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            {t('settings.newCategory')}
          </Button>
        )}
      </div>
    </SettingCard>
  )
}
