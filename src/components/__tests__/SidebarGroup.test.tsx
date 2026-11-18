import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SidebarGroup from '@/components/layout/SidebarGroup'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const items = [
  { href: '/goals', icon: 'flag', label: 'Objetivos' },
  { href: '/progress', icon: 'trending_up', label: 'Progreso' },
]

describe('SidebarGroup', () => {
  it('renders the group button with aria-expanded and aria-controls when expanded', () => {
    render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={false}
        onToggle={() => {}}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    const button = screen.getByRole('button', { name: /Plan/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls')
  })

  it('reflects the open state in aria-expanded and the panel', () => {
    const { container } = render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={true}
        onToggle={() => {}}
        isActive={false}
        pathname="/goals"
        items={items}
      />
    )
    expect(screen.getByRole('button', { name: /Plan/ })).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelector('.sidebar-children')).toHaveAttribute('data-open', 'true')
  })

  it('calls onToggle when the group is clicked', () => {
    const onToggle = vi.fn()
    render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={false}
        onToggle={onToggle}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Plan/ }))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('shows the chevron only when expanded', () => {
    const { rerender } = render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={false}
        onToggle={() => {}}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    expect(screen.getByText('chevron_right')).toBeInTheDocument()

    rerender(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={false}
        groupExpanded={false}
        onToggle={() => {}}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    expect(screen.queryByText('chevron_right')).not.toBeInTheDocument()
  })

  it('renders the sub-items inside the tree guide when expanded', () => {
    const { container } = render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={true}
        onToggle={() => {}}
        isActive={false}
        pathname="/goals"
        items={items}
      />
    )
    const tree = container.querySelector('ul.border-l')
    expect(tree).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Objetivos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Progreso' })).not.toHaveAttribute('aria-current')
  })

  it('hides the group button in the rail and exposes the children as icons', () => {
    render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={false}
        groupExpanded={false}
        onToggle={() => {}}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('highlights the group when a child route is active', () => {
    render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={false}
        onToggle={() => {}}
        isActive={true}
        pathname="/progress"
        items={items}
      />
    )
    expect(screen.getByRole('button', { name: /Plan/ }).className).toContain('text-primary')
  })

  it('uses no inline styles', () => {
    const { container } = render(
      <SidebarGroup
        icon="track_changes"
        label="Plan"
        isExpanded={true}
        groupExpanded={true}
        onToggle={() => {}}
        isActive={false}
        pathname="/dashboard"
        items={items}
      />
    )
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
  })
})
