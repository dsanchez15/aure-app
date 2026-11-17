import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Drawer } from '@/components/ui/Drawer'
import { MetaGrid } from '@/components/ui/MetaGrid'
import { MetricCard } from '@/components/ui/MetricCard'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'

describe('Checkbox', () => {
  it('renders a native checkbox associated with its label', () => {
    render(<Checkbox label="Recordarme" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Recordarme' })
    expect(checkbox).toHaveAttribute('type', 'checkbox')
  })

  it('toggles with keyboard/click', () => {
    const onChange = vi.fn()
    render(<Checkbox aria-label="Tarea" onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tarea' }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe('PasswordInput', () => {
  it('oculta el valor por defecto y lo muestra con el visor', () => {
    render(<PasswordInput label="Contraseña" defaultValue="secreto" />)
    const input = screen.getByLabelText('Contraseña')
    expect(input).toHaveAttribute('type', 'password')

    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('SegmentedControl', () => {
  const options = [
    { value: '2' as const, label: '2' },
    { value: '4' as const, label: '4' },
    { value: '6' as const, label: '6' },
  ]

  it('exposes radiogroup semantics and marks the selected option', () => {
    render(<SegmentedControl options={options} value="4" onChange={() => {}} ariaLabel="Tarjetas" />)
    expect(screen.getByRole('radiogroup', { name: 'Tarjetas' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '4' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '2' })).toHaveAttribute('aria-checked', 'false')
  })

  it('emits the selected value', () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="2" onChange={onChange} ariaLabel="Tarjetas" />)
    fireEvent.click(screen.getByRole('radio', { name: '6' }))
    expect(onChange).toHaveBeenCalledWith('6')
  })
})

describe('Drawer', () => {
  it('does not render when closed', () => {
    render(
      <Drawer isOpen={false} onClose={() => {}} title="Detalle">
        Cuerpo
      </Drawer>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog semantics and closes with Escape', () => {
    const onClose = vi.fn()
    render(
      <Drawer isOpen onClose={onClose} title="Detalle">
        Cuerpo
      </Drawer>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Detalle')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes via the close button', () => {
    const onClose = vi.fn()
    render(
      <Drawer isOpen onClose={onClose} title="Detalle">
        Cuerpo
      </Drawer>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('MetaGrid', () => {
  it('renders label/value pairs', () => {
    render(<MetaGrid items={[{ label: 'Categoría', value: 'Trabajo' }, { label: 'Estado', value: 'Pendiente' }]} />)
    expect(screen.getByText('Categoría')).toBeInTheDocument()
    expect(screen.getByText('Trabajo')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })
})

describe('SectionHeader', () => {
  it('renders title, description and actions', () => {
    render(<SectionHeader title="Apariencia" description="Tema de la app" actions={<button>Editar</button>} />)
    expect(screen.getByRole('heading', { name: 'Apariencia' })).toBeInTheDocument()
    expect(screen.getByText('Tema de la app')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })
})

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Pendientes" value={34} />)
    expect(screen.getByText('Pendientes')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
  })
})

describe('Skeleton', () => {
  it('renders decorative placeholders for the requested lines', () => {
    const { container } = render(<Skeleton lines={3} />)
    expect(container.firstElementChild?.children).toHaveLength(3)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
