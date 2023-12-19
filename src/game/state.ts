import type { Operation } from '../aritmethic/operation'

export default class GameState {
  stage: Operation
  hits = 0
  misses = 0
  health: number
  startDifficulty: number
  isRetry = false
  
  constructor(firstStage: Operation, startDifficulty: number, startHealth: number = 3) {
    this.stage = firstStage
    this.health = startHealth
    this.startDifficulty = startDifficulty
  }
  
  get isOver(): boolean {
    return this.health <= 0
  }
  
  get difficulty(): number {
    return this.startDifficulty + this.hits / 10
  }
  
  get score(): string {
    return `${this.hits}/${this.hits + this.misses}`
  }
}
