'use client'

import { Button } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

interface SettingsFooterProps {
  isDirty: boolean
  onSave: () => void
  onDiscard: () => void
}

export default function SettingsFooter({ isDirty, onSave, onDiscard }: SettingsFooterProps) {
  const { t } = useAppTranslation()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-4 border-t border-border bg-bg-surface/80 p-4 pb-safe backdrop-blur-md lg:left-60 lg:px-10">
      <p
        role="status"
        className={`font-label text-label-md italic text-text-muted transition-opacity ${
          isDirty ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {t('settings.unsavedChanges')}
      </p>
      <div className="ml-auto flex gap-3">
        <Button variant="secondary" onClick={onDiscard}>
          {t('settings.discard')}
        </Button>
        <Button onClick={onSave}>
          <span aria-hidden="true" className="material-symbols-outlined text-lg">
            save
          </span>
          {t('settings.saveChanges')}
        </Button>
      </div>
    </footer>
  )
}
