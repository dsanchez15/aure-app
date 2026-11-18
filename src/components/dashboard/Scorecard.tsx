'use client'

import { Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { DashboardMetrics } from '@/types/dashboard'

interface ScorecardProps {
  metrics: DashboardMetrics | null
}

export default function Scorecard({ metrics }: ScorecardProps) {
  const { t } = useAppTranslation()

  const cells = metrics
    ? [
        { value: metrics.overallStreak, valueClass: 'text-primary', label: t('dashboard.dayStreak') },
        { value: metrics.activeProjects, valueClass: 'text-success', label: t('dashboard.activeProjects') },
        { value: metrics.pendingTasks, valueClass: 'text-warning', label: t('dashboard.pendingTasks') },
        { value: `${metrics.weeklyCompliance}%`, valueClass: 'text-info', label: t('dashboard.complianceLabel') },
      ]
    : []

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader title={t('dashboard.scorecard')} />
      {metrics ? (
        <div className="grid grid-cols-2 gap-3">
          {cells.map((cell) => (
            <div key={cell.label} className="rounded-control bg-bg-surface-hover px-3 py-2.5">
              <p className={`font-mono text-headline-md tabular-nums ${cell.valueClass}`}>{cell.value}</p>
              <p className="mt-0.5 font-label text-label-sm uppercase text-text-muted">{cell.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center font-body text-body-md text-text-muted">{t('dashboard.loadingMetrics')}</p>
      )}
    </Card>
  )
}
