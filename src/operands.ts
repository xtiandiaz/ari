import Operator from './operator'
import * as Utils from './utils'

export enum OperandKind {
  Integer = "INTEGER",
  Fraction = "FRACTION",
  Operation = "OPERATION"
}

export interface Operand {
  kind: OperandKind
  rawValue: number
  textRepresentation: string
  
  isNegative: boolean
  
  operated(opr: Operator, rhsOpnd: Operand): Operand
  simplified(): Operand
}

export class Integer implements Operand {
  readonly kind = OperandKind.Integer
  rawValue: number
  
  constructor(rawValue: number) {
    this.rawValue = Math.floor(rawValue)
  }
  
  get textRepresentation(): string {
    return this.isNegative ? `${this.rawValue}` : `${this.rawValue}`
  }
  
  get isNegative(): boolean {
    return this.rawValue < 0
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
          throw new Error(`${this.textRepresentation} not implemented for operation with ${rhsOpnd.textRepresentation}`)
      }
  }
  
  simplified(): Operand {
    return this
  }
}

export class Fraction implements Operand {
  readonly kind = OperandKind.Fraction
  
  private _dividend: number
  private _divisor: number
  
  constructor(dividend: number | Integer, divisor: number | Integer, simplified: boolean = true) {
    this._dividend = typeof dividend === 'number' ? dividend : dividend.rawValue
    this._divisor = typeof divisor === 'number' ? divisor : divisor.rawValue
    
    if (this._dividend == 0) {
      throw new Error("Division by zero")
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
  
  get textRepresentation(): string {
    return `${this._dividend}/${this._divisor}`
  }
  
  get isNegative(): boolean {
    return this._dividend < 0
  }
  
  operated(opr: Operator, rhsOpnd: Operand): Operand {
    switch (rhsOpnd.kind) {
      case OperandKind.Integer:
        return this._operated(opr, new Fraction(<Integer>rhsOpnd, 1))
      case OperandKind.Fraction:
        return this._operated(opr, <Fraction>rhsOpnd)
      default:
        throw new Error(`${this.textRepresentation} not implemented for operation with ${rhsOpnd.textRepresentation}`)
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
    const gcd = Math.abs(Utils.gcd(this._dividend, this._divisor))
    if (gcd == 1) {
      return
    }    
    // console.log(this.textRepresentation, `gcd: ${gcd}`)
    this._dividend /= gcd
    this._divisor /= gcd
    // console.log(this.textRepresentation)
  }
}
