'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Drawer,
  EmptyState,
  Field,
  Input,
  MetaGrid,
  MetricCard,
  MiniBars,
  Modal,
  PasswordInput,
  ProgressRing,
  SectionHeader,
  SegmentedControl,
  Select,
  Skeleton,
  Sparkline,
  Spinner,
  Textarea,
  Toggle,
} from '@/components/ui';
import { BottomNav, MobileTopbar, PageHeader } from '@/components/layout';
import { SidebarProvider } from '@/components/SidebarContext';

type VisualTheme = 'classic' | 'focus';
type ColorMode = 'light' | 'dark';
type CardLimit = '2' | '4' | '6' | '8';

const COLOR_TOKENS = [
  { name: 'bg-base', label: 'Fondo de página' },
  { name: 'bg-surface', label: 'Tarjetas' },
  { name: 'bg-surface-hover', label: 'Hover de superficie' },
  { name: 'bg-input', label: 'Inputs' },
  { name: 'primary', label: 'Primario' },
  { name: 'primary-light', label: 'Primario suave' },
  { name: 'text-primary', label: 'Texto principal' },
  { name: 'text-secondary', label: 'Texto secundario' },
  { name: 'text-muted', label: 'Texto terciario' },
  { name: 'border', label: 'Bordes' },
  { name: 'border-strong', label: 'Bordes fuertes' },
  { name: 'success', label: 'Éxito' },
  { name: 'warning', label: 'Advertencia' },
  { name: 'danger', label: 'Peligro' },
  { name: 'info', label: 'Info' },
  { name: 'sidebar-item-active-bg', label: 'Nav activo' },
] as const;

const TYPE_SCALE = [
  { cls: 'text-display-lg font-display', label: 'display-lg · 40/48 · Mona Sans 600', text: 'Enfoque sostenido' },
  { cls: 'text-headline-lg font-display', label: 'headline-lg · 28/36 · Mona Sans 600', text: 'Tareas del día' },
  { cls: 'text-headline-md font-display', label: 'headline-md · 22/28 · Mona Sans 600', text: 'Próximos recordatorios' },
  { cls: 'text-title-lg font-display', label: 'title-lg · 18/24 · Mona Sans 600', text: 'Detalles de la tarea' },
  { cls: 'text-title-md font-display', label: 'title-md · 16/22 · Mona Sans 600', text: 'Enfoque de hoy' },
  { cls: 'text-body-lg font-body', label: 'body-lg · 16/24 · Commissioner 400', text: 'Escribe a Tigo para obtener las facturas.' },
  { cls: 'text-body-md font-body', label: 'body-md · 14/20 · Commissioner 400', text: 'Crear una página en Notion con las mejoras pendientes.' },
  { cls: 'text-label-lg font-label', label: 'label-lg · 14/20 · Commissioner 500', text: 'Guardar recordatorio' },
  { cls: 'text-label-md font-label', label: 'label-md · 12/16 · Commissioner 500', text: 'CATEGORÍA' },
  { cls: 'text-label-sm font-mono', label: 'label-sm · 11/16 · Fragment Mono 400', text: '34 pendientes · 16 completadas' },
] as const;

const RADII = [
  { cls: 'rounded-sm', label: 'sm · 4px' },
  { cls: 'rounded-control', label: 'control · 8px' },
  { cls: 'rounded-card', label: 'card · 12px' },
  { cls: 'rounded-lg', label: 'lg · 16px focus / 14px classic' },
  { cls: 'rounded-pill', label: 'pill · 9999px' },
] as const;

const SPACING = [
  { cls: 'w-1', label: '4' },
  { cls: 'w-2', label: '8' },
  { cls: 'w-3', label: '12' },
  { cls: 'w-4', label: '16' },
  { cls: 'w-5', label: '20' },
  { cls: 'w-6', label: '24' },
  { cls: 'w-8', label: '32' },
  { cls: 'w-12', label: '48' },
] as const;

