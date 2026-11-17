import type { ReactNode } from 'react';

export interface BrandMarkProps {
  /** sm = topbar móvil (28px) · md = sidebar (32px) · lg = auth (44px) */
  size?: 'sm' | 'md' | 'lg';
  /** Muestra el logotipo textual. En el rail colapsado se oculta. */
  showName?: boolean;
  /** Icono sobre el nombre, centrado (pantallas de acceso). */
  stacked?: boolean;
  className?: string;
  children?: ReactNode;
}

const boxSize = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-11 w-11',
} as const;

const svgSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

/** Marca de Aure: hexágono en primary + nombre en Mona Sans. */
export function BrandMark({
  size = 'md',
  showName = true,
  stacked = false,
  className = '',
}: BrandMarkProps) {
  return (
    <div
      className={`flex gap-2.5 ${stacked ? 'flex-col items-center gap-3' : 'items-center'} ${className}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-control bg-primary text-text-inverse shadow-sm ${boxSize[size]}`}
      >
        <svg
          width={svgSize[size]}
          height={svgSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="currentColor" fillOpacity="0.3" />
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 6L8 9V15L12 18L16 15V9L12 6Z" fill="currentColor" />
        </svg>
      </div>
      {showName && (
        <span className={`font-display text-text-primary ${size === 'lg' ? 'text-headline-lg' : 'text-title-lg'}`}>
          Aure
        </span>
      )}
    </div>
  );
}

export default BrandMark;
