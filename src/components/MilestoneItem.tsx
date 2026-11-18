'use client'

import { useState } from 'react'
import { Milestone } from '@/types/goal'

interface MilestoneItemProps {
  milestone: Milestone
  onToggle?: (id: string, completed: boolean) => void
  readOnly?: boolean
}

export default function MilestoneItem({ milestone, onToggle, readOnly }: MilestoneItemProps) {
  const [loading, setLoading] = useState(false)

  const isOverdue = milestone.targetDate &&
    !milestone.completed &&
    new Date(milestone.targetDate) < new Date()

  const handleToggle = async () => {
    if (!onToggle || readOnly) return
    setLoading(true)
    try {
      await onToggle(milestone.id, !milestone.completed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-card border p-3 transition-state ${
        milestone.completed ? 'bg-bg-surface opacity-60' : 'bg-transparent'
      } ${isOverdue ? 'border-danger/30' : 'border-border'}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading || readOnly}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border-2 transition-state ${
          milestone.completed
            ? 'border-success bg-success'
            : readOnly
              ? 'cursor-not-allowed border-border'
              : 'border-border-strong hover:border-success'
        }`}
      >
        {milestone.completed && (
          <svg aria-hidden="true" className="h-4 w-4 text-text-inverse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-label text-label-lg text-text-primary ${milestone.completed ? 'line-through' : ''}`}
        >
          {milestone.title}
        </p>
        {milestone.targetDate && (
          <p className={`font-label text-label-md ${isOverdue ? 'text-danger' : 'text-text-muted'}`}>
            {isOverdue ? 'Vencido: ' : ''}{new Date(milestone.targetDate).toLocaleDateString('es')}
          </p>
        )}
      </div>
    </div>
  )
}
