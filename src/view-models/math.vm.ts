import { Operator } from '@/models/math'
import { Icon } from '@design-tokens/iconography'

export const operatorIcon = (operator: Operator) => {
  switch (operator) {
    case Operator.Addition:
      return Icon.Plus
    case Operator.Division:
      return Icon.Divide
    case Operator.Multiplication:
      return Icon.Multiply
    case Operator.Percent:
      return Icon.Percent
    case Operator.Subtraction:
      return Icon.Minus
  }
}
