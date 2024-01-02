export enum OperatorColor {
  LightBlue,
  Pink,
  Blue,
  Purple
}

class Operator {
  static readonly addition = new Operator('+', OperatorColor.LightBlue)
  static readonly subtraction = new Operator('-', OperatorColor.Pink)
  static readonly multiplication = new Operator('×', OperatorColor.Blue)
  static readonly division = new Operator('÷', OperatorColor.Purple)
  
  readonly symbol: string
  readonly color: OperatorColor
  
  constructor(symbol: string, color: OperatorColor) {
    this.symbol = symbol
    this.color = color
  }
}

export default Operator
