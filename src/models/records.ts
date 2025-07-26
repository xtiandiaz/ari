import type { Operator } from './math'
import type { OperationModality } from './game'

export interface OperatorScore {
  best: number
  modality: OperationModality
  operator: Operator
  value: number
}

export interface PersonalBest {
  modality: OperationModality
  totalScore: number
  
  duration?: number
}

export interface RawDailyRecords {
  date: string,
  
  operatorScores?: OperatorScore[]
}

export interface DailyRecords {
  date: Date
  operatorScores: OperatorScore[]
}

export interface Level {
  best: number
  modality: OperationModality
  operatorScores: OperatorScore[]
  value: number
}
