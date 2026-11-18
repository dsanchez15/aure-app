'use client'

import { useAppTranslation } from '@/components/LanguageProvider'
import { PageHeader } from '@/components/layout'
import { Button, SegmentedControl } from '@/components/ui'

interface DashboardHeaderProps {
  viewMode: 'month' | 'week'
  currentDate: Date
  onViewModeChange: (mode: 'month' | 'week') => void
  onToday: () => void
  onPrev: () => void
  onNext: () => void
}

export default function DashboardHeader({
  viewMode,
  currentDate,
  onViewModeChange,
  onToday,
  onPrev,
  onNext,
}: DashboardHeaderProps) {
  const { t, language } = useAppTranslation()

  const periodLabel = currentDate.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <PageHeader
      title={t('dashboard.title')}
      description={t('dashboard.subtitle')}
      actions={
        <>
          <SegmentedControl
            ariaLabel={t('dashboard.title')}
            size="sm"
            options={[
              { value: 'month', label: t('dashboard.month') },
              { value: 'week', label: t('dashboard.week') },
            ]}
            value={viewMode}
            onChange={onViewModeChange}
          />
          <Button variant="ghost" size="sm" onClick={onToday}>
            {t('dashboard.today')}
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onPrev} aria-label="Periodo anterior">
              <span aria-hidden="true" className="material-symbols-outlined block text-lg">
                chevron_left
              </span>
            </Button>
            <span className="w-32 text-center font-label text-label-md text-text-secondary">{periodLabel}</span>
            <Button variant="ghost" size="sm" onClick={onNext} aria-label="Periodo siguiente">
              <span aria-hidden="true" className="material-symbols-outlined block text-lg">
                chevron_right
              </span>
            </Button>
          </div>
        </>
      }
    />
  )
}
