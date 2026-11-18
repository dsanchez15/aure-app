export interface ProgressRingProps {
  /** Valor entre 0 y 100. */
  progress: number;
  /** 48 = tarjetas compactas · 64 = resumen de sección. */
  size?: number;
  strokeWidth?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Texto accesible con el resumen ("72% de cumplimiento"). */
  label: string;
  showLabel?: boolean;
  className?: string;
}

const toneClass = {
  primary: 'stroke-primary',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-danger',
  info: 'stroke-info',
} as const;

/**
 * Anillo de progreso en SVG puro (ADR-007). Sin dependencias ni medición JS:
 * `viewBox` fijo y el porcentaje se dibuja como texto HTML encima.
 */
export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  tone = 'primary',
  label,
  showLabel = true,
  className = '',
}: ProgressRingProps) {
  const value = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-bg-input"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${toneClass[tone]} transition-surface`}
        />
      </svg>
      {showLabel && (
        <span
          aria-hidden="true"
          className={`absolute font-mono tabular-nums text-text-primary ${
            size >= 56 ? 'text-label-md' : 'text-label-sm'
          }`}
        >
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}

export default ProgressRing;
