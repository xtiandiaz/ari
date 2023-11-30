import { Log } from './log'

export enum Mode {
  Blind,
  Master,
}

export class State {
  mode: Mode | undefined
  private _log: Log
  
  get score(): string {
    return `${this._hits}/${this._hits + this._log.misses.length}`
  }
  
  get difficulty(): number {
    return 0.1 + this._hits / 20
  }
  
  private get _hits(): number {
    return this._log.hits.length
  }
  
  constructor(log: Log) {
    this._log = log
  }
}
