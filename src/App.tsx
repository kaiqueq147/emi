import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Cat } from './components/Cat'
import { CONFIG } from './config'
import { getMilestoneState } from './utils/milestones'
import {
  MOODS,
  fetchRemoteMood,
  getMood,
  loadMood,
  postRemoteMood,
  saveMood,
  subscribeMood,
  todayKey,
} from './utils/mood'
import { getTheme } from './utils/theme'
import { formatStartDate, getTimeTogether } from './utils/time'
import './App.css'

interface PetHeart {
  id: number
  left: number
  emoji: string
}

const PET_EMOJIS = ['💕', '💖', '💗', '😻', '🥰', '✨']

function App() {
  const [time, setTime] = useState(() => getTimeTogether(CONFIG.startDate))
  const [pets, setPets] = useState(0)
  const [happy, setHappy] = useState(false)
  const [hearts, setHearts] = useState<PetHeart[]>([])
  const [moodId, setMoodId] = useState<string | null>(() => loadMood())
  const [dayKey, setDayKey] = useState(() => todayKey())
  const [moodModalOpen, setMoodModalOpen] = useState(false)
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const happyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const milestones = getMilestoneState(time.days)
  const accessoryIds = milestones.unlockedAccessories.map((a) => a.id)
  const theme = getTheme()
  const currentMood = getMood(moodId)
  const milestoneMessage = milestones.unlockedAccessories.at(-1)?.message ?? CONFIG.message

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeTogether(CONFIG.startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const key = todayKey()
    if (key !== dayKey) {
      setDayKey(key)
      setMoodId(null)
    }
  }, [time, dayKey])

  // Sincroniza o humor com o servidor: busca o atual e escuta mudanças ao vivo.
  useEffect(() => {
    let active = true
    fetchRemoteMood()
      .then((remote) => {
        if (active) setMoodId(remote)
      })
      .catch(() => {
        // servidor indisponível — mantém o valor local (offline)
      })

    const unsubscribe = subscribeMood((remote) => {
      setMoodId(remote)
      if (remote) saveMood(remote)
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    return () => clearTimeout(happyTimeout.current)
  }, [])

  useEffect(() => {
    if (!moodModalOpen && !themeModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoodModalOpen(false)
        setThemeModalOpen(false)
      }
    }
    globalThis.addEventListener('keydown', onKey)
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [moodModalOpen, themeModalOpen])

  const handleSetMood = (id: string) => {
    setMoodId(id)
    saveMood(id)
    setMoodModalOpen(false)
    postRemoteMood(id).catch(() => {
      // sem conexão com o servidor — fica salvo localmente
    })
  }

  const handlePet = () => {
    setPets((p) => p + 1)
    setHappy(true)
    clearTimeout(happyTimeout.current)
    happyTimeout.current = setTimeout(() => setHappy(false), 300)

    const id = Date.now() + Math.random()
    const left = 25 + Math.random() * 50
    const emoji = PET_EMOJIS[Math.floor(Math.random() * PET_EMOJIS.length)]
    setHearts((prev) => [...prev, { id, left, emoji }])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 1100)
  }

  const dayLabel = time.days === 1 ? 'dia' : 'dias'

  return (
    <div className="app" data-theme={theme.id}>
      <div className="sky-decor">
        <button
          type="button"
          className="celestial"
          onClick={() => setThemeModalOpen(true)}
          aria-label="Ver saudação do momento"
        >
          {theme.icon}
        </button>
      </div>
      <div className="hearts-bg" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="floating-heart" style={{ '--i': i } as CSSProperties}>
            💕
          </span>
        ))}
      </div>

      <main className="card">
        <header className="header">
          <p className="subtitle">{CONFIG.herName}</p>
          <h1 className="title">Nosso tempo juntos</h1>
        </header>

        <div className="cat-stage">
          <div className="cat-pet-area">
            {currentMood && (
              <div className="mood-bubble" key={currentMood.id} aria-label={`Humor: ${currentMood.label}`}>
                <span className="mood-bubble-emoji">{currentMood.emoji}</span>
              </div>
            )}
            <Cat
              stage={milestones.stage}
              scale={milestones.scale}
              accessories={accessoryIds}
              happy={happy}
              onPet={handlePet}
            />
            {hearts.map((h) => (
              <span key={h.id} className="pet-heart" style={{ left: `${h.left}%` }}>
                {h.emoji}
              </span>
            ))}
          </div>
          <p className="cat-name">{CONFIG.catName}</p>
          <span className="stage-badge">{milestones.stageLabel}</span>
          <p className="pet-hint">
            {pets === 0 ? ' 🐾' : `${pets} ${pets === 1 ? 'carinho' : 'carinhos'} 💞`}
          </p>
        </div>

        <button type="button" className="mood-trigger" onClick={() => setMoodModalOpen(true)}>
          {currentMood ? (
            <>
              <span className="mood-trigger-emoji">{currentMood.emoji}</span>
              <span>{currentMood.label} hoje</span>
            </>
          ) : (
            <span>Como a Emilly está hoje?</span>
          )}
        </button>

        <section className="counter">
          <p className="counter-label">Juntos há</p>
          <p className="counter-days">
            {time.days} <span>{dayLabel}</span>
          </p>
          <p className="counter-detail">
            {String(time.hours).padStart(2, '0')}h {String(time.minutes).padStart(2, '0')}m{' '}
            {String(time.seconds).padStart(2, '0')}s
          </p>
          <p className="start-date">desde {formatStartDate(CONFIG.startDate)}</p>
        </section>

        <p className="message">{milestoneMessage}</p>

        {milestones.nextAccessory ? (
          <section className="milestone">
            <div className="milestone-header">
              <span className="milestone-emoji">{milestones.nextAccessory.emoji}</span>
              <div>
                <p className="milestone-next">Próximo: {milestones.nextAccessory.label}</p>
                <p className="milestone-remaining">
                  Faltam {milestones.daysUntilNext} {milestones.daysUntilNext === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${milestones.progress * 100}%` }} />
            </div>
          </section>
        ) : (
          <section className="milestone complete">
            <p>🎉 A gente provavelmente se casou</p>
          </section>
        )}

        {milestones.unlockedAccessories.length > 0 && (
          <section className="unlocked">
            <p className="unlocked-title">Conquistas</p>
            <ul className="accessory-list">
              {milestones.unlockedAccessories.map((acc) => (
                <li key={acc.id} className="accessory-item" title={acc.message}>
                  <span>{acc.emoji}</span>
                  <span>{acc.label}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {moodModalOpen &&
        createPortal(
          <div className="modal-overlay">
            <button
              type="button"
              className="modal-backdrop"
              aria-label="Fechar"
              onClick={() => setMoodModalOpen(false)}
            />
            <div className="modal" role="dialog" aria-modal="true" aria-label="Escolher humor">
              <button
                type="button"
                className="modal-close"
                onClick={() => setMoodModalOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
              <p className="mood-title">Como a {CONFIG.herName} está hoje?</p>
              <div className="mood-options">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`mood-option ${moodId === m.id ? 'active' : ''}`}
                    onClick={() => handleSetMood(m.id)}
                    title={m.label}
                    aria-pressed={moodId === m.id}
                  >
                    <span className="mood-option-emoji">{m.emoji}</span>
                    <span className="mood-option-label">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {themeModalOpen &&
        createPortal(
          <div className="modal-overlay">
            <button
              type="button"
              className="modal-backdrop"
              aria-label="Fechar"
              onClick={() => setThemeModalOpen(false)}
            />
            <div className="modal theme-modal" role="dialog" aria-modal="true" aria-label="Saudação do momento">
              <button
                type="button"
                className="modal-close"
                onClick={() => setThemeModalOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
              <span className="theme-modal-icon">{theme.icon}</span>
              <p className="theme-modal-greeting">{theme.greeting}</p>
              <p className="theme-modal-name">{CONFIG.herName} 💕</p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default App
