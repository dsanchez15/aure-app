'use client'

import { Badge, Card, MetaGrid, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { formatDate, formatEffort } from '@/lib/todo-utils'
import type { Todo } from '@/types/todo'

interface TodoDetailsSidebarProps {
  todo: Todo | null
}

export default function TodoDetailsSidebar({ todo }: TodoDetailsSidebarProps) {
  const { t } = useAppTranslation()

  const detailItems = [
    { label: t('todos.details.category'), value: todo?.category ? todo.category.name : t('todos.details.none') },
    {
      label: t('todos.details.status'),
      value: todo ? (
        <Badge variant={todo.completed ? 'success' : 'info'}>
          {todo.completed ? t('todos.statuses.completed') : t('todos.statuses.pending')}
        </Badge>
      ) : (
        t('todos.details.none')
      ),
    },
    {
      label: t('todos.details.priority'),
      value: todo?.priority ? t(`todos.priorities.${todo.priority}`) : t('todos.details.none'),
    },
    {
      label: t('todos.details.date'),
      value: todo?.dueDate
        ? `${formatDate(todo.dueDate)}${todo.dueTime ? ` ${todo.dueTime}` : ''}`
        : t('todos.details.none'),
    },
    {
      label: t('todos.details.effort'),
      value: todo && todo.effortMinutes > 0 ? formatEffort(todo.effortMinutes) : t('todos.details.none'),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card padding="lg" className="flex flex-col gap-4">
        <SectionHeader title={t('todos.details.title')} icon="info" />
        {todo?.title && <p className="font-label text-label-lg text-text-primary">{todo.title}</p>}
        <MetaGrid items={detailItems} columns={1} />
      </Card>
    </div>
  )
}
