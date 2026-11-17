import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PageHeader from '@/components/layout/PageHeader'
import BottomNav from '@/components/layout/BottomNav'
import MobileTopbar from '@/components/layout/MobileTopbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

vi.mock('@/components/LanguageProvider', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
    language: 'es',
    setLanguage: vi.fn(),
  }),
}))

const toggle = vi.fn()

vi.mock('@/components/SidebarContext', () => ({
  useSidebar: () => ({
    isExpanded: true,
    isCollapsed: false,
    isMobileOverlayOpen: false,
    mode: 'expanded',
    toggle,
    expand: vi.fn(),
    collapse: vi.fn(),
    openMobileOverlay: vi.fn(),
    closeMobileOverlay: vi.fn(),
  }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('PageHeader', () => {
  it('renders a single h1 with the title', () => {
    render(<PageHeader title="Panel" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument()
  })

  it('renders eyebrow, description and actions', () => {
    render(
      <PageHeader
        title="Tareas"
        eyebrow="Lunes 16 de noviembre"
        description="34 pendientes"
        actions={<button>Nueva tarea</button>}
      />
    )
    expect(screen.getByText('Lunes 16 de noviembre')).toBeInTheDocument()
    expect(screen.getByText('34 pendientes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nueva tarea' })).toBeInTheDocument()
  })
})

describe('BottomNav', () => {
  it('renders the four default destinations', () => {
    render(<BottomNav fixed={false} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/dashboard',
      '/todos',
      '/reminders',
      '/settings',
    ])
  })

  it('marks the current route and exposes a navigation landmark', () => {
    render(<BottomNav fixed={false} />)
    expect(screen.getByRole('navigation', { name: 'Navegación inferior' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'sidebar.dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'sidebar.todos' })).not.toHaveAttribute('aria-current')
  })

  it('accepts a custom item list', () => {
    render(
      <BottomNav
        fixed={false}
        items={[
          { href: '/todos', icon: 'check_circle', label: 'Tareas' },
          { href: '/settings', icon: 'settings', label: 'Ajustes' },
        ]}
      />
    )
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})

describe('MobileTopbar', () => {
  it('renders the brand and the navigation trigger', () => {
    render(<MobileTopbar />)
    expect(screen.getByText('Aure')).toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: 'Abrir navegación' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'main-sidebar')
  })

  it('toggles the sidebar', () => {
    render(<MobileTopbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegación' }))
    expect(toggle).toHaveBeenCalled()
  })
})
