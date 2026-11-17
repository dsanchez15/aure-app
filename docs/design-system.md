# Aure — Design System

> Sistema visual de Aure. Fuente de verdad para tokens, componentes y reglas de estilo.
> Plan de migración completo: `C:\Users\Duv\Documents\Documentos\Code\aure-app\PLAN_MIGRACION_FOCUS.md`

| | |
|---|---|
| Tema | **Focus** — único tema de la app (`data-visual-theme="focus"` desde Ola 5) |
| Classic | retirado de la app; `tokens-classic.css` queda solo como fallback SSR |
| Tokens | `src/styles/tokens-base.css` (contrato) · `tokens-focus.css` |
| Styleguide | `/styleguide` (light/dark; el tema visual ya no es conmutable) |

---

## 0. Cómo usar este documento

1. Antes de escribir UI, lee §1 (reglas), §2 (capas), §3 (tokens) y §4 (registro).
2. Reutiliza lo registrado: `ui/` → `layout/` → `patterns/` → módulo. Las pantallas solo componen.
3. Si falta un valor, agrégalo como token en `src/styles/`; nunca lo hardcodees en el componente.
4. Si implementas o cambias un componente, actualiza su fila en §4 y su demo en `/styleguide` en el mismo cambio.
5. Si este documento y el código discrepan, corrige ambos antes de cerrar el PR.

---

## 1. Reglas no negociables

1. **Solo tokens.** Prohibido `#hex`, `rgba()` y valores arbitrarios (`rounded-[8px]`, `text-[13px]`) en componentes.
2. **Si falta un valor, se agrega al token**, no al componente.
3. **Nada de `style={{ color: 'var(--color-…') }}`** cuando existe una utilidad (`text-text-primary`, `bg-bg-surface`, `border-border`).
4. **Radios:** `rounded-card` (12px) en tarjetas y paneles; `rounded-control` (8px) en botones, inputs y pills; `rounded-pill` en avatares y badges.
5. **Tipografía:** `font-display` (Mona Sans) para títulos, `font-body`/`font-label` (Commissioner) para texto y labels, `font-mono` (Fragment Mono) solo para métricas, fechas y atajos.
6. **Contraste mínimo 4.5:1** en todo texto. `--color-text-muted` es para texto atenuado; `--color-border*` nunca se usa como color de texto.
7. **Motion:** usar las utilidades `transition-state` (120 ms) para hover/focus y `transition-surface` (200 ms) para entrada de superficies. Nada decorativo en loop.
8. **Accesibilidad:** todo control interactivo es un elemento nativo o tiene `role` + teclado + `aria-*`.
9. **Idioma:** copy de UI en español (LatAm), sentence case, sin exclamaciones.

---

## 2. Capas

```
src/components/
  ui/         primitivas sin dominio (Button, Card, Input, Checkbox, …)
  layout/     estructura (AppShell, Sidebar, PageHeader, BottomNav)
  patterns/   composiciones repetibles (ListPage, FormPage, AuthShell, Toolbar)
  <módulo>/   dominio (todo, checklist, dashboard, goals, progress, reminders, study, settings)
```

- `ui/` no importa de dominio.
- `patterns/` no define colores ni tipografía.
- Las pantallas no definen primitivas: solo componen.

---

## 3. Tokens

### Colores (contrato de 33 tokens)

| Grupo | Tokens |
|---|---|
| Superficies | `bg-base`, `bg-surface`, `bg-surface-hover`, `bg-input`, `bg-overlay` |
| Texto | `text-primary`, `text-secondary`, `text-muted`, `text-inverse` |
| Acento | `primary`, `primary-hover`, `primary-light`, `primary-glow` |
| Bordes | `border`, `border-hover`, `border-strong` |
| Estados | `success`, `warning`, `danger`, `info` |
| Sidebar | `sidebar-bg`, `sidebar-border`, `sidebar-item-active-bg`, `sidebar-item-active-text`, `sidebar-item-active-border` |
| Sombras | `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-glow` |
| Decorativos | `deco-grid-line`, `deco-sidebar-top-line`, `deco-logo-bg`, `deco-logo-shadow` |

Uso: `bg-bg-surface`, `text-text-secondary`, `border-border`, `bg-primary`, `text-danger`.

### Tipografía

| Utilidad | Tamaño / línea | Peso | Familia |
|---|---|---|---|
| `text-display-lg` | 40 / 48 · -0.5px | 600 | display |
| `text-display-lg-mobile` | 28 / 34 | 600 | display |
| `text-headline-lg` | 28 / 36 | 600 | display |
| `text-headline-md` | 22 / 28 | 600 | display |
| `text-title-lg` | 18 / 24 | 600 | display |
| `text-title-md` | 16 / 22 | 600 | display |
| `text-body-lg` | 16 / 24 | 400 | body |
| `text-body-md` | 14 / 20 | 400 | body |
| `text-label-lg` | 14 / 20 | 500 | label |
| `text-label-md` | 12 / 16 | 500 | label |
| `text-label-sm` | 11 / 16 | 400 | mono |

