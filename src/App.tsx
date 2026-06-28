import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Cat } from './components/Cat'
import { CONFIG } from './config'
import { getMilestoneState } from './utils/milestones'
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
  const happyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const milestones = getMilestoneState(time.days)
  const accessoryIds = milestones.unlockedAccessories.map((a) => a.id)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeTogether(CONFIG.startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => clearTimeout(happyTimeout.current)
  }, [])

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
    <div className="app">
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

        <p className="message">{CONFIG.message}</p>

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
    </div>
  )
}

export default App
