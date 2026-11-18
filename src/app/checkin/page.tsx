'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import CheckInForm from '@/components/CheckInForm'
import { PageHeader } from '@/components/layout'
import { Badge, Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { fatigueBadgeVariant, fatigueLabel } from '@/components/progress/fatigue'
import { WeeklyCheckIn } from '@/types/goal'

export default function CheckInPage() {
  const { t, language } = useAppTranslation()
  const [checkins, setCheckins] = useState<WeeklyCheckIn[]>([])
  const [, setLoading] = useState(true)

  const fetchCheckins = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/checkin')
      if (!res.ok) throw new Error(t('progress.loadError'))

      const data = await res.json()
      setCheckins(data.checkins)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  const handleSubmit = async (data: {
    weekStartDate: string
    fatigueLevel: number
    completedHours: number | null
    deviations: string
    adjustmentNotes: string
  }) => {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || t('progress.saveError'))
    }

    await fetchCheckins()
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader title={t('progress.weeklyCheckIn')} description={t('progress.subtitle')} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card padding="lg" className="flex flex-col gap-4">
              <SectionHeader title={t('progress.newCheckIn')} icon="fact_check" />
              <CheckInForm onSubmit={handleSubmit} />
            </Card>

            {checkins.length > 0 && (
              <Card padding="lg" className="flex flex-col gap-4">
                <SectionHeader title={t('progress.historyLabel')} icon="history" />
                <div className="flex flex-col gap-3">
                  {checkins.map((checkin) => (
                    <div key={checkin.id} className="rounded-control border border-border p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-label text-label-lg text-text-primary">
                          {t('progress.weekOfDate', {
                            date: new Date(checkin.weekStartDate).toLocaleDateString(
                              language === 'es' ? 'es' : 'en'
                            ),
                          })}
                        </span>
                        <Badge variant={fatigueBadgeVariant(checkin.fatigueLevel)}>
                          {t('progress.fatigue')}: {fatigueLabel(checkin.fatigueLevel, t)}
                        </Badge>
                      </div>
                      {checkin.completedHours && (
                        <p className="mb-1 font-body text-body-md text-text-muted">
                          {t('progress.hoursCompleted')}: {checkin.completedHours}
                        </p>
                      )}
                      {checkin.deviations && (
                        <p className="mb-1 font-body text-body-md text-text-secondary">
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
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
