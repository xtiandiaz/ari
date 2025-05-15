import SimpleOperand from '../models/simple-operand'
import Operation from '../models/operation'
import Operator from '../models/operator'
import { GameState, SolutionClue } from '../models/state'
import * as factory from './factory'

export default class GameReducer {
  readonly state: GameState
  
  constructor(startDifficulty: number = 1) {
    let operation = factory.operation(startDifficulty)
    // let operation = new Operation(
    //   [
    //     new SimpleOperand(34, 1),
    //     new Operation(
    //       [new SimpleOperand(18, 5), new SimpleOperand(13), new SimpleOperand(29)],
    //       [Operator.addition, Operator.subtraction]
    //     ),
    //     new SimpleOperand(29, 1),
    //     new SimpleOperand(8, 1),
    //     new SimpleOperand(-8, 1),
    //   ],
    //   [Operator.addition, Operator.subtraction, Operator.addition, Operator.division]
    // )
    this.state = new GameState(operation, startDifficulty)
  }
  
  evaluate(ans: SimpleOperand): boolean {
    const correctAns = this.state.stage.result
    
    if (ans.isEqualTo(correctAns)) {
      if (!this.state.isRetry) {
        this.state.score.hits++
        this.state.score.points += Math.round(this.state.difficulty * 10)
      }
      return true
    }
    
    if (!this.state.isRetry) {
      this.state.score.misses++
      this.state.health--
      this.state.isRetry = true  
    }
    
    this.state.clue = (() => {
      const simpAns = ans.simplified()
      if (simpAns.isEqualTo(correctAns)) {
        return SolutionClue.simplify  
      } else if (ans.isAbsEqualTo(correctAns) || simpAns.isAbsEqualTo(correctAns)) {
        return SolutionClue.checkSign
      }
      return undefined
    })()
    
    return false
  }
  
  resume(): void {
    this.state.stage = factory.operation(this.state.difficulty)
    this.state.isRetry = false
    this.state.clue = undefined
  }
}
