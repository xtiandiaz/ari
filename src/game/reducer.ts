import GameState from './state'
import * as factory from './factory'
import * as stringify from '../stringifier'

export default class GameReducer {
  readonly state: GameState
  
  constructor(startDifficulty: number = 5) {
    this.state = new GameState(factory.operation(startDifficulty), startDifficulty)
  }
  
  evaluate(inputResult: string): boolean {
    if (inputResult === stringify.operandString(this.state.stage.result)) {
      if (!this.state.isRetry) {
        this.state.hits++
      }
      this.state.stage = factory.operation(this.state.difficulty)
      this.state.isRetry = false
      return true
    }
    
    if (!this.state.isRetry) {
      this.state.misses++
      this.state.health--
      this.state.isRetry = true
    }
    
    return false
  }
}
