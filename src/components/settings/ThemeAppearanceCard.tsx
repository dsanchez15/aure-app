'use client'

import SettingCard from '@/components/SettingCard'
import { SectionHeader } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

type ThemeMode = 'light' | 'dark' | 'system'
type LangCode = 'en' | 'es'

interface ThemeAppearanceCardProps {
  theme: ThemeMode
  selectedLang: LangCode
  onThemeChange: (theme: ThemeMode) => void
  onLanguageChange: (lang: LangCode) => void
}

const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

const THEME_MODES: { mode: ThemeMode; icon: string }[] = [
  { mode: 'light', icon: 'light_mode' },
  { mode: 'dark', icon: 'dark_mode' },
  { mode: 'system', icon: 'settings_brightness' },
]

export default function ThemeAppearanceCard({
  theme,
  selectedLang,
  onThemeChange,
  onLanguageChange,
}: ThemeAppearanceCardProps) {
  const { t } = useAppTranslation()

  const optionClasses = (selected: boolean) =>
    `flex items-center gap-3 rounded-control border p-4 text-left transition-state focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      selected
        ? 'border-primary bg-primary/5 text-text-primary'
        : 'border-border text-text-secondary hover:border-border-hover hover:bg-bg-surface-hover'
    }`

  return (
    <SettingCard>
      <SectionHeader title={t('settings.themeAppearance')} icon="palette" />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-label text-label-md text-text-secondary">{t('settings.language')}</legend>
        <div className="grid grid-cols-2 gap-4">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLanguageChange(l.code)}
              aria-pressed={selectedLang === l.code}
              className={optionClasses(selectedLang === l.code)}
            >
              <span aria-hidden="true" className="text-2xl">
                {l.flag}
              </span>
              <span className="font-label text-label-lg">{l.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-label text-label-md text-text-secondary">{t('settings.displayMode')}</legend>
        <div className="grid grid-cols-3 gap-4">
          {THEME_MODES.map(({ mode, icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onThemeChange(mode)}
              aria-pressed={theme === mode}
              className={`${optionClasses(theme === mode)} flex-col justify-center`}
            >
              <span
                aria-hidden="true"
                className={`material-symbols-outlined ${theme === mode ? 'text-primary' : 'text-text-muted'}`}
              >
                {icon}
              </span>
              <span className="font-label text-label-md">{t(`settings.themeModes.${mode}`)}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </SettingCard>
  )
}
