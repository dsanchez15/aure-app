'use client'

import { Badge, Button, Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { Goal, GoalStatus } from '@/types/goal'

interface GoalPermissions {
  canEdit: boolean
  canDelete: boolean
  canActivate: boolean
  canPause: boolean
  canComplete: boolean
  canChangeStatus: boolean
}

interface GoalStatusSidebarProps {
  goal: Goal
  permissions: GoalPermissions
  saving: boolean
  isEditing: boolean
  onStatusChange: (status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED') => void
  onEdit: () => void
  onDelete: () => void
}

const STATUS_VARIANTS: Record<GoalStatus, 'neutral' | 'success' | 'info' | 'warning' | 'danger'> = {
  PENDING: 'neutral',
  ACTIVE: 'success',
  COMPLETED: 'info',
  PAUSED: 'warning',
  CANCELLED: 'danger',
}

export default function GoalStatusSidebar({
  goal,
  permissions,
  saving,
  isEditing,
  onStatusChange,
  onEdit,
  onDelete,
}: GoalStatusSidebarProps) {
  const { t } = useAppTranslation()

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader title={t('goals.statusLabel')} icon="flag" />
      <Badge variant={STATUS_VARIANTS[goal.status]} className="w-fit px-3 py-1">
        {t(`goals.status.${goal.status.toLowerCase()}`)}
      </Badge>

      {permissions.canEdit && !isEditing && (
        <div className="rounded-control bg-warning/10 p-3 font-label text-label-md text-warning">
          {t('goals.alerts.noProgress')}
        </div>
      )}

      {!isEditing && permissions.canChangeStatus && (
        <div className="flex flex-col gap-2">
          {permissions.canActivate && (
            <Button variant="secondary" fullWidth disabled={saving} onClick={() => onStatusChange('ACTIVE')}>
              {t('goals.actions.activate')}
            </Button>
          )}
          {permissions.canPause && (
            <Button variant="secondary" fullWidth disabled={saving} onClick={() => onStatusChange('PAUSED')}>
              {t('goals.actions.pause')}
            </Button>
          )}
          {permissions.canComplete && (
            <Button
              variant="secondary"
              fullWidth
              disabled={saving}
              className="border-success/40 text-success hover:bg-success/10"
              onClick={() => onStatusChange('COMPLETED')}
            >
              {t('goals.actions.complete')}
            </Button>
          )}
        </div>
      )}

      {!isEditing && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {permissions.canEdit && (
            <Button variant="ghost" fullWidth onClick={onEdit}>
              {t('goals.actions.editGoal')}
            </Button>
          )}
          {permissions.canDelete && (
            <Button
              variant="ghost"
              fullWidth
              className="text-danger hover:bg-danger/10"
              onClick={onDelete}
            >
              {t('goals.actions.deleteGoal')}
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
