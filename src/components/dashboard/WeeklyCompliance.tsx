'use client'

import { Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { DashboardMetrics } from '@/types/dashboard'

interface WeeklyComplianceProps {
  metrics: DashboardMetrics | null
}

export default function WeeklyCompliance({ metrics }: WeeklyComplianceProps) {
  const { t } = useAppTranslation()

  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <SectionHeader
        title={t('dashboard.weeklyCompliance')}
        actions={
          metrics ? (
            <span className="font-mono text-title-md tabular-nums text-success">{metrics.weeklyCompliance}%</span>
          ) : undefined
        }
      />
      {metrics ? (
        <div className="space-y-2">
          <div className="h-2 w-full rounded-pill bg-bg-surface-hover">
            <div
              className="h-2 rounded-pill bg-success transition-surface"
              style={{ width: `${metrics.weeklyCompliance}%` }}
            />
          </div>
          <p className="font-label text-label-sm text-text-muted">
            {metrics.weeklyCompliance >= 80
              ? t('dashboard.compliance.high')
              : metrics.weeklyCompliance >= 50
                ? t('dashboard.compliance.medium')
                : t('dashboard.compliance.low')}
          </p>
        </div>
      ) : (
        <p className="py-2 text-center font-body text-body-md text-text-muted">{t('common.loading')}</p>
      )}
    </Card>
  )
}
