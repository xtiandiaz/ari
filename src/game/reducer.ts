import type { SimpleOperand } from '../aritmethic/operand'
import GameState from './state'
import * as factory from './factory'

export default class GameReducer {
  readonly state: GameState
  
  constructor(startDifficulty: number = 1) {
    this.state = new GameState(factory.operation(startDifficulty), startDifficulty)
  }
  
  evaluate(inputResult: SimpleOperand): boolean {
    if (this.state.stage.result.isEqualTo(inputResult)) {
      if (!this.state.isRetry) {
        this.state.score.hits++
      }
      return true
    }
    
    if (!this.state.isRetry) {
      this.state.score.misses++
      this.state.health--
      this.state.isRetry = true
      // this.state.clue = ...
    }
    return false
  }
  
  resume(): void {
    this.state.stage = factory.operation(this.state.difficulty)
    this.state.isRetry = false
    this.state.clue = undefined
  }
}
