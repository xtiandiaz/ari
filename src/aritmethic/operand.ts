import Operator from './operator'

export enum OperandKind {
  Simple = "SIMPLE",
  Compound = "COMPOUND"
}

export interface Operand {
  readonly kind: OperandKind
  readonly rawValue: number
  
  operated(opr: Operator, rhsOpnd: Operand): Operand
}
