export type GrowthStage = 'filhote' | 'jovem' | 'adulto' | 'especial'

export interface Accessory {
  id: string
  emoji: string
  label: string
  daysRequired: number
  message: string
}

export interface MilestoneState {
  stage: GrowthStage
  stageLabel: string
  scale: number
  unlockedAccessories: Accessory[]
  nextAccessory: Accessory | null
  daysUntilNext: number
  progress: number
}

export const ACCESSORIES: Accessory[] = [
  {
    id: 'collar',
    emoji: '💖',
    label: 'Coleira',
    daysRequired: 1,
    message: 'u.u',
  },
  {
    id: 'heart',
    emoji: '💕',
    label: 'Coraçãozinho',
    daysRequired: 3,
    message: '(o_o)',
  },
  {
    id: 'bow',
    emoji: '🎀',
    label: 'Laço rosa',
    daysRequired: 5,
    message: ':3',
  },
  {
    id: 'toy',
    emoji: '🧶',
    label: 'Novelo de lã',
    daysRequired: 7,
    message: '(u_u)',
  },
  {
    id: 'flower',
    emoji: '🌸',
    label: 'Flor',
    daysRequired: 10,
    message: '(0u0)',
  },
  {
    id: 'scarf',
    emoji: '🧣',
    label: 'Cachecol',
    daysRequired: 14,
    message: '(t_t)',
  },
  {
    id: 'bell',
    emoji: '🔔',
    label: 'Sino',
    daysRequired: 21,
    message: '-_-',
  },
  {
    id: 'crown',
    emoji: '👑',
    label: 'Coroa',
    daysRequired: 30,
    message: 'O_O',
  },
  {
    id: 'sparkle',
    emoji: '✨',
    label: 'Brilho ',
    daysRequired: 45,
    message: 'o.O',
  },
  {
    id: 'cape',
    emoji: '🦸',
    label: 'Capa de herói',
    daysRequired: 60,
    message: 'UwU',
  },
  {
    id: 'halo',
    emoji: '🌟',
    label: 'Aura dourada',
    daysRequired: 90,
    message: '(OuO)',
  },
]

const STAGE_THRESHOLDS: { maxDays: number; stage: GrowthStage; label: string; scale: number }[] = [
  { maxDays: 5, stage: 'filhote', label: 'Filhote', scale: 0.75 },
  { maxDays: 14, stage: 'jovem', label: 'Jovem', scale: 0.9 },
  { maxDays: 30, stage: 'adulto', label: 'Adulto', scale: 1 },
  { maxDays: Infinity, stage: 'especial', label: 'Especial', scale: 1.1 },
]

export function getMilestoneState(days: number): MilestoneState {
  const stageInfo = STAGE_THRESHOLDS.find((s) => days <= s.maxDays) ?? STAGE_THRESHOLDS.at(-1)!
  const unlockedAccessories = ACCESSORIES.filter((a) => days >= a.daysRequired)
  const nextAccessory = ACCESSORIES.find((a) => days < a.daysRequired) ?? null

  let daysUntilNext = 0
  let progress = 1

  if (nextAccessory) {
    const prevDays = unlockedAccessories.at(-1)?.daysRequired ?? 0
    daysUntilNext = nextAccessory.daysRequired - days
    const range = nextAccessory.daysRequired - prevDays
    progress = range > 0 ? (days - prevDays) / range : 0
  }

  return {
    stage: stageInfo.stage,
    stageLabel: stageInfo.label,
    scale: stageInfo.scale,
    unlockedAccessories,
    nextAccessory,
    daysUntilNext,
    progress: Math.min(1, Math.max(0, progress)),
  }
}
