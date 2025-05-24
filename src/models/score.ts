import type { Operator } from './math'

export interface OperatorScore {
  operator: Operator
  record: number
  score: number
}

export interface RawDailyScore {
  date: string,
  operatorsScores: OperatorScore[]
}

export interface DailyScore {
  date: Date
  operatorsScores: OperatorScore[]
}
