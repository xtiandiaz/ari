enum OutputColor {
  Red = '31m',
  Green = '32m',
  Yellow = '33m',
  Magenta = '35m'
}

class Log {
  debugMode = false
  
  health(val: number): void {
    console.log(
      this._colorize([...Array(Math.floor(val)).keys()].map(_ => '❤️').join(' '), OutputColor.Red)
    )
  }
  
  correctAnswer(score: string, isRetry: boolean): void {
    console.log(this._colorize(
      `Correct! (${score})`,
      isRetry ? OutputColor.Yellow : OutputColor.Green
    ))
  }
  
  mistake(hint?: string): void {
    console.log(this._colorize('Not correct yet... Try again!', OutputColor.Magenta))
  }
  
  gameOver(score: string, correctResult: string): void {
    console.log(this._colorize(`= ${correctResult}`, OutputColor.Yellow))
    console.log(this._colorize('GAME OVER', OutputColor.Magenta))
    console.log(this._colorize(`✔️ ${score}`, OutputColor.Green))
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
