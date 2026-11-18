'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge, Button, Drawer, EmptyState, Spinner } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { useAppTranslation } from '@/components/LanguageProvider'
import { useTodos } from '@/hooks/useTodos'
import { useDebounce } from '@/hooks/useDebounce'
import { useSessionState } from '@/hooks/useSessionState'
import TodoCreateForm from './TodoCreateForm'
import TodoFilters, { type TodoFiltersValue, type TodoSort } from './TodoFilters'
import TodoItems from './TodoItems'
import TodoEditModal from './TodoEditModal'
import TodoDetailsSidebar from './TodoDetailsSidebar'
import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'aure-todo-filters'

const INITIAL_FILTERS: TodoFiltersValue = {
  viewMode: 'all',
  sort: 'newest',
  groupBy: 'none',
  search: '',
  priority: '',
  category: '',
  status: '',
}

function sortByCreatedAt(todos: Todo[], sort: TodoSort): Todo[] {
  return [...todos].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sort === 'oldest' ? diff : -diff
  })
}

export default function TodoList() {
  const { t } = useAppTranslation()
  const [filters, setFilters] = useSessionState<TodoFiltersValue>(STORAGE_KEY, INITIAL_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebounce(filters.search, 400)

  const {
    todos,
    groupedTodos,
    categories,
    loading,
    error,
    apiError,
    selectedTodo,
    setApiError,
    setSelectedTodo,
    fetchTodos,
    createTodo,
    createSubtask,
    toggleTodo,
    deleteTodo,
    editTodo,
  } = useTodos(t)

  const { viewMode, groupBy, priority, category, status } = filters
  useEffect(() => {
    fetchTodos({ viewMode, groupBy, search: debouncedSearch, priority, category, status })
  }, [fetchTodos, viewMode, groupBy, debouncedSearch, priority, category, status])

  // Los filtros sobreviven a un refresh durante la sesión del navegador
  // (useSessionState); el panel de filtros permanece abierto mientras se aplican.

  // Keyboard shortcut: "n" to focus the new-todo input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const clearFilters = () => setFilters(INITIAL_FILTERS)

  const itemHandlers = {
    onToggle: toggleTodo,
    onDelete: deleteTodo,
    onEdit: setEditingTodo,
    onSelect: setSelectedTodo,
    onCreateSubtask: createSubtask,
  }

  if (loading && todos.length === 0 && !groupedTodos) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-body text-body-md text-danger">{error}</p>
        <Button
          className="mt-4"
          onClick={() =>
            fetchTodos({ viewMode, groupBy, search: debouncedSearch, priority, category, status })
          }
        >
          {t('todos.retry')}
        </Button>
      </div>
    )
  }

  const sortedTodos = sortByCreatedAt(todos, filters.sort)
  const sortedGroups = groupedTodos
    ? Object.fromEntries(
        Object.entries(groupedTodos).map(([group, list]) => [
          group,
          sortByCreatedAt(list as Todo[], filters.sort),
        ])
      )
    : null

  const countable = groupedTodos ? (Object.values(groupedTodos).flat() as Todo[]) : todos
  const counts = {
    pending: countable.filter((todo) => !todo.completed).length,
    completed: countable.filter((todo) => todo.completed).length,
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('todos.title')} />

      <div className="flex flex-col gap-6">
        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <TodoCreateForm inputRef={inputRef} onAdd={createTodo} />

          {apiError && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-card border border-danger/30 bg-danger/10 p-4 text-danger"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                error
              </span>
              <span className="flex-1 font-label text-label-md">{apiError}</span>
              <Button
                variant="ghost"
                size="sm"
                className="px-1.5 text-danger hover:bg-danger/10"
                onClick={() => setApiError('')}
                aria-label={t('common.cancel')}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  close
                </span>
              </Button>
            </div>
          )}

          <TodoFilters
            value={filters}
            categories={categories}
            counts={counts}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen((open) => !open)}
            onChange={setFilters}
            onClear={clearFilters}
          />

          {sortedGroups ? (
            <div className="flex flex-col gap-6">
              {Object.entries(sortedGroups).map(([groupName, groupTodos]) => (
                <section key={groupName} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-primary" />
                    <h2 className="font-display text-title-md text-text-primary">{groupName}</h2>
                    <Badge variant="neutral">{groupTodos.length}</Badge>
                  </div>
                  <TodoItems todos={groupTodos} selectedId={selectedTodo?.id ?? null} {...itemHandlers} />
                </section>
              ))}
            </div>
          ) : sortedTodos.length === 0 ? (
            <EmptyState
              icon="checklist"
              title={t('todos.noTodos')}
              description={t('todos.adjustFilters')}
            />
          ) : (
            <TodoItems todos={sortedTodos} selectedId={selectedTodo?.id ?? null} {...itemHandlers} />
          )}

          {editingTodo && (
            <TodoEditModal
              todo={editingTodo}
              categories={categories}
              onSave={editTodo}
              onClose={() => setEditingTodo(null)}
            />
          )}
        </div>
      </div>

      <Drawer
        isOpen={selectedTodo !== null}
        onClose={() => setSelectedTodo(null)}
        title={t('todos.details.title')}
      >
        <TodoDetailsSidebar todo={selectedTodo} />
      </Drawer>
    </div>
  )
}
