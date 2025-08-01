export enum Language {
  English = 'en',
  Spanish = 'es'
}

export enum Operator {
  Addition = 'addition',
  Division = 'division',
  Multiplication = 'multiplication',
  Percent = 'percent',
  Subtraction = 'subtraction',
}

export const allOperators = [Operator.Addition, Operator.Subtraction, Operator.Multiplication, Operator.Division, Operator.Percent]

export enum OperationModality {
  Aural = 'aural',
  Visual = 'visual' 
}

export const allModalities = [OperationModality.Aural, OperationModality.Visual]
export const allModalitiesInPlayabilityOrder = [OperationModality.Visual, OperationModality.Aural]
