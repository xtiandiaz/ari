import * as io from './io'
import { Operation } from './operation'

class Log {
  readonly hits: Operation[] = []
  readonly misses: Operation[] = []
  
  debugMode = false
  
  private get _balance(): string {
    return `${this.hits.length}/${this.hits.length + this.misses.length}`
  }
  
  correctAnswer(operation: Operation, isRetry: boolean): void {
    if (!isRetry) {
      this._recordHit(operation)
    }
    console.log(io.colorize(
      `Correct! (${this._balance})`,
      isRetry ? io.OutputColor.Yellow : io.OutputColor.Green
    ))
  }
  
  mistake(operation: Operation): void {
    this._recordMiss(operation)
    console.log(io.colorize('Not correct yet... Try again!', io.OutputColor.Red))
  }
  
  debug(...args: any[]): void {
    if (this.debugMode) {
      console.log(args)
    }
  }
  
  error(err: Error): void {
    console.log(io.colorize(err.message, io.OutputColor.Red))
  }
  
  private _recordHit(operation: Operation): void {
    if (!this._isRecorded(operation)) {
      this.hits.push(operation)
    }
  }
  
  private _recordMiss(operation: Operation): void {
    if (!this._isRecorded(operation)) {
      this.misses.push(operation)
    }
  }
  
  private _isRecorded(operation: Operation): boolean {
    const predicate = (o: Operation) => o.id == operation.id
    return this.hits.findIndex(predicate) >= 0 || this.misses.findIndex(predicate) >= 0
  }
}

export default new Log()
