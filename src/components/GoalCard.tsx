'use client'

import { Badge, Card } from '@/components/ui'
import { ProgressRing } from '@/components/ui/charts'
import PriorityBadge from './PriorityBadge'
import type { Goal } from '@/types/goal'

interface GoalCardProps {
  goal: Goal
  onClick?: () => void
}

const STATUS_VARIANT = {
  ACTIVE: 'success',
  COMPLETED: 'info',
  PAUSED: 'warning',
  PENDING: 'neutral',
  CANCELLED: 'danger',
} as const

const STATUS_LABEL = {
  ACTIVE: 'Activo',
  COMPLETED: 'Completado',
  PAUSED: 'Pausado',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelado',
} as const

export default function GoalCard({ goal, onClick }: GoalCardProps) {
  const progress =
    goal.estimatedHours && goal.estimatedHours > 0
      ? Math.min(100, (goal.totalHoursSpent / goal.estimatedHours) * 100)
      : null

  const status = goal.status as keyof typeof STATUS_LABEL

  return (
    <Card
      padding="md"
      hoverable={Boolean(onClick)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={`flex flex-col gap-3 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-title-md text-text-primary">{goal.title}</h3>
            <Badge variant={goal.category === 'PROFESIONAL' ? 'info' : 'success'}>
              {goal.category === 'PROFESIONAL' ? 'Profesional' : 'Personal'}
            </Badge>
          </div>
          {goal.description && (
            <p className="mt-1 truncate font-body text-body-md text-text-secondary">{goal.description}</p>
          )}
        </div>
        <PriorityBadge priority={goal.priority} />
      </div>

      {progress !== null && (
        <div className="flex items-center gap-3">
          <ProgressRing progress={progress} size={48} label={`${Math.round(progress)}% de avance`} />
          <div className="min-w-0 flex-1">
            <div className="h-2 w-full rounded-pill bg-bg-surface-hover">
              <div className="h-2 rounded-pill bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 font-mono text-label-sm text-text-muted">
              {goal.totalHoursSpent.toFixed(1)} / {goal.estimatedHours} h
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 font-label text-label-md text-text-muted">
        {goal.deadline && <span>Vence: {new Date(goal.deadline).toLocaleDateString('es')}</span>}
        {goal.milestones && goal.milestones.length > 0 && (
          <span>
            {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} hitos
          </span>
        )}
        <Badge variant={STATUS_VARIANT[status] ?? 'neutral'} className="ml-auto">
          {STATUS_LABEL[status] ?? goal.status}
        </Badge>
      </div>
    </Card>
  )
}
