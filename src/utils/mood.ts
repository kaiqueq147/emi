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

const API_BASE = import.meta.env.VITE_API_URL ?? ''

interface RemoteMood {
  moodId: string | null
  date: string
  updatedAt: string | null
}

function moodForToday(data: RemoteMood): string | null {
  return data.date === todayKey() ? data.moodId : null
}

export async function fetchRemoteMood(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/api/mood`)
  if (!res.ok) throw new Error(`Falha ao buscar humor: ${res.status}`)
  const data = (await res.json()) as RemoteMood
  return moodForToday(data)
}

export async function postRemoteMood(moodId: string): Promise<void> {
  await fetch(`${API_BASE}/api/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moodId }),
  })
}

// Assina atualizações em tempo real; retorna função para encerrar.
export function subscribeMood(onChange: (moodId: string | null) => void): () => void {
  const source = new EventSource(`${API_BASE}/api/mood/stream`)
  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as RemoteMood
      onChange(moodForToday(data))
    } catch {
      // mensagem inválida — ignora
    }
  }
  return () => source.close()
}
