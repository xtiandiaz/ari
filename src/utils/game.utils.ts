import { OperationModality } from "@/models/game";
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
