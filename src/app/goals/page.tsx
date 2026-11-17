'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import GoalCard from '@/components/GoalCard'
import { PageHeader } from '@/components/layout'
import { Button, Checkbox, EmptyState, Select, Spinner } from '@/components/ui'
import { Goal } from '@/types/goal'
import { useAppTranslation } from '@/components/LanguageProvider'

const secondaryLink =
  'inline-flex items-center gap-2 rounded-control border border-border bg-bg-surface px-4 py-2 font-label text-label-lg text-text-primary transition-state hover:bg-bg-surface-hover'

const primaryLink =
  'inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 font-label text-label-lg text-text-inverse transition-state hover:bg-primary-hover'

export default function GoalsPage() {
  const { t } = useAppTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (!showInactive) {
        params.set('status', 'ACTIVE,PENDING')
      }
      if (categoryFilter) params.set('category', categoryFilter)

      const res = await fetch(`/api/goals?${params}`)
      if (!res.ok) throw new Error(t('goals.errors.fetchGoals'))

      const data = await res.json()
      setGoals(data.goals)
      setError('')
    } catch (err) {
      setError(t('goals.errors.fetchGoals'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [showInactive, categoryFilter, t])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const deleteGoal = async (goalId: string) => {
    if (!confirm(t('goals.confirmDelete'))) return
    try {
      const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' })
      if (res.ok) {
        setGoals(goals.filter((g) => g.id !== goalId))
      } else {
        alert(t('goals.errors.deleteGoal'))
      }
    } catch (err) {
      console.error(err)
      alert(t('goals.errors.deleteGoal'))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('goals.title')}
          description={t('goals.subtitle')}
          actions={
            <>
              <Link href="/goals/phases" className={secondaryLink}>
                {t('goals.phases')}
              </Link>
              <Link href="/goals/new" className={primaryLink}>
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  add
                </span>
                {t('goals.newGoal')}
              </Link>
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-4">
          <Checkbox
            label={t('goals.showInactive')}
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <Select
            fieldSize="sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label={t('goals.allCategories')}
            className="w-auto"
          >
            <option value="">{t('goals.allCategories')}</option>
            <option value="PROFESIONAL">{t('goals.categoryProfessional')}</option>
            <option value="PERSONAL">{t('goals.categoryPersonal')}</option>
          </Select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div role="alert" className="rounded-card border border-danger/30 bg-danger/10 p-4 text-center">
            <p className="font-label text-label-md text-danger">{error}</p>
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon="flag"
            title={t('goals.noGoals')}
            description={showInactive ? t('goals.noGoals') : t('goals.createFirst')}
            action={
              <Link href="/goals/new" className={primaryLink}>
                {t('goals.newGoal')}
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <div key={goal.id} className="relative">
                <GoalCard goal={goal} onClick={() => (window.location.href = `/goals/${goal.id}`)} />
                {(goal.status === 'PAUSED' || goal.status === 'CANCELLED') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 px-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
                    title={t('goals.actions.deleteGoal')}
                    aria-label={t('goals.actions.deleteGoal')}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteGoal(goal.id)
                    }}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
