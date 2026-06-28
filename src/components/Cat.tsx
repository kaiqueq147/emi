import type { CSSProperties } from 'react'
import type { GrowthStage } from '../utils/milestones'

interface CatProps {
  stage: GrowthStage
  scale: number
  accessories: string[]
  happy?: boolean
  onPet?: () => void
}

export function Cat({ stage, scale, accessories, happy = false, onPet }: CatProps) {
  const hasCollar = accessories.includes('collar')
  const hasHeart = accessories.includes('heart')
  const hasBow = accessories.includes('bow')
  const hasToy = accessories.includes('toy')
  const hasFlower = accessories.includes('flower')
  const hasScarf = accessories.includes('scarf')
  const hasBell = accessories.includes('bell')
  const hasCrown = accessories.includes('crown')
  const hasSparkle = accessories.includes('sparkle')
  const hasCape = accessories.includes('cape')
  const hasHalo = accessories.includes('halo')
  const isSpecial = stage === 'especial'

  const eyeSize = stage === 'filhote' ? 7 : 5.5
  const blushOpacity = stage === 'filhote' ? 0.6 : 0.4

  return (
    <button
      type="button"
      className={`cat-wrapper ${happy ? 'happy' : ''}`}
      style={{ '--cat-scale': scale } as CSSProperties}
      onClick={onPet}
      aria-label="Fazer carinho no gatinho"
    >
      <svg
        viewBox="0 0 200 220"
        className={`cat-svg ${stage}`}
        aria-label="Gatinho mascote"
      >
        {(isSpecial || hasHalo) && (
          <g className="cat-glow">
            <ellipse cx="100" cy="120" rx="85" ry="90" fill="url(#glowGrad)" opacity={hasHalo ? 0.5 : 0.35} />
          </g>
        )}

        {hasHalo && (
          <g className="accessory halo">
            <ellipse cx="100" cy="18" rx="38" ry="8" fill="none" stroke="#ffd700" strokeWidth="3" opacity="0.85" />
            <ellipse cx="100" cy="16" rx="38" ry="8" fill="none" stroke="#fff8dc" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* Cape */}
        {hasCape && (
          <g className="accessory cape">
            <path
              d="M55 130 Q100 115 145 130 L150 175 Q100 190 50 175 Z"
              fill="#ff6b9d"
              stroke="#ff4d8d"
              strokeWidth="2"
              opacity="0.85"
            />
          </g>
        )}

        {/* Tail */}
        <path
          d="M155 155 Q185 130 175 95 Q170 80 160 88"
          fill="none"
          stroke="#f4a6b8"
          strokeWidth="14"
          strokeLinecap="round"
          className="cat-tail"
        />

        {/* Body */}
        <ellipse cx="100" cy="155" rx="52" ry="48" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2.5" />

        {/* Paws */}
        <ellipse cx="72" cy="195" rx="14" ry="8" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2" />
        <ellipse cx="128" cy="195" rx="14" ry="8" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2" />

        {/* Head */}
        <circle cx="100" cy="95" r="48" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2.5" />

        {/* Ears */}
        <polygon points="58,58 72,22 88,52" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="112,52 128,22 142,58" fill="#fff5f7" stroke="#f4a6b8" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="63,55 72,30 82,50" fill="#ffd6e0" />
        <polygon points="118,50 128,30 137,55" fill="#ffd6e0" />

        {/* Flower */}
        {hasFlower && (
          <g className="accessory flower">
            <circle cx="148" cy="72" r="8" fill="#ffb3c6" />
            <circle cx="140" cy="68" r="7" fill="#ff8fab" />
            <circle cx="156" cy="68" r="7" fill="#ff8fab" />
            <circle cx="143" cy="78" r="7" fill="#ff8fab" />
            <circle cx="153" cy="78" r="7" fill="#ff8fab" />
            <circle cx="148" cy="72" r="4" fill="#ffd700" />
          </g>
        )}

        {/* Collar */}
        {hasCollar && (
          <g className="accessory collar">
            <path
              d="M58 118 Q100 132 142 118"
              fill="none"
              stroke="#ff6b9d"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="127" r="4" fill="#ffd700" stroke="#ffb700" strokeWidth="1" />
          </g>
        )}

        {/* Bell on collar */}
        {hasBell && (
          <g className="accessory bell">
            <path d="M96 127 L100 137 L104 127 Z" fill="#ffd700" stroke="#ffb700" strokeWidth="1" />
            <circle cx="100" cy="139" r="2.5" fill="#ffd700" />
          </g>
        )}

        {/* Scarf */}
        {hasScarf && (
          <g className="accessory scarf">
            <path d="M55 118 Q100 138 145 118 L145 128 Q100 148 55 128 Z" fill="#ff8fab" />
            <rect x="88" y="128" width="24" height="32" rx="4" fill="#ff8fab" />
            <line x1="92" y1="135" x2="92" y2="155" stroke="#ff6b9d" strokeWidth="1.5" />
            <line x1="100" y1="135" x2="100" y2="158" stroke="#ff6b9d" strokeWidth="1.5" />
            <line x1="108" y1="135" x2="108" y2="155" stroke="#ff6b9d" strokeWidth="1.5" />
          </g>
        )}

        {/* Eyes */}
        {happy ? (
          <g>
            <path d="M74 94 Q82 84 90 94" fill="none" stroke="#4a3040" strokeWidth="3" strokeLinecap="round" />
            <path d="M110 94 Q118 84 126 94" fill="none" stroke="#4a3040" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : (
          <>
            <g className="cat-eye">
              <ellipse cx="82" cy="92" rx={eyeSize} ry={eyeSize + 1} fill="#4a3040" />
              <circle cx={82 + eyeSize * 0.3} cy={92 - eyeSize * 0.3} r="2.5" fill="#fff" />
            </g>
            <g className="cat-eye">
              <ellipse cx="118" cy="92" rx={eyeSize} ry={eyeSize + 1} fill="#4a3040" />
              <circle cx={118 + eyeSize * 0.3} cy={92 - eyeSize * 0.3} r="2.5" fill="#fff" />
            </g>
          </>
        )}

        {/* Blush */}
        <ellipse cx="68" cy="105" rx="10" ry="6" fill="#ffb3c6" opacity={blushOpacity} />
        <ellipse cx="132" cy="105" rx="10" ry="6" fill="#ffb3c6" opacity={blushOpacity} />

        {/* Heart cheek pin */}
        {hasHeart && (
          <g className="accessory heart">
            <path
              d="M58 106 C55 103 51 105 51 109 C51 113 58 118 58 118 C58 118 65 113 65 109 C65 105 61 103 58 106 Z"
              fill="#ff4d8d"
            />
          </g>
        )}

        {/* Nose */}
        <polygon points="100,100 94,108 106,108" fill="#ff8fab" />

        {/* Mouth */}
        <path d="M100 108 Q92 116 86 112" fill="none" stroke="#f4a6b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 108 Q108 116 114 112" fill="none" stroke="#f4a6b8" strokeWidth="2" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="48" y1="98" x2="72" y2="96" stroke="#f4a6b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="46" y1="108" x2="72" y2="106" stroke="#f4a6b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="128" y1="96" x2="152" y2="98" stroke="#f4a6b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="128" y1="106" x2="152" y2="108" stroke="#f4a6b8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bow */}
        {hasBow && (
          <g className="accessory bow">
            <ellipse cx="100" cy="52" rx="18" ry="10" fill="#ff6b9d" />
            <ellipse cx="82" cy="50" rx="12" ry="9" fill="#ff8fab" />
            <ellipse cx="118" cy="50" rx="12" ry="9" fill="#ff8fab" />
            <circle cx="100" cy="50" r="5" fill="#ff4d8d" />
          </g>
        )}

        {/* Crown */}
        {hasCrown && (
          <g className="accessory crown">
            <path
              d="M72 42 L78 22 L88 36 L100 18 L112 36 L122 22 L128 42 Z"
              fill="#ffd700"
              stroke="#ffb700"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="28" r="3" fill="#fff" />
            <circle cx="78" cy="26" r="2" fill="#fff" />
            <circle cx="122" cy="26" r="2" fill="#fff" />
          </g>
        )}

        {/* Sparkle */}
        {hasSparkle && (
          <g className="accessory sparkle">
            <text x="38" y="45" fontSize="16">✨</text>
            <text x="148" y="50" fontSize="14">✨</text>
            <text x="155" y="75" fontSize="12">✨</text>
          </g>
        )}

        {/* Toy */}
        {hasToy && (
          <g className="accessory toy">
            <circle cx="168" cy="175" r="14" fill="#ff8fab" stroke="#ff6b9d" strokeWidth="2" />
            <path d="M168 161 Q158 150 148 155" fill="none" stroke="#ff6b9d" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        <defs>
          <radialGradient id="glowGrad">
            <stop offset="0%" stopColor="#ffb3c6" />
            <stop offset="100%" stopColor="#ffb3c6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </button>
  )
}
