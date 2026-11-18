'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppTranslation } from '@/components/LanguageProvider'
import { BrandMark } from '@/components/layout'
import { Button, Card, Checkbox, Input, PasswordInput } from '@/components/ui'

const FOOTER_LINKS = ['privacyPolicy', 'termsOfService', 'support'] as const

export default function LoginPage() {
  const { t } = useAppTranslation()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-bg-base px-4 py-8 font-body">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <header className="flex flex-col items-center gap-3 text-center">
            <BrandMark size="lg" showName={false} />
            <h1 className="font-display text-headline-lg text-text-primary">Aure</h1>
            <p className="font-body text-body-md text-text-secondary">
              {isLogin ? t('login.welcomeBack') : t('login.createAccount')}
            </p>
          </header>

          <Card padding="lg" className="w-full shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-control border border-danger/40 bg-danger/10 px-3 py-2 text-center font-label text-label-md text-danger"
                >
                  {error}
                </div>
              )}

              <Input
                id="email"
                type="email"
                label={t('login.emailLabel')}
                leadingIcon="mail"
                placeholder={t('login.emailPlaceholder')}
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              {!isLogin && (
                <Input
                  id="name"
                  type="text"
                  label={t('login.nameLabel')}
                  leadingIcon="person"
                  placeholder={t('login.namePlaceholder')}
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              )}

              <PasswordInput
                id="password"
                label={t('login.passwordLabel')}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Checkbox id="remember-me" name="remember-me" label={t('login.rememberMe')} />
                <a href="#" className="font-label text-label-lg text-primary transition-state hover:underline">
                  {t('login.forgotPassword')}
                </a>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? t('login.processing') : isLogin ? t('login.logIn') : t('login.signUp')}
              </Button>
            </form>

            <p className="mt-6 text-center font-body text-body-md text-text-secondary">
              {isLogin ? t('login.noAccount') : t('login.hasAccount')}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="rounded-sm font-label text-label-lg font-medium text-primary transition-state hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {isLogin ? t('login.signUpFree') : t('login.logInLink')}
              </button>
            </p>
          </Card>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-6 py-4">
        {FOOTER_LINKS.map((key) => (
          <a
            key={key}
            href="#"
            className="font-label text-label-md text-text-muted transition-state hover:text-text-primary"
          >
            {t(`login.${key}`)}
          </a>
        ))}
      </footer>
    </div>
  )
}
