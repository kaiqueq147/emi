export interface Mood {
  id: string
  emoji: string
  label: string
}

export const MOODS: Mood[] = [
  { id: 'happy', emoji: '😺', label: 'Feliz' },
  { id: 'calm', emoji: '😌', label: 'Chillada' },
  { id: 'excited', emoji: '🫣', label: 'Com tesão' },
  { id: 'playful', emoji: '🧶', label: 'Resenha' },
  { id: 'sleepy', emoji: '😴', label: 'Com sono' },
  { id: 'hungry', emoji: '🍤', label: 'Com fome' },
  { id: 'needy', emoji: '🥺', label: 'Carente' },
  { id: 'sad', emoji: '🥀', label: 'Pra baixo' },
]

const STORAGE_KEY = 'emi-mood'

interface StoredMood {
  date: string
  moodId: string
}

export function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function getMood(id: string | null): Mood | undefined {
  return MOODS.find((m) => m.id === id)
}

export function loadMood(date = new Date()): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as StoredMood
    return data.date === todayKey(date) ? data.moodId : null
  } catch {
    return null
  }
}

export function saveMood(moodId: string, date = new Date()): void {
  try {
    const data: StoredMood = { date: todayKey(date), moodId }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage indisponível — segue sem persistir
  }
}
