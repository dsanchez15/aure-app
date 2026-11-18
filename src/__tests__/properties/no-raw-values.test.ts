/**
 * Guard de la capa visual: `src/` no puede contener valores crudos en el
 * marcado. Las rutas de API quedan fuera porque sus colores son datos
 * semilla persistidos, no estilos.
 */
import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const ROOTS = ['src/components', 'src/lib', 'src/types', 'src/app'] as const

const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/
const ARBITRARY = /\b(?:[a-z]+-)?\[[0-9.]+(?:px|rem|em)\]/
const RAW_PALETTE =
  /\b(?:text|bg|border|ring)-(?:red|blue|green|emerald|amber|orange|yellow|slate|gray|zinc|purple|pink|cyan|teal|indigo|violet)-\d{2,3}\b/
const TEXT_WHITE = /\btext-white\b/

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'api') return []
      return walk(full)
    }
    return entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') ? [full] : []
  })
}

const files = ROOTS.flatMap((root) => walk(path.resolve(process.cwd(), root)))

const RULES = [
  { name: '#hex', re: RAW_HEX },
  { name: 'utilidad arbitraria', re: ARBITRARY },
  { name: 'paleta Tailwind cruda', re: RAW_PALETTE },
  { name: 'text-white', re: TEXT_WHITE },
] as const

describe('Sin valores crudos en la app', () => {
  it('encuentra archivos que revisar', () => {
    expect(files.length).toBeGreaterThan(50)
  })

  for (const rule of RULES) {
    it(`no usa ${rule.name}`, () => {
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8')
        const match = content.match(rule.re)
        expect(
          match?.[0],
          `${rule.name} (${match?.[0]}) en ${path.relative(process.cwd(), file)}`
        ).toBeUndefined()
      }
    })
  }
})
