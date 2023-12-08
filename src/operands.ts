import Operator from './operator'
import * as Utils from './utils'

export interface Operand {
  value: number
  textRepresentation: string
  
  operated(opr: Operator, rhs: Operand): Operand
  simplified(): Operand
}

export class Integer implements Operand {
  value: number
  
  constructor(rawValue: number) {
    this.value = Math.floor(rawValue)
  }
  
  get textRepresentation(): string {
    return this.value < 0 ? `${this.value}` : `${this.value}`
  }
  
  operated(opr: Operator, rhs: Operand): Operand {
      switch (rhs.constructor) {
        case Integer:
          switch (opr) {
            case Operator.Addition:
              return new Integer(this.value + rhs.value)
            case Operator.Subtraction:
              return new Integer(this.value - rhs.value)
            case Operator.Multiplication:
              return new Integer(this.value * rhs.value)
            case Operator.Division:
              return new Fraction(this, rhs)
          }
        case Fraction:
          return (new Fraction(this, 1)).operated(opr, rhs)
        default:
          throw new Error(`${this.textRepresentation} not implemented for operation with ${rhs.textRepresentation}`)
      }
  }
  
  simplified(): Operand {
    return this
  }
}

export class Fraction implements Operand {
  private _dividend: number
  private _divisor: number
  
  constructor(dividend: number | Integer, divisor: number | Integer, simplified: boolean = true) {
    this._dividend = typeof dividend === 'number' ? dividend : dividend.value
    this._divisor = typeof divisor === 'number' ? divisor : divisor.value
    
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
  
  get value(): number {
    return this._dividend / this._divisor
  }
  
  get textRepresentation(): string {
    return `${this._dividend}/${this._divisor}`
  }
  
  operated(opr: Operator, rhs: Operand): Operand {
    switch (rhs.constructor) {
      case Integer:
        return this._operated(opr, new Fraction(rhs, 1))
      case Fraction:
        return this._operated(opr, <Fraction>rhs)
      default:
        throw new Error(`${this.textRepresentation} not implemented for operation with ${rhs.textRepresentation}`)
    }
  }
  
  simplified(): Operand {
    this._simplify()
    
    if (this._divisor == 1) {
      return new Integer(this._dividend)
    }
    
    return this
  }
  
  private _operated(opr: Operator, rhs: Fraction): Fraction {
    switch (opr) {
      case Operator.Addition:
        return new Fraction(
          this._dividend * rhs._divisor + this._divisor * rhs._dividend,
          this._divisor * rhs._divisor
        )
      case Operator.Subtraction:
        return new Fraction(
          this._dividend * rhs._divisor - this._divisor * rhs._dividend,
          this._divisor * rhs._divisor
        )
      case Operator.Multiplication:
        return new Fraction(this._dividend * rhs._dividend, this._divisor * rhs._divisor)
      case Operator.Division:
        return new Fraction(this._dividend * rhs._divisor, this._divisor * rhs._dividend)
    }
  }
  
  private _simplify() {
    const gcd = Math.abs(Utils.gcd(this._dividend, this._divisor))
    if (gcd == 1) {
      return
    }
    
    console.log(this.textRepresentation, `gcd: ${gcd}`)
    this._dividend /= gcd
    this._divisor /= gcd
    console.log(this.textRepresentation)
  }
}
