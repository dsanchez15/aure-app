'use client'

import { useState, memo } from 'react'
import { Button, Input } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  isSelected: boolean
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
  onSelect: (todo: Todo) => void
  onCreateSubtask: (parentId: number, title: string) => void
}

function CheckCircle({
  completed,
  onClick,
  size = 'md',
}: {
  completed: boolean
  onClick: () => void
  size?: 'md' | 'sm'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="checkbox"
      aria-checked={completed}
      className={`flex shrink-0 items-center justify-center rounded-pill border-2 transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        size === 'md' ? 'h-6 w-6' : 'h-5 w-5'
      } ${completed ? 'border-success bg-success text-text-inverse' : 'border-border-strong bg-transparent'}`}
    >
      {completed && (
        <svg
          aria-hidden="true"
          className={size === 'md' ? 'h-4 w-4' : 'h-3 w-3'}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}

function TodoItem({
  todo,
  isSelected,
  onToggle,
  onDelete,
  onEdit,
  onSelect,
  onCreateSubtask,
}: TodoItemProps) {
  const { t } = useAppTranslation()
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    onCreateSubtask(todo.id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
    setShowAddSubtask(false)
    setShowSubtasks(true)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`group flex items-start gap-3 rounded-card border p-4 transition-surface ${
          todo.completed ? 'bg-bg-surface-hover' : 'bg-bg-surface'
        } ${isSelected ? 'border-primary' : 'border-border hover:border-border-hover'}`}
      >
        <span className="pt-0.5">
          <CheckCircle completed={todo.completed} onClick={() => onToggle(todo.id, !todo.completed)} />
        </span>

        <div
          className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1"
          onClick={() => onSelect(todo)}
        >
          <span
            onDoubleClick={(e) => {
              e.stopPropagation()
              onEdit(todo)
            }}
            className={`block break-words font-label text-label-lg ${
              todo.completed ? 'text-text-muted line-through' : 'text-text-primary'
            }`}
          >
            {todo.title}
          </span>

          {todo.description && (
            <p className="font-body text-body-md text-text-secondary">{todo.description}</p>
          )}

          {(todo.subTasksCount || 0) > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowSubtasks(!showSubtasks)
              }}
              className="mt-1 flex w-fit items-center gap-1 rounded-pill bg-bg-surface-hover px-2 py-0.5 font-label text-label-sm text-text-secondary transition-state hover:text-text-primary"
            >
              <span
                aria-hidden="true"
                className={`material-symbols-outlined text-sm transition-transform ${
                  showSubtasks ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
              <span>{t('todos.subtasks')}</span>
              <span className="text-text-muted">
                {todo.completedSubTasksCount}/{todo.subTasksCount}
              </span>
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => setShowAddSubtask(!showAddSubtask)}
            aria-label={t('todos.addSubtask')}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              add_task
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => onEdit(todo)}
            aria-label={t('todos.editTitle')}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              edit
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-danger hover:bg-danger/10"
            onClick={() => onDelete(todo.id)}
            aria-label={t('common.delete')}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              delete
            </span>
          </Button>
        </div>
      </div>

      {showAddSubtask && (
        <div className="ml-8">
          <form onSubmit={handleAddSubtask} className="flex flex-wrap gap-2">
            <Input
              fieldSize="sm"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder={t('todos.subtaskPlaceholder')}
              aria-label={t('todos.subtaskPlaceholder')}
              className="min-w-40 flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" disabled={!newSubtaskTitle.trim()}>
              {t('todos.add')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddSubtask(false)
                setNewSubtaskTitle('')
              }}
            >
              {t('todos.form.cancel')}
            </Button>
          </form>
        </div>
      )}

      {showSubtasks && todo.subTasks && todo.subTasks.length > 0 && (
        <div className="ml-8 space-y-2">
          {todo.subTasks.map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center gap-3 rounded-control border border-border bg-bg-surface-hover p-3"
            >
              <CheckCircle
                size="sm"
                completed={subtask.completed}
                onClick={() => onToggle(subtask.id, !subtask.completed)}
              />
              <span
                className={`flex-1 font-body text-body-md ${
                  subtask.completed ? 'text-text-muted line-through' : 'text-text-secondary'
                }`}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-text-muted opacity-0 group-hover:opacity-100"
                onClick={() => onDelete(subtask.id)}
                aria-label={t('common.delete')}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-base">
                  delete
                </span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(TodoItem)
