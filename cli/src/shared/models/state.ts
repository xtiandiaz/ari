import type Operation from '../models/operation'

export enum SolutionClue {
  checkSign,
  simplify
}

export interface Score {
  hits: number
  misses: number
  points: number
}

export class GameState {
  stage: Operation
  score: Score
  health: number
  startDifficulty: number
  isRetry = false
  clue?: SolutionClue
  
  constructor(firstStage: Operation, startDifficulty: number, startHealth: number = 3) {
    this.stage = firstStage
    this.health = startHealth
    this.startDifficulty = startDifficulty
    this.score = { hits: 0, misses: 0, points: 0 }
  }
  
  get isOver(): boolean {
    return this.health <= 0
  }
  
  get difficulty(): number {
    return this.startDifficulty + this.score.hits / 10
  }
}
