export interface SparklineProps {
  values: number[];
  /** 64×20 es el tamaño canónico para métricas de tarjeta. */
  width?: number;
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
 * Tendencia mínima en SVG puro (ADR-007). Sin ejes ni tooltips: el número
 * clave se muestra como texto al lado del gráfico.
 */
export function Sparkline({
  values,
  width = 64,
  height = 20,
  tone = 'primary',
  label,
  className = '',
}: SparklineProps) {
  const points = values.length > 1 ? values : [0, values[0] ?? 0];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);

  const coords = points.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * (height - 2) - 1;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = coords.join(' ');
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`overflow-visible ${toneClass[tone]} ${className}`}
    >
      <polygon points={area} fill="currentColor" fillOpacity={0.12} />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Sparkline;
