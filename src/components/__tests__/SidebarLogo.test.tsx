import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SidebarLogo from '@/components/layout/SidebarLogo'

describe('SidebarLogo', () => {
  it('renders the brand name when expanded', () => {
    render(<SidebarLogo isExpanded={true} />)
    expect(screen.getByText('Aure')).toBeInTheDocument()
  })

  it('hides the brand name in the rail', () => {
    render(<SidebarLogo isExpanded={false} />)
    expect(screen.queryByText('Aure')).not.toBeInTheDocument()
  })

  it('renders the hexagon logo with the primary token', () => {
    const { container } = render(<SidebarLogo isExpanded={true} />)
    const logoBox = container.querySelector('.bg-primary')
    expect(logoBox).toBeInTheDocument()
    expect(container.querySelector('svg path')).toBeTruthy()
  })

  it('uses no inline styles', () => {
    const { container } = render(<SidebarLogo isExpanded={true} />)
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
  })
})
