'use client'

import { Card, SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import { MODULE_COLORS, type DayData, type WorkloadDay } from '@/types/dashboard'

interface DashboardCalendarProps {
  year: number
  month: number
  calendarData: Record<string, DayData>
  workloadData: Record<string, WorkloadDay>
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const INTENSITY_COLORS: Record<number, string> = {
  3: 'var(--color-danger)',
  2: 'var(--color-warning)',
  1: 'var(--color-success)',
}

export default function DashboardCalendar({
  year,
  month,
  calendarData,
  workloadData,
  selectedDate,
  onSelectDate,
}: DashboardCalendarProps) {
  const { t } = useAppTranslation()

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const todayStr = new Date().toISOString().split('T')[0]

  const dayHeaders = [
    t('dashboard.daySun'),
    t('dashboard.dayMon'),
    t('dashboard.dayTue'),
    t('dashboard.dayWed'),
    t('dashboard.dayThu'),
    t('dashboard.dayFri'),
    t('dashboard.daySat'),
  ]

  const renderDays = () => {
    const days: React.ReactElement[] = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 sm:h-24" />)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayData = calendarData[dateStr]
      const wl = workloadData[dateStr]
      const isSelected = selectedDateStr === dateStr
      const isToday = todayStr === dateStr

      let intensity = 0
      if (wl) {
        if (wl.score > 8) intensity = 3
        else if (wl.score > 5) intensity = 2
        else if (wl.score > 2) intensity = 1
      }

      days.push(
        <button
          key={day}
          onClick={() => onSelectDate(new Date(year, month - 1, day))}
          className={`relative h-20 overflow-hidden rounded-control border p-1.5 text-left transition-state sm:h-24 sm:p-2 ${
            isSelected ? 'border-primary/40 bg-primary/5 shadow-sm' : 'border-border'
          } ${isToday ? 'ring-2 ring-primary/20' : ''}`}
        >
          {intensity > 0 && (
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{ backgroundColor: INTENSITY_COLORS[intensity] }}
            />
          )}
          <span
            className={`relative font-label text-label-md ${
              isToday ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            {day}
          </span>
          {dayData && dayData.count > 0 && (
            <div className="relative mt-1 flex flex-wrap gap-0.5 sm:gap-1">
              {Object.entries(dayData.modules)
                .slice(0, 4)
                .map(([mod, count]) => (
                  <span
                    key={mod}
                    className="inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 font-label text-label-sm text-text-inverse"
                    style={{ backgroundColor: MODULE_COLORS[mod] }}
                  >
                    {count}
                  </span>
                ))}
              {dayData.count > 4 && (
                <span className="font-mono text-label-sm text-text-muted">+{dayData.count - 4}</span>
              )}
            </div>
          )}
          {wl?.overloaded && (
            <div className="absolute right-1 top-1 h-2 w-2 rounded-pill bg-danger" title="Overloaded day" />
          )}
        </button>
      )
    }
    return days
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title={t('dashboard.planning')} />
      <Card>
        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3">
          {Object.entries(MODULE_COLORS).map(([mod, color]) => (
            <div key={mod} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-pill"
                style={{ backgroundColor: color }}
              />
              <span className="font-label text-label-md capitalize text-text-muted">{mod}</span>
            </div>
          ))}
        </div>
        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {dayHeaders.map((d) => (
            <div
              key={d}
              className="text-center font-label text-label-md uppercase tracking-wider text-text-muted"
            >
              {d}
            </div>
          ))}
        </div>
        {/* Days */}
        <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
      </Card>
    </section>
  )
}
