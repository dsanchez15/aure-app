'use client';

import { BrandMark } from './BrandMark';
import { useSidebar } from '@/components/SidebarContext';

export interface MobileTopbarProps {
  /** Ref del botón hamburguesa, usado para devolver el foco al cerrar el overlay. */
  toggleRef?: React.Ref<HTMLButtonElement>;
  /** `false` para previsualizarla en escritorio (styleguide). */
  desktopHidden?: boolean;
}

/** Barra superior móvil: marca + acceso a la navegación. Solo &lt; lg. */
export function MobileTopbar({ toggleRef, desktopHidden = true }: MobileTopbarProps) {
  const { isMobileOverlayOpen, toggle } = useSidebar();

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-bg-surface px-4 py-3 ${
        desktopHidden ? 'lg:hidden' : ''
      }`}
    >
      <BrandMark size="sm" />
      <button
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-expanded={isMobileOverlayOpen}
        aria-controls="main-sidebar"
        aria-label={isMobileOverlayOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        className="rounded-control p-2 text-text-secondary transition-state hover:bg-bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span aria-hidden="true" className="material-symbols-outlined block">
          {isMobileOverlayOpen ? 'close' : 'menu'}
        </span>
      </button>
    </header>
  );
}

export default MobileTopbar;
