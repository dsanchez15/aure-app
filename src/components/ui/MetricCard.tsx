import { Card } from './Card'

export type MetricTone = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export interface MetricCardProps {
  label: string
  value: string | number
  tone?: MetricTone
  hint?: string
}

const toneClasses: Record<MetricTone, string> = {
  default: 'text-text-primary',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

/**
 * Métrica de resumen (panel). Valor en Fragment Mono tabular para que las
 * cifras no bailen entre renders.
 */
export function MetricCard({ label, value, tone = 'default', hint }: MetricCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-1.5">
      <span className="font-label text-label-md text-text-secondary">{label}</span>
      <span className={`font-mono text-headline-md tabular-nums ${toneClasses[tone]}`}>{value}</span>
      {hint && <span className="font-label text-label-sm text-text-muted">{hint}</span>}
    </Card>
  )
}

export default MetricCard
