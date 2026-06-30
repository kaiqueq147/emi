import { ACCESSORIES } from './utils/milestones'

export const CONFIG = {

  startDate: new Date(2026, 5, 28),// 01/07/2026
  message: ACCESSORIES.at(-1)?.message ?? '',
  catName: 'Mimi',
} as const
