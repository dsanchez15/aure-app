'use client'

import Link from 'next/link'
import { Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { PerformanceStats } from '@/types/dashboard'

interface PerformanceSectionProps {
  stats: PerformanceStats | null
}

export default function PerformanceSection({ stats }: PerformanceSectionProps) {
  const { t, language } = useAppTranslation()

  const cards = [
    {
      icon: 'local_fire_department',
      iconClass: 'bg-warning/15 text-warning',
      value: stats?.gymStreak ?? 0,
      suffix: '',
      label: t('dashboard.gymStreak'),
    },
    {
      icon: 'schedule',
      iconClass: 'bg-info/15 text-info',
      value: stats?.hoursThisWeek ?? 0,
      suffix: 'h',
      label: t('dashboard.thisWeek'),
    },
    {
      icon: 'track_changes',
      iconClass: 'bg-success/15 text-success',
      value: stats?.totalGoals ?? 0,
      suffix: '',
      label: t('dashboard.activeGoals'),
    },
  ]

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader
        title={t('dashboard.performancePlan')}
        actions={
          <Link
            href="/goals"
            className="rounded-control px-2 py-1 font-label text-label-md text-text-secondary transition-state hover:bg-bg-surface-hover hover:text-text-primary"
          >
            {t('dashboard.viewAll')}
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.icon} padding="md">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-pill ${card.iconClass}`}>
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  {card.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-headline-md tabular-nums text-text-primary">
                  {card.value}
                  {card.suffix}
                </p>
                <p className="truncate font-label text-label-sm text-text-muted">{card.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {stats?.nextMilestones && stats.nextMilestones.length > 0 && (
        <Card padding="lg" className="flex flex-col gap-3">
          <SectionHeader title={t('dashboard.upcomingMilestones')} />
          <div className="space-y-2">
            {stats.nextMilestones.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-control bg-bg-surface-hover p-2.5">
                <span aria-hidden="true" className="material-symbols-outlined text-lg text-text-muted">
                  flag
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-label text-label-lg text-text-primary">{m.title}</p>
                  <p className="truncate font-label text-label-sm text-text-muted">{m.goal.title}</p>
                </div>
                <span className="shrink-0 font-mono text-label-sm text-text-muted">
                  {m.targetDate
                    ? new Date(m.targetDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  )
}
