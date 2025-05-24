import scoreStore from '@/stores/score'
import settingsStore from '@/stores/settings'
import '@/assets/tungsten/extensions/array.extensions'

export const levelWeight = 3

export function calculateLevel(): number {
  const score = scoreStore()
  const settings = settingsStore()
  
  return Math.ceil(
    (
      settings.playableOperators
        .compactMap(o => score.getOperatorDailyScore(o))
        .reduce((acc, os) => acc + os.score, 0) / settings.playableOperators.length
      ) / levelWeight
    )
}

export function calculateRecordLevel(): number {
  const score = scoreStore()
  const settings = settingsStore()
  
  return Math.ceil(
    (
      settings.playableOperators
        .compactMap(o => score.getOperatorDailyScore(o))
        .reduce((acc, os) => acc + os.record, 0) / settings.playableOperators.length
      ) / levelWeight
    )
}
