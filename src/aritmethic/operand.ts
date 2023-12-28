import Operator from './operator'
import { OperationError, OperandError } from '../errors'
import * as utils from '../utils'

export enum OperandKind {
  Simple = "SIMPLE",
  Compound = "COMPOUND"
}

export abstract class Operand {
  readonly kind: OperandKind
  readonly exponent: number
  
  constructor(kind: OperandKind, exponent: number) {
    if (exponent < 0) {
      throw OperandError.unsupportedExponent(exponent)
    }
    
    this.kind = kind
    this.exponent = Math.floor(exponent)
  }
  
  abstract get rawValue(): number
  
  abstract operated(opr: Operator, rhsOpnd: Operand): SimpleOperand
}

export class SimpleOperand extends Operand {  
  readonly numerator: number
  readonly denominator: number
  
  constructor(numerator: number, denominator: number = 1, exponent: number = 1, simplified: boolean = true) {
    super(OperandKind.Simple, exponent)
    
    if (denominator == 0) {
      throw OperationError.divisionByZero
    } else if (denominator < 0) {
      denominator *= -1
      numerator *= -1
    }
    
    const gcd = simplified ? Math.abs(utils.gcd(numerator, denominator)) : 1
    this.numerator = numerator / gcd
    this.denominator = denominator / gcd
  }
  
  get baseRawValue(): number {
    return this.numerator / this.denominator
  }
  
  get rawValue(): number {
    return this.rawNumerator / this.rawDenominator
  }
  
  get rawNumerator(): number {
    return Math.pow(this.numerator, this.exponent)
  }
  
  get rawDenominator(): number {
    return Math.pow(this.denominator, this.exponent)
  }
  
  operated(opr: Operator, rhsOpnd: Operand): SimpleOperand {
    switch (rhsOpnd.kind) {
      case OperandKind.Simple:
        return this._operated(opr, <SimpleOperand>rhsOpnd)
      case OperandKind.Compound:
        return this._operated(opr, new SimpleOperand(rhsOpnd.rawValue))
    }
  }
  
  isEqualTo(othr: SimpleOperand): boolean {
    return this.numerator == othr.numerator && 
      this.denominator == othr.denominator && 
      this.exponent == othr.exponent
  }
  
  private _operated(opr: Operator, rhsOpnd: SimpleOperand): SimpleOperand {
    switch (opr) {
      case Operator.Addition:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator + this.rawDenominator * rhsOpnd.rawNumerator,
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.Subtraction:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator - this.rawDenominator * rhsOpnd.rawNumerator,
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.Multiplication:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawNumerator, 
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.Division:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator, 
          this.rawDenominator * rhsOpnd.rawNumerator
        )
    }
  }
}
