'use client'

import { ReactNode, useEffect, useId, useRef } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { Button } from './Button'

export type DrawerSide = 'right' | 'left'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  side?: DrawerSide
  closeOnOverlayClick?: boolean
}

/**
 * Panel lateral para detalles. Equivalente al drawer de los mockups de Aure.
 * Accesible: role="dialog", aria-modal, focus trap, Escape y click en overlay.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  closeOnOverlayClick = true,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useFocusTrap(panelRef, isOpen)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-bg-overlay" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex h-full w-full max-w-sm flex-col border-border bg-bg-surface shadow-lg ${
          side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <h2 id={titleId} className="font-display text-title-md text-text-primary">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar" className="-mr-2 px-2">
            <span aria-hidden="true" className="material-symbols-outlined text-xl">
              close
            </span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export default Drawer
