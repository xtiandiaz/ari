import { Operator, OperationModality, allModalitiesInPlayabilityOrder } from "@/enums";
import type { OperatorScore, LevelCard } from "@/models";
import useRecordsStore from '@/stores/records'
import { Icon } from "@/assets/design-tokens/iconography";

export const modalityIcon = (modality: OperationModality): Icon => {
  switch (modality) {
    case OperationModality.Aural:
      return Icon.Ear
    case OperationModality.Visual:
      return Icon.Eye
  }
}

export const operatorIcon = (operator: Operator) => {
  switch (operator) {
    case Operator.Addition:
      return Icon.Plus
    case Operator.Division:
      return Icon.Divide
    case Operator.Multiplication:
      return Icon.Multiply
    case Operator.Percent:
      return Icon.Percent
    case Operator.Subtraction:
      return Icon.Minus
  }
}

export function composeLevelCards(): LevelCard[] {
  const records = useRecordsStore()
  const levels = new Map(records.levels.map(l => [l.modality, l.value]))
  const personalBests = new Map(records.personalBests.levels.map(l => [l.modality, l.value]))
  const operatorScores = new Map(records.dailyRecords.operatorScores
    .groupedBy<OperatorScore, OperationModality>(os => os.modality)
    .map(gos => [gos[0].modality, gos])
  )
  
  return allModalitiesInPlayabilityOrder.map(modality => {
    return {
      level: levels.get(modality)!,
      modality,
      operatorScores: operatorScores.get(modality)!,
      personalBest: personalBests.get(modality)!
    }
  })
}
