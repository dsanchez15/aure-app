'use client'

import { Button, Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { DashboardChecklistItem, DashboardTodo } from '@/types/dashboard'

interface TaskListsProps {
  checklists: DashboardChecklistItem[]
  todos: DashboardTodo[]
  showChecklists?: boolean
  onMarkChecklistItemDone: (checklistId: number, itemId: number) => void
  onMarkTodoDone: (id: number) => void
}

export default function TaskLists({
  checklists,
  todos,
  showChecklists = true,
  onMarkChecklistItemDone,
  onMarkTodoDone,
}: TaskListsProps) {
  const { t } = useAppTranslation()

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title={showChecklists ? t('dashboard.checklistsAndTodos') : t('dashboard.todos')} />
      <div className={`grid grid-cols-1 gap-4 ${showChecklists ? 'lg:grid-cols-2' : ''}`}>
        {showChecklists && (
          <Card padding="lg" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display text-title-md text-text-primary">
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-warning" />
                {t('dashboard.checklists')}
              </h3>
              <span className="font-label text-label-sm text-text-muted">
                {t('dashboard.pendingCount', { count: checklists.length })}
              </span>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {checklists.length === 0 && (
                <p className="py-4 text-center font-body text-body-md text-text-muted">
                  {t('dashboard.noPendingChecklists')}
                </p>
              )}
              {checklists.map((item) => (
                <div
                  key={`cl-${item.id}`}
                  className="flex items-center gap-3 rounded-control border border-border p-3"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-pill"
                    style={{ backgroundColor: item.checklistColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-label text-label-lg text-text-primary">{item.title}</p>
                    <p className="truncate font-label text-label-sm text-text-muted">
                      {item.checklistTitle} · {item.priority}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-primary"
                    onClick={() => onMarkChecklistItemDone(item.checklistId, item.id)}
                  >
                    {t('common.done')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card padding="lg" className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-title-md text-text-primary">
              <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-danger" />
              {t('dashboard.todos')}
            </h3>
            <span className="font-label text-label-sm text-text-muted">
              {t('dashboard.pendingCount', { count: todos.length })}
            </span>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {todos.length === 0 && (
              <p className="py-4 text-center font-body text-body-md text-text-muted">
                {t('dashboard.noPendingTodos')}
              </p>
            )}
            {todos.map((todo) => (
              <div key={`td-${todo.id}`} className="flex items-center gap-3 rounded-control border border-border p-3">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-pill bg-danger" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-label text-label-lg text-text-primary">{todo.title}</p>
                  <p className="truncate font-label text-label-sm text-text-muted">
                    {todo.dueDate && `${todo.dueDate} · `}
                    {todo.priority}
                    {todo.category?.name && ` · ${todo.category.name}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-primary"
                  onClick={() => onMarkTodoDone(todo.id)}
                >
                  {t('common.done')}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
