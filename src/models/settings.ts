import type { Language } from "./localization";
import type { OperationModality } from "./game";

export interface Settings {
  language: Language
  modality?: OperationModality
}
