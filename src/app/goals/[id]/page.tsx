'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import { SegmentedControl, Spinner } from '@/components/ui'
import PriorityBadge from '@/components/PriorityBadge'
import { useAppTranslation } from '@/components/LanguageProvider'
import { useGoal } from '@/hooks/useGoal'
import GoalProgressCard from '@/components/goals/GoalProgressCard'
import GoalMilestonesCard from '@/components/goals/GoalMilestonesCard'
import GoalEditForm from '@/components/goals/GoalEditForm'
import GoalStatusSidebar from '@/components/goals/GoalStatusSidebar'

const backLink =
  'inline-flex items-center gap-2 rounded-control border border-border bg-bg-surface px-4 py-2 font-label text-label-lg text-text-primary transition-state hover:bg-bg-surface-hover'

export default function GoalDetailPage() {
  const { t, language: lang, setLanguage } = useAppTranslation()
  const params = useParams()
  const router = useRouter()
  const goalId = params.id as string

  const {
    goal,
    loading,
    error,
    saving,
    phases,
    permissions,
    setError,
    toggleMilestone,
    changeStatus,
    deleteGoal,
    saveEdit,
  } = useGoal(goalId, t)

  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    if (!goal) return
    if (!confirm(t('common.confirm'))) return
    const success = await deleteGoal()
    if (success) {
      router.push('/goals')
    } else {
      alert(t('common.error'))
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  if (!goal || !permissions) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="font-display text-title-lg text-text-primary">{t('goals.notFound')}</p>
          <Link href="/goals" className={backLink}>
            {t('common.back')}
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <SegmentedControl<'es' | 'en'>
            ariaLabel={t('settings.language')}
            size="sm"
            options={[
              { value: 'es', label: 'ES' },
              { value: 'en', label: 'EN' },
            ]}
            value={lang}
            onChange={setLanguage}
          />
        </div>

        <PageHeader
          eyebrow={isEditing ? undefined : t('goals.progress.title')}
          title={isEditing ? t('goals.actions.editGoal') : goal.title}
          description={!isEditing && goal.description ? goal.description : undefined}
          actions={
            <>
              <Link href="/goals" className={backLink}>
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
                {t('goals.title')}
              </Link>
              {!isEditing && <PriorityBadge priority={goal.priority} />}
            </>
          }
        />

        {error && (
          <div role="alert" className="rounded-card border border-danger/30 bg-danger/10 p-4">
            <p className="font-label text-label-md text-danger">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {!isEditing ? (
              <>
                <GoalProgressCard goal={goal} />
                <GoalMilestonesCard
                  goal={goal}
                  canCheck={permissions.canCheckMilestones}
                  onToggle={toggleMilestone}
                />
              </>
            ) : (
              <GoalEditForm
                goal={goal}
                phases={phases}
                saving={saving}
                onSave={saveEdit}
                onCancel={() => {
                  setIsEditing(false)
                  setError('')
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-6">
            <GoalStatusSidebar
              goal={goal}
              permissions={permissions}
              saving={saving}
              isEditing={isEditing}
              onStatusChange={changeStatus}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
