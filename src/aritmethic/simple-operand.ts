import Operator from './operator'
import { Operand, OperandKind } from './operand'
import { OperandError, OperationError } from '../errors'
import * as utils from '../utils'

export default class SimpleOperand implements Operand {
  readonly kind = OperandKind.Simple
  readonly numerator: number
  readonly denominator: number
  readonly exponent: number
  
  constructor(numerator: number, denominator: number = 1, exponent: number = 1) {
    if (denominator == 0) {
      throw OperandError.divisionByZero
    } else if (denominator < 0) {
      denominator *= -1
      numerator *= -1
    }
    if (exponent < 0) {
      throw OperandError.unsupportedExponent(exponent)
    }
    
    this.numerator = numerator
    this.denominator = denominator
    this.exponent = Math.floor(exponent)
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
  
  operated(opr: Operator, rhsOpnd: Operand): Operand {
    switch (rhsOpnd.kind) {
      case OperandKind.Simple:
        return this._operated(opr, <SimpleOperand>rhsOpnd)
      case OperandKind.Compound:
        return this._operated(opr, new SimpleOperand(rhsOpnd.rawValue))
    }
  }
  
  simplified(): SimpleOperand {
    let num = this.rawNumerator
    let den = this.rawDenominator
    const gcd = Math.abs(utils.gcd(num, den))
    
    return new SimpleOperand(num / gcd, den / gcd, 1)
  }
  
  isEqualTo(other: SimpleOperand): boolean {
    return this.numerator == other.numerator && 
      this.denominator == other.denominator && 
      this.exponent == other.exponent
  }
  
  isAbsEqualTo(other: SimpleOperand): boolean {
    return Math.abs(this.numerator) == Math.abs(other.numerator) &&
      Math.abs(this.denominator) == Math.abs(other.denominator) &&
      this.exponent == other.exponent      
  }
  
  private _operated(opr: Operator, rhsOpnd: SimpleOperand): SimpleOperand {
    switch (opr) {
      case Operator.addition:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator + this.rawDenominator * rhsOpnd.rawNumerator,
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.subtraction:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator - this.rawDenominator * rhsOpnd.rawNumerator,
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.multiplication:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawNumerator, 
          this.rawDenominator * rhsOpnd.rawDenominator
        )
      case Operator.division:
        return new SimpleOperand(
          this.rawNumerator * rhsOpnd.rawDenominator, 
          this.rawDenominator * rhsOpnd.rawNumerator
        )
      default:
        throw OperationError.notImplemented(this, opr, rhsOpnd)
    }
  }
}