### Radios y espaciado

`rounded-sm` 4 · `rounded-control` 8 · `rounded-card` 12 · `rounded-lg` 16 · `rounded-pill`.

Escala de 4px: 4, 8, 12, 16, 20, 24, 32, 48. Márgenes de página: 24 px.

---

## 4. Registro de componentes

Estados: `propuesto → en diseño → implementado → estable → deprecado`.
Un componente solo se usa en pantallas si está **implementado** y visible en `/styleguide`.

### Primitivas (`ui/`)

Todas se exportan desde `@/components/ui` y se muestran viven en `/styleguide`.

| Componente | Ola | Estado |
|---|---|---|
| Button, Card, Input, Select, Textarea, Toggle, Modal, Badge, EmptyState, Spinner | 1 | implementado |
| Field (`FieldWrapper` como alias), Hint, Required | 1 | implementado |
| Checkbox, SegmentedControl, Drawer, MetaGrid, SectionHeader, MetricCard, Skeleton | 1 | implementado |
| PasswordInput | 3 | implementado |
| ProgressRing, Sparkline, MiniBars (`ui/charts`) | 4 | implementado |

#### API canónica

| Componente | Props |
|---|---|
| `Button` | `variant: primary \| secondary \| danger \| ghost` · `size: sm \| md \| lg` · `fullWidth` |
| `Card` | `padding: none \| sm \| md \| lg` · `hoverable` |
| `Field` | `label` · `hint` · `error` · `htmlFor` · `required` · (los controles lo usan con `label`/`hint`/`error`) |
| `Input` / `Select` / `Textarea` | `label` · `hint` · `error` · `fieldSize` (Input/Select) · `leadingIcon` (Input) |
| `PasswordInput` | hereda de `Input` (sin `type`/`leadingIcon`); visor con `aria-pressed` |
| `Checkbox` | `label` · `description` · props nativas del input |
| `Toggle` | `checked` · `onChange` · `label` · `description` · `disabled` · `ariaLabel` |
| `SegmentedControl` | `options[{value,label,disabled}]` · `value` · `onChange` · `ariaLabel` · `size` · `fullWidth` |
| `Modal` | `isOpen` · `onClose` · `title` · `footer` · `maxWidth: sm…2xl` |
| `Drawer` | `isOpen` · `onClose` · `title` · `footer` · `side: right \| left` |
| `Badge` | `variant: primary \| success \| warning \| danger \| info \| neutral` |
| `MetricCard` | `label` · `value` · `tone: default \| primary \| success \| warning \| danger` · `hint` |
| `SectionHeader` | `title` · `icon` · `description` · `actions` |
| `MetaGrid` | `items[{label,value}]` · `columns: 1 \| 2` |
| `Skeleton` | `lines` · `className` |
| `EmptyState` | `icon` · `title` · `description` · `action` |
| `ProgressRing` | `progress` (0–100) · `size` (48/64) · `strokeWidth` · `tone` · `label` (obligatorio) · `showLabel` |
| `Sparkline` | `values` · `width` (64) · `height` (20) · `tone` · `label` |
| `MiniBars` | `values` · `max` · `barWidth` (8) · `gap` (4) · `height` (32) · `tone` · `label` |

Reglas de composición:
- `MetricCard` ya incluye `Card`: no envolver en otra tarjeta.
- `Modal` para formularios cortos y confirmaciones; `Drawer` para detalle/edición de una entidad (tareas, recordatorios).
- `SectionHeader` es el único título permitido dentro de una tarjeta.
- Los controles de formulario comparten `ui/fieldStyles.ts` (`fieldControlBase` + `fieldSizeClasses`): un cambio visual en un control aplica a Input, Select, Textarea y PasswordInput.

### Pantallas del piloto (Ola 3)

| Pantalla | Patrón aplicado |
|---|---|
| Login | `BrandMark size="lg"` + `Card` centrada + `Input leadingIcon` + `PasswordInput` + `Button size="lg" fullWidth`; enlace de modo con `Button`/texto primary |
| Panel | `PageHeader` + `SegmentedControl` (mes/semana) + `SectionHeader` en tarjetas + `MetricCard` para métricas |
| Tareas | `PageHeader` con acción, barra de creación inline en `Card`, `SegmentedControl` para vistas, detalle con `MetaGrid` en columna `xl:w-72` |
| Recordatorios | `PageHeader` + `SegmentedControl` (pendientes/todos/completados) + filas tokenizadas |
| Ajustes | `PageHeader` + tabs con `font-label` + `SettingCard` sobre `Card` + `SectionHeader` por sección |

### Layout (`layout/`)

| Componente | Ola | Estado |
|---|---|---|
| AppShell, Sidebar, SidebarItem, SidebarGroup, SidebarLogo, UserProfileMenu, BrandMark | 2 | implementado |
| PageHeader, MobileTopbar, BottomNav | 2 | implementado |

Los módulos antiguos (`components/AppLayout.tsx`, `components/Sidebar*.tsx`, `components/UserProfileMenu.tsx`) quedan como **shims** que re-exportan la versión de `layout/`. En código nuevo, importa desde `@/components/layout`.

