'use client'

import { useState, RefObject } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

interface TodoCreateFormProps {
  inputRef: RefObject<HTMLInputElement | null>
  onAdd: (title: string) => Promise<void>
}

export default function TodoCreateForm({ inputRef, onAdd }: TodoCreateFormProps) {
  const { t } = useAppTranslation()
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setTitle('')
    await onAdd(trimmed)
  }

  return (
    <Card padding="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-xl text-text-muted">
            add_task
          </span>
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('todos.addPlaceholder')}
            aria-label={t('todos.addPlaceholder')}
            className="border-0 bg-transparent focus:ring-0"
          />
        </div>
        <Button type="submit" disabled={!title.trim()} className="shrink-0 whitespace-nowrap">
          {t('todos.add')}
        </Button>
      </form>
    </Card>
  )
}
