import scoreStore from '@/stores/score'
import settingsStore from '@/stores/settings'
import '@/assets/tungsten/extensions/array.extensions'

export const levelWeight = 3

function calculateLevel(averageOperatorScore: number): number {
  return Math.ceil(averageOperatorScore / levelWeight)
}

export function calculateDailyLevel(): number {
  const score = scoreStore()
  const settings = settingsStore()
  
  return calculateLevel(
    settings.playableOperators
      .compactMap(o => score.getOperatorDailyScore(o))
      .reduce((acc, os) => acc + os.score, 0) / settings.playableOperators.length
  )
}

export function calculateRecordLevel(): number {
  const score = scoreStore()
  const settings = settingsStore()
  
  return calculateLevel(
    settings.playableOperators
      .compactMap(o => score.getOperatorDailyScore(o))
      .reduce((acc, os) => acc + os.record, 0) / settings.playableOperators.length
  )
}
