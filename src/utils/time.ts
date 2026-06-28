export interface TimeTogether {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export function getTimeTogether(startDate: Date, now = new Date()): TimeTogether {
  const totalMs = Math.max(0, now.getTime() - startDate.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, totalMs }
}

export function formatStartDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
