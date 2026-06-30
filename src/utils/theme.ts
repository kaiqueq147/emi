export type TimeOfDay = 'dawn' | 'day' | 'night'

export interface Theme {
  id: TimeOfDay
  greeting: string
  icon: string
}

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const h = date.getHours()
  if (h >= 5 && h < 12) return 'dawn'
  if (h >= 12 && h < 20) return 'day'
  return 'night'
}

const THEMES: Record<TimeOfDay, Theme> = {
  dawn: { id: 'dawn', greeting: 'Bom dia bebe', icon: '☀️' },
  day: { id: 'day', greeting: 'Geralmente você ta dormindo de tarde', icon: '🌇' },
  night: { id: 'night', greeting: 'Boa noite princesinha', icon: '🌙' },
}

export function getTheme(date = new Date()): Theme {
  return THEMES[getTimeOfDay(date)]
}
