'use client'

import { useState, useEffect } from 'react'
import { UserProgression } from '@/types/habit'
import { getLevelName, getXPForNextLevel } from '@/lib/habit-utils'

export default function UserProgressionBadge() {
  const [progression, setProgression] = useState<UserProgression | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/progression')
      .then((res) => res.json())
      .then((data) => {
        setProgression(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !progression) return null

  const levelName = getLevelName(progression.currentLevel)
  const nextLevelXP = getXPForNextLevel(progression.currentLevel)
  const progress = Math.min(100, (progression.totalXP / nextLevelXP) * 100)

  return (
    <div className="rounded-card bg-bg-surface-hover px-3 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-gradient-to-br from-primary to-primary-hover font-label text-label-lg text-text-inverse">
          {progression.currentLevel}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-label text-label-md text-text-secondary">
            {levelName}
          </p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-pill bg-border">
            <div
              className="h-full rounded-pill bg-primary transition-state"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-0.5 font-mono text-label-sm text-text-muted">
            {progression.totalXP} / {nextLevelXP} XP
          </p>
        </div>
      </div>
    </div>
  )
}
