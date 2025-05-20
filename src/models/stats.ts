import type { Operator } from './math'

export interface OperatorStats {
  operator: Operator
  score: number
  record: number
}

export interface OperatorRecords {
  maxSolutionCount: number
  operator: Operator
}

export interface RawDailyStats {
  date: string,
  operatorsStats: OperatorStats[]
}

export interface DailyStats {
  date: Date
  operatorsStats: OperatorStats[]
}

export interface Records {
  operatorsRecords: OperatorRecords[]
}
