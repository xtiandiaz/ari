import type { SimpleOperand } from '../aritmethic/operand'
import { GameState, SolutionClue } from './state'
import * as factory from './factory'

export default class GameReducer {
  readonly state: GameState
  
  constructor(startDifficulty: number = 1) {
    this.state = new GameState(factory.operation(startDifficulty), startDifficulty)
  }
  
  evaluate(ans: SimpleOperand): boolean {
    const correctAns = this.state.stage.result
    
    if (ans.isEqualTo(correctAns)) {
      if (!this.state.isRetry) {
        this.state.score.hits++
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
