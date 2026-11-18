'use client'

import { Card } from '@/components/ui'

interface StatCardProps {
  label: string
  value: string | number
  sublabel?: string
  icon?: React.ReactNode
}

export default function StatCard({ label, value, sublabel, icon }: StatCardProps) {
  return (
    <Card padding="md" className="text-center">
      <div className="mb-2 flex items-center justify-center">
        {icon}
      </div>
      <p className="font-mono text-headline-md text-text-primary">
        {value}
      </p>
      <p className="mt-1 font-label text-label-md uppercase text-text-muted">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 font-body text-label-md text-text-muted">
          {sublabel}
        </p>
      )}
    </Card>
  )
}
