export class Range {
  readonly min: number
  readonly max: number
  
  constructor(min: number, max: number) {
    this.min = min
    this.max = max
  }
  
  rounded(): Range {
    return new Range(Math.round(this.min), Math.round(this.max))
  }
  
  dividedBy(divisor: number): Range {
    return new Range(this.min / divisor, this.max / divisor)
  }
}
