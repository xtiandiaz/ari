export enum Operator {
  Addition = '+',
  Subtraction = '−',
  Multiplication = '×',
  Division = '/',
}

export class Operation {
  readonly id: number
  lhs: number
  operator: Operator
  rhs: number
  
  private static _id = 0
  
  constructor(lhs: number, operator: Operator, rhs: number) {
    this.id = Operation._id++
    this.lhs = lhs
    this.operator = operator
    this.rhs = rhs
  }
  
  text(blindMode: boolean = false): string {
    const a = this._numberText(this.lhs)
    const _ = blindMode ? this._operatorText(this.operator) : this.operator
    const b = this._numberText(this.rhs)
    return `${a} ${_} ${b}`
  }
  
  get result(): number {
    switch (this.operator) {
      case Operator.Addition:
        return this.lhs + this.rhs
      case Operator.Subtraction:
        return this.lhs - this.rhs
      case Operator.Multiplication:
        return this.lhs * this.rhs
      case Operator.Division:
        return this.lhs / this.rhs
    }
  }
  
  private _numberText(n: number, blindMode: boolean = false): string {
    return `${n < 0 ? (blindMode ? 'minus' : '−') : ''}${Math.abs(n)}`
  }
  
  private _operatorText(op: Operator): string {
    switch (op) {
    case Operator.Addition:
      return "plus"
    case Operator.Subtraction:
      return "minus"
    case Operator.Multiplication:
      return "multiplied by"
    case Operator.Division:
      return "divided by"
    }
  }
}
