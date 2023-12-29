import { Score } from '../game/state'

export enum LogColor {
  Red = '31m',
  Green = '32m',
  Yellow = '33m',
  Magenta = '35m',
  Gray = '90m'
}

export class Log {
  readonly debugMode: boolean
  
  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode
  }
  
  health(val: number): void {
    console.log(
      this._colorize([...Array(Math.floor(val)).keys()].map(_ => '❤️').join(' '), LogColor.Red)
    )
  }
  
  score(val: Score, prefix?: string): void {
    console.log(this._colorize(`${prefix ?? ''}${val.hits}/${val.hits + val.misses} ✔️`, LogColor.Green))
  }
  
  correctAnswer(score: Score, isRetry: boolean): void {
    if (isRetry) {
      console.log(this._colorize(`Good!`, LogColor.Yellow))
    } else {
      this.score(score, 'Perfect! ')
    }
  }
  
  mistake(clue?: string): void {
    console.log(this._colorize('Not there yet... Try again!', LogColor.Magenta))
    
    if (clue) {
      console.log(this._colorize(`(Psst! ${clue})`, LogColor.Gray))
    }
  }
  
  gameOver(score: Score, correctResult: string): void {
    console.log(this._colorize(`= ${correctResult}`, LogColor.Yellow))
    console.log(this._colorize('\nGAME OVER', LogColor.Magenta))
    this.score(score)
  }
  
  info(msg: string, color?: LogColor): void {
    console.log(color ? this._colorize(msg, color) : msg)
  }
  
  error(err: Error): void {
    console.log(this._colorize(err.message, LogColor.Red))
  }
  
  debug(...args: any[]): void {
    if (this.debugMode) {
      console.log(args)
    }
  }
  
  private _colorize(str: string, color: LogColor): string {
    return `\x1b[${color}${str}\x1b[0m`
  }
}
