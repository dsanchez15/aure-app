'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import WeekCalendar from '@/components/WeekCalendar'
import { PageHeader } from '@/components/layout'
import { Button, Card, Modal } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { useProgressData } from '@/hooks/useProgressData'
import ActivityForm from '@/components/progress/ActivityForm'
import CheckinForm from '@/components/progress/CheckinForm'
import ActivityList from '@/components/progress/ActivityList'
import CheckinHistory from '@/components/progress/CheckinHistory'

type EntryType = 'activity' | 'checkin' | null

export default function ProgressPage() {
  const { t, language: lang } = useAppTranslation()
  const { entries, checkins, goals, phases, currentWeek, prevWeek, nextWeek, refetch } = useProgressData()

  const [entryType, setEntryType] = useState<EntryType>(null)
  const [saving, setSaving] = useState(false)

  const weekEnd = new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
  const locale = lang === 'es' ? 'es' : 'en'
  const weekLabel = `${currentWeek.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`

  const handleSaved = () => {
    setEntryType(null)
    refetch()
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('progress.title')}
          description={t('progress.subtitle')}
          actions={
            <>
              <Button onClick={() => setEntryType('activity')}>{t('progress.activityLog')}</Button>
              <Button variant="secondary" onClick={() => setEntryType('checkin')}>
                {t('progress.weeklyCheckIn')}
              </Button>
            </>
          }
        />

        {entryType && (
          <Modal
            isOpen={true}
            onClose={() => setEntryType(null)}
            title={entryType === 'activity' ? t('progress.activityLog') : t('progress.weeklyCheckIn')}
          >
            {entryType === 'activity' ? (
              <ActivityForm
                goals={goals}
                phases={phases}
                saving={saving}
                setSaving={setSaving}
                onSaved={handleSaved}
              />
            ) : (
              <CheckinForm saving={saving} setSaving={setSaving} onSaved={handleSaved} />
            )}
          </Modal>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card padding="lg" className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={prevWeek} aria-label={t('progress.prevWeek')}>
                  <span aria-hidden="true" className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </Button>
                <span className="font-label text-label-lg text-text-primary">{weekLabel}</span>
                <Button variant="ghost" size="sm" onClick={nextWeek} aria-label={t('progress.nextWeek')}>
                  <span aria-hidden="true" className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </Button>
              </div>
              <WeekCalendar entries={entries} weekStart={currentWeek} />
              <ActivityList entries={entries} goals={goals} />
            </Card>
          </div>

          <div>
            <CheckinHistory checkins={checkins} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
