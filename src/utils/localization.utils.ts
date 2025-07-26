import type { Operation } from "@/models/math";
import { Operator } from "@/models/math";

export function stringifyOperation(operation: Operation): string {
  switch (operation.operator) {
    case Operator.Addition:
      return `${operation.operands[0]} plus ${operation.operands[1]}`
    case Operator.Subtraction:
      return `${operation.operands[0]} minus ${operation.operands[1]}`
    case Operator.Multiplication:
      return `${operation.operands[0]} multiplied by ${operation.operands[1]}`
    case Operator.Division:
      return `${operation.operands[0]} divided by ${operation.operands[1]}`
    case Operator.Percent:
      return `${operation.operands[1]} percent of ${operation.operands[0]}`
  }
}
