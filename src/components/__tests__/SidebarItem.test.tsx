import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SidebarItem from '@/components/layout/SidebarItem'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('SidebarItem', () => {
  it('renders label when expanded', () => {
    render(
      <SidebarItem href="/dashboard" icon="grid_view" label="Panel" isExpanded={true} isActive={false} />
    )
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })

  it('keeps an accessible name when collapsed and hides the text', () => {
    render(
      <SidebarItem href="/dashboard" icon="grid_view" label="Panel" isExpanded={false} isActive={false} />
    )
    expect(screen.getByRole('link', { name: 'Panel' })).toBeInTheDocument()
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
  })

  it('marks the active destination with aria-current', () => {
    render(
      <SidebarItem href="/dashboard" icon="grid_view" label="Panel" isExpanded={true} isActive={true} />
    )
    const link = screen.getByRole('link', { name: 'Panel' })
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link.className).toContain('bg-sidebar-item-active-bg')
    expect(link.className).toContain('text-sidebar-item-active-text')
  })

  it('does not mark inactive destinations', () => {
    render(<SidebarItem href="/todos" icon="check_circle" label="Tareas" isExpanded={true} isActive={false} />)
    const link = screen.getByRole('link', { name: 'Tareas' })
    expect(link).not.toHaveAttribute('aria-current')
    expect(link.className).not.toContain('bg-sidebar-item-active-bg')
  })

  it('renders the badge when expanded', () => {
    render(
      <SidebarItem
        href="/checklists"
        icon="fact_check"
        label="Checklists"
        isExpanded={true}
        isActive={false}
        badge={<span data-testid="badge">3</span>}
      />
    )
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('hides the badge in the collapsed rail', () => {
    render(
      <SidebarItem
        href="/checklists"
        icon="fact_check"
        label="Checklists"
        isExpanded={false}
        isActive={false}
        badge={<span data-testid="badge">3</span>}
      />
    )
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  it('renders the sub-item variant with the indented style', () => {
    render(
      <SidebarItem href="/goals" icon="flag" label="Objetivos" isExpanded={true} isActive={false} variant="sub" />
    )
    const link = screen.getByRole('link', { name: 'Objetivos' })
    expect(link.className).toContain('pl-2')
    expect(link.className).toContain('text-text-muted')
  })

  it('renders sub-items as icons when collapsed (rail)', () => {
    render(
      <SidebarItem href="/goals" icon="flag" label="Objetivos" isExpanded={false} isActive={false} variant="sub" />
    )
    const link = screen.getByRole('link', { name: 'Objetivos' })
    expect(link.className).toContain('justify-center')
  })

  it('renders the icon as decorative', () => {
    const { container } = render(
      <SidebarItem href="/dashboard" icon="grid_view" label="Panel" isExpanded={true} isActive={false} />
    )
    const icon = container.querySelector('.material-symbols-outlined')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders href correctly', () => {
    render(
      <SidebarItem href="/reminders" icon="notifications" label="Recordatorios" isExpanded={true} isActive={false} />
    )
    expect(screen.getByRole('link', { name: 'Recordatorios' })).toHaveAttribute('href', '/reminders')
  })
})
