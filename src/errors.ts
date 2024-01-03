export enum AriErrorCode {
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
    super(`[Error #${code}] ${message ?? ''}`)
    
    this.code = code
  }
}