`BrandMark` escala con `size: sm` (topbar móvil, 28 px) · `md` (sidebar, 32 px) · `lg` (acceso, 44 px); `showName={false}` lo deja solo icono.

#### Anatomía de navegación

| Elemento | Reglas |
|---|---|
| Sidebar | `w-60` (240 px) expandida · `w-20` rail · `bg-sidebar-bg`, `border-sidebar-border`, padding `px-4 py-6` |
| Ítem activo | `bg-sidebar-item-active-bg` + `text-sidebar-item-active-text` + `aria-current="page"` |
| Grupo | `aria-expanded` + `aria-controls`; acordeón con `.sidebar-children` (0fr→1fr, sin inline styles) |
| Rail colapsado | Solo iconos, label con `aria-label`; los grupos exponen sus hijos como iconos |
| Móvil | `MobileTopbar` (marca + hamburguesa) + `BottomNav` fija de 4 destinos, `pb-safe` |
| Foco | El overlay móvil atrapa el foco y lo devuelve a la hamburguesa (`returnFocusRef`) |

### Patrones (`patterns/`)

| Componente | Ola | Estado |
|---|---|---|
| InlineCreateBar, Toolbar, ListRow | 2–3 | falta |
| ListPage, DetailPage, FormPage, SettingsPage, AuthShell | 3 | falta |

### Gráficas (`ui/charts`, Ola 4)

ADR-007: **SVG propio, sin librería**. Implementado en `src/components/ui/charts/` (`ProgressRing`, `Sparkline`, `MiniBars`); `src/components/ProgressRing.tsx` queda como shim de compatibilidad.

| Regla | Detalle |
|---|---|
| Implementación | SVG inline con `viewBox`, sin dependencias ni `useEffect` para medir |
| Color | Solo clases por token (`stroke-success`, `fill-primary/15`); nunca `stroke="#..."` |
| Tamaños | `Sparkline` 64×20 · `MiniBars` barras de 8 px de ancho, gap 4, radio 2 · `ProgressRing` 48/64 con `stroke-width` 4/6 |
| Accesibilidad | `role="img"` + `aria-label` con el resumen ("72% de cumplimiento semanal"); el número clave siempre visible como texto |
| Ejes y tooltips | No se implementan hasta que una pantalla los necesite; si aparece una gráfica compleja, se evalúa visx *headless* para ese caso y se documenta aquí |

### Contrato mínimo de un componente

1. Variantes cerradas.
2. Estados default / hover / focus / disabled / loading / error.
3. `aria-*` y teclado.
4. Cero valores crudos.
5. Fila en este registro + entrada en `/styleguide`.

El test `src/__tests__/properties/no-raw-values.test.ts` bloquea `#hex`, utilidades arbitrarias, `text-white` y paleta Tailwind cruda en todo `src/` (excepto `__tests__` y `app/api`). Está activo desde Ola 5.

---

## 5. Cómo agregar una pantalla nueva

1. ¿Encaja en una plantilla existente (`ListPage`, `FormPage`, `DetailPage`, `AuthShell`)? Úsala.
2. ¿Falta un patrón? Documéntalo aquí con anatomía, estados y usos **antes** de implementarlo.
3. Compón con primitivas; no escribas estilos de color/tipografía en la pantalla.
4. Revisa 390 px y 1440 px, light y dark, contraste AA, textos en español.

---

## 6. Candados de calidad

- `pnpm test --run` — tests de propiedades: contraste AA (focus light/dark), completitud de tokens, tokens-only, ausencia de `!important` y `no-raw-values` (prohíbe `#hex`, arbitrarios, `text-white` y paleta Tailwind cruda en `src/`; las rutas de API quedan fuera porque sus colores son datos semilla).
- `pnpm lint` — bloquea patrones prohibidos (en expansión durante la migración).
- `/styleguide` — revisión visual de tokens y componentes.
- Checklist de PR: sin hex · sin arbitrarios nuevos · estados completos · AA · móvil/desktop · dark · i18n es.

---

## 7. Changelog

| Fecha | Ola | Cambio |
|---|---|---|
| 2026-11-16 | 0 | Tokens Focus (light/dark), escala tipográfica, radios semánticos, fuentes Mona Sans / Commissioner / Fragment Mono, `/styleguide`, tests extendidos a la variante focus. |
| 2026-11-16 | 1 | Primitivas reescritas sobre tokens (radios, tipografía, motion `transition-state`), nuevas `Field`, `Checkbox`, `SegmentedControl`, `Drawer`, `MetaGrid`, `SectionHeader`, `MetricCard`, `Skeleton`, y galería viva en `/styleguide`. |
| 2026-11-16 | 2 | `layout/`: `AppShell`, sidebar 240 px/rail con árbol accesible, `PageHeader`, `MobileTopbar`, `BottomNav`, `BrandMark`; tokens de sidebar y sombras expuestos como utilidades; shims de compatibilidad; `.sidebar-children` y `pb-safe`. |
