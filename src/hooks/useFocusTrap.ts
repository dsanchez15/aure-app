'use client';

import { useEffect } from 'react';

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  returnFocusRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;
    const container = ref.current;

    // Excluye controles ocultos (p. ej. el botón de escritorio dentro del overlay móvil):
    // querySelectorAll los incluye aunque no sean enfocables.
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const triggerElement = returnFocusRef?.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    first?.focus();
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (triggerElement) {
        triggerElement.focus();
      }
    };
  }, [isActive, ref, returnFocusRef]);
}
