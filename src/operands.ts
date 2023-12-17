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
  private _baseDividend: number
  private _baseDivisor: number
  
  constructor(dividend: number, divisor: number, exponent: number = 1) {
    super(OperandKind.Fraction, exponent)
    
    if (divisor == 0) {
      throw OperationError.divisionByZero
    } else if (divisor < 0) {
      divisor *= -1
      dividend *= -1
    }
    
    this._baseDividend = dividend
    this._baseDivisor = divisor
    
    this._simplify()
  }
  
  get rawValue(): number {
    return this._poweredDividend / this._poweredDivisor
  }
  
  get baseRawValue(): number {
    return this.baseDividend / this.baseDivisor
  }
  
  get baseDividend(): number {
    return this._baseDividend
  }
  
  get baseDivisor(): number {
    return this._baseDivisor
  }
  
  private get _poweredDividend(): number {
    return Math.pow(this.baseDividend, this.exponent)
  }
  
  private get _poweredDivisor(): number {
    return Math.pow(this.baseDivisor, this.exponent)
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
    
    if (this.baseDivisor == 1) {
      return new Integer(this.baseDividend)
    }
    
    return this
  }
  
  private _operated(opr: Operator, rhsOpnd: Fraction): Fraction {
    switch (opr) {
      case Operator.Addition:
        return new Fraction(
          this._poweredDividend * rhsOpnd._poweredDivisor + this._poweredDivisor * rhsOpnd._poweredDividend,
          this._poweredDivisor * rhsOpnd._poweredDivisor
        )
      case Operator.Subtraction:
        return new Fraction(
          this._poweredDividend * rhsOpnd._poweredDivisor - this._poweredDivisor * rhsOpnd._poweredDividend,
          this._poweredDivisor * rhsOpnd._poweredDivisor
        )
      case Operator.Multiplication:
        return new Fraction(
          this._poweredDividend * rhsOpnd._poweredDividend, 
          this._poweredDivisor * rhsOpnd._poweredDivisor
        )
      case Operator.Division:
        return new Fraction(
          this._poweredDividend * rhsOpnd._poweredDivisor, 
          this._poweredDivisor * rhsOpnd._poweredDividend
        )
    }
  }
  
  private _simplify() {
    const gcd = Math.abs(utils.gcd(this._baseDividend, this._baseDivisor))
    if (gcd == 1) {
      return
    }    
    // console.log(this.textRepresentation, `gcd: ${gcd}`)
    this._baseDividend /= gcd
    this._baseDivisor /= gcd
    // console.log(this.textRepresentation)
  }
}
