'use client'

import { Badge, Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { fatigueLabel, fatigueBadgeVariant } from './fatigue'
import type { WeeklyCheckIn } from '@/types/goal'

interface CheckinHistoryProps {
  checkins: WeeklyCheckIn[]
}

export default function CheckinHistory({ checkins }: CheckinHistoryProps) {
  const { t, language: lang } = useAppTranslation()

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <SectionHeader title={t('progress.history')} icon="history" />

      {checkins.length === 0 ? (
        <p className="py-4 text-center font-body text-body-md text-text-muted">{t('progress.noCheckins')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {checkins.slice(0, 8).map((checkin) => (
            <div key={checkin.id} className="rounded-control border border-border p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-label-sm uppercase text-text-muted">
                  {t('progress.weekOf')}{' '}
                  {new Date(checkin.weekStartDate).toLocaleDateString(lang === 'es' ? 'es' : 'en')}
                </span>
                <Badge variant={fatigueBadgeVariant(checkin.fatigueLevel)}>
                  {fatigueLabel(checkin.fatigueLevel, t)}
                </Badge>
              </div>
              {checkin.deviations && (
                <p className="font-body text-body-md text-text-secondary">
                  <span className="font-label text-text-primary">{t('progress.deviations')}:</span>{' '}
                  {checkin.deviations}
                </p>
              )}
              {checkin.adjustmentNotes && (
                <p className="font-body text-body-md text-text-secondary">
                  <span className="font-label text-text-primary">{t('progress.adjustments')}:</span>{' '}
                  {checkin.adjustmentNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
