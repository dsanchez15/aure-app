'use client'

import { useEffect, useState } from 'react'

function hydrate<T>(initial: T, raw: string | null): T {
  if (!raw) return initial
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      initial &&
      typeof initial === 'object' &&
      !Array.isArray(initial)
    ) {
      return { ...(initial as object), ...(parsed as object) } as T
    }
    return parsed as T
  } catch {
    return initial
  }
}

/**
 * Estado de filtros que sobrevive a un refresh dentro de la sesión del
 * navegador (sessionStorage). La hidratación ocurre después del montaje
 * para no romper la SSR.
 */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      setValue(hydrate(initial, window.sessionStorage.getItem(key)))
    } catch {
      // sessionStorage puede estar bloqueado; se usa el default.
    }
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (!loaded) return
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Sin persistencia si el navegador la bloquea.
    }
  }, [key, value, loaded])

  return [value, setValue, loaded] as const
}

export default useSessionState
