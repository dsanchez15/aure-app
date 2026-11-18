'use client'

import AppLayout from '@/components/AppLayout'
import { PageHeader } from '@/components/layout'
import { Card, EmptyState } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'

export default function UnderConstructionPage({ title, icon }: { title: string; icon: string }) {
  const { t } = useAppTranslation()

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader title={title} />
        <Card padding="lg">
          <EmptyState
            icon="construction"
            title={t('common.underConstruction')}
            description={t('common.comingSoon')}
            action={
              <span className="inline-flex items-center gap-2 font-label text-label-md text-primary">
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  {icon}
                </span>
                {t('common.comingSoon')}
              </span>
            }
          />
        </Card>
      </div>
    </AppLayout>
  )
}
