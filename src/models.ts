import { Language, OperationModality, Operator } from "@/enums"

export interface Settings {
  language: Language
  modality?: OperationModality
}

export interface Operation {
  modality: OperationModality
  operands: number[]
  operator: Operator
  result: number
}


export interface OperatorScore {
  modality: OperationModality
  operator: Operator
  value: number
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
  modality: OperationModality
  value: number
}

export interface PersonalBests {
  levels: Level[]
  operatorScores: OperatorScore[]
}

export interface LevelCard {
  level: number
  modality: OperationModality
  operatorScores: OperatorScore[]
  personalBest: number
}
