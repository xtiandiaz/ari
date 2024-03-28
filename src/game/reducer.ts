import SimpleOperand from '../aritmethic/simple-operand'
import Operation from '../aritmethic/operation'
import Operator from '../aritmethic/operator'
import { GameState, SolutionClue } from './state'
import * as factory from './factory'

export default class GameReducer {
  readonly state: GameState
  
  constructor(startDifficulty: number = 1) {
    let operation = factory.operation(startDifficulty)
    // let operation = new Operation(
    //   [
    //     new Operation([new SimpleOperand(15), new SimpleOperand(-4)], [Operator.addition]),
    //     new SimpleOperand(-16, 9),
    //     new SimpleOperand(-12, 5),
    //     new SimpleOperand(9, 1),
    //   ],
    //   [Operator.division, Operator.subtraction, Operator.subtraction]
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
