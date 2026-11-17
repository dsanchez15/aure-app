'use client'

import { useAppTranslation } from '@/components/LanguageProvider'

export type SettingsTabKey = 'general' | 'vistas' | 'admin'

interface SettingsTabsProps {
  activeTab: SettingsTabKey
  onTabChange: (tab: SettingsTabKey) => void
}

const TAB_ICONS: Record<SettingsTabKey, string> = {
  general: 'tune',
  vistas: 'visibility',
  admin: 'admin_panel_settings',
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const { t } = useAppTranslation()

  const tabs: { key: SettingsTabKey; label: string }[] = [
    { key: 'general', label: t('settings.tabs.general') },
    { key: 'vistas', label: t('settings.tabs.vistas') },
    { key: 'admin', label: t('settings.tabs.admin') },
  ]

  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const active = activeTab === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.key)}
            className={`-mb-px flex shrink-0 items-center gap-2 rounded-t-control border-b-2 px-4 py-3 font-label text-label-md transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              {TAB_ICONS[tab.key]}
            </span>
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
