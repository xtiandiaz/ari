import { OperationModality } from "@/models/game";
import useRecordsStore from '@/stores/records'
import { getRandomWeightedChoice } from "@/assets/tungsten/randomness";
import { Icon } from "@/assets/design-tokens/iconography";

export const modalitiesInPlayabilityOrder = [OperationModality.Visual, OperationModality.Aural]

export const modalityIcon = (modality: OperationModality): Icon => {
  switch (modality) {
    case OperationModality.Aural:
      return Icon.Ear
    case OperationModality.Visual:
      return Icon.Eye
  }
}

export function getRandomModality(): OperationModality {
  const levels = useRecordsStore().levels
  const modalities = levels.map(l => l.modality)
  const weights = levels.map(l => l.value).reversed()
  
  // console.log(modalities, weights)
  return getRandomWeightedChoice(modalities, weights)
}
