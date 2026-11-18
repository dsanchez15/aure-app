import { Card } from '@/components/ui'

export default function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      {children}
    </Card>
  )
}
