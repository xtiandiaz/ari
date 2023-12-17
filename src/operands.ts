import Operator from './operator'
import { OperationError } from './operation'
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
    this.kind = kind
    this.exponent = Math.floor(exponent)
  }
  
  abstract get rawValue(): number
  abstract get isBaseNegative(): boolean
  
  abstract textRepresentation(parenthesized: boolean): string
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
  
  get isBaseNegative(): boolean {
    return this.base < 0
  }
  
  private get _exponentString(): string {
    return this.exponent != 1 && this.base != 1 ? utils.exponentString(this.exponent) : ''
  }
  
  textRepresentation(parenthesized: boolean): string {
    parenthesized ||= this.isBaseNegative && this.exponent != 1
    return `${parenthesized ? `(${this.base})` : `${this.base}`}${this._exponentString}`
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
              return new Fraction(this, <Integer>rhsOpnd)
          }
        case OperandKind.Fraction:
          return (new Fraction(this, 1)).operated(opr, rhsOpnd)
        default:
          throw OperationError.notImplemented(this, opr, rhsOpnd)
      }
  }
  
  simplified(): Operand {
    return this
  }
}

export class Fraction extends Operand {  
  private _dividend: number
  private _divisor: number
  
  constructor(
    dividend: number | Integer, 
    divisor: number | Integer, 
    simplified: boolean = true
  ) {
    super(OperandKind.Fraction, 1)
    
    this._dividend = typeof dividend === 'number' ? dividend : dividend.rawValue
    this._divisor = typeof divisor === 'number' ? divisor : divisor.rawValue
    
    if (this._dividend == 0) {
      throw OperationError.divisionByZero
    } else if (this._divisor < 0) {
      this._divisor *= -1
      this._dividend *= -1
    }
    
    if (simplified) {
      this._simplify()
    }
  }
  
  get rawValue(): number {
    return this._dividend / this._divisor
  }
  
  textRepresentation(parenthesized: boolean): string {
    // parenthesized ||= this.isNegative && this.exponent != 1
    const rprtn = `${this._dividend}/${this._divisor}`
    
    return parenthesized ? `(${rprtn})` : rprtn
  }
  
  get isBaseNegative(): boolean {
    return this._dividend < 0
  }
  
  operated(opr: Operator, rhsOpnd: Operand): Operand {
    switch (rhsOpnd.kind) {
      case OperandKind.Integer:
        return this._operated(opr, new Fraction(<Integer>rhsOpnd, 1))
      case OperandKind.Fraction:
        return this._operated(opr, <Fraction>rhsOpnd)
      default:
        throw OperationError.notImplemented(this, opr, rhsOpnd)
    }
  }
  
  simplified(): Operand {
    this._simplify()
    
    if (this._divisor == 1) {
      return new Integer(this._dividend)
    }
    
    return this
  }
  
  private _operated(opr: Operator, rhsOpnd: Fraction): Fraction {
    switch (opr) {
      case Operator.Addition:
        return new Fraction(
          this._dividend * rhsOpnd._divisor + this._divisor * rhsOpnd._dividend,
          this._divisor * rhsOpnd._divisor
        )
      case Operator.Subtraction:
        return new Fraction(
          this._dividend * rhsOpnd._divisor - this._divisor * rhsOpnd._dividend,
          this._divisor * rhsOpnd._divisor
        )
      case Operator.Multiplication:
        return new Fraction(this._dividend * rhsOpnd._dividend, this._divisor * rhsOpnd._divisor)
      case Operator.Division:
        return new Fraction(this._dividend * rhsOpnd._divisor, this._divisor * rhsOpnd._dividend)
    }
  }
  
  private _simplify() {
    const gcd = Math.abs(utils.gcd(this._dividend, this._divisor))
    if (gcd == 1) {
      return
    }    
    // console.log(this.textRepresentation, `gcd: ${gcd}`)
    this._dividend /= gcd
    this._divisor /= gcd
    // console.log(this.textRepresentation)
  }
}
