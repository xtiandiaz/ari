import type { Operator } from './math'

export interface OperatorScores {
  operator: Operator
  record: number
  score: number
}

export interface RawDailyScores {
  date: string,
  operatorsScores: OperatorScores[]
  
  recordLevel?: number
}

export interface DailyScores {
  date: Date
  operatorsScores: OperatorScores[]
  
  recordLevel?: number
}
