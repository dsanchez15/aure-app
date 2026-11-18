'use client'

import { useState } from 'react'
import { useAppTranslation } from '@/components/LanguageProvider'
import { Card, SectionHeader } from '@/components/ui'

interface EnergySelectorProps {
  onLog?: (level: number) => void
}

export default function EnergySelector({ onLog }: EnergySelectorProps) {
  const { t } = useAppTranslation()
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const levels = [
    { value: 1, label: t('habits.energy.veryLow'), emoji: '😫', color: 'bg-danger' },
    { value: 2, label: t('habits.energy.low'), emoji: '😕', color: 'bg-warning' },
    { value: 3, label: t('habits.energy.medium'), emoji: '😐', color: 'bg-warning/70' },
    { value: 4, label: t('habits.energy.high'), emoji: '🙂', color: 'bg-success/70' },
    { value: 5, label: t('habits.energy.veryHigh'), emoji: '🤩', color: 'bg-success' },
  ]

  const handleSelect = async (level: number) => {
    setSelected(level)
    try {
      const response = await fetch('/api/user/energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level }),
      })
      if (response.ok) {
        setSubmitted(true)
        onLog?.(level)
      }
    } catch (err) {
      console.error('Error logging energy:', err)
    }
  }

  if (submitted) {
    return (
      <Card padding="md" className="energy-selector">
        <p className="text-center font-body text-body-md text-text-secondary">
          {t('habits.energy.logged', { emoji: levels.find((l) => l.value === selected)?.emoji || '', label: levels.find((l) => l.value === selected)?.label || '' })}
        </p>
      </Card>
    )
  }

  return (
    <Card padding="md" className="energy-selector">
      <SectionHeader title={t('habits.energy.title')} className="mb-3" />
      <div className="flex justify-between gap-1">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => handleSelect(level.value)}
            aria-pressed={selected === level.value}
            className={`flex flex-1 flex-col items-center gap-1 rounded-control p-2 transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              selected === level.value
                ? 'bg-bg-surface-hover ring-2 ring-primary'
                : 'hover:bg-bg-surface-hover'
            }`}
          >
            <span className="text-2xl">{level.emoji}</span>
            <span className="font-label text-label-md text-text-muted">{level.label}</span>
            <div className={`h-1 w-full rounded-pill ${level.color} opacity-50`} />
          </button>
        ))}
      </div>
    </Card>
  )
}
