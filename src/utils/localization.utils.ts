import { Language } from "@/models/localization"
import type { Operation } from "@/models/math";
import useGameStore from '@/stores/game'
import EN from "@/assets/localization/en";
import ES from "@/assets/localization/es";

export const languageSelection = [Language.English, Language.Spanish]

export const localizedStringInLanguage = (key: string, language: Language): string => {
  return (() => {
    switch (language) {
    case Language.English: return EN.get(key)
    case Language.Spanish: return ES.get(key)
    }
  })() ?? `{${key} :: ${language}}`
}

export const localizedString = (key: string): string => {
  return localizedStringInLanguage(key, useGameStore().settings.language)
}

export const interpolatedLocalizedString = (key: string, ...options: unknown[]): string => {
  switch (key) {
    case 'operation':
      const operation = options[0] as Operation
      const partialString = localizedString(`${key}-${operation.operator}`)
      
      return partialString.replace(
        /{operand(\d+)}/g, 
        (_, i) => `${(operation.operands[i]).toLocaleString()}`
      )
  }
  
  return localizedString(key)
}
