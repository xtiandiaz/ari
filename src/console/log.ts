import { OutputColor } from './io'
import { Score } from '../game/state'

class Log {
  debugMode = false
  
  health(val: number): void {
    console.log(
      this._colorize([...Array(Math.floor(val)).keys()].map(_ => '❤️').join(' '), OutputColor.Red)
    )
  }
  
  score(val: Score, prefix?: string): void {
    console.log(this._colorize(`${prefix ?? ''}${val.hits}/${val.hits + val.misses} ✔️`, OutputColor.Green))
  }
  
  correctAnswer(score: Score, isRetry: boolean): void {
    if (isRetry) {
      console.log(this._colorize(`Good!`, OutputColor.Yellow))
    } else {
      this.score(score, 'Perfect! ')
    }
  }
  
  mistake(clue?: string): void {
    console.log(this._colorize('Not there yet... Try again!', OutputColor.Magenta))
    
    if (clue) {
      console.log(this._colorize(`Psst! ${clue}`, OutputColor.Gray))
    }
  }
  
  gameOver(score: Score, correctResult: string): void {
    console.log(this._colorize(`= ${correctResult}`, OutputColor.Yellow))
    console.log(this._colorize('GAME OVER', OutputColor.Magenta))
    this.score(score)
  }
  
  info(msg: string, color?: OutputColor): void {
    console.log(color ? this._colorize(msg, color) : msg)
  }
  
  error(err: Error): void {
    console.log(this._colorize(err.message, OutputColor.Red))
  }
  
  debug(...args: any[]): void {
    if (this.debugMode) {
      console.log(args)
    }
  }
  
  private _colorize(str: string, color: OutputColor): string {
    return `\x1b[${color}${str}\x1b[0m`
  }
}

export default new Log()
