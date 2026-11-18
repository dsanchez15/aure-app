export interface MiniBarsProps {
  values: number[];
  /** Máximo de la escala; por defecto, el mayor valor. */
  max?: number;
  /** 8 px de ancho y gap 4 son los valores canónicos. */
  barWidth?: number;
  gap?: number;
  height?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  label: string;
  className?: string;
}

const toneClass = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
} as const;

/**
 * Barras verticales simples en SVG puro (ADR-007) para series cortas
 * (7 días, 4 semanas). El valor va como texto en la pantalla, no aquí.
 */
export function MiniBars({
  values,
  max,
  barWidth = 8,
  gap = 4,
  height = 32,
  tone = 'primary',
  label,
  className = '',
}: MiniBarsProps) {
  const scaleMax = max ?? Math.max(...values, 1);
  const width = values.length * barWidth + Math.max(0, values.length - 1) * gap;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`${toneClass[tone]} ${className}`}
    >
      {values.map((value, index) => {
        const ratio = Math.min(1, Math.max(0, value / scaleMax));
        const barHeight = Math.max(2, ratio * height);
        return (
          <rect
            key={index}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill="currentColor"
            fillOpacity={value === 0 ? 0.15 : 0.85}
          />
        );
      })}
    </svg>
  );
}

export default MiniBars;