const REGISTRY = [
  { name: 'Button · Card · Input · Select · Textarea · Field · PasswordInput', wave: 'Ola 1', status: 'implementado' },
  { name: 'Checkbox · SegmentedControl · Drawer · MetaGrid · SectionHeader · MetricCard · Skeleton', wave: 'Ola 1', status: 'implementado' },
  { name: 'Toggle · Modal · Badge · EmptyState · Spinner', wave: 'Ola 1', status: 'implementado' },
  { name: 'AppShell · Sidebar · SidebarItem · SidebarGroup · SidebarLogo · UserProfileMenu', wave: 'Ola 2', status: 'implementado' },
  { name: 'PageHeader · MobileTopbar · BottomNav · BrandMark', wave: 'Ola 2', status: 'implementado' },
  { name: 'Login · Panel · Tareas · Recordatorios · Ajustes', wave: 'Ola 3', status: 'implementado' },
  { name: 'ProgressRing · Sparkline · MiniBars (ui/charts, SVG propio)', wave: 'Ola 4', status: 'implementado' },
  { name: 'ListPage · DetailPage · FormPage · AuthShell', wave: 'Ola 4', status: 'pendiente' },
] as const;

export default function StyleguideClient() {
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('classic');
  const [mode, setMode] = useState<ColorMode>('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [cardLimit, setCardLimit] = useState<CardLimit>('4');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const storedVisual = localStorage.getItem('app-visual-theme');
    const storedTheme = localStorage.getItem('app-theme');
    setVisualTheme(storedVisual === 'focus' ? 'focus' : 'classic');
    setMode(storedTheme === 'light' ? 'light' : document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const applyVisualTheme = (next: VisualTheme) => {
    setVisualTheme(next);
    localStorage.setItem('app-visual-theme', next);
    document.documentElement.setAttribute('data-visual-theme', next);
  };

  const applyMode = (next: ColorMode) => {
    setMode(next);
    localStorage.setItem('app-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div className="min-h-screen bg-background font-body text-text-primary">
      {/* Barra de control */}
      <header className="sticky top-0 z-10 border-b border-border bg-bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-mono text-label-sm uppercase tracking-wider text-text-muted">Aure</p>
            <h1 className="font-display text-headline-md">Styleguide</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-control border border-border p-1" role="group" aria-label="Tema visual">
              {(['classic', 'focus'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applyVisualTheme(value)}
                  aria-pressed={visualTheme === value}
                  className={`rounded-sm px-3 py-1.5 font-label text-label-md capitalize transition-state ${
                    visualTheme === value ? 'bg-primary text-text-inverse' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex rounded-control border border-border p-1" role="group" aria-label="Modo de color">
              {(['light', 'dark'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applyMode(value)}
                  aria-pressed={mode === value}
                  className={`rounded-sm px-3 py-1.5 font-label text-label-md transition-state ${
                    mode === value ? 'bg-primary text-text-inverse' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {value === 'light' ? 'Claro' : 'Oscuro'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-title-lg">Colores</h2>
          <p className="font-body text-body-md text-text-secondary">
            Cada muestra usa <code className="font-mono text-label-sm">var(--color-*)</code>. El tema activo resuelve
            automáticamente claro/oscuro.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COLOR_TOKENS.map((token) => (
              <div key={token.name} className="rounded-card border border-border bg-bg-surface p-3">
                <div
                  className="mb-3 h-12 rounded-control border border-border"
                  style={{ background: `var(--color-${token.name})` }}
                  aria-hidden="true"
                />
                <p className="font-label text-label-md">{token.label}</p>
                <p className="font-mono text-label-sm text-text-muted">--color-{token.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-title-lg">Tipografía</h2>
          <div className="flex flex-col gap-4 rounded-card border border-border bg-bg-surface p-6">
            {TYPE_SCALE.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0">
                <span className="font-mono text-label-sm text-text-muted">{item.label}</span>
                <span className={item.cls}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-title-lg">Radios</h2>
          <div className="flex flex-wrap gap-4">
            {RADII.map((radius) => (
              <div key={radius.cls} className="flex flex-col items-center gap-2">
                <div className={`h-16 w-24 border border-border bg-bg-surface-hover ${radius.cls}`} aria-hidden="true" />
                <span className="font-mono text-label-sm text-text-muted">{radius.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-title-lg">Espaciado</h2>
          <div className="flex flex-col gap-2">
            {SPACING.map((space) => (
              <div key={space.label} className="flex items-center gap-3">
                <span className="w-8 font-mono text-label-sm text-text-muted">{space.label}</span>
                <div className={`h-3 bg-primary ${space.cls}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-title-lg">Componentes</h2>
            <p className="font-body text-body-md text-text-secondary">
              Ola 1 completa. Estos son los componentes canónicos: las pantallas deben componer con ellos.
            </p>
          </div>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Botones" icon="smart_button" description="Un solo primario por vista" />
            <div className="flex flex-wrap items-center gap-3">
              <Button>Guardar</Button>
              <Button variant="secondary">Cancelar</Button>
              <Button variant="danger">Eliminar</Button>
              <Button variant="ghost">Ver detalle</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Pequeño</Button>
              <Button size="md">Medio</Button>
              <Button size="lg">Grande</Button>
              <Button disabled>Deshabilitado</Button>
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Métricas" icon="monitoring" description="Cifras tabulares en Fragment Mono" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard label="Pendientes" value={34} />
              <MetricCard label="Completadas" value={16} tone="success" />
              <MetricCard label="Vencidas" value={1} tone="danger" />
              <MetricCard label="Cumplimiento" value="32%" tone="primary" />
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader
              title="Gráficas"
              icon="show_chart"
              description="SVG propio (ADR-007), sin librería"
            />
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex items-center gap-4">
                <ProgressRing progress={72} size={64} label="72% de cumplimiento semanal" />
                <ProgressRing progress={40} size={48} tone="success" label="40% de avance" />
              </div>
              <div className="flex flex-col gap-1">
                <Sparkline values={[2, 4, 3, 6, 5, 8, 7]} label="Tendencia de tareas completadas" />
                <span className="font-mono text-label-sm text-text-muted">Últimos 7 días</span>
              </div>
              <div className="flex flex-col gap-1">
                <MiniBars values={[3, 5, 2, 6, 4, 7, 5]} label="Hábitos por día" tone="info" />
                <span className="font-mono text-label-sm text-text-muted">Hábitos por día</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Formularios" icon="edit_note" description="Field + control + error" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Correo electrónico" type="email" leadingIcon="mail" placeholder="nombre@ejemplo.com" />
              <Input label="Nombre completo" placeholder="Duvan" hint="Como aparecerá en tu perfil" />
              <PasswordInput label="Contraseña" placeholder="••••••••" hint="Mínimo 8 caracteres" />
              <Select label="Repetición" defaultValue="monthly">
                <option value="none">No repetir</option>
                <option value="daily">Todos los días</option>
                <option value="monthly">Cada mes</option>
              </Select>
            </div>
            <Textarea label="Notas" placeholder="Detalles de la tarea…" rows={3} />
            <Input label="Buscar" leadingIcon="search" placeholder="Buscar tareas…" fieldSize="sm" />
            <Field label="Preferencias">
              <Checkbox label="Recordarme" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            </Field>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Controles" icon="tune" description="Toggle y opciones exclusivas" />
            <div className="flex flex-wrap items-center gap-6">
              <Toggle checked={notifications} onChange={setNotifications} label="Recordatorios diarios" description="Resumen de pendientes" />
              <Toggle checked={weekly} onChange={setWeekly} label="Resumen semanal" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-label text-label-md text-text-secondary">Tarjetas del panel</span>
              <SegmentedControl
                ariaLabel="Tarjetas del panel"
                options={[
                  { value: '2', label: '2' },
                  { value: '4', label: '4' },
                  { value: '6', label: '6' },
                  { value: '8', label: '8' },
                ]}
                value={cardLimit}
                onChange={setCardLimit}
              />
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Estados y feedback" icon="info" description="Badges, carga y vacío" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Media</Badge>
              <Badge variant="success">Completada</Badge>
              <Badge variant="warning">Por vencer</Badge>
              <Badge variant="danger">Vencida</Badge>
              <Badge variant="info">En curso</Badge>
              <Badge>Sin categoría</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Spinner size="sm" />
              <Spinner />
              <div className="w-full max-w-sm">
                <Skeleton lines={3} />
              </div>
            </div>
            <EmptyState title="No hay tareas" description="Crea la primera con el campo de arriba." />
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader title="Superposiciones" icon="layers" description="Modal centrado y drawer lateral" />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                Abrir drawer
              </Button>
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col gap-5">
            <SectionHeader
              title="Layout y navegación"
              icon="dashboard"
              description="Shell, cabecera de página y navegación móvil"
            />
            <PageHeader
              eyebrow="Lunes 16 de noviembre"
              title="Tareas del día"
              description="34 pendientes · 16 completadas"
              actions={
                <>
                  <Button variant="secondary" size="sm">
                    Filtros
                  </Button>
                  <Button size="sm">Nueva tarea</Button>
                </>
              }
            />
            <div className="flex flex-col gap-3 rounded-card border border-border bg-bg-base p-3">
              <span className="font-mono text-label-sm uppercase tracking-wider text-text-muted">
                Previsualización móvil
              </span>
              <SidebarProvider>
                <div className="overflow-hidden rounded-control border border-border bg-bg-base">
                  <MobileTopbar desktopHidden={false} />
                  <BottomNav fixed={false} />
                </div>
              </SidebarProvider>
            </div>
            <p className="font-body text-body-md text-text-secondary">
              La barra lateral conserva el árbol de destinos actual: 240 px expandida, rail de iconos al colapsar y
              overlay con foco atrapado en móvil.
            </p>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-title-lg">Registro</h2>
          <div className="overflow-hidden rounded-card border border-border">
            {REGISTRY.map((item, index) => (
              <div
                key={item.name}
                className={`flex flex-wrap items-center justify-between gap-2 bg-bg-surface px-4 py-3 ${
                  index !== 0 ? 'border-t border-border' : ''
                }`}
              >
                <span className="font-body text-body-md">{item.name}</span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-label-sm text-text-muted">{item.wave}</span>
                  <span
                    className={`rounded-pill border px-2 py-0.5 font-label text-label-sm ${
                      item.status === 'implementado'
                        ? 'border-success/40 text-success'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {item.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-6 font-mono text-label-sm text-text-muted">
          Herramienta de desarrollo · Ola 1 · {new Date().getFullYear()}
        </footer>
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo recordatorio" maxWidth="md">
        <div className="flex flex-col gap-4">
          <Input label="¿Qué quieres recordar?" placeholder="Ej. Pagar factura de Tigo" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Fecha" type="date" />
            <Input label="Hora" type="time" />
          </div>
        </div>
      </Modal>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Detalles de la tarea">
        <div className="flex flex-col gap-5">
          <p className="font-body text-body-lg text-text-primary">
            Planear idea de mejora de app con Notion.
          </p>
          <MetaGrid
            items={[
              { label: 'Categoría', value: 'Ninguno' },
              { label: 'Estado', value: 'Pendiente' },
              { label: 'Prioridad', value: 'Media' },
              { label: 'Fecha', value: 'Sin fecha' },
            ]}
          />
        </div>
      </Drawer>
    </div>
  );
}
