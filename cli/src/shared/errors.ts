export enum AriErrorCode {
  Cheating,
  DivisionByZero,
  ElementShortfall,
  ElementUnbalance,
  MalformedStringRepresentation,
  MeasureOutOfRange,
  NotImplementedOrSupported,
}

export class AriError extends Error {
  static divisionByZero = new AriError(AriErrorCode.DivisionByZero, 'operand')
  
  readonly code: AriErrorCode
  
  constructor(code: AriErrorCode, message?: string) {
    super(message)
    
    this.code = code
  }
}
