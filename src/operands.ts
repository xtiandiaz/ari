import Operator from './operator'
import { OperationError, OperandError } from './errors'
import * as utils from './utils'

export enum OperandKind {
  Integer = "INTEGER",
  Fraction = "FRACTION",
  Operation = "OPERATION"
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
  abstract get baseRawValue(): number
  
  abstract operated(opr: Operator, rhsOpnd: Operand): Operand
  abstract simplified(): Operand
}

export class Integer extends Operand {
  readonly base: number
  
  constructor(base: number, exponent: number = 1) {
    super(OperandKind.Integer, exponent)
    
    this.base = Math.floor(base)
  }
  
  get rawValue(): number {
    return Math.pow(Math.floor(this.base), this.exponent)
  }
  
  get baseRawValue(): number {
    return this.base
  }
  
  operated(opr: Operator, rhsOpnd: Operand): Operand {
      switch (rhsOpnd.kind) {
        case OperandKind.Integer:
          switch (opr) {
            case Operator.Addition:
              return new Integer(this.rawValue + rhsOpnd.rawValue)
            case Operator.Subtraction:
              return new Integer(this.rawValue - rhsOpnd.rawValue)
            case Operator.Multiplication:
              return new Integer(this.rawValue * rhsOpnd.rawValue)
            case Operator.Division:
              return new Fraction(this.rawValue, rhsOpnd.rawValue)
          }
        case OperandKind.Fraction:
          return (new Fraction(this.rawValue, 1)).operated(opr, rhsOpnd)
        default:
          throw OperationError.notImplemented(this, opr, rhsOpnd)
      }
  }
  
  simplified(): Operand {
    return this
  }
}

export class Fraction extends Operand {  
  private _baseNumerator: number
  private _baseDenominator: number
  
  constructor(numerator: number, denominator: number, exponent: number = 1) {
    super(OperandKind.Fraction, exponent)
    
    if (denominator == 0) {
      throw OperationError.divisionByZero
    } else if (denominator < 0) {
      denominator *= -1
      numerator *= -1
    }
    
    this._baseNumerator = numerator
    this._baseDenominator = denominator
    
    this._simplify()
  }
  
  get rawValue(): number {
    return this._poweredNumerator / this._poweredDenominator
  }
  
  get baseRawValue(): number {
    return this.baseNumerator / this.baseDenominator
  }
  
  get baseNumerator(): number {
    return this._baseNumerator
  }
  
  get baseDenominator(): number {
    return this._baseDenominator
  }
  
  private get _poweredNumerator(): number {
    return Math.pow(this.baseNumerator, this.exponent)
  }
  
  private get _poweredDenominator(): number {
    return Math.pow(this.baseDenominator, this.exponent)
  }
  
  operated(opr: Operator, rhsOpnd: Operand): Operand {
    switch (rhsOpnd.kind) {
      case OperandKind.Integer:
        return this._operated(opr, new Fraction(rhsOpnd.rawValue, 1))
      case OperandKind.Fraction:
        return this._operated(opr, <Fraction>rhsOpnd)
      default:
        throw OperationError.notImplemented(this, opr, rhsOpnd)
    }
  }
  
  simplified(): Operand {
    this._simplify()
    
    if (this.baseDenominator == 1) {
      return new Integer(this.baseNumerator)
    }
    
    return this
  }
  
  private _operated(opr: Operator, rhsOpnd: Fraction): Fraction {
    switch (opr) {
      case Operator.Addition:
        return new Fraction(
          this._poweredNumerator * rhsOpnd._poweredDenominator + this._poweredDenominator * rhsOpnd._poweredNumerator,
          this._poweredDenominator * rhsOpnd._poweredDenominator
        )
      case Operator.Subtraction:
        return new Fraction(
          this._poweredNumerator * rhsOpnd._poweredDenominator - this._poweredDenominator * rhsOpnd._poweredNumerator,
          this._poweredDenominator * rhsOpnd._poweredDenominator
        )
      case Operator.Multiplication:
        return new Fraction(
          this._poweredNumerator * rhsOpnd._poweredNumerator, 
          this._poweredDenominator * rhsOpnd._poweredDenominator
        )
      case Operator.Division:
        return new Fraction(
          this._poweredNumerator * rhsOpnd._poweredDenominator, 
          this._poweredDenominator * rhsOpnd._poweredNumerator
        )
    }
  }
  
  private _simplify() {
    const gcd = Math.abs(utils.gcd(this._baseNumerator, this._baseDenominator))
    if (gcd == 1) {
      return
    }
    this._baseNumerator /= gcd
    this._baseDenominator /= gcd
  }
}
