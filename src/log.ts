import { Score } from './game/state'
import { OutputColor, colorOutput } from './console'

export default class Log {
  readonly debugMode: boolean
  
  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode
  }
  
  health(val: number): void {
    console.log(
      colorOutput([...Array(Math.floor(val)).keys()].map(_ => '❤️').join(' '), OutputColor.Red)
    )
  }
  
  score(val: Score, prefix?: string): void {
    console.log(colorOutput(`${prefix ?? ''}${val.hits}/${val.hits + val.misses} ✔️`, OutputColor.Green))
  }
  
  correctAnswer(score: Score, isRetry: boolean): void {
    if (isRetry) {
      console.log(colorOutput(`Good!`, OutputColor.Yellow))
    } else {
      this.score(score, 'Perfect! ')
    }
  }
  
  mistake(clue?: string): void {
    console.log(colorOutput('Not there yet... Try again!', OutputColor.Magenta))
    
    if (clue) {
      console.log(colorOutput(`(Psst! ${clue})`, OutputColor.Gray))
    }
  }
  
  gameOver(score: Score, correctResult: string): void {
    console.log(colorOutput(`= ${correctResult}`, OutputColor.Yellow))
    console.log(colorOutput('\nGAME OVER', OutputColor.Magenta))
    this.score(score)
  }
  
  info(msg: string, color?: OutputColor): void {
    console.log(color ? colorOutput(msg, color) : msg)
  }
  
  error(err: Error): void {
    console.log(colorOutput(err.message, OutputColor.Red))
  }
  
  debug(...args: any[]): void {
    if (this.debugMode) {
      console.log(args)
    }
  }
}
