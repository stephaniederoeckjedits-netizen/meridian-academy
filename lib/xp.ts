export interface Level {
  level: number
  name: string
  xpRequired: number
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Digital Novice', xpRequired: 0 },
  { level: 2, name: 'Avid Reader', xpRequired: 2500 },
  { level: 3, name: 'Builder', xpRequired: 6000 },
  { level: 4, name: 'Systems Thinker', xpRequired: 12000 },
  { level: 5, name: 'Language Architect', xpRequired: 20000 },
  { level: 6, name: 'Disciplined Mind', xpRequired: 35000 },
  { level: 7, name: 'Digital Systems Architect', xpRequired: 50000 },
  { level: 8, name: 'Digital Renaissance Architect', xpRequired: 100000 },
]

export function getLevelData(currentXp: number) {
  let currentLevel = LEVELS[0]
  let nextLevel: Level | null = LEVELS[1]

  for (let i = 0; i < LEVELS.length; i++) {
    if (currentXp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] || null
    }
  }

  const xpInCurrentLevel = currentXp - currentLevel.xpRequired
  const xpNeededForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 1
  const progressPercent = nextLevel
    ? Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100)
    : 100

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpInCurrentLevel,
    xpNeededForNext
  }
}