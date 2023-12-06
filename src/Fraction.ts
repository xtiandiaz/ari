import Operator from './operator';
import { Operand, Integer } from './operands';


export class Fraction implements Operand {
  private _dividend: number;
  private _divisor: number;

  constructor(dividend: number | Integer, divisor: number | Integer) {
    this._dividend = typeof dividend === 'number' ? dividend : dividend.value;
    this._divisor = typeof divisor === 'number' ? divisor : divisor.value;

    if (this._dividend == 0) {
      throw new Error("Division by zero");
    } else if (this._divisor < 0) {
      this._divisor *= -1;
      this._dividend *= -1;
    }
  }

  get value(): number {
    return this._dividend / this._divisor;
  }

  get textRepresentation(): string {
    return `${this._dividend}/${this._divisor}`;
  }

  operated(opr: Operator, rhs: Operand): Operand {
    switch (rhs.constructor) {
      case Integer:
        return this._operated(opr, new Fraction(rhs, 1));
      case Fraction:
        return this._operated(opr, <Fraction>rhs);
      default:
        throw new Error(`${this.textRepresentation} not implemented for operation with ${rhs.textRepresentation}`);
    }
  }

  simplify() {
    if (Math.abs(this._dividend) == Math.abs(this._divisor)) {
      return new Integer(Math.sign(this._dividend));
    }

    return this;
  }

  private _operated(opr: Operator, rhs: Fraction): Fraction {
    switch (opr) {
      case Operator.Addition:
        return new Fraction(
          this._dividend * rhs._divisor + this._divisor * rhs._dividend,
          this._divisor * rhs._divisor
        );
      case Operator.Subtraction:
        return new Fraction(
          this._dividend * rhs._divisor - this._divisor * rhs._dividend,
          this._divisor * rhs._divisor
        );
      case Operator.Multiplication:
        return new Fraction(this._dividend * rhs._dividend, this._divisor * rhs._divisor);
      case Operator.Division:
        return new Fraction(this._dividend * rhs._divisor, this._divisor * rhs._dividend);
    }
  }
}
