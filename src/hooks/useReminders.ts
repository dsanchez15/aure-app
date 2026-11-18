'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Reminder } from '@/types/reminder'

export type ReminderFilter = 'all' | 'pending' | 'completed'

const FILTER_KEY = 'aure-reminder-filter'

function isReminderFilter(value: string | null): value is ReminderFilter {
  return value === 'all' || value === 'pending' || value === 'completed'
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilterState] = useState<ReminderFilter>('pending')

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(FILTER_KEY)
      if (isReminderFilter(stored)) setFilterState(stored)
    } catch {
      // Sin persistencia si el navegador la bloquea.
    }
  }, [])

  const setFilter = useCallback((next: ReminderFilter) => {
    setFilterState(next)
    try {
      window.sessionStorage.setItem(FILTER_KEY, next)
    } catch {
      // Sin persistencia si el navegador la bloquea.
    }
  }, [])

  const fetchReminders = useCallback(async () => {
    try {
      setReminders(await apiClient.get<Reminder[]>('/api/reminders'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  const toggleReminder = useCallback(async (r: Reminder) => {
    try {
      await apiClient.put(`/api/reminders/${r.id}`, { completed: !r.completed })
      setReminders((prev) => prev.map((x) => (x.id === r.id ? { ...x, completed: !x.completed } : x)))
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteReminder = useCallback(async (id: number) => {
    try {
      await apiClient.delete(`/api/reminders/${id}`)
      setReminders((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }, [])

  const filtered = reminders.filter((r) => {
    if (filter === 'pending') return !r.completed
    if (filter === 'completed') return r.completed
    return true
  })

  const pendingCount = reminders.filter((r) => !r.completed).length
  const completedCount = reminders.filter((r) => r.completed).length

  return {
    filtered,
    loading,
    filter,
    setFilter,
    pendingCount,
    completedCount,
    fetchReminders,
    toggleReminder,
    deleteReminder,
  }
}
