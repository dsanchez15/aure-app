'use client'

import { Card, MetaGrid, SectionHeader } from '@/components/ui'
import { ProgressRing } from '@/components/ui/charts'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { Goal } from '@/types/goal'

interface GoalProgressCardProps {
  goal: Goal
}

export default function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const { t, language: lang } = useAppTranslation()

  const progress =
    goal.estimatedHours && goal.estimatedHours > 0
      ? Math.min(100, (goal.totalHoursSpent / goal.estimatedHours) * 100)
      : null

  const rows: { label: string; value: string }[] = [
    { label: t('goals.progress.timeInvested'), value: `${goal.totalHoursSpent.toFixed(1)} h` },
  ]
  if (goal.estimatedHours) {
    rows.push({ label: t('goals.progress.estimated'), value: `${goal.estimatedHours} h` })
  }
  if (goal.deadline) {
    rows.push({
      label: t('goals.progress.deadline'),
      value: new Date(goal.deadline).toLocaleDateString(lang === 'es' ? 'es' : 'en'),
    })
  }
  if (goal.phase) {
    rows.push({ label: t('goals.progress.phase'), value: `${goal.phase.number}. ${goal.phase.title}` })
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader title={t('goals.progress.title')} icon="donut_large" />
      <div className="flex items-center gap-6">
        {progress !== null && (
          <ProgressRing
            progress={progress}
            size={80}
            strokeWidth={8}
            label={`${Math.round(progress)}% ${t('goals.progress.timeInvested')}`}
          />
        )}
        <MetaGrid items={rows} columns={1} className="flex-1" />
      </div>
    </Card>
  )
}
